import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Granting RELAYER_ROLE using account:", deployer.address);

    // Bridge address on Flare Coston2
    const bridgeAddress = "0xfadc1ac000557842D2D2A991bf8643Ae2e2c2275";

    // Relayer address  
    const relayerAddress = "0x28e514Ce1a0554B83f6d5EEEE11B07D0e294D9F9";

    const Bridge = await ethers.getContractAt("Bridge", bridgeAddress);

    // RELAYER_ROLE = keccak256("RELAYER_ROLE")
    const RELAYER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("RELAYER_ROLE"));

    console.log("Granting RELAYER_ROLE to:", relayerAddress);

    const tx = await Bridge.grantRole(RELAYER_ROLE, relayerAddress);
    await tx.wait();

    console.log("✅ RELAYER_ROLE granted successfully!");
    console.log("Transaction hash:", tx.hash);

    // Verify
    const hasRole = await Bridge.hasRole(RELAYER_ROLE, relayerAddress);
    console.log("Verification - Has RELAYER_ROLE:", hasRole);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
