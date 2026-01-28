import { ethers } from "hardhat";

async function main() {
    const relayerKey = "ef3c8edcf70855ba073cb9ef556b5cb8a0d20aea57a0bf2dceb3210b0c8c4792";
    const wallet = new ethers.Wallet(relayerKey);
    console.log("Relayer Address:", wallet.address);

    const bridgeAddress = "0xfadc1ac000557842D2D2A991bf8643Ae2e2c2275"; // Flare Bridge
    const Bridge = await ethers.getContractAt("Bridge", bridgeAddress);

    const RELAYER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("RELAYER_ROLE"));
    const hasRole = await Bridge.hasRole(RELAYER_ROLE, wallet.address);
    console.log("Has RELAYER_ROLE on Flare:", hasRole);

    const bridgeNonce = await Bridge.bridgeNonce();
    console.log("Current Bridge Nonce on Flare:", bridgeNonce.toString());
}

main().catch(console.error);
