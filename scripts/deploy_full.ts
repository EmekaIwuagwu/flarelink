/**
 * FlareLink Multi-Chain Deployment Script
 * 
 * Deploys Bridge and FLT Token to new chains and configures them
 */

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const TREASURY = process.env.TREASURY_ADDRESS || "0x28e514Ce1a0554B83f6d5EEEE11B07D0e294D9F9";
const STATE_CONNECTOR = process.env.STATE_CONNECTOR_ADDRESS || "0x1234567890123456789012345678901234567890";

async function main() {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    console.log("=".repeat(60));
    console.log("FLARELINK MULTI-CHAIN DEPLOYMENT");
    console.log("=".repeat(60));
    console.log("Network:", network.name, `(Chain ID: ${network.chainId})`);
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));
    console.log("=".repeat(60));

    // 1. Deploy Bridge Contract
    console.log("\n📦 Step 1: Deploying Bridge Contract...");
    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = await Bridge.deploy(TREASURY, STATE_CONNECTOR);
    await bridge.waitForDeployment();
    const bridgeAddress = await bridge.getAddress();
    console.log("✅ Bridge deployed to:", bridgeAddress);

    // 2. Deploy FLT Token
    console.log("\n📦 Step 2: Deploying FlareLink Token (FLT)...");
    const FLT = await ethers.getContractFactory("FlareLinkToken");
    const flt = await FLT.deploy();
    await flt.waitForDeployment();
    const fltAddress = await flt.getAddress();
    console.log("✅ FLT Token deployed to:", fltAddress);

    // 3. Grant RELAYER_ROLE to deployer (for testing)
    console.log("\n🔐 Step 3: Granting RELAYER_ROLE to deployer...");
    const RELAYER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("RELAYER_ROLE"));
    const grantTx = await bridge.grantRole(RELAYER_ROLE, deployer.address);
    await grantTx.wait();
    console.log("✅ RELAYER_ROLE granted");

    // 4. Whitelist FLT on Bridge
    console.log("\n📝 Step 4: Whitelisting FLT on Bridge...");
    const whitelistTx = await bridge.addSupportedToken(fltAddress);
    await whitelistTx.wait();
    console.log("✅ FLT whitelisted");

    // 5. Set daily volume cap for deployer
    console.log("\n💰 Step 5: Setting daily volume cap...");
    const capTx = await bridge.setDailyVolumeCap(deployer.address, ethers.parseEther("1000000"));
    await capTx.wait();
    console.log("✅ Daily cap set to 1,000,000 tokens");

    // 6. Summary
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n🔗 Add these to your .env file:\n");

    if (network.chainId === 80002n) {
        console.log(`NEXT_PUBLIC_BRIDGE_ADDRESS_AMOY=${bridgeAddress}`);
        console.log(`BRIDGE_ADDRESS_AMOY=${bridgeAddress}`);
        console.log(`POLYGON_RPC_URL=https://rpc-amoy.polygon.technology`);
        console.log(`\n# FLT Token on Polygon Amoy: ${fltAddress}`);
    } else if (network.chainId === 114n) {
        console.log(`NEXT_PUBLIC_BRIDGE_ADDRESS_COSTON2=${bridgeAddress}`);
        console.log(`\n# FLT Token on Flare Coston2: ${fltAddress}`);
    }

    console.log("\n" + "=".repeat(60));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
