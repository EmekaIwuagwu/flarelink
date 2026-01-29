package bridge

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"strings"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/core/types"
)

// ERC20 ABI for fetching metadata
const erc20ABIString = `[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]`

const bridgeABIString = `[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"bridgeId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"enum Bridge.ChainId","name":"sourceChain","type":"uint8"},{"indexed":false,"internalType":"enum Bridge.ChainId","name":"destinationChain","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"TokensLocked","type":"event"},{"inputs":[{"internalType":"uint256","name":"_bridgeId","type":"uint256"},{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"address","name":"_originalToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint8","name":"_sourceChain","type":"uint8"},{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"string","name":"_tokenSymbol","type":"string"},{"internalType":"bytes","name":"_attestationData","type":"bytes"},{"internalType":"bytes[]","name":"_relayerSignatures","type":"bytes[]"}],"name":"executeTransfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`

type ChainListener struct {
	client       *ethclient.Client
	bridgeAddr   common.Address
	bridgeABI    abi.ABI
	erc20ABI     abi.ABI
	chainID      uint8
	chainName    string
	eventChan    chan BridgeEvent
	blockTracker *big.Int
	ctx          context.Context
	cancel       context.CancelFunc
	wg           sync.WaitGroup
}

type BridgeEvent struct {
	EventType        string // "TokensLocked", "TokensBurned"
	BridgeID         *big.Int
	User             common.Address
	TokenAddress     common.Address
	TokenName        string
	TokenSymbol      string
	Amount           *big.Int
	SourceChain      uint8
	DestinationChain uint8
	TransactionHash  common.Hash
	BlockNumber      uint64
	Timestamp        time.Time
}

// NewChainListener initializes a listener for a specific blockchain
func NewChainListener(
	rpcURL string,
	bridgeAddress string,
	chainID uint8,
	chainName string,
) (*ChainListener, error) {
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RPC: %w", err)
	}

	// Parse ABIs
	bridgeABI, err := abi.JSON(strings.NewReader(bridgeABIString))
	if err != nil {
		return nil, fmt.Errorf("failed to parse Bridge ABI: %w", err)
	}

	erc20ABI, err := abi.JSON(strings.NewReader(erc20ABIString))
	if err != nil {
		return nil, fmt.Errorf("failed to parse ERC20 ABI: %w", err)
	}

	ctx, cancel := context.WithCancel(context.Background())

	return &ChainListener{
		client:       client,
		bridgeAddr:   common.HexToAddress(bridgeAddress),
		bridgeABI:    bridgeABI,
		erc20ABI:     erc20ABI,
		chainID:      chainID,
		chainName:    chainName,
		eventChan:    make(chan BridgeEvent, 1000), // Increased buffer to prevent dropping events
		blockTracker: big.NewInt(0),
		ctx:          ctx,
		cancel:       cancel,
	}, nil
}

// Start begins listening for events
func (cl *ChainListener) Start(ctx context.Context) error {
	cl.wg.Add(1)
	go cl.listenLoop(ctx)
	return nil
}

// listenLoop continuously monitors for bridge events
func (cl *ChainListener) listenLoop(ctx context.Context) {
	defer cl.wg.Done()
	
	ticker := time.NewTicker(2 * time.Second) // Poll every 2 seconds for faster updates
	defer ticker.Stop()

	latestBlock, _ := cl.client.BlockNumber(ctx)
	// Start 10,000 blocks back to ensure we don't miss anything
	startBlock := uint64(0)
	if latestBlock > 10000 {
		startBlock = latestBlock - 10000
	}
	cl.blockTracker.SetUint64(startBlock)

	for {
		select {
		case <-ctx.Done():
			log.Printf("[%s] Listener stopping", cl.chainName)
			return
		case <-ticker.C:
			cl.pollEvents(ctx)
		}
	}
}

// pollEvents retrieves new events since last poll
func (cl *ChainListener) pollEvents(ctx context.Context) {
	latestBlock, err := cl.client.BlockNumber(ctx)
	if err != nil {
		log.Printf("[%s] Error fetching block number: %v", cl.chainName, err)
		return
	}

	fromBlock := cl.blockTracker.Uint64()
	toBlock := latestBlock

	if fromBlock >= toBlock {
		return
	}

	// Avalanche Fuji limits filter range to 2048 blocks
	const maxRange = 2000 
	
	for currentFrom := fromBlock; currentFrom < toBlock; {
		currentTo := currentFrom + maxRange
		if currentTo > toBlock {
			currentTo = toBlock
		}

		log.Printf("[%s] Polling range %d-%d", cl.chainName, currentFrom, currentTo)
		
		query := ethereum.FilterQuery{
			Addresses: []common.Address{cl.bridgeAddr},
			Topics: [][]common.Hash{
				{cl.bridgeABI.Events["TokensLocked"].ID},
			},
			FromBlock: big.NewInt(int64(currentFrom)),
			ToBlock:   big.NewInt(int64(currentTo)),
		}

		logs, err := cl.client.FilterLogs(ctx, query)
		if err != nil {
			log.Printf("[%s] Error filtering logs in range %d-%d: %v", cl.chainName, currentFrom, currentTo, err)
			break 
		}

		for _, vLog := range logs {
			event := cl.parseTokensLockedEvent(vLog)
			if event != nil {
				select {
				case cl.eventChan <- *event:
				default:
					log.Printf("[%s] Event channel full, dropping event", cl.chainName)
				}
			}
		}
		
		currentFrom = currentTo + 1
	}

	cl.blockTracker.SetUint64(toBlock)
}

// parseTokensLockedEvent extracts event data from log
func (cl *ChainListener) parseTokensLockedEvent(vLog types.Log) *BridgeEvent {
	// 1. Unpack non-indexed fields from Data
	var data struct {
		Amount           *big.Int
		SourceChain      uint8
		DestinationChain uint8
		Timestamp        *big.Int
	}

	err := cl.bridgeABI.UnpackIntoInterface(&data, "TokensLocked", vLog.Data)
	if err != nil {
		log.Printf("[%s] Error unpacking event data: %v", cl.chainName, err)
		return nil
	}

	// 2. Extract indexed fields from Topics
	// Topic[0] is the event signature. Topics 1-3 are the indexed parameters.
	if len(vLog.Topics) < 4 {
		log.Printf("[%s] Error: insufficient topics in log", cl.chainName)
		return nil
	}
	
	bridgeID := new(big.Int).SetBytes(vLog.Topics[1].Bytes())
	user := common.BytesToAddress(vLog.Topics[2].Bytes())
	tokenAddress := common.BytesToAddress(vLog.Topics[3].Bytes())

	name, symbol := cl.getTokenMetadata(context.Background(), tokenAddress)

	return &BridgeEvent{
		EventType:        "TokensLocked",
		BridgeID:         bridgeID,
		User:             user,
		TokenAddress:     tokenAddress,
		TokenName:        name,
		TokenSymbol:      symbol,
		Amount:           data.Amount,
		SourceChain:      data.SourceChain,
		DestinationChain: data.DestinationChain,
		TransactionHash:  vLog.TxHash,
		BlockNumber:      vLog.BlockNumber,
		Timestamp:        time.Unix(data.Timestamp.Int64(), 0),
	}
}

func (cl *ChainListener) getTokenMetadata(ctx context.Context, tokenAddr common.Address) (string, string) {
	// Fallback values
	name := "Unknown Token"
	symbol := "TKN"

	// 1. Fetch Name
	nameCall, err := cl.erc20ABI.Pack("name")
	if err == nil {
		msg := ethereum.CallMsg{To: &tokenAddr, Data: nameCall}
		result, err := cl.client.CallContract(ctx, msg, nil)
		if err == nil {
			unpacked, err := cl.erc20ABI.Unpack("name", result)
			if err == nil && len(unpacked) > 0 {
				name = unpacked[0].(string)
			}
		}
	}

	// 2. Fetch Symbol
	symbolCall, err := cl.erc20ABI.Pack("symbol")
	if err == nil {
		msg := ethereum.CallMsg{To: &tokenAddr, Data: symbolCall}
		result, err := cl.client.CallContract(ctx, msg, nil)
		if err == nil {
			unpacked, err := cl.erc20ABI.Unpack("symbol", result)
			if err == nil && len(unpacked) > 0 {
				symbol = unpacked[0].(string)
			}
		}
	}

	return name, symbol
}

// GetEventChannel returns the event channel
func (cl *ChainListener) GetEventChannel() chan BridgeEvent {
	return cl.eventChan
}

// Stop gracefully stops the listener
func (cl *ChainListener) Stop() {
	cl.cancel()
	cl.wg.Wait()
	close(cl.eventChan)
	cl.client.Close()
	log.Printf("[%s] Listener stopped", cl.chainName)
}
