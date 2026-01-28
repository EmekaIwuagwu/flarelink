import { ethers } from "hardhat";

async function main() {
    const txHash = "0x5df2392f1ff450fb64b46bb05a7dd4fcf704b84eb7c60e712c22becf1040759f";
    const provider = new ethers.JsonRpcProvider("https://coston2-api.flare.network/ext/C/rpc");

    console.log("Checking transaction:", txHash);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
        console.log("Transaction not found or not mined yet.");
        return;
    }

    console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
    console.log("Gas Used:", receipt.gasUsed.toString());

    if (receipt.status === 0) {
        console.log("Transaction reverted. Attempting to get revert reason...");
        const tx = await provider.getTransaction(txHash);
        try {
            const code = await provider.call({
                to: tx.to,
                from: tx.from,
                data: tx.data,
                value: tx.value,
                gasLimit: tx.gasLimit,
                gasPrice: tx.gasPrice,
                blockTag: receipt.blockNumber - 1
            });
            console.log("Revert reason (raw):", code);
        } catch (err: any) {
            console.log("Revert reason (decoded):", err.message);
        }
    } else {
        console.log("Logs emitted:", receipt.logs.length);
        for (const log of receipt.logs) {
            console.log("Log index:", log.index);
        }
    }
}

main().catch(console.error);
