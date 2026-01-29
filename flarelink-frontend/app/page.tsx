'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
    {
        icon: "🔒",
        title: "Bank-Grade Security",
        description: "Secured by unforgeable Merkle proofs and Flare's State Connector protocol.",
        color: "from-green-500/20 to-green-900/20",
    },
    {
        icon: "⚡",
        title: "Instant Finality",
        description: "Experience sub-minute bridging with our optimized relay network.",
        color: "from-yellow-500/20 to-yellow-900/20",
    },
    {
        icon: "🌍",
        title: "Universal Access",
        description: "Connect seamlessly between EVM chains with a single interface.",
        color: "from-blue-500/20 to-blue-900/20",
    },
];

const chains = [
    { name: 'Avalanche', icon: '🔺', color: '#E84142' },
    { name: 'Flare', icon: '☀️', color: '#FF4D4D' },
    { name: 'Polygon', icon: '♾️', color: '#8247E5' },
    { name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
];

const stats = [
    { value: '$1.2B+', label: 'Total Value Locked' },
    { value: '2.5M+', label: 'Transactions' },
    { value: '4', label: 'Supported Networks' },
    { value: '99.9%', label: 'Uptime' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            {/* Hero Section */}
            <section className="relative flex-1 flex flex-col justify-center items-center text-center px-6 min-h-screen overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-bg.png"
                        alt="FlareLink Network Background"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    {/* Layered Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
                    {/* Animated Glow */}
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-600/20 rounded-full blur-[150px]"
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto pt-20">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 border border-red-500/30 rounded-full bg-red-950/30 backdrop-blur-xl text-red-400 text-sm font-medium tracking-wider">
                            <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-red-500"
                            />
                            V2.0 is Live on Testnet
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]"
                    >
                        <span className="text-white drop-shadow-2xl">The Future of</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-orange-500">
                            Interoperability.
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Move assets instantly across Avalanche, Flare, Polygon, and Ethereum.
                        <br />
                        <span className="text-white font-normal">No bridges. Just Portals.</span>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 items-center"
                    >
                        <Link href="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(220, 20, 60, 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-xl font-bold overflow-hidden shadow-[0_0_40px_-10px_rgba(220,20,60,0.5)] transition-all"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <span className="relative text-white flex items-center gap-3">
                                    Enter App
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </motion.button>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-10 py-5 rounded-2xl border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all text-white text-lg backdrop-blur-md"
                        >
                            View Documentation
                        </motion.button>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
                        >
                            <div className="w-1.5 h-2.5 rounded-full bg-white/40" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-y border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-gray-500 uppercase tracking-widest text-xs md:text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] -z-10" />

                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why FlareLink?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Enterprise-grade infrastructure for the multi-chain future.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="glass-panel-elevated p-10 hover-glow"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 text-3xl`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-red-950/5 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Bridging in <span className="text-gradient-red">Three Simple Steps</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

                        {[
                            { step: '1', icon: '🔒', title: 'Lock Assets', desc: 'Deposit your tokens into the FlareLink smart contract on the source chain.' },
                            { step: '2', icon: '📡', title: 'Attest', desc: "Flare's State Connector verifies the transaction with decentralized proof." },
                            { step: '3', icon: '💸', title: 'Receive', desc: 'Wrapped tokens are instantly minted to your wallet on the destination chain.' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-28 h-28 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex items-center justify-center text-5xl mb-8 z-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:border-red-500/50 group-hover:shadow-[0_0_50px_rgba(220,20,60,0.2)] transition-all duration-500"
                                >
                                    {item.icon}
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-4">{item.step}. {item.title}</h3>
                                <p className="text-gray-400 leading-relaxed max-w-xs">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supported Chains */}
            <section className="py-24 border-y border-white/5 bg-black/30">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-sm font-bold text-red-500 tracking-widest uppercase mb-12"
                    >
                        Trusted by the best ecosystems
                    </motion.p>

                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                        {chains.map((chain, i) => (
                            <motion.div
                                key={chain.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                className="flex items-center gap-4 text-2xl md:text-3xl font-bold text-white opacity-60 hover:opacity-100 transition-all cursor-default"
                            >
                                <span style={{ color: chain.color }} className="text-4xl">{chain.icon}</span>
                                {chain.name}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="glass-panel-elevated p-16 text-center relative overflow-hidden border border-red-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-transparent to-transparent" />
                        <motion.div
                            animate={{ opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"
                        />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Ready to go <span className="text-gradient-red">cross-chain?</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                                Join thousands of users bridging millions in volume every day.
                                The future is interoperable.
                            </p>
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-12 py-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold shadow-[0_0_50px_rgba(220,20,60,0.3)] hover:shadow-[0_0_70px_rgba(220,20,60,0.5)] transition-all"
                                >
                                    Launch Bridge App
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
