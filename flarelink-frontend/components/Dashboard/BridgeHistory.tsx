'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from '@/styles/bridge.module.css';
import { ethers } from 'ethers';

interface BridgeRecord {
    id: string;
    sourceChain: string;
    destChain: string;
    amount: string;
    status: string; // initiated, locked, minted, completed
    txHash: string;
    timestamp: number;
}

export default function BridgeHistory() {
    const { address } = useAccount();
    const [history, setHistory] = useState<BridgeRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (address) {
            fetchHistory();
            const interval = setInterval(fetchHistory, 15000); // Poll every 15s
            return () => clearInterval(interval);
        }
    }, [address]);

    const getExplorerLink = (tx: BridgeRecord) => {
        if (tx.sourceChain.toLowerCase().includes('avalanche')) {
            return `https://testnet.snowtrace.io/tx/${tx.txHash}`;
        } else if (tx.sourceChain.toLowerCase().includes('flare')) {
            return `https://coston2-explorer.flare.network/tx/${tx.txHash}`;
        }
        return `https://testnet.snowtrace.io/tx/${tx.txHash}`;
    };

    const fetchHistory = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_RELAYER_API_URL || 'http://localhost:8080/api/v1';
            const res = await fetch(`${baseUrl}/bridge/user/${address}`);
            const data = await res.json();
            if (data.data) {
                setHistory(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    const getStatusColor = (status: string) => {
        if (!status) return '#FFA500'; // Default to orange if status is missing
        switch (status.toLowerCase()) {
            case 'completed':
            case 'minted':
                return '#50C878'; // Green
            case 'failed':
                return '#FF4D4D'; // Red
            case 'locked':
            case 'executing':
                return '#00BFFF'; // DeepSkyBlue
            default:
                return '#FFA500'; // Orange
        }
    };

    if (!address) return <div className="text-center text-gray-400">Please connect wallet to view history</div>;

    return (
        <div className={styles.formCard} style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="flex justify-between items-center mb-6">
                <h2 style={{ color: '#DC143C', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Bridge Activity</h2>
                <button onClick={fetchHistory} className="text-xs text-gray-400 hover:text-white transition-colors">Refresh ↻</button>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-2">No bridging activity found for this address.</p>
                    <p className="text-xs text-gray-600">Try sending some tokens from the Transfer tab!</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#E8E8E8' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#888', fontSize: '13px' }}>
                                <th style={{ padding: '12px' }}>ID</th>
                                <th style={{ padding: '12px' }}>Route</th>
                                <th style={{ padding: '12px' }}>Amount</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Network Scan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((tx) => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #1a1a1a', transition: 'background 0.2s' }} className="hover:bg-white/[0.02]">
                                    <td style={{ padding: '12px', fontSize: '13px', fontFamily: 'monospace' }}>#{tx.id.substring(0, 8)}...</td>
                                    <td style={{ padding: '12px' }}>
                                        <div className="flex flex-col">
                                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{tx.sourceChain} → {tx.destChain}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span className="font-bold">{ethers.formatUnits(tx.amount || '0', 18)}</span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            color: getStatusColor(tx.status),
                                            border: `1px solid ${getStatusColor(tx.status)}`,
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            background: `${getStatusColor(tx.status)}10`
                                        }}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <a
                                            href={getExplorerLink(tx)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-2 w-fit"
                                        >
                                            View Source ↗
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
