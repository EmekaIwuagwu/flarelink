'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const timeline = [
    { year: '2026 Q1', title: 'Protocol Genesis', description: 'Core team formation and architecture design' },
    { year: '2026 Q2', title: 'Testnet Launch', description: 'Deployment on Avalanche Fuji, Sepolia, and Flare Coston2' },
    { year: '2026 Q3', title: 'Security Audits', description: 'Comprehensive audits by leading security firms' },
    { year: '2026 Q4', title: 'Mainnet Launch', description: 'Production deployment across all major networks' },
];

const stats = [
    { value: '2026', label: 'Founded' },
    { value: '4', label: 'Chains Supported' },
    { value: '4', label: 'Audits Passed' },
    { value: '0', label: 'Security Incidents' },
];

const values = [
    { icon: '🔒', title: 'Security First', description: 'Every line of code prioritizes user fund safety above all else.' },
    { icon: '🌐', title: 'True Decentralization', description: 'No single point of failure. Trust math, not intermediaries.' },
    { icon: '⚡', title: 'User Experience', description: 'Complex technology, simple interface. Bridge in seconds.' },
    { icon: '🤝', title: 'Open Source', description: 'Transparent, auditable code. Community-driven development.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent" />
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] -z-10" />

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            About FlareLink
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                            Building the<br />
                            <span className="text-gradient-red">Invisible Bridge</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            FlareLink was born from a simple belief: moving value across blockchains
                            should be as easy as sending an email. No wrapping complications,
                            no security fears, just pure interoperability.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="glass-panel-elevated p-8 text-center hover-lift"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-red-500 uppercase tracking-widest font-semibold">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-panel-elevated p-12"
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                To unify the fragmented blockchain liquidity landscape by providing
                                a secure, trust-minimized, and user-friendly bridging infrastructure
                                that empowers the next billion users.
                            </p>
                            <p className="text-gray-500 leading-relaxed">
                                We believe in a multi-chain future where users shouldn't need to
                                understand the underlying complexity. FlareLink abstracts away
                                the technical details while maintaining the highest security standards.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="relative h-[400px] rounded-3xl overflow-hidden glass-panel flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-transparent" />
                            <div className="absolute w-64 h-64 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
                            <motion.span
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="text-[150px] z-10"
                            >
                                🌐
                            </motion.span>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6 bg-gradient-to-b from-transparent to-black/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
                        <p className="text-gray-400">The principles that guide everything we build.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="glass-panel p-8 text-center hover-glow"
                            >
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-500">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
                        <p className="text-gray-400">From idea to production-ready protocol.</p>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-red-500/50 to-transparent" />

                        <div className="space-y-8">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 + i * 0.15 }}
                                    className="relative pl-20"
                                >
                                    <div className="absolute left-6 w-5 h-5 rounded-full bg-red-500 border-4 border-black" />
                                    <div className="glass-panel p-6">
                                        <div className="text-red-500 font-semibold text-sm mb-2">{item.year}</div>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-gray-400 text-sm">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="max-w-4xl mx-auto text-center glass-panel-elevated p-12 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent" />
                    <div className="relative">
                        <h2 className="text-3xl font-bold text-white mb-4">Join the Revolution</h2>
                        <p className="text-gray-400 mb-8">Be part of the future of blockchain interoperability.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg shadow-red-500/20"
                                >
                                    Launch App
                                </motion.button>
                            </Link>
                            <a href="https://github.com/EmekaIwuagwu/flarelink" target="_blank" rel="noopener noreferrer">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                                >
                                    View on GitHub
                                </motion.button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
