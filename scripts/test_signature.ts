import { ethers } from "hardhat";

async function main() {
    // Test values from actual bridge event
    const bridgeId = 7;
    const recipient = "0x28e514Ce1a0554B83f6d5EEEE11B07D0e294D9F9";
    const originalToken = "0xe0572C001B320dBd214C5ddB592C018FA5cedA4F";
    const amount = "9995000000000000000";
    const sourceChain = 0; // Avalanche
    const tokenName = "FlareLink Test Token";
    const tokenSymbol = "FLT";

    // 1. Create messageHash exactly as contract does
    const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
            ["uint256", "address", "address", "uint256", "uint8", "string", "string"],
            [bridgeId, recipient, originalToken, amount, sourceChain, tokenName, tokenSymbol]
        )
    );

    console.log("Message Hash:", messageHash);

    // 2. Sign it as relayer would
    const [signer] = await ethers.getSigners();
    const signature = await signer.signMessage(ethers.getBytes(messageHash));

    console.log("Signature:", signature);
    console.log("Signer Address:", signer.address);

    // 3. Verify recovery works
    const recovered = ethers.verifyMessage(ethers.getBytes(messageHash), signature);
    console.log("Recovered Address:", recovered);
    console.log("Match:", recovered.toLowerCase() === signer.address.toLowerCase());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
