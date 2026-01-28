'use client';

import * as React from 'react';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { avalanche, polygon, hardhat, avalancheFuji } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// ============ CUSTOM CHAIN DEFINITIONS ============

// Ethereum Sepolia (with reliable RPC)
const sepolia = {
    id: 11155111,
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'Sepolia Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: { http: ['https://1rpc.io/sepolia'] },
        default: { http: ['https://1rpc.io/sepolia'] },
    },
    blockExplorers: {
        default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
} as const;

// Flare Mainnet
const flare = {
    id: 14,
    name: 'Flare',
    network: 'flare',
    nativeCurrency: {
        decimals: 18,
        name: 'Flare',
        symbol: 'FLR',
    },
    rpcUrls: {
        public: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
        default: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Flare Explorer', url: 'https://flare-explorer.flare.network' },
    },
} as const;

// Flare Coston2 Testnet
const coston2 = {
    id: 114,
    name: 'Flare Coston2',
    network: 'coston2',
    nativeCurrency: {
        decimals: 18,
        name: 'Coston2 Flare',
        symbol: 'C2FLR',
    },
    rpcUrls: {
        public: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
        default: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Coston2 Explorer', url: 'https://coston2-explorer.flare.network' },
    },
    testnet: true,
} as const;

// Polygon Amoy Testnet
const polygonAmoy = {
    id: 80002,
    name: 'Polygon Amoy',
    network: 'polygon-amoy',
    nativeCurrency: {
        decimals: 18,
        name: 'MATIC',
        symbol: 'MATIC',
    },
    rpcUrls: {
        public: { http: ['https://polygon-amoy-bor-rpc.publicnode.com'] },
        default: { http: ['https://polygon-amoy-bor-rpc.publicnode.com'] },
    },
    blockExplorers: {
        default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
    },
    testnet: true,
} as const;

// ============ WAGMI CONFIGURATION ============

const supportedChains = [
    avalancheFuji,
    sepolia,
    coston2,
    polygonAmoy,
    avalanche,
    flare,
    polygon,
    mainnet,
    hardhat,
];

const { chains, publicClient, webSocketPublicClient } = configureChains(
    supportedChains,
    [
        // Use custom JSON-RPC provider for reliable connections
        jsonRpcProvider({
            rpc: (chain) => {
                if (chain.id === 11155111) return { http: 'https://1rpc.io/sepolia' };
                if (chain.id === 43113) return { http: 'https://api.avax-test.network/ext/bc/C/rpc' };
                if (chain.id === 114) return { http: 'https://coston2-api.flare.network/ext/C/rpc' };
                if (chain.id === 80002) return { http: 'https://polygon-amoy-bor-rpc.publicnode.com' };
                return null; // Fallback to publicProvider
            },
        }),
        publicProvider(),
    ]
);

const config = createConfig({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Core',
                shimDisconnect: true,
            }
        }),
    ],
    publicClient,
    webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return (
        <WagmiConfig config={config}>
            {mounted && children}
        </WagmiConfig>
    );
}
