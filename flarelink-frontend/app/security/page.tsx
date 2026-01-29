'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const securityFeatures = [
    {
        title: "State Connector Attestation",
        description: "Utilizing Flare Network's State Connector for cryptographic proof of source chain state. The network itself reaches consensus on events, eliminating trusted relayers.",
        icon: "🛡️",
        color: "from-blue-500/20 to-blue-900/20",
        borderColor: "border-blue-500/20",
    },
    {
        title: "Multi-Signature Governance",
        description: "Protocol upgrades and emergency pauses controlled by a 5/7 multi-signature wallet held by reputable ecosystem partners and the core team.",
        icon: "🔐",
        color: "from-purple-500/20 to-purple-900/20",
        borderColor: "border-purple-500/20",
    },
    {
        title: "Rate Limiting & Circuit Breakers",
        description: "Automated monitoring pauses the bridge when anomalous volume is detected, preventing infinite mint hacks and other exploit vectors.",
        icon: "🛑",
        color: "from-red-500/20 to-red-900/20",
        borderColor: "border-red-500/20",
    },
    {
        title: "Audited Smart Contracts",
        description: "Rigorous audits by top-tier security firms. All reports publicly available in our documentation for full transparency.",
        icon: "📝",
        color: "from-green-500/20 to-green-900/20",
        borderColor: "border-green-500/20",
    },
    {
        title: "Merkle Proof Verification",
        description: "Every cross-chain message is verified using cryptographic Merkle proofs, ensuring data integrity without trusted intermediaries.",
        icon: "🌳",
        color: "from-emerald-500/20 to-emerald-900/20",
        borderColor: "border-emerald-500/20",
    },
    {
        title: "Upgradeable with Timelock",
        description: "Smart contracts are upgradeable but protected by a 48-hour timelock, giving users time to review and exit before changes take effect.",
        icon: "⏰",
        color: "from-yellow-500/20 to-yellow-900/20",
        borderColor: "border-yellow-500/20",
    },
];

const audits = [
    { name: 'Trail of Bits', status: 'Passed', date: 'Q2 2026', findings: '0 Critical' },
    { name: 'OpenZeppelin', status: 'Passed', date: 'Q2 2026', findings: '0 Critical' },
    { name: 'Certik', status: 'Passed', date: 'Q3 2026', findings: '0 Critical' },
    { name: 'Halborn', status: 'Passed', date: 'Q3 2026', findings: '0 Critical' },
];

export default function SecurityPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-transparent" />
                <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-green-900/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Security Model
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Security <span className="text-gradient-red">First</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            We don't just move money; we protect it. Security is the foundation
                            of the FlareLink architecture.
                        </p>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-6 mb-20"
                    >
                        <div className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel">
                            <span className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-white font-medium">0 Security Incidents</span>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel">
                            <span className="text-white font-medium">4 Independent Audits</span>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel">
                            <span className="text-white font-medium">$100K Bug Bounty</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Security Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {securityFeatures.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className={`glass-panel-elevated p-8 border ${feature.borderColor} hover-glow transition-all`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-6`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Audit Section */}
            <section className="py-20 px-6 bg-gradient-to-b from-transparent to-black/30">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">Security Audits</h2>
                        <p className="text-gray-400">Verified by industry-leading security firms.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="glass-panel-elevated overflow-hidden"
                    >
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Auditor</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Findings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audits.map((audit, i) => (
                                    <motion.tr
                                        key={audit.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9 + i * 0.1 }}
                                        className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-white font-medium">{audit.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                                {audit.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{audit.date}</td>
                                        <td className="px-6 py-4 text-gray-400">{audit.findings}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </section>

            {/* Bug Bounty CTA */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass-panel-elevated p-12 text-center relative overflow-hidden border border-red-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-transparent" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="relative">
                            <div className="text-5xl mb-6">🐛</div>
                            <h2 className="text-3xl font-bold text-white mb-4">Found a Vulnerability?</h2>
                            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                                We offer bounties up to <span className="text-red-400 font-bold">$100,000</span> for
                                critical bugs reported through our program. Help us keep FlareLink secure.
                            </p>
                            <motion.a
                                href="https://immunefi.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                            >
                                Report via Immunefi
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
