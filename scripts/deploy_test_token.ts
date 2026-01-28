import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    const bridgeAddress = "0x652f4C99e069edDa38C30E82935BbaF5e1B48EaE"; // Your Fuji Bridge

    console.log("Deploying Test Token to Avalanche Fuji...");

    // 1. Deploy Test Token (We'll use WrappedToken.sol because it's a standard ERC20 with a mint function)
    const MockToken = await ethers.getContractFactory("WrappedToken");
    const token = await MockToken.deploy(
        "FlareLink Test Token",
        "FLT",
        deployer.address, // Set deployer as bridge just for minting access
        "0x0000000000000000000000000000000000000000",
        0
    );
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log(`Test Token deployed to: ${tokenAddress}`);

    // 2. Mint tokens to the user
    console.log("Minting 1000 FLT to your wallet...");
    await (await token.mint(deployer.address, ethers.parseEther("1000"))).wait();
    console.log("Minting successful!");

    // 3. Whitelist in Bridge
    console.log("Whitelisting token in Bridge...");
    const Bridge = await ethers.getContractAt("Bridge", bridgeAddress);
    await (await Bridge.addSupportedToken(tokenAddress)).wait();
    console.log("Token whitelisted in Bridge successfully.");

    console.log("\n----------------------------------------------------");
    console.log("TOKEN ADDRESS TO USE IN FORM:");
    console.log(tokenAddress);
    console.log("----------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
