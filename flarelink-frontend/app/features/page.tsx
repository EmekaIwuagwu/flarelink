'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
    {
        title: "Cross-Chain Liquidity",
        description: "Access unified liquidity across Avalanche, Ethereum, Flare, and Polygon. No fragmentation, always the best rates.",
        icon: "💧",
        color: "from-blue-500/20 to-blue-900/20",
        borderColor: "border-blue-500/20",
    },
    {
        title: "One-Click Bridging",
        description: "Approve and bridge in a seamless flow. We handle wrapping, unwrapping, and gas optimization automatically.",
        icon: "⚡",
        color: "from-yellow-500/20 to-yellow-900/20",
        borderColor: "border-yellow-500/20",
    },
    {
        title: "Cryptographic Security",
        description: "Secured by Merkle proofs and Flare's State Connector. No trust assumptions, just math.",
        icon: "🔒",
        color: "from-green-500/20 to-green-900/20",
        borderColor: "border-green-500/20",
    },
    {
        title: "Sub-Minute Finality",
        description: "Experience lightning-fast bridging with our optimized relay network. Most transfers complete in under 60 seconds.",
        icon: "🚀",
        color: "from-purple-500/20 to-purple-900/20",
        borderColor: "border-purple-500/20",
    },
    {
        title: "Developer SDK",
        description: "Integrate cross-chain functionality into your dApp with just a few lines of code using our comprehensive SDK.",
        icon: "💻",
        color: "from-pink-500/20 to-pink-900/20",
        borderColor: "border-pink-500/20",
    },
    {
        title: "Gas Optimization",
        description: "Smart gas estimation ensures you never overpay. Dynamic pricing adapts to network conditions in real-time.",
        icon: "⛽",
        color: "from-orange-500/20 to-orange-900/20",
        borderColor: "border-orange-500/20",
    },
];

const stats = [
    { label: "Networks Supported", value: "4", suffix: "" },
    { label: "Average Bridge Time", value: "2.5", suffix: "min" },
    { label: "Bridge Fee", value: "0.05", suffix: "%" },
    { label: "Uptime", value: "99.9", suffix: "%" },
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Platform Features
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Built for <span className="text-gradient-red">Power Users</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Enterprise-grade cross-chain infrastructure, simplified for everyone.
                            Experience the future of blockchain interoperability.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="glass-panel p-6 text-center hover-lift"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                    {stat.value}<span className="text-red-500">{stat.suffix}</span>
                                </div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className={`glass-panel-elevated p-8 hover-glow border ${feature.borderColor} transition-all cursor-default`}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="glass-panel-elevated p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to bridge?
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                                Join thousands of users moving assets seamlessly across chains.
                            </p>
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
                                >
                                    Launch App →
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
