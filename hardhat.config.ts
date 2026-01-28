import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            viaIR: true,
        },
    },
    networks: {
        hardhat: {
            chainId: 31337
        },
        avalancheFuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            chainId: 43113,
            accounts: [PRIVATE_KEY]
        },
        flareCoston2: {
            url: "https://coston2-api.flare.network/ext/C/rpc",
            chainId: 114,
            accounts: [PRIVATE_KEY]
        },
        polygonAmoy: {
            url: "https://rpc-amoy.polygon.technology",
            chainId: 80002,
            accounts: [PRIVATE_KEY]
        },
        sepolia: {
            url: "https://1rpc.io/sepolia",
            chainId: 11155111,
            accounts: [PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: {
            avalancheFuji: process.env.SNOWTRACE_API_KEY || "",
            polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
            sepolia: process.env.ETHERSCAN_API_KEY || "",
        }
    }
};

export default config;
