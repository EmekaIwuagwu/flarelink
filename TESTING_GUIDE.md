# FlareLink End-to-End Testing Guide

## 1. Prerequisites
- Node.js & npm installed
- Go (Golang) installed (for Relayer)
- MetaMask Wallet installed in browser
- Testnet Tokens (AVAX for Fuji, FLR for Coston2, MATIC for Amoy, ETH for Sepolia) via Faucets.

## 2. Smart Contract Deployment
1. Navigate to the root folder:
   ```bash
   cd ./
   ```
2. create a `.env` file in the root with your private key:
   ```env
   PRIVATE_KEY=your_private_key_here
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Deploy to Avalanche Fuji (Source):
   ```bash
   npx hardhat run scripts/deploy.ts --network avalancheFuji
   ```
   *Note the Bridge Address returned.*

5. Deploy to Flare Coston2 (Destination):
   ```bash
   npx hardhat run scripts/deploy.ts --network flareCoston2
   ```
   *Note the Bridge Address returned.*

## 3. Relayer Setup
1. Navigate to the relayer folder:
   ```bash
   cd flarelink-relayer
   ```
2. Update `cmd/relayer/main.go` with the deployed Bridge addresses and your private key (same as deployer, who has RELAYER_ROLE).
   - `privateKeyHex`: Your private key (without 0x).
   - `bridgeAddress`: The address from Step 2.4 (Avalanche Fuji Bridge).
   - `avalancheRPC`: Keep as is or update if needed.
3. Run the Relayer:
   ```bash
   go run cmd/relayer/main.go
   ```
   The relayer will start listening for events on Avalanche Fuji.

## 4. Frontend Setup
1. Navigate to frontend folder:
   ```bash
   cd flarelink-frontend
   ```
2. Update `components/Bridge/BridgeForm.tsx` and `components/Bridge/ChainSelector.tsx`:
   - Update `CHAINS` object with the **REAL** deployed Bridge addresses from Step 2.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the frontend:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## 5. Testing the Flow
1. Connect Wallet (ensure you are on Avalanche Fuji).
2. Go to `Dashboard` -> `Transfer`.
3. Select **From: Avalanche** -> **To: Flare**.
4. Enter a Token Address (you can deploy a dummy ERC20 or use an existing one if authorized).
   - *Tip: The deploy script can be modified to deploy a test ERC20 separately.*
5. Enter Amount and click **Approve** (if prompted), then **Bridge Tokens**.
6. Wait for transaction confirmation.
7. Observe the **Relayer Terminal**:
   - It should log "Received event".
   - It should sign the message.
   - It should log "Transfer successful! Tx Hash: ...".
8. Switch wallet to Flare Coston2 and import the "Wrapped Token" address (you can find this by querying the `wrappedTokenRegistry` on the Flare Bridge contract, or checking logs).
9. Verify balance on Flare.

## 6. Troubleshooting
- **Relayer Errors**: Check RPC URLs and ensure Private Key has funds on BOTH chains (for gas).
- **Frontend Errors**: Ensure contract addresses match exactly.
- **Verification Failed**: Ensure the Relayer account has the `RELAYER_ROLE` on the Destination Chain (Flare). You might need to manually grant it via `npx hardhat console` or a script if you deployed with a different account.
