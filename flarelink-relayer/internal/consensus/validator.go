package consensus

import (
	"crypto/ecdsa"
	"sync"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)


// Validator manages the relayer's identity and signature verification
type Validator struct {
	Address    common.Address
	PrivateKey *ecdsa.PrivateKey
}

func NewValidator(privateKey *ecdsa.PrivateKey) *Validator {
	return &Validator{
		Address:    crypto.PubkeyToAddress(privateKey.PublicKey),
		PrivateKey: privateKey,
	}
}

func (v *Validator) SignHash(hash []byte) ([]byte, error) {
	sig, err := crypto.Sign(hash, v.PrivateKey)
	if err != nil {
		return nil, err
	}
	// Transform V to 27/28
	if len(sig) == 65 {
		sig[64] += 27
	}
	return sig, nil
}

// ConsensusManager handles the collection of signatures for a bridge transaction
type ConsensusManager struct {
	mu            sync.RWMutex
	Signatures    map[string]map[common.Address][]byte // BridgeID -> RelayerAddress -> Signature
	Threshold     int
	TotalRelayers int
}

func NewConsensusManager(threshold int, totalRelayers int) *ConsensusManager {
	return &ConsensusManager{
		Signatures:    make(map[string]map[common.Address][]byte),
		Threshold:     threshold,
		TotalRelayers: totalRelayers,
	}
}

func (cm *ConsensusManager) AddSignature(bridgeID string, relayer common.Address, signature []byte) bool {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if _, exists := cm.Signatures[bridgeID]; !exists {
		cm.Signatures[bridgeID] = make(map[common.Address][]byte)
	}

	// Verify signature is valid (simplified, assume caller verified signature recovery)
	cm.Signatures[bridgeID][relayer] = signature

	return len(cm.Signatures[bridgeID]) >= cm.Threshold
}

func (cm *ConsensusManager) GetSignatures(bridgeID string) [][]byte {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	sigs := make([][]byte, 0, len(cm.Signatures[bridgeID]))
	for _, sig := range cm.Signatures[bridgeID] {
		sigs = append(sigs, sig)
	}
	return sigs
}
