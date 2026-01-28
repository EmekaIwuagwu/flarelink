import React from 'react';
import styles from '@/styles/bridge.module.css';

interface ChainConfig {
    id: number;
    name: string;
    symbol: string;
    bridgeAddress: `0x${string}`;
    tokenAddress: `0x${string}`;
}

interface ChainSelectorProps {
    selected: ChainConfig;
    onChange: (chain: ChainConfig) => void;
    exclude?: ChainConfig;
}

// ============ SUPPORTED CHAINS ============
// These must match the chains defined in BridgeForm.tsx

const CHAINS: ChainConfig[] = [
    {
        id: 43113,
        name: 'Avalanche Fuji',
        symbol: 'AVAX',
        bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_FUJI || '0x652f4C99e069edDa38C30E82935BbaF5e1B48EaE') as `0x${string}`,
        tokenAddress: '0x7B418fcb4b5a1c612Ce5E19B9F23017041E995Ee' as `0x${string}`,
    },
    {
        id: 114,
        name: 'Flare Coston2',
        symbol: 'C2FLR',
        bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_COSTON2 || '0xfadc1ac000557842D2D2A991bf8643Ae2e2c2275') as `0x${string}`,
        tokenAddress: '0x70FB9FfDA73a0518F16E32fc2905351fd1a97565' as `0x${string}`,
    },
    {
        id: 11155111,
        name: 'Ethereum Sepolia',
        symbol: 'ETH',
        bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_SEPOLIA || '0xE7635764e8CE10DF60201E3c2120af43D823Ccc2') as `0x${string}`,
        tokenAddress: '0x341f64F97De07e3B6d47D244B5a0A8B7a6292267' as `0x${string}`,
    },
    {
        id: 80002,
        name: 'Polygon Amoy',
        symbol: 'MATIC',
        bridgeAddress: (process.env.NEXT_PUBLIC_BRIDGE_ADDRESS_AMOY || '0x2B53AF2fF168345C409da33d5cc68270F2905cA7') as `0x${string}`,
        tokenAddress: '0xEbd238521aabd9834A1be844a4eBE1acA820b416' as `0x${string}`,
    },
];


export default function ChainSelector({ selected, onChange, exclude }: ChainSelectorProps) {
    // Filter out excluded chain and chains without deployed bridges
    const availableChains = CHAINS.filter(c =>
        (!exclude || c.id !== exclude.id) &&
        c.bridgeAddress !== '0x0000000000000000000000000000000000000000'
    );

    return (
        <div className="relative">
            <select
                className={styles.input}
                value={selected.id}
                onChange={(e) => {
                    const chain = CHAINS.find(c => c.id === Number(e.target.value));
                    if (chain) onChange(chain);
                }}
            >
                {availableChains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                        {chain.name} ({chain.symbol})
                    </option>
                ))}
            </select>
        </div>
    );
}
