'use client';

import React from 'react';
import Link from 'next/link';
import { useAccount, useDisconnect, useBalance, useConnect, useNetwork } from 'wagmi';
import styles from '@/styles/bridge.module.css';
import NetworkSelector from './NetworkSelector';

import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect, connectors, isLoading, pendingConnector } = useConnect();
    const { chain } = useNetwork();
    const { data: balance, refetch: refetchBalance } = useBalance({
        address,
        watch: true,
        chainId: chain?.id, // Explicitly use current chain
    });

    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Refetch balance when chain changes
    React.useEffect(() => {
        if (chain?.id) {
            refetchBalance();
        }
    }, [chain?.id, refetchBalance]);


    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const [showConnectModal, setShowConnectModal] = React.useState(false);

    const handleLogout = () => {
        disconnect();
        setShowLogoutModal(false);
        router.push('/disconnect');
    };

    const handleConnectClick = () => {
        setShowConnectModal(true);
    };

    const executeConnect = (connector: any) => {
        connect({ connector });
        setShowConnectModal(false);
    };

    // Formatting address 0x1234...5678
    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    if (!isMounted) return null; // Prevent hydration mismatch

    return (
        <>
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 40px',
                background: 'rgba(13, 13, 13, 0.9)',
                borderBottom: '1px solid rgba(220, 20, 60, 0.2)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                backdropFilter: 'blur(10px)'
            }}>
                {/* Logo Area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #DC143C, #8B0000)',
                        borderRadius: '8px'
                    }}></div>
                    <Link href="/" style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: '#E8E8E8',
                        textDecoration: 'none',
                        letterSpacing: '-0.5px'
                    }}>
                        FLARE<span style={{ color: '#DC143C' }}>LINK</span>
                    </Link>
                </div>

                {/* Navigation Links - Dynamic based on Auth */}
                <div className="hidden md:flex gap-8 font-medium">
                    {isConnected ? (
                        <>
                            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Overview</Link>
                            <Link href="/dashboard/transfer" className="text-gray-300 hover:text-white transition-colors">Transfer</Link>
                            <Link href="/dashboard/history" className="text-gray-300 hover:text-white transition-colors">History</Link>
                            <Link href="/dashboard/settings" className="text-gray-300 hover:text-white transition-colors">Settings</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
                            <Link href="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
                            <Link href="/security" className="text-gray-300 hover:text-white transition-colors">Security</Link>
                            <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
                        </>
                    )}
                </div>

                {/* User Profile / Connect */}
                <div>
                    {isConnected && address ? (
                        <div className="flex items-center gap-4">
                            {/* Balance Pill */}
                            <div className="glass-panel px-4 py-2 flex items-center gap-2 text-sm text-gray-300 hidden md:flex">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                                {balance?.formatted.substring(0, 5)} {balance?.symbol}
                            </div>

                            {/* Network Selector */}
                            <NetworkSelector />

                            {/* Profile Dropdown Trigger */}
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="glass-panel px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/5 hover:border-red-500/50 transition-all text-white group"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center font-bold text-xs">
                                    {address.substring(2, 4).toUpperCase()}
                                </div>
                                <span className="group-hover:text-red-400 transition-colors">{formatAddress(address)}</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnectClick}
                            className="neon-button px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(220,20,60,0.4)]"
                        >
                            {isLoading ? 'Connecting...' : 'Connect Wallet'}
                        </button>
                    )}
                </div>
            </nav>

            {/* Connect Wallet Modal */}
            {showConnectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-panel p-8 max-w-sm w-full mx-4 border-red-500/20 shadow-[0_0_50px_rgba(220,20,60,0.1)] relative">
                        <button
                            onClick={() => setShowConnectModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold text-white mb-2 text-center">Connect Wallet</h3>
                        <p className="text-gray-400 mb-6 text-center text-sm">Select your wallet provider to continue.</p>

                        <div className="space-y-3">
                            {/* Core Wallet Option */}
                            <button
                                onClick={() => {
                                    // Try to find the specific Core/Injected connector first
                                    const core = connectors.find(c => c.name === 'Core') || connectors.find(c => c.id === 'injected' && c.name !== 'MetaMask');
                                    if (core) executeConnect(core);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-orange-500/50 transition-all group"
                            >
                                <span className="font-bold text-white group-hover:text-orange-400 transition-colors">
                                    Core
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                    <span className="text-lg">☀️</span>
                                </div>
                            </button>

                            {/* MetaMask Option */}
                            <button
                                onClick={() => {
                                    // Try to find the specific MetaMask connector
                                    const metamask = connectors.find(c => c.name === 'MetaMask');
                                    if (metamask) executeConnect(metamask);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-yellow-500/50 transition-all group"
                            >
                                <span className="font-bold text-white group-hover:text-yellow-400 transition-colors">
                                    MetaMask
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                    <span className="text-lg">🦊</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="glass-panel p-8 max-w-sm w-full mx-4 text-center border-red-500/20 shadow-[0_0_50px_rgba(220,20,60,0.2)]">
                        <h3 className="text-xl font-bold text-white mb-2">Disconnect Wallet?</h3>
                        <p className="text-gray-400 mb-8">You will be logged out of your session.</p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
