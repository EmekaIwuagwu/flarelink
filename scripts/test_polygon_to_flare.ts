/**
 * 🌉 FlareLink Bridge Test: Polygon Amoy → Flare Coston2
 */

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

// Chain configurations from .env
const CHAINS = {
    AMOY: {
        id: 2,
        name: "Polygon Amoy",
        rpc: process.env.POLYGON_RPC_URL!,
        bridge: process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_AMOY!,
        token: process.env.FLT_AMOY!
    },
    COSTON2: {
        id: 1,
        name: "Flare Coston2",
        rpc: process.env.FLARE_RPC_URL!,
        bridge: process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_COSTON2!,
        token: process.env.FLT_COSTON2!
    }
};

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function faucet() external"
];

const BRIDGE_ABI = [
    "function initiateTransfer(address _tokenAddress, uint256 _amount, uint8 _destinationChain) returns (uint256 bridgeId)",
    "function isSupportedToken(address) view returns (bool)",
    "event TokensLocked(uint256 indexed bridgeId, address indexed user, address indexed tokenAddress, uint256 amount, uint8 sourceChain, uint8 destinationChain, uint256 timestamp)"
];

async function main() {
    console.log("=".repeat(60));
    console.log("🌉 FLARELINK TEST: POLYGON AMOY → FLARE COSTON2");
    console.log("=".repeat(60));

    const privateKey = process.env.PRIVATE_KEY!;
    const provider = new ethers.JsonRpcProvider(CHAINS.AMOY.rpc);
    const wallet = new ethers.Wallet(privateKey, provider);

    const token = new ethers.Contract(CHAINS.AMOY.token, ERC20_ABI, wallet);
    const bridge = new ethers.Contract(CHAINS.AMOY.bridge, BRIDGE_ABI, wallet);

    // 1. Check Balance & Faucet
    let balance = await token.balanceOf(wallet.address);
    console.log(`Wallet: ${wallet.address}`);
    console.log(`Initial FLT Balance on Amoy: ${ethers.formatEther(balance)}`);

    if (balance < ethers.parseEther("10")) {
        console.log("🚰 Balance low, requesting from FLT faucet...");
        try {
            const faucetTx = await token.faucet();
            await faucetTx.wait();
            console.log("✅ Faucet success!");
            balance = await token.balanceOf(wallet.address);
            console.log(`New Balance: ${ethers.formatEther(balance)}`);
        } catch (e) {
            console.log("❌ Faucet failed (maybe cooled down). Trying anyway...");
        }
    }

    const amount = ethers.parseEther("5");

    // 2. Check Whitelist
    const isWhitelisted = await bridge.isSupportedToken(CHAINS.AMOY.token);
    console.log(`Token Whitelisted on Bridge: ${isWhitelisted}`);

    if (!isWhitelisted) {
        throw new Error("Token not whitelisted on source bridge!");
    }

    // 3. Approve
    const allowance = await token.allowance(wallet.address, CHAINS.AMOY.bridge);
    if (allowance < amount) {
        console.log("📝 Approving bridge to spend FLT...");
        // Use higher gas for Amoy
        const approveTx = await token.approve(CHAINS.AMOY.bridge, amount, {
            maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
            maxFeePerGas: ethers.parseUnits("60", "gwei")
        });
        await approveTx.wait();
        console.log(`✅ Approved! TX: ${approveTx.hash}`);
    }

    // 4. Initiate Bridge
    console.log(`🌉 Initiating bridge: ${ethers.formatEther(amount)} FLT to Flare Coston2...`);
    const bridgeTx = await bridge.initiateTransfer(
        CHAINS.AMOY.token,
        amount,
        CHAINS.COSTON2.id,
        {
            maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
            maxFeePerGas: ethers.parseUnits("60", "gwei")
        }
    );

    console.log(`⏳ Waiting for confirmation...`);
    const receipt = await bridgeTx.wait();
    console.log(`✅ Bridge Transaction Confirmed!`);
    console.log(`🔗 TX Hash: ${bridgeTx.hash}`);

    // Parse Bridge ID
    const iface = new ethers.Interface(BRIDGE_ABI);
    let bridgeId = "unknown";
    for (const log of receipt.logs) {
        try {
            const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
            if (parsed?.name === "TokensLocked") {
                bridgeId = parsed.args.bridgeId.toString();
                console.log(`🆔 Bridge ID: ${bridgeId}`);
            }
        } catch { }
    }

    console.log("\n" + "=".repeat(60));
    console.log("SUCCESS: Transfer initiated on Polygon Amoy.");
    console.log("The Relayer should pick this up and relay it to Flare Coston2 shortly.");
    console.log("Watch the Relayer terminal for updates.");
    console.log("=".repeat(60));
}

main().catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
});
