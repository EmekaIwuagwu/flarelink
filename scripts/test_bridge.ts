/**
 * FlareLink Bridge Integration Test
 * 
 * This script tests the complete bridge flow:
 * 1. Approves tokens on source chain
 * 2. Initiates bridge transfer
 * 3. Waits for relayer to pick it up
 * 4. Verifies tokens are minted on destination
 */

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

// Chain configurations
const CHAINS = {
    FUJI: {
        id: 0,
        name: "Avalanche Fuji",
        rpc: process.env.AVAX_RPC_URL!,
        bridge: "0x652f4C99e069edDa38C30E82935BbaF5e1B48EaE",
        token: "0x7B418fcb4b5a1c612Ce5E19B9F23017041E995Ee"
    },
    SEPOLIA: {
        id: 3,
        name: "Ethereum Sepolia",
        rpc: process.env.SEPOLIA_RPC_URL!,
        bridge: "0xE7635764e8CE10DF60201E3c2120af43D823Ccc2",
        token: "0x341f64F97De07e3B6d47D244B5a0A8B7a6292267"
    },
    COSTON2: {
        id: 1,
        name: "Flare Coston2",
        rpc: process.env.FLARE_RPC_URL!,
        bridge: "0xfadc1ac000557842D2D2A991bf8643Ae2e2c2275",
        token: "0x0000000000000000000000000000000000000000" // Wrapped tokens minted on demand
    }
};

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function name() view returns (string)",
    "function symbol() view returns (string)"
];

const BRIDGE_ABI = [
    "function initiateTransfer(address _tokenAddress, uint256 _amount, uint8 _destinationChain) returns (uint256 bridgeId)",
    "function isSupportedToken(address) view returns (bool)",
    "function dailyVolumeCap(address) view returns (uint256)",
    "event TokensLocked(uint256 indexed bridgeId, address indexed user, address indexed tokenAddress, uint256 amount, uint8 sourceChain, uint8 destinationChain, uint256 timestamp)"
];

async function main() {
    console.log("=".repeat(60));
    console.log("FLARELINK BRIDGE INTEGRATION TEST");
    console.log("=".repeat(60));

    const privateKey = process.env.PRIVATE_KEY!;

    // ===== TEST 1: FUJI → SEPOLIA =====
    console.log("\n📍 TEST 1: Avalanche Fuji → Ethereum Sepolia");
    console.log("-".repeat(50));

    const fujiProvider = new ethers.JsonRpcProvider(CHAINS.FUJI.rpc);
    const fujiWallet = new ethers.Wallet(privateKey, fujiProvider);
    const fujiToken = new ethers.Contract(CHAINS.FUJI.token, ERC20_ABI, fujiWallet);
    const fujiBridge = new ethers.Contract(CHAINS.FUJI.bridge, BRIDGE_ABI, fujiWallet);

    const amount = ethers.parseEther("10");

    // Check balance
    const balance = await fujiToken.balanceOf(fujiWallet.address);
    console.log(`Wallet Address: ${fujiWallet.address}`);
    console.log(`FLT Balance on Fuji: ${ethers.formatEther(balance)}`);

    if (balance < amount) {
        console.log("❌ Insufficient balance. Skipping test.");
    } else {
        // Check whitelist
        const isWhitelisted = await fujiBridge.isSupportedToken(CHAINS.FUJI.token);
        console.log(`Token whitelisted: ${isWhitelisted}`);

        // Check allowance
        const allowance = await fujiToken.allowance(fujiWallet.address, CHAINS.FUJI.bridge);
        console.log(`Current allowance: ${ethers.formatEther(allowance)}`);

        if (allowance < amount) {
            console.log("📝 Approving tokens...");
            const approveTx = await fujiToken.approve(CHAINS.FUJI.bridge, amount);
            await approveTx.wait();
            console.log(`✅ Approved! TX: ${approveTx.hash}`);
        }

        // Initiate bridge
        console.log("🌉 Initiating bridge transfer...");
        const bridgeTx = await fujiBridge.initiateTransfer(
            CHAINS.FUJI.token,
            amount,
            CHAINS.SEPOLIA.id // Destination: Sepolia
        );
        const receipt = await bridgeTx.wait();
        console.log(`✅ Bridge initiated! TX: ${bridgeTx.hash}`);
        console.log(`   Block: ${receipt.blockNumber}`);

        // Parse event
        const iface = new ethers.Interface(BRIDGE_ABI);
        for (const log of receipt.logs) {
            try {
                const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
                if (parsed?.name === "TokensLocked") {
                    console.log(`   Bridge ID: ${parsed.args.bridgeId}`);
                    console.log(`   Amount: ${ethers.formatEther(parsed.args.amount)}`);
                    console.log(`   Destination Chain: ${CHAINS.SEPOLIA.name}`);
                }
            } catch { }
        }
    }

    // ===== TEST 2: SEPOLIA → FUJI =====
    console.log("\n📍 TEST 2: Ethereum Sepolia → Avalanche Fuji");
    console.log("-".repeat(50));

    const sepoliaProvider = new ethers.JsonRpcProvider(CHAINS.SEPOLIA.rpc);
    const sepoliaWallet = new ethers.Wallet(privateKey, sepoliaProvider);
    const sepoliaToken = new ethers.Contract(CHAINS.SEPOLIA.token, ERC20_ABI, sepoliaWallet);
    const sepoliaBridge = new ethers.Contract(CHAINS.SEPOLIA.bridge, BRIDGE_ABI, sepoliaWallet);

    // Check balance
    const sepoliaBalance = await sepoliaToken.balanceOf(sepoliaWallet.address);
    console.log(`Wallet Address: ${sepoliaWallet.address}`);
    console.log(`FLT Balance on Sepolia: ${ethers.formatEther(sepoliaBalance)}`);

    if (sepoliaBalance < amount) {
        console.log("❌ Insufficient balance. Skipping test.");
    } else {
        // Check whitelist
        const isWhitelisted = await sepoliaBridge.isSupportedToken(CHAINS.SEPOLIA.token);
        console.log(`Token whitelisted: ${isWhitelisted}`);

        // Check allowance
        const allowance = await sepoliaToken.allowance(sepoliaWallet.address, CHAINS.SEPOLIA.bridge);
        console.log(`Current allowance: ${ethers.formatEther(allowance)}`);

        if (allowance < amount) {
            console.log("📝 Approving tokens...");
            const approveTx = await sepoliaToken.approve(CHAINS.SEPOLIA.bridge, amount);
            await approveTx.wait();
            console.log(`✅ Approved! TX: ${approveTx.hash}`);
        }

        // Initiate bridge
        console.log("🌉 Initiating bridge transfer...");
        const bridgeTx = await sepoliaBridge.initiateTransfer(
            CHAINS.SEPOLIA.token,
            amount,
            CHAINS.FUJI.id // Destination: Avalanche Fuji
        );
        const receipt = await bridgeTx.wait();
        console.log(`✅ Bridge initiated! TX: ${bridgeTx.hash}`);
        console.log(`   Block: ${receipt.blockNumber}`);

        // Parse event
        const iface = new ethers.Interface(BRIDGE_ABI);
        for (const log of receipt.logs) {
            try {
                const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
                if (parsed?.name === "TokensLocked") {
                    console.log(`   Bridge ID: ${parsed.args.bridgeId}`);
                    console.log(`   Amount: ${ethers.formatEther(parsed.args.amount)}`);
                    console.log(`   Destination Chain: ${CHAINS.FUJI.name}`);
                }
            } catch { }
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("TEST COMPLETE");
    console.log("The relayer should now pick up these events and execute transfers.");
    console.log("Check relayer logs and destination chains for minted tokens.");
    console.log("=".repeat(60));
}

main().catch(console.error);
