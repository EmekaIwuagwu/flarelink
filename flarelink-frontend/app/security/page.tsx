'use client';

import React from 'react';

const securityFeatures = [
    {
        title: "State Connector Attestation",
        description: "We utilize Flare Network's State Connector to cryptographically prove the state of the source chain. This eliminates the need for trusted relayers to 'report' events, as the network itself consensus on the event.",
        icon: "🛡️"
    },
    {
        title: "Multi-Sig Governance",
        description: "The protocol upgrades and emergency pauses are controlled by a 5/7 multi-signature wallet held by reputable ecosystem partners and the core team.",
        icon: "🔐"
    },
    {
        title: "Rate Limiting",
        description: "Automated circuit breakers pause the bridge if an anomalous amount of volume is detected within a short timeframe, preventing infinite mint hacks.",
        icon: "🛑"
    },
    {
        title: "Audited Smart Contracts",
        description: "Our contracts have undergone rigorous audits by top-tier firms. Reports are publicly available in our documentation.",
        icon: "📝"
    }
];

export default function SecurityPage() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-white mb-6">Security First</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    We don't just move money; we protect it. Security is the foundation of the FlareLink architecture.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {securityFeatures.map((feature, idx) => (
                    <div key={idx} className="glass-panel p-8 hover:border-red-500/50 transition-colors">
                        <div className="text-4xl mb-6">{feature.icon}</div>
                        <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Found a Vulnerability?</h3>
                <p className="text-gray-300 mb-6">
                    We offer bounties up to $100,000 for critical bugs reported through our program.
                </p>
                <button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition-colors">
                    Report via Immunefi
                </button>
            </div>
        </div>
    );
}
