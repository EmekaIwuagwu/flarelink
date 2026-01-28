'use client';

import React from 'react';

export default function ReceivePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Receive Assets</h1>
                <p className="text-gray-400">View your deposit address and pending incomings.</p>
            </div>

            <div className="glass-panel p-8 text-center py-20 border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">👇</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Action Needed</h3>
                <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                    FlareLink uses a relayer network to automatically mint assets to your wallet.
                    Simply wait for the transaction to finalize on the source chain, and your assets will appear here.
                </p>
            </div>
        </div>
    );
}
