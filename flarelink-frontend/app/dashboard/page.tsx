'use client';

import React from 'react';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import Link from 'next/link';
import { motion } from 'framer-motion';

const networks = [
    { name: 'Avalanche Fuji', symbol: 'AVAX', color: '#E84142', status: 'operational' },
    { name: 'Ethereum Sepolia', symbol: 'ETH', color: '#627EEA', status: 'operational' },
    { name: 'Flare Coston2', symbol: 'C2FLR', color: '#FF4D4D', status: 'operational' },
    { name: 'Polygon Amoy', symbol: 'MATIC', color: '#8247E5', status: 'operational' },
];

const quickStats = [
    { label: 'Total Bridged', value: '$1.2B+', change: '+12.5%', positive: true },
    { label: 'Transactions', value: '2.5M+', change: '+8.3%', positive: true },
    { label: 'Avg. Time', value: '~2.5 min', change: '-15%', positive: true },
];

export default function DashboardOverview() {
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { data: balance } = useBalance({ address, chainId: chain?.id });

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel-elevated p-12 max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
                    <p className="text-gray-400 mb-8">
                        Access your FlareLink dashboard by connecting your Web3 wallet.
                    </p>
                    <div className="flex justify-center">
                        <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm">
                            Use the button in the header →
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden glass-panel-elevated p-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-green-500/10 text-green-500 rounded-full">
                            Connected
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-white/5 text-gray-400 rounded-full">
                            {chain?.name || 'Unknown Network'}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="text-gradient-red">{address?.slice(0, 8)}...</span>
                    </h1>
                    <p className="text-gray-400">Your cross-chain portfolio at a glance.</p>
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickStats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 hover-lift"
                    >
                        <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">{stat.label}</div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                            <span className={`text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel-elevated p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-red-500/10 to-transparent rounded-full -mr-20 -mt-20" />
                    <div className="relative">
                        <div className="text-sm text-gray-500 uppercase tracking-wider mb-4">Current Balance</div>
                        <div className="text-5xl font-bold text-white mb-2">
                            {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'}
                        </div>
                        <div className="text-xl text-gray-500 mb-6">{balance?.symbol || 'ETH'}</div>
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">USD Value</span>
                            <span className="text-white font-medium">
                                ≈ ${balance ? (parseFloat(balance.formatted) * 2200).toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 glass-panel p-8"
                >
                    <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link href="/dashboard/transfer">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-6 rounded-xl bg-gradient-to-br from-red-600/20 to-red-900/10 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer group"
                            >
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🌉</div>
                                <div className="font-semibold text-white mb-1">Bridge Assets</div>
                                <div className="text-xs text-gray-500">Transfer cross-chain</div>
                            </motion.div>
                        </Link>

                        <Link href="/dashboard/history">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                            >
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📜</div>
                                <div className="font-semibold text-white mb-1">View History</div>
                                <div className="text-xs text-gray-500">Past transactions</div>
                            </motion.div>
                        </Link>

                        <Link href="/dashboard/settings">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                            >
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
                                <div className="font-semibold text-white mb-1">Settings</div>
                                <div className="text-xs text-gray-500">Preferences</div>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Network Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel p-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Network Status</h3>
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-green-500/10 text-green-500 rounded-full flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        All Systems Operational
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {networks.map((network, i) => (
                        <motion.div
                            key={network.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: network.color + '20' }}
                                >
                                    {network.symbol.slice(0, 2)}
                                </div>
                                <div>
                                    <div className="font-medium text-white text-sm">{network.name}</div>
                                    <div className="text-xs text-gray-500">{network.symbol}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs text-green-500 font-medium uppercase">Operational</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
