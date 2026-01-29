'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ChainSelector.module.css';

interface ChainConfig {
    id: number;
    name: string;
    symbol: string;
    bridgeAddress: `0x${string}`;
    tokenAddress: `0x${string}`;
    explorerUrl?: string;
}

interface ChainSelectorProps {
    selected: ChainConfig;
    onChange: (chain: ChainConfig) => void;
    exclude?: ChainConfig;
}

// Chain Icons (emoji placeholders - can be replaced with actual SVG icons)
const CHAIN_ICONS: Record<number, string> = {
    43113: '🔺',    // Avalanche
    114: '🔥',      // Flare
    11155111: '💎', // Ethereum
    80002: '🟣',    // Polygon
};

const CHAIN_COLORS: Record<number, string> = {
    43113: '#E84142',   // Avalanche Red
    114: '#FF4D4D',     // Flare Red
    11155111: '#627EEA', // Ethereum Blue
    80002: '#8247E5',   // Polygon Purple
};

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
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const availableChains = CHAINS.filter(c =>
        (!exclude || c.id !== exclude.id) &&
        c.bridgeAddress !== '0x0000000000000000000000000000000000000000'
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (chain: ChainConfig) => {
        onChange(chain);
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            {/* Selected Chain Button */}
            <motion.button
                className={styles.selector}
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.98 }}
                style={{
                    borderColor: isOpen ? CHAIN_COLORS[selected.id] + '50' : undefined,
                    boxShadow: isOpen ? `0 0 20px ${CHAIN_COLORS[selected.id]}20` : undefined
                }}
            >
                <div className={styles.chainInfo}>
                    <span
                        className={styles.chainIcon}
                        style={{ backgroundColor: CHAIN_COLORS[selected.id] + '20' }}
                    >
                        {CHAIN_ICONS[selected.id]}
                    </span>
                    <div className={styles.chainText}>
                        <span className={styles.chainName}>{selected.name}</span>
                        <span className={styles.chainSymbol}>{selected.symbol}</span>
                    </div>
                </div>
                <motion.svg
                    className={styles.chevron}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </motion.svg>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >
                        {availableChains.map((chain) => (
                            <motion.button
                                key={chain.id}
                                className={`${styles.option} ${chain.id === selected.id ? styles.optionActive : ''}`}
                                onClick={() => handleSelect(chain)}
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span
                                    className={styles.chainIcon}
                                    style={{ backgroundColor: CHAIN_COLORS[chain.id] + '20' }}
                                >
                                    {CHAIN_ICONS[chain.id]}
                                </span>
                                <div className={styles.chainText}>
                                    <span className={styles.chainName}>{chain.name}</span>
                                    <span className={styles.chainSymbol}>{chain.symbol}</span>
                                </div>
                                {chain.id === selected.id && (
                                    <motion.span
                                        className={styles.checkmark}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        ✓
                                    </motion.span>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
