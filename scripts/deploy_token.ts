import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    console.log(`Deploying FLT to network: ${network.name} (${network.chainId})`);

    const FLT = await ethers.getContractFactory("FlareLinkToken");
    const flt = await FLT.deploy();
    await flt.waitForDeployment();

    const fltAddress = await flt.getAddress();
    console.log(`FlareLink Token (FLT) deployed to: ${fltAddress}`);

    // Whitelist on native bridge
    let bridgeAddr = "";
    if (network.chainId === 11155111n) {
        bridgeAddr = "0xE7635764e8CE10DF60201E3c2120af43D823Ccc2";
    } else if (network.chainId === 43113n) {
        bridgeAddr = "0x652f4C99e069edDa38C30E82935BbaF5e1B48EaE";
    }

    if (bridgeAddr) {
        const bridge = await ethers.getContractAt("Bridge", bridgeAddr);
        console.log(`Whitelisting FLT on bridge ${bridgeAddr}...`);
        await (await bridge.addSupportedToken(fltAddress)).wait();
        console.log("Whitelisted!");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
