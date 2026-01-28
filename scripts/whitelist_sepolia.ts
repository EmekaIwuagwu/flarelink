import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    const bridgeAddress = "0xE7635764e8CE10DF60201E3c2120af43D823Ccc2"; // Sepolia Bridge
    const tokenToWhitelist = "0xe0572C001B320dBd214C5ddB592C018FA5cedA4F"; // Your Test Token

    console.log("----------------------------------------------------");
    console.log("Whitelisting Token on Sepolia Bridge");
    console.log("Bridge:", bridgeAddress);
    console.log("Token:", tokenToWhitelist);
    console.log("----------------------------------------------------");

    const bridge = await ethers.getContractAt("Bridge", bridgeAddress);

    console.log("Sending whitelist transaction...");
    const tx = await bridge.addSupportedToken(tokenToWhitelist);

    console.log("Waiting for confirmation...");
    await tx.wait();

    console.log("SUCCESS! Token is now whitelisted on Sepolia.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
