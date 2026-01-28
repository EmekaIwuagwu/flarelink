'use client';

import React from 'react';

const features = [
    {
        title: "Universal Liquidity",
        description: "Access liquidity across any supported EVM chain without fragmentation. Our unified liquidity pools ensure you always get the best price.",
        icon: "💧"
    },
    {
        title: "One-Click Bridging",
        description: "Forget complex steps. Approve and Swap in a single transaction flow. We handle the wrapping, unwrapping, and gas payments.",
        icon: "👆"
    },
    {
        title: "Developer SDK",
        description: "Integrate cross-chain functionality into your dApp with just 5 lines of code using the FlareLink SDK.",
        icon: "💻"
    },
    {
        title: "Yield Optimization",
        description: "Earn yield on your idle assets while they sit in our liquidity pools. Auto-compounding returns paid in native tokens.",
        icon: "📈"
    }
];

export default function FeaturesPage() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-white mb-6">Platform Features</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Built for power users, simplified for everyone.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                    <div key={idx} className="glass-panel p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-black rounded-full flex items-center justify-center text-3xl mb-6 border border-white/5">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
