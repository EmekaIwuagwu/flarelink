/**
 * Deploy FLT Token to a network with existing Bridge
 * and whitelist it on the bridge
 */

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

// Existing Bridge addresses per network
const EXISTING_BRIDGES: Record<number, string> = {
    114: "0xfadc1ac000557842D2D2A991bf8643Ae2e2c2275", // Coston2
};

async function main() {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    const chainId = Number(network.chainId);

    console.log("=".repeat(60));
    console.log("FLT TOKEN DEPLOYMENT");
    console.log("=".repeat(60));
    console.log("Network:", network.name, `(Chain ID: ${chainId})`);
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

    const existingBridge = EXISTING_BRIDGES[chainId];
    if (!existingBridge) {
        console.log("\n❌ No existing bridge found for this network. Use deploy_full.ts instead.");
        return;
    }
    console.log("Existing Bridge:", existingBridge);
    console.log("=".repeat(60));

    // 1. Deploy FLT Token
    console.log("\n📦 Step 1: Deploying FlareLink Token (FLT)...");
    const FLT = await ethers.getContractFactory("FlareLinkToken");
    const flt = await FLT.deploy();
    await flt.waitForDeployment();
    const fltAddress = await flt.getAddress();
    console.log("✅ FLT Token deployed to:", fltAddress);

    // 2. Connect to existing Bridge
    console.log("\n🔗 Step 2: Connecting to existing Bridge...");
    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = Bridge.attach(existingBridge);

    // 3. Whitelist FLT on Bridge
    console.log("\n📝 Step 3: Whitelisting FLT on Bridge...");
    try {
        const whitelistTx = await bridge.addSupportedToken(fltAddress);
        await whitelistTx.wait();
        console.log("✅ FLT whitelisted");
    } catch (e: any) {
        console.log("⚠️ Whitelist failed (may already be whitelisted):", e.message?.substring(0, 50));
    }

    // 4. Set daily volume cap for deployer
    console.log("\n💰 Step 4: Setting daily volume cap...");
    try {
        const capTx = await bridge.setDailyVolumeCap(deployer.address, ethers.parseEther("1000000"));
        await capTx.wait();
        console.log("✅ Daily cap set to 1,000,000 tokens");
    } catch (e: any) {
        console.log("⚠️ Cap setting failed (may already be set):", e.message?.substring(0, 50));
    }

    // 5. Summary
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log(`\n# FLT Token on Chain ${chainId}: ${fltAddress}`);
    console.log("\n" + "=".repeat(60));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
