'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePublicClient, useAccount } from 'wagmi';
import Link from 'next/link';
import { ethers } from 'ethers';

interface BridgeStatus {
    step: 'locked' | 'executing' | 'completed' | 'failed';
    sourceTxHash: string;
    destTxHash?: string;
    amount: string;
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    sourceChain: string;
    destChain: string;
    errorMessage?: string;
    timestamp: number;
}

export default function TransactionStatusPage() {
    const params = useParams();
    const router = useRouter();
    const { address } = useAccount();
    const txHash = params.txHash as string;

    const [status, setStatus] = useState<BridgeStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (txHash) {
            pollStatus();
            const interval = setInterval(pollStatus, 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [txHash]);

    useEffect(() => {
        const timer = setInterval(() => setElapsed(e => e + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const pollStatus = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_RELAYER_API_URL || 'http://localhost:8080/api/v1';
            const res = await fetch(`${baseUrl}/bridge/status/${txHash}`);

            if (res.status === 200) {
                const data = await res.json();
                if (data.data) {
                    setStatus(data.data);
                    setLoading(false);
                }
            } else if (res.status === 404) {
                // Not found yet is normal while relayer polls
                console.log('Transaction not found yet, will retry...');
            }
        } catch (err) {
            console.error('Failed to fetch status', err);
        }
    };

    const getExplorerLink = (chain: string, hash: string) => {
        if (chain.toLowerCase().includes('avalanche')) {
            return `https://testnet.snowtrace.io/tx/${hash}`;
        } else if (chain.toLowerCase().includes('flare')) {
            return `https://coston2-explorer.flare.network/tx/${hash}`;
        }
        return `https://testnet.snowtrace.io/tx/${hash}`;
    };

    const addTokenToMetaMask = async () => {
        if (typeof window.ethereum === 'undefined' || !status) return;

        try {
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: status.tokenAddress,
                        symbol: `w${status.tokenSymbol}`,
                        decimals: 18,
                    },
                },
            });
        } catch (error) {
            console.error('Failed to add token:', error);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto mt-20">
                <div className="glass-panel p-12 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Fetching Transaction Status...</h2>
                    <p className="text-gray-400">Searching for transaction {txHash?.substring(0, 10)}...</p>
                </div>
            </div>
        );
    }

    if (!status) {
        return (
            <div className="max-w-2xl mx-auto mt-20">
                <div className="glass-panel p-12 text-center">
                    <div className="text-6xl mb-6">❌</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Transaction Not Found</h2>
                    <p className="text-gray-400 mb-8">We couldn't find a bridge transaction with hash:</p>
                    <code className="text-xs bg-black/50 px-4 py-2 rounded text-gray-300">{txHash}</code>
                    <div className="mt-8">
                        <Link href="/dashboard/transfer" className="neon-button px-8 py-3 rounded-xl inline-block">
                            Start New Bridge
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isCompleted = status.step === 'completed';
    const isFailed = status.step === 'failed';
    const isProcessing = status.step === 'locked' || status.step === 'executing';

    return (
        <div className="max-w-3xl mx-auto mt-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Bridge Transaction Status</h1>
                <p className="text-gray-400">Track your cross-chain transfer in real-time</p>
            </div>

            {/* Main Status Card */}
            <div className="glass-panel p-8 mb-6">
                {/* Status Icon */}
                <div className="text-center mb-8">
                    {isCompleted && <div className="text-7xl mb-4">✅</div>}
                    {isFailed && <div className="text-7xl mb-4">❌</div>}
                    {isProcessing && (
                        <div className="flex justify-center mb-4">
                            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-blue-500"></div>
                        </div>
                    )}

                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isCompleted && 'Bridge Completed!'}
                        {isFailed && 'Bridge Failed'}
                        {status.step === 'locked' && 'Tokens Locked'}
                        {status.step === 'executing' && 'Executing Transfer...'}
                    </h2>
                    <p className="text-gray-400">
                        {isCompleted && `Your ${ethers.formatUnits(status.amount || '0', 18)} ${status.tokenSymbol} has been successfully bridged`}
                        {isFailed && status.errorMessage}
                        {status.step === 'locked' && 'Waiting for relayer to process...'}
                        {status.step === 'executing' && 'Minting wrapped tokens on destination chain...'}
                    </p>
                    {isProcessing && (
                        <p className="text-sm text-blue-400 mt-2">⏱️ Elapsed: {elapsed}s | Est. 30-60s total</p>
                    )}
                </div>

                {/* Progress Steps */}
                <div className="relative mb-8">
                    <div className="flex justify-between items-center">
                        {/* Step 1: Source */}
                        <div className="flex-1 text-center relative">
                            <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${status.step !== 'failed' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                                }`}>
                                ✓
                            </div>
                            <p className="text-xs font-bold text-white">Source Locked</p>
                            <p className="text-xs text-gray-500">{status.sourceChain}</p>
                        </div>

                        {/* Connector Line */}
                        <div className={`flex-1 h-1 ${status.step === 'executing' || status.step === 'completed' ? 'bg-blue-500' : 'bg-gray-700'
                            }`}></div>

                        {/* Step 2: Relayer */}
                        <div className="flex-1 text-center relative">
                            <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${status.step === 'executing' || status.step === 'completed'
                                ? 'bg-blue-500/20 text-blue-500 animate-pulse'
                                : 'bg-gray-700/20 text-gray-500'
                                }`}>
                                {status.step === 'executing' || status.step === 'completed' ? '⚙️' : '○'}
                            </div>
                            <p className="text-xs font-bold text-white">Relayer</p>
                            <p className="text-xs text-gray-500">Processing</p>
                        </div>

                        {/* Connector Line */}
                        <div className={`flex-1 h-1 ${status.step === 'completed' ? 'bg-green-500' : 'bg-gray-700'
                            }`}></div>

                        {/* Step 3: Destination */}
                        <div className="flex-1 text-center relative">
                            <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${status.step === 'completed'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-gray-700/20 text-gray-500'
                                }`}>
                                {status.step === 'completed' ? '✓' : '○'}
                            </div>
                            <p className="text-xs font-bold text-white">Destination Minted</p>
                            <p className="text-xs text-gray-500">{status.destChain}</p>
                        </div>
                    </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Amount</span>
                        <span className="text-white font-bold">{status.amount} {status.tokenSymbol}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Route</span>
                        <span className="text-white">{status.sourceChain} → {status.destChain}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-400">Source TX</span>
                        <a
                            href={getExplorerLink(status.sourceChain, status.sourceTxHash)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                            {status.sourceTxHash.substring(0, 10)}...{status.sourceTxHash.substring(status.sourceTxHash.length - 8)} ↗
                        </a>
                    </div>
                    {status.destTxHash && (
                        <div className="flex justify-between items-start">
                            <span className="text-gray-400">Destination TX</span>
                            <a
                                href={getExplorerLink(status.destChain, status.destTxHash)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
                            >
                                {status.destTxHash.substring(0, 10)}...{status.destTxHash.substring(status.destTxHash.length - 8)} ↗
                            </a>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {isCompleted && (
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={addTokenToMetaMask}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            🦊 Add to MetaMask
                        </button>
                        <Link
                            href="/dashboard/history"
                            className="flex-1 border border-white/20 hover:bg-white/5 text-white font-bold py-3 px-6 rounded-xl transition-all text-center"
                        >
                            View History
                        </Link>
                    </div>
                )}

                {isProcessing && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">This page will auto-update when the transfer completes</p>
                    </div>
                )}
            </div>

            {/* Help Section */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-400">
                    <p>• Typical bridge times: 30-90 seconds</p>
                    <p>• If stuck on "Locked" for &gt;5 minutes, check relayer status</p>
                    <p>• Contact support: support@flarelink.io</p>
                </div>
            </div>
        </div>
    );
}
