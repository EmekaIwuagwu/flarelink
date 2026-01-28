import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("----------------------------------------------------");
    console.log("FlareLink Deployment & Initialization");
    console.log("Deployer:", deployer.address);
    console.log("----------------------------------------------------");

    // 1. Configurables from Environment
    const treasury = process.env.TREASURY_ADDRESS || deployer.address;
    const stateConnector = process.env.STATE_CONNECTOR_ADDRESS || "0x0000000000000000000000000000000000000000";
    const testTokenAddress = process.env.TEST_TOKEN_ADDRESS;

    // 2. Deploy Bridge
    console.log("Deploying Bridge Contract...");
    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = await Bridge.deploy(treasury, stateConnector);
    await bridge.waitForDeployment();
    const bridgeAddress = await bridge.getAddress();
    console.log(`Bridge deployed to: ${bridgeAddress}`);

    // 3. Grant Relayer Role (For the deployer/relayer account)
    const RELAYER_ROLE = await bridge.RELAYER_ROLE();
    await (await bridge.grantRole(RELAYER_ROLE, deployer.address)).wait();
    console.log("Granted RELAYER_ROLE to:", deployer.address);

    // 4. Initialization for Testing
    console.log("\nInitializing Security Settings for Testnet...");

    // Set a high daily volume cap for the deployer to ensure no 'cap exceeded' errors during testing
    const highCap = ethers.parseEther("1000000"); // 1M tokens
    await (await bridge.setDailyVolumeCap(deployer.address, highCap)).wait();
    console.log(`Daily volume cap for ${deployer.address} set to 1M tokens.`);

    // Whitelist the test token if provided
    if (testTokenAddress) {
        await (await bridge.addSupportedToken(testTokenAddress)).wait();
        console.log(`Token ${testTokenAddress} whitelisted successfully.`);
    } else {
        console.log("Warning: No TEST_TOKEN_ADDRESS provided. Whitelisting skipped.");
    }

    console.log("\n----------------------------------------------------");
    console.log("DEPLOYMENT COMPLETE");
    console.log("Bridge:", bridgeAddress);
    console.log("Treasury:", treasury);
    console.log("----------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
