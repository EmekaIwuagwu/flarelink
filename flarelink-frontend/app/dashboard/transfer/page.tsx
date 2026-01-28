'use client';

import BridgeForm from '@/components/Bridge/BridgeForm';

export default function TransferPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Transfer Funds</h1>
                <p className="text-gray-400">Move assets securely across chains.</p>
            </div>

            <BridgeForm />
        </div>
    );
}
