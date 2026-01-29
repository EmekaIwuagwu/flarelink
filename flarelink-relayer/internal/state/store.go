package state

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/dgraph-io/badger/v4"
)

type BridgeRecord struct {
	ID                  string `json:"id"`
	SourceChain         string `json:"sourceChain"`
	DestChain           string `json:"destChain"`
	User                string `json:"user"`
	Token               string `json:"tokenAddress"`
	TokenName           string `json:"tokenName"`
	TokenSymbol         string `json:"tokenSymbol"`
	Amount              string `json:"amount"`
	Status              string `json:"step"`         // For status page (step)
	StatusAlias         string `json:"status"`       // For history page (status)
	TransactionHash     string `json:"sourceTxHash"` // For status page (sourceTxHash)
	TransactionHashAlias string `json:"txHash"`       // For history page (txHash)
	DestTransactionHash string `json:"destTxHash,omitempty"`
	ErrorMessage        string `json:"errorMessage,omitempty"`
	Timestamp           int64  `json:"timestamp"`
}

type StateStore struct {
	db *badger.DB
}

// NewStateStore initializes the database using BadgerDB (Pure Go)
func NewStateStore(dbPath string) (*StateStore, error) {
	opts := badger.DefaultOptions(dbPath).WithLoggingLevel(badger.ERROR)
	db, err := badger.Open(opts)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	return &StateStore{db: db}, nil
}

// SaveBridgeRecord saves a bridge transaction and creates indexes for fast lookup
func (s *StateStore) SaveBridgeRecord(record *BridgeRecord) error {
	return s.db.Update(func(txn *badger.Txn) error {
		// 1. Save main record by Composite ID (SourceChain + ID)
		// This prevents ID collisions between different chains
		compositeID := fmt.Sprintf("%s:%s", record.SourceChain, record.ID)
		data, err := json.Marshal(record)
		if err != nil {
			return err
		}
		
		recordKey := []byte(fmt.Sprintf("bridge:%s", compositeID))
		if err := txn.Set(recordKey, data); err != nil {
			return err
		}

		// 2. Create TxHash -> CompositeID index for frontend status queries
		txHashIndexKey := []byte(fmt.Sprintf("txhash:%s", strings.ToLower(record.TransactionHash)))
		if err := txn.Set(txHashIndexKey, []byte(compositeID)); err != nil {
			return err
		}

		if record.DestTransactionHash != "" {
			destHashKey := []byte(fmt.Sprintf("txhash:%s", strings.ToLower(record.DestTransactionHash)))
			if err := txn.Set(destHashKey, []byte(compositeID)); err != nil {
				return err
			}
		}

		// 3. Save user index (mapping User -> CompositeID)
		userIndexKey := []byte(fmt.Sprintf("user:%s:%s", strings.ToLower(record.User), compositeID))
		if err := txn.Set(userIndexKey, []byte(compositeID)); err != nil {
			return err
		}

		return nil
	})
}

// GetBridgeRecord retrieves a bridge transaction by (Composite ID) or TxHash
func (s *StateStore) GetBridgeRecord(idOrTxHash string) (*BridgeRecord, error) {
	idOrTxHash = strings.ToLower(idOrTxHash)
	
	var record BridgeRecord
	err := s.db.View(func(txn *badger.Txn) error {
		lookupKey := fmt.Sprintf("bridge:%s", idOrTxHash)
		
		// If it's a TxHash, look up the composite ID first
		if len(idOrTxHash) > 2 && idOrTxHash[:2] == "0x" {
			txHashKey := []byte(fmt.Sprintf("txhash:%s", idOrTxHash))
			item, err := txn.Get(txHashKey)
			if err != nil {
				return err
			}
			
			var compositeID string
			err = item.Value(func(val []byte) error {
				compositeID = string(val)
				return nil
			})
			if err != nil {
				return err
			}
			
			lookupKey = fmt.Sprintf("bridge:%s", compositeID)
		}
		
		item, err := txn.Get([]byte(lookupKey))
		if err != nil {
			return err
		}
		
		return item.Value(func(val []byte) error {
			return json.Unmarshal(val, &record)
		})
	})
	
	if err != nil {
		return nil, err
	}
	return &record, nil
}

// ListUserBridges returns all bridge transactions for a given user address
// ListUserBridges returns all bridge transactions for a given user address
func (s *StateStore) ListUserBridges(userAddress string) ([]*BridgeRecord, error) {
	var records []*BridgeRecord
	searchAddr := strings.ToLower(userAddress)

	err := s.db.View(func(txn *badger.Txn) error {
		it := txn.NewIterator(badger.DefaultIteratorOptions)
		defer it.Close()
		
		// Iterate through all records for this user using the index
		prefix := []byte(fmt.Sprintf("user:%s:", searchAddr))
		for it.Seek(prefix); it.ValidForPrefix(prefix); it.Next() {
			item := it.Item()
			err := item.Value(func(val []byte) error {
				compositeID := string(val)
				record, err := s.GetBridgeRecord(compositeID)
				if err == nil {
					records = append(records, record)
				}
				return nil
			})
			if err != nil {
				return err
			}
		}
		return nil
	})
	
	if err != nil {
		return nil, err
	}
	return records, nil
}

func (s *StateStore) Close() error {
	return s.db.Close()
}
