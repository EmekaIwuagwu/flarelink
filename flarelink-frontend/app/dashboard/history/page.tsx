'use client';

import BridgeHistory from '@/components/Dashboard/BridgeHistory';

export default function HistoryPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
                <p className="text-gray-400">View your cross-chain activity log.</p>
            </div>

            <div className="glass-panel p-6">
                <BridgeHistory />
            </div>
        </div>
    );
}
