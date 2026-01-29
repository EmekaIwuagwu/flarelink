'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useDisconnect, useBalance, useConnect, useNetwork } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import NetworkSelector from './NetworkSelector';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect, connectors, isLoading } = useConnect();
    const { chain } = useNetwork();
    const { data: balance, refetch: refetchBalance } = useBalance({
        address,
        watch: true,
        chainId: chain?.id,
    });

    const [isMounted, setIsMounted] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (chain?.id) refetchBalance();
    }, [chain?.id, refetchBalance]);

    const handleLogout = () => {
        disconnect();
        setShowLogoutModal(false);
        router.push('/disconnect');
    };

    const executeConnect = (connector: any) => {
        connect({ connector });
        setShowConnectModal(false);
    };

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    if (!isMounted) return null;

    const navLinks = isConnected
        ? [
            { href: '/dashboard', label: 'Overview' },
            { href: '/dashboard/transfer', label: 'Bridge' },
            { href: '/dashboard/history', label: 'History' },
            { href: '/dashboard/settings', label: 'Settings' },
        ]
        : [
            { href: '/about', label: 'About' },
            { href: '/features', label: 'Features' },
            { href: '/security', label: 'Security' },
            { href: '/faq', label: 'FAQ' },
        ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-lg'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center shadow-lg shadow-red-500/20"
                        >
                            <span className="text-white font-bold text-lg">F</span>
                        </motion.div>
                        <span className="text-2xl font-bold tracking-tight">
                            <span className="text-white">FLARE</span>
                            <span className="text-red-500">LINK</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {isConnected && address ? (
                            <>
                                {/* Balance */}
                                <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                                    <span className="text-sm text-gray-300 font-medium">
                                        {parseFloat(balance?.formatted || '0').toFixed(4)} {balance?.symbol}
                                    </span>
                                </div>

                                {/* Network Selector */}
                                <NetworkSelector />

                                {/* Profile Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowLogoutModal(true)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:border-red-500/30 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-xs font-bold text-white">
                                        {address.slice(2, 4).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-white font-medium hidden sm:block">
                                        {formatAddress(address)}
                                    </span>
                                </motion.button>
                            </>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowConnectModal(true)}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Connecting...
                                    </span>
                                ) : (
                                    'Connect Wallet'
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Connect Modal */}
            <AnimatePresence>
                {showConnectModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowConnectModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel-elevated p-8 max-w-md w-full mx-4 relative"
                        >
                            <button
                                onClick={() => setShowConnectModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center">
                                    <span className="text-3xl">🔐</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Connect Wallet</h3>
                                <p className="text-gray-400 text-sm">Select your preferred wallet to continue</p>
                            </div>

                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => {
                                        const metamask = connectors.find(c => c.name === 'MetaMask');
                                        if (metamask) executeConnect(metamask);
                                    }}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-700/20 flex items-center justify-center">
                                            <span className="text-2xl">🦊</span>
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-white font-semibold group-hover:text-orange-400 transition-colors">MetaMask</span>
                                            <span className="text-xs text-gray-500">Popular browser wallet</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => {
                                        const core = connectors.find(c => c.name === 'Core') || connectors.find(c => c.id === 'injected');
                                        if (core) executeConnect(core);
                                    }}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center">
                                            <span className="text-2xl">💎</span>
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-white font-semibold group-hover:text-blue-400 transition-colors">Core / Injected</span>
                                            <span className="text-xs text-gray-500">Browser extension</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.button>
                            </div>

                            <p className="text-center text-xs text-gray-500 mt-6">
                                By connecting, you agree to our Terms of Service
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowLogoutModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel-elevated p-8 max-w-sm w-full mx-4 text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <span className="text-3xl">👋</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Disconnect Wallet?</h3>
                            <p className="text-gray-400 text-sm mb-8">Your session will be ended and you'll need to reconnect.</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
