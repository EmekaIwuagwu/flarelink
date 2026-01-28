'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';

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

    // Store the chain ID when user initiates a switch
    const initialChainId = useRef<number | undefined>(undefined);

    const currentNetwork = NETWORKS.find(n => n.id === chain?.id) || NETWORKS[0];

    // Poll every 2 seconds to check if chain changed
    useEffect(() => {
        if (!isSwitching) return;

        const interval = setInterval(() => {
            // Check the chain directly from MetaMask/window.ethereum
            if (typeof window !== 'undefined' && (window as any).ethereum) {
                (window as any).ethereum.request({ method: 'eth_chainId' })
                    .then((chainIdHex: string) => {
                        const currentChainId = parseInt(chainIdHex, 16);

                        // If chain has changed from what it was before, refresh!
                        if (initialChainId.current && currentChainId !== initialChainId.current) {
                            console.log('Chain changed detected! Refreshing...');
                            window.location.reload();
                        }
                    })
                    .catch(console.error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isSwitching]);

    const handleNetworkChange = (networkId: number) => {
        // If already on this network, just close dropdown
        if (networkId === chain?.id) {
            setIsOpen(false);
            return;
        }

        // Store current chain ID before switching
        initialChainId.current = chain?.id;
        setIsSwitching(true);
        setIsOpen(false);

        // Trigger the network switch (MetaMask will prompt)
        if (switchNetwork) {
            switchNetwork(networkId);
        }
    };

    return (
        <div className="relative">
            {/* Current Network Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isSwitching}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 disabled:opacity-50"
                style={{ borderColor: currentNetwork.color + '40' }}
            >
                {isSwitching ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span className="text-sm font-medium text-gray-200">
                            Switching...
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-lg">{currentNetwork.icon}</span>
                        <span className="text-sm font-medium text-gray-200">
                            {currentNetwork.shortName}
                        </span>
                        <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Select Network</span>
                        </div>
                        <div className="py-1">
                            {NETWORKS.map((network) => {
                                const isCurrentNetwork = chain?.id === network.id;

                                return (
                                    <button
                                        key={network.id}
                                        onClick={() => handleNetworkChange(network.id)}
                                        disabled={isSwitching}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 ${isCurrentNetwork ? 'bg-gray-800/50' : ''
                                            }`}
                                    >
                                        <span
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                            style={{ backgroundColor: network.color + '20' }}
                                        >
                                            {network.icon}
                                        </span>
                                        <div className="flex-1 text-left">
                                            <div className="text-sm font-medium text-gray-200">{network.name}</div>
                                            <div className="text-xs text-gray-500">{network.symbol}</div>
                                        </div>
                                        {isCurrentNetwork && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-green-400">Connected</span>
                                                <div
                                                    className="w-2 h-2 rounded-full animate-pulse"
                                                    style={{ backgroundColor: network.color }}
                                                />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
