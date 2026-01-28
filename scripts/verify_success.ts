import { ethers } from "hardhat";

async function main() {
    const txHash = "0x3d7eebf08910116de32621f63c7ca52468279e945f95a38ec817f3f16b7d1e0c";
    const provider = new ethers.JsonRpcProvider("https://coston2-api.flare.network/ext/C/rpc");

    console.log("Checking NEW Flare transaction:", txHash);
    let receipt = null;
    for (let i = 0; i < 5; i++) {
        receipt = await provider.getTransactionReceipt(txHash);
        if (receipt) break;
        console.log("Waiting for mining...");
        await new Promise(r => setTimeout(r, 4000));
    }

    if (!receipt) {
        console.log("Transaction still pending or not found.");
        return;
    }

    console.log("Status:", receipt.status === 1 ? "✅ SUCCESS" : "❌ FAILED");
    console.log("Gas Used:", receipt.gasUsed.toString());

    if (receipt.status === 1) {
        console.log("Bridge transaction successfully completed on Flare!");
    } else {
        console.log("Transaction still reverting despite higher gas. Analyzing data...");
    }
}

main().catch(console.error);
