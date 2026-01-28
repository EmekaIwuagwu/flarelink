package bridge

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"log"
	"math/big"
	"strings"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/core/types"
)

type BridgeExecutor struct {
	client          *ethclient.Client
	bridgeAddr      common.Address
	privateKey      *ecdsa.PrivateKey
	chainID         *big.Int
	nonce           uint64
	gasPrice        *big.Int
	gasPriceUpdated time.Time
	mu              sync.Mutex
}

func NewBridgeExecutor(
	rpcURL string,
	bridgeAddress string,
	privateKey *ecdsa.PrivateKey,
) (*BridgeExecutor, error) {
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RPC: %w", err)
	}

	chainID, err := client.ChainID(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to fetch chain ID: %w", err)
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("failed to cast public key to ECDSA")
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch nonce: %w", err)
	}

	// Fetch current gas price from network
	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		// Fallback to 25 gwei for Flare/Coston2
		gasPrice = big.NewInt(25000000000)
	}

	return &BridgeExecutor{
		client:     client,
		bridgeAddr: common.HexToAddress(bridgeAddress),
		privateKey: privateKey,
		chainID:    chainID,
		nonce:      nonce,
		gasPrice:   gasPrice,
	}, nil
}

func (be *BridgeExecutor) ExecuteTransfer(
	ctx context.Context,
	bridgeId *big.Int,
	recipient common.Address,
	originalToken common.Address,
	amount *big.Int,
	sourceChain uint8,
	tokenName string,
	tokenSymbol string,
	attestationData []byte,
	relayerSignatures [][]byte,
) (string, error) {
	be.mu.Lock()
	defer be.mu.Unlock()

	// Always fetch fresh nonce from blockchain to avoid "nonce too low" errors
	publicKey := be.privateKey.Public()
	publicKeyECDSA, _ := publicKey.(*ecdsa.PublicKey)
	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	
	nonce, err := be.client.PendingNonceAt(ctx, fromAddress)
	if err != nil {
		return "", fmt.Errorf("failed to fetch nonce: %w", err)
	}
	be.nonce = nonce

	// Update gas price/fees if needed
	if time.Since(be.gasPriceUpdated) > 30*time.Second {
		tip, err := be.client.SuggestGasTipCap(ctx)
		if err != nil {
			log.Printf("Failed to update gas tip cap: %v", err)
		} else {
			be.gasPrice = tip
			be.gasPriceUpdated = time.Now()
		}
	}


	// Build call data
	callData, err := be.encodeExecuteTransferCall(
		bridgeId,
		recipient,
		originalToken,
		amount,
		sourceChain,
		tokenName,
		tokenSymbol,
		attestationData,
		relayerSignatures,
	)
	if err != nil {
		return "", fmt.Errorf("failed to encode call data: %w", err)
	}

	// 1. Fetch Dynamic Fee Data for EIP-1559 (Cheaper/Predictable)
	tipCap, err := be.client.SuggestGasTipCap(ctx)
	if err != nil {
		tipCap = big.NewInt(1500000000) // 1.5 Gwei fallback
	}

	// Chain-specific minimum tip caps (some networks like Polygon require higher minimums)
	chainMinTips := map[int64]int64{
		80002:    26000000000, // Polygon Amoy: 26 Gwei minimum (requirement is 25)
		137:      30000000000, // Polygon Mainnet: 30 Gwei
		114:      26000000000, // Flare Coston2: 26 Gwei
		14:       26000000000, // Flare Mainnet: 26 Gwei
		43113:    2000000000,  // Avalanche Fuji: 2 Gwei
		11155111: 2000000000,  // Sepolia: 2 Gwei
	}

	// Apply minimum if the suggested tip is too low
	if minTip, exists := chainMinTips[be.chainID.Int64()]; exists {
		if tipCap.Cmp(big.NewInt(minTip)) < 0 {
			tipCap = big.NewInt(minTip)
		}
	}

	head, err := be.client.HeaderByNumber(ctx, nil)
	if err != nil {
		return "", fmt.Errorf("failed to get latest header: %w", err)
	}

	// MaxFee = (BaseFee * 2) + Tip
	maxFee := new(big.Int).Add(
		new(big.Int).Mul(head.BaseFee, big.NewInt(2)),
		tipCap,
	)

	// Create EIP-1559 Transaction
	tx := types.NewTx(&types.DynamicFeeTx{
		ChainID:   be.chainID,
		Nonce:     be.nonce,
		GasTipCap: tipCap,
		GasFeeCap: maxFee,
		Gas:       1200000, 
		To:        &be.bridgeAddr,
		Value:     big.NewInt(0),
		Data:      callData,
	})

	// Use LatestSignerForChainID
	signer := types.LatestSignerForChainID(be.chainID)
	signedTx, err := types.SignTx(tx, signer, be.privateKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign transaction: %w", err)
	}

	err = be.client.SendTransaction(ctx, signedTx)
	if err != nil {
		return "", fmt.Errorf("failed to send transaction: %w", err)
	}

	be.nonce++
	return signedTx.Hash().Hex(), nil
}

func (be *BridgeExecutor) WaitForConfirmation(
	ctx context.Context,
	txHash common.Hash,
	confirmations int64,
) error {
	ticker := time.NewTicker(6 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			receipt, err := be.client.TransactionReceipt(ctx, txHash)
			if err != nil {
				if err == ethereum.NotFound {
					continue
				}
				return fmt.Errorf("error fetching receipt: %w", err)
			}

			latestBlock, err := be.client.BlockNumber(ctx)
			if err != nil {
				return fmt.Errorf("error fetching latest block: %w", err)
			}

			confirmationCount := int64(latestBlock) - receipt.BlockNumber.Int64()
			if confirmationCount >= confirmations {
				if receipt.Status == 0 {
					return fmt.Errorf("transaction failed")
				}
				return nil
			}
		}
	}
}

func (be *BridgeExecutor) encodeExecuteTransferCall(
	bridgeId *big.Int,
	recipient common.Address,
	originalToken common.Address,
	amount *big.Int,
	sourceChain uint8,
	tokenName string,
	tokenSymbol string,
	attestationData []byte,
	relayerSignatures [][]byte,
) ([]byte, error) {
	const bridgeABIString = `[{"inputs":[{"internalType":"uint256","name":"_bridgeId","type":"uint256"},{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"address","name":"_originalToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint8","name":"_sourceChain","type":"uint8"},{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"string","name":"_tokenSymbol","type":"string"},{"internalType":"bytes","name":"_attestationData","type":"bytes"},{"internalType":"bytes[]","name":"_relayerSignatures","type":"bytes[]"}],"name":"executeTransfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`
	bridgeABI, err := abi.JSON(strings.NewReader(bridgeABIString))
	if err != nil {
		return nil, err
	}

	return bridgeABI.Pack(
		"executeTransfer",
		bridgeId,
		recipient,
		originalToken,
		amount,
		sourceChain,
		tokenName,
		tokenSymbol,
		attestationData,
		relayerSignatures,
	)
}
