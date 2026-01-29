'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BridgeHistory from '@/components/Dashboard/BridgeHistory';

export default function HistoryPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/20 flex items-center justify-center">
                        <span className="text-2xl">📜</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Transaction History</h1>
                        <p className="text-gray-400">Track all your cross-chain bridge activities.</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4"
            >
                <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Total Transfers</div>
                </div>
                <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-green-500">0</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Completed</div>
                </div>
                <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-500">0</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Pending</div>
                </div>
                <div className="glass-panel p-4 text-center">
                    <div className="text-2xl font-bold text-red-500">0</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Failed</div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-4"
            >
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-400 text-sm">Filter:</span>
                    <select className="bg-transparent text-white text-sm focus:outline-none cursor-pointer">
                        <option value="all">All Transactions</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-400 text-sm">Chain:</span>
                    <select className="bg-transparent text-white text-sm focus:outline-none cursor-pointer">
                        <option value="all">All Chains</option>
                        <option value="avalanche">Avalanche</option>
                        <option value="ethereum">Ethereum</option>
                        <option value="flare">Flare</option>
                        <option value="polygon">Polygon</option>
                    </select>
                </div>
                <div className="flex-1" />
                <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    🔄 Refresh
                </button>
            </motion.div>

            {/* History Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel-elevated overflow-hidden"
            >
                <BridgeHistory />
            </motion.div>

            {/* Empty State Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-8"
            >
                <p className="text-gray-500 text-sm">
                    Don't have any transactions yet?{' '}
                    <a href="/dashboard/transfer" className="text-red-500 hover:text-red-400 transition-colors">
                        Start bridging →
                    </a>
                </p>
            </motion.div>
        </div>
    );
}
