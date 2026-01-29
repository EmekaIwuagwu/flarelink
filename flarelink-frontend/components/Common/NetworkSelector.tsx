'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';

interface NetworkConfig {
    id: number;
    name: string;
    shortName: string;
    symbol: string;
    color: string;
    icon: string;
}

const NETWORKS: NetworkConfig[] = [
    {
        id: 43113,
        name: 'Avalanche Fuji',
        shortName: 'Fuji',
        symbol: 'AVAX',
        color: '#E84142',
        icon: '🔺',
    },
    {
        id: 11155111,
        name: 'Ethereum Sepolia',
        shortName: 'Sepolia',
        symbol: 'ETH',
        color: '#627EEA',
        icon: '⟠',
    },
    {
        id: 114,
        name: 'Flare Coston2',
        shortName: 'Coston2',
        symbol: 'C2FLR',
        color: '#E62058',
        icon: '🔥',
    },
    {
        id: 80002,
        name: 'Polygon Amoy',
        shortName: 'Amoy',
        symbol: 'MATIC',
        color: '#8247E5',
        icon: '🔷',
    },
];

export default function NetworkSelector() {
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const [isOpen, setIsOpen] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const initialChainId = useRef<number | undefined>(undefined);
    const currentNetwork = NETWORKS.find(n => n.id === chain?.id) || NETWORKS[0];

    useEffect(() => {
        if (!isSwitching) return;

        const interval = setInterval(() => {
            if (typeof window !== 'undefined' && (window as any).ethereum) {
                (window as any).ethereum.request({ method: 'eth_chainId' })
                    .then((chainIdHex: string) => {
                        const currentChainId = parseInt(chainIdHex, 16);
                        if (initialChainId.current && currentChainId !== initialChainId.current) {
                            window.location.reload();
                        }
                    })
                    .catch(console.error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isSwitching]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNetworkChange = (networkId: number) => {
        if (networkId === chain?.id) {
            setIsOpen(false);
            return;
        }

        initialChainId.current = chain?.id;
        setIsSwitching(true);
        setIsOpen(false);

        if (switchNetwork) {
            switchNetwork(networkId);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Current Network Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                disabled={isSwitching}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all disabled:opacity-50"
                style={{ borderColor: currentNetwork.color + '30' }}
            >
                {isSwitching ? (
                    <>
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-300">Switching...</span>
                    </>
                ) : (
                    <>
                        <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                            style={{ backgroundColor: currentNetwork.color + '20' }}
                        >
                            {currentNetwork.icon}
                        </span>
                        <span className="text-sm font-medium text-white">{currentNetwork.shortName}</span>
                        <motion.svg
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </>
                )}
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-64 z-50"
                    >
                        <div className="glass-panel-elevated overflow-hidden border border-white/10">
                            {/* Header */}
                            <div className="px-4 py-3 bg-white/5 border-b border-white/5">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                    Select Network
                                </span>
                            </div>

                            {/* Network List */}
                            <div className="py-1">
                                {NETWORKS.map((network, i) => {
                                    const isCurrentNetwork = chain?.id === network.id;

                                    return (
                                        <motion.button
                                            key={network.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => handleNetworkChange(network.id)}
                                            disabled={isSwitching}
                                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all disabled:opacity-50 ${isCurrentNetwork ? 'bg-white/5' : ''
                                                }`}
                                        >
                                            <span
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                                style={{ backgroundColor: network.color + '15' }}
                                            >
                                                {network.icon}
                                            </span>
                                            <div className="flex-1 text-left">
                                                <div className="text-sm font-medium text-white">{network.name}</div>
                                                <div className="text-xs text-gray-500">{network.symbol}</div>
                                            </div>
                                            {isCurrentNetwork && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-green-400 font-medium">Active</span>
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="w-2 h-2 rounded-full bg-green-500"
                                                    />
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
