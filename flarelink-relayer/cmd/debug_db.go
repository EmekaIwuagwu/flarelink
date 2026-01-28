package main

import (
	"fmt"
	"log"
	"flarelink-relayer/internal/state"
)

func main() {
	store, err := state.NewStateStore("./data/relayer.db")
	if err != nil {
		log.Fatal(err)
	}
	defer store.Close()

	// List all transactions for the user address in your screenshot
	userAddr := "0x28e514Ce1a0554B83f6d5EEEE11B07D0e294D9F9"
	records, err := store.ListUserBridges(userAddr)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Found %d records for user %s\n", len(records), userAddr)
	for _, r := range records {
		fmt.Printf("ID: %s | SourceHash: %s | Status: %s\n", r.ID, r.TransactionHash, r.Status)
	}
}
