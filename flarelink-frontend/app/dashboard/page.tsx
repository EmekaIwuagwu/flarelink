'use client';

import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import Link from 'next/link';

export default function DashboardOverview() {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-gray-300 mb-4">Please Connect Your Wallet</h2>
                <p className="text-gray-500 mb-8 max-w-md">Access your FlareLink Portfolio by connecting your wallet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome Banner */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back, <span className="text-gradient-red">{address?.substring(0, 6)}...</span>
                </h1>
                <p className="text-gray-400">Here is your portfolio performance.</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Total Balance Card */}
                <div className="glass-panel p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-600/20 transition-all"></div>
                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Total Balance</div>
                    <div className="text-5xl font-bold text-white mb-4">
                        {balance ? `${parseFloat(balance.formatted).toFixed(4)}` : '0.00'}
                        <span className="text-2xl text-gray-500 ml-2">{balance?.symbol}</span>
                    </div>
                    <div className="flex items-center text-green-400 text-sm">
                        <span className="mr-2">▲ 2.4%</span>
                        <span>vs last week</span>
                    </div>
                </div>

                {/* Action Card */}
                <div className="md:col-span-2 glass-panel p-8 flex flex-col justify-center items-start bg-gradient-to-r from-gray-900 via-transparent to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="flex gap-4">
                        <Link href="/dashboard/transfer" className="neon-button px-8 py-3 rounded-xl flex items-center gap-2">
                            <span>💸</span> Transfer Funds
                        </Link>
                        <Link href="/dashboard/receive" className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white flex items-center gap-2">
                            <span>⬇️</span> Receive (QR)
                        </Link>
                        <Link href="/dashboard/analytics" className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white flex items-center gap-2">
                            <span>📊</span> Analytics
                        </Link>
                    </div>
                </div>
            </div>

            {/* Assets & History Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Asset List */}
                <div className="lg:col-span-2 glass-panel p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Your Assets</h3>
                        <button className="text-sm text-red-500 hover:text-red-400">View All</button>
                    </div>

                    <div className="space-y-4">
                        {/* Asset Row 1 */}
                        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">₿</div>
                                <div>
                                    <div className="font-bold text-white">Bitcoin (WBTC)</div>
                                    <div className="text-xs text-gray-500">Avalanche Chain</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-white">0.00</div>
                                <div className="text-xs text-gray-500">$0.00</div>
                            </div>
                        </div>

                        {/* Asset Row 2 */}
                        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">Ξ</div>
                                <div>
                                    <div className="font-bold text-white">Ethereum</div>
                                    <div className="text-xs text-gray-500">Ethereum Mainnet</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-white">{balance ? parseFloat(balance.formatted).toFixed(4) : '0.00'}</div>
                                <div className="text-xs text-gray-500">≈ ${balance ? (parseFloat(balance.formatted) * 2200).toFixed(2) : '0.00'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Network Status */}
                <div className="glass-panel p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Network Health</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Ethereum</span>
                            <span className="text-green-500 text-xs font-bold px-2 py-1 bg-green-500/10 rounded">OPERATIONAL</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Avalanche</span>
                            <span className="text-green-500 text-xs font-bold px-2 py-1 bg-green-500/10 rounded">OPERATIONAL</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Flare</span>
                            <span className="text-green-500 text-xs font-bold px-2 py-1 bg-green-500/10 rounded">OPERATIONAL</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Polygon</span>
                            <span className="text-green-500 text-xs font-bold px-2 py-1 bg-green-500/10 rounded">OPERATIONAL</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
