'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface BridgeRecord {
    id: string;
    sourceChain: string;
    destChain: string;
    amount: string;
    status: string;
    txHash: string;
    destTxHash?: string;
    tokenSymbol?: string;
    timestamp: number;
}

const chainColors: Record<string, string> = {
    avalanche: '#E84142',
    ethereum: '#627EEA',
    flare: '#FF4D4D',
    polygon: '#8247E5',
};

const getChainColor = (chain: string) => {
    const lowerChain = chain.toLowerCase();
    for (const [key, color] of Object.entries(chainColors)) {
        if (lowerChain.includes(key)) return color;
    }
    return '#888888';
};

const getExplorerLink = (chainName: string, hash: string) => {
    if (!hash) return null;
    const chain = chainName.toLowerCase();
    if (chain.includes('avalanche')) {
        return `https://testnet.snowtrace.io/tx/${hash}`;
    } else if (chain.includes('flare')) {
        return `https://coston2-explorer.flare.network/tx/${hash}`;
    } else if (chain.includes('polygon')) {
        return `https://amoy.polygonscan.com/tx/${hash}`;
    } else if (chain.includes('ethereum')) {
        return `https://sepolia.etherscan.io/tx/${hash}`;
    }
    return null;
};

const getStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
        case 'completed':
        case 'minted':
            return { color: '#22C55E', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'Completed' };
        case 'failed':
            return { color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Failed' };
        case 'locked':
        case 'executing':
            return { color: '#3B82F6', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'Processing' };
        default:
            return { color: '#F59E0B', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'Pending' };
    }
};

export default function BridgeHistory() {
    const { address } = useAccount();
    const [history, setHistory] = useState<BridgeRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (address) {
            fetchHistory();
            const interval = setInterval(fetchHistory, 15000);
            return () => clearInterval(interval);
        }
    }, [address]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_RELAYER_API_URL || 'http://localhost:8080/api/v1';
            const res = await fetch(`${baseUrl}/bridge/user/${address}`);
            const data = await res.json();
            if (data.data) {
                const results = data.data as BridgeRecord[];
                // Sort by timestamp descending (newest first)
                results.sort((a, b) => b.timestamp - a.timestamp);
                setHistory(results);
                setError(null);
            }
        } catch (err) {
            console.error("Failed to fetch history", err);
            setError("Unable to fetch history. Is the relayer running?");
        } finally {
            setLoading(false);
        }
    };

    if (!address) {
        return (
            <div className="text-center py-16">
                <div className="text-5xl mb-4">🔌</div>
                <p className="text-gray-400">Please connect your wallet to view history</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span>📜</span> Bridge Activity
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        Total: {history.length} Transactions
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchHistory}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        <motion.span
                            animate={loading ? { rotate: 360 } : {}}
                            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
                        >
                            ↻
                        </motion.span>
                        Refresh
                    </motion.button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* Empty State */}
            {history.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800/50 flex items-center justify-center">
                        <span className="text-4xl">📭</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Start bridging to see your transaction history here.
                    </p>
                    <Link href="/dashboard/transfer">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm"
                        >
                            Bridge Tokens →
                        </motion.button>
                    </Link>
                </motion.div>
            ) : (
                /* Transaction Table */
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {history.map((tx, i) => {
                                    const statusConfig = getStatusConfig(tx.status);
                                    const sourceLink = getExplorerLink(tx.sourceChain, tx.txHash);
                                    const destLink = getExplorerLink(tx.destChain, tx.destTxHash || '');
                                    const date = new Date(tx.timestamp * 1000).toLocaleString();

                                    return (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                        >
                                            {/* Time */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white text-sm">{date.split(',')[0]}</span>
                                                    <span className="text-gray-500 text-xs">{date.split(',')[1]}</span>
                                                </div>
                                            </td>

                                            {/* Route */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getChainColor(tx.sourceChain) }} />
                                                            <span className="text-white text-sm">{tx.sourceChain}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getChainColor(tx.destChain) }} />
                                                            <span className="text-gray-400 text-xs">{tx.destChain}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-4 py-4">
                                                <span className="text-white font-semibold">
                                                    {parseFloat(ethers.formatUnits(tx.amount || '0', 18)).toFixed(2)}
                                                </span>
                                                <span className="text-red-500 text-xs font-bold ml-1">{tx.tokenSymbol || 'FLT'}</span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusConfig.bg} ${statusConfig.border} border`} style={{ color: statusConfig.color }}>
                                                    {statusConfig.label}
                                                </span>
                                            </td>

                                            {/* Links */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-2">
                                                    {sourceLink && (
                                                        <a href={sourceLink} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                                            Source TX ↗
                                                        </a>
                                                    )}
                                                    {destLink && (
                                                        <a href={destLink} target="_blank" rel="noreferrer" className="text-[10px] text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
                                                            Dest TX ↗
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
