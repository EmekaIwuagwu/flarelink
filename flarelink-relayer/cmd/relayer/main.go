package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"flarelink-relayer/internal/api"
	"flarelink-relayer/internal/bridge"
	"flarelink-relayer/internal/state"

	"github.com/gin-gonic/gin"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/joho/godotenv"
)

type ChainConfig struct {
	ID            uint8
	Name          string
	RPC           string
	BridgeAddress string
}

func main() {
	log.Println("Starting FlareLink Multi-Chain Relayer...")

	// Load .env from root
	godotenv.Load("../.env")

	// 1. Initialize State Store
	store, err := state.NewStateStore("./data/relayer.db")
	if err != nil {
		log.Fatalf("Failed to init state store: %v", err)
	}
	defer store.Close()

	privateKeyHex := os.Getenv("RELAYER_KEY")
	privKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		log.Fatalf("Invalid RELAYER_KEY: %v", err)
	}

	// 2. Define Supported Chains
	configs := []ChainConfig{
		{ID: 0, Name: "Avalanche Fuji", RPC: os.Getenv("AVAX_RPC_URL"), BridgeAddress: os.Getenv("NEXT_PUBLIC_BRIDGE_ADDRESS_FUJI")},
		{ID: 1, Name: "Flare Coston2", RPC: os.Getenv("FLARE_RPC_URL"), BridgeAddress: os.Getenv("NEXT_PUBLIC_BRIDGE_ADDRESS_COSTON2")},
		{ID: 2, Name: "Polygon Amoy", RPC: os.Getenv("POLYGON_RPC_URL"), BridgeAddress: os.Getenv("NEXT_PUBLIC_BRIDGE_ADDRESS_AMOY")},
		{ID: 3, Name: "Ethereum Sepolia", RPC: os.Getenv("SEPOLIA_RPC_URL"), BridgeAddress: os.Getenv("NEXT_PUBLIC_BRIDGE_ADDRESS_SEPOLIA")},
	}


	executors := make(map[uint8]*bridge.BridgeExecutor)
	listeners := make(map[uint8]*bridge.ChainListener)

	// 3. Initialize Global API Server
	handler := api.NewAPIHandler(store)
	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	handler.RegisterRoutes(router)
	go router.Run(":8080")

	// 4. Setup Executors and Listeners for each chain
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	globalEventChan := make(chan bridge.BridgeEvent, 500)

	for _, cfg := range configs {
		if cfg.RPC == "" || cfg.BridgeAddress == "" {
			log.Printf("Skipping chain %s: missing RPC or Bridge Address", cfg.Name)
			continue
		}

		// Initialize Executor
		executor, err := bridge.NewBridgeExecutor(cfg.RPC, cfg.BridgeAddress, privKey)
		if err != nil {
			log.Printf("Failed to init executor for %s: %v", cfg.Name, err)
			continue
		}
		executors[cfg.ID] = executor
		log.Printf("Executor loaded for %s", cfg.Name)

		// Initialize Listener
		listener, err := bridge.NewChainListener(cfg.RPC, cfg.BridgeAddress, cfg.ID, cfg.Name)
		if err != nil {
			log.Printf("Failed to init listener for %s: %v", cfg.Name, err)
			continue
		}
		listeners[cfg.ID] = listener
		listener.Start(ctx)

		// Pipe events to global channel
		go func(l *bridge.ChainListener) {
			for event := range l.GetEventChannel() {
				globalEventChan <- event
			}
		}(listener)
	}

	// 5. Global Relay Loop
	go func() {
		for event := range globalEventChan {
			log.Printf("[%s -> Chain %d] Received Bridge Event. Amount: %s", event.SourceChain, event.DestinationChain, event.Amount.String())

			destExecutor, exists := executors[event.DestinationChain]
			if !exists {
				log.Printf("ERROR: No executor found for destination chain %d", event.DestinationChain)
				continue
			}

			// Save and Process
			record := &state.BridgeRecord{
				ID:                   event.BridgeID.String(),
				SourceChain:          getChainName(event.SourceChain),
				DestChain:            getChainName(event.DestinationChain),
				User:                 strings.ToLower(event.User.Hex()),
				Token:                event.TokenAddress.Hex(),
				TokenName:            event.TokenName,
				TokenSymbol:          event.TokenSymbol,
				Amount:               event.Amount.String(),
				Status:               "locked",
				StatusAlias:          "locked",
				TransactionHash:      event.TransactionHash.Hex(),
				TransactionHashAlias: event.TransactionHash.Hex(),
				Timestamp:            event.Timestamp.Unix(),
			}
			store.SaveBridgeRecord(record)

			// 1. Sign
			packedData, _ := packBridgeData(event)
			messageHash := crypto.Keccak256Hash(packedData)
			signatureHash := crypto.Keccak256Hash(append([]byte("\x19Ethereum Signed Message:\n32"), messageHash.Bytes()...))
			signature, _ := crypto.Sign(signatureHash.Bytes(), privKey)
			if signature[64] < 27 {
				signature[64] += 27
			}

			// 2. Prepare Attestation
			attestationData := prepareDummyAttestation()

			// 3. Execute
			record.Status = "executing"
			record.StatusAlias = "executing"
			store.SaveBridgeRecord(record)

			destTxHash, err := destExecutor.ExecuteTransfer(
				ctx, event.BridgeID, event.User, event.TokenAddress, event.Amount,
				event.SourceChain, event.TokenName, event.TokenSymbol,
				attestationData, [][]byte{signature},
			)

			if err != nil {
				log.Printf("Relay Failed: %v", err)
				record.Status = "failed"
				record.StatusAlias = "failed"
				record.ErrorMessage = err.Error()
			} else {
				log.Printf("Relay Success! Dest TX: %s", destTxHash)
				record.Status = "completed"
				record.StatusAlias = "completed"
				record.DestTransactionHash = destTxHash
			}
			store.SaveBridgeRecord(record)
		}
	}()

	// 6. Wait for interrupt
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan
	log.Println("Shutting down...")
}

func getChainName(id uint8) string {
	switch id {
	case 0: return "Avalanche Fuji"
	case 1: return "Flare Coston2"
	case 2: return "Polygon Amoy"
	case 3: return "Ethereum Sepolia"
	default: return "Unknown"
	}
}

func packBridgeData(event bridge.BridgeEvent) ([]byte, error) {
	uint256Type, _ := abi.NewType("uint256", "", nil)
	addressType, _ := abi.NewType("address", "", nil)
	uint8Type, _ := abi.NewType("uint8", "", nil)
	stringType, _ := abi.NewType("string", "", nil)

	arguments := abi.Arguments{
		{Type: uint256Type}, {Type: addressType}, {Type: addressType},
		{Type: uint256Type}, {Type: uint8Type}, {Type: stringType}, {Type: stringType},
	}
	return arguments.Pack(event.BridgeID, event.User, event.TokenAddress, event.Amount, event.SourceChain, event.TokenName, event.TokenSymbol)
}

func prepareDummyAttestation() []byte {
	bytes32Type, _ := abi.NewType("bytes32", "", nil)
	bytes32ArrayType, _ := abi.NewType("bytes32[]", "", nil)
	attestationArgs := abi.Arguments{{Type: bytes32ArrayType}, {Type: bytes32Type}, {Type: bytes32Type}}
	dummyHash := [32]byte{}
	data, _ := attestationArgs.Pack([][32]byte{}, dummyHash, dummyHash)
	return data
}
