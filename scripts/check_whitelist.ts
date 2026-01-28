import { ethers } from "hardhat";

async function main() {
    const bridgeAddress = "0x652f4C99e069edDa38C30E82935BbaF5e1B48EaE"; // Fuji
    const tokenAddress = "0xe0572C001B320dBd214C5ddB592C018FA5cedA4F"; // FLT

    const Bridge = await ethers.getContractAt("Bridge", bridgeAddress);

    console.log("Checking if token is whitelisted...");
    const isWhitelisted = await Bridge.isSupportedToken(tokenAddress);

    console.log(`Token ${tokenAddress}`);
    console.log(`Is Whitelisted: ${isWhitelisted}`);

    if (!isWhitelisted) {
        console.log("\n❌ TOKEN IS NOT WHITELISTED!");
        console.log("This is why bridge transactions are failing.");
        console.log("\nTo fix, run: npx hardhat run scripts/whitelist_token.ts --network avalancheFuji");
    } else {
        console.log("\n✅ Token is properly whitelisted");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
