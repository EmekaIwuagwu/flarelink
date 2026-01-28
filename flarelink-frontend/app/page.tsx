'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="relative flex-1 flex flex-col justify-center items-center text-center px-4 overflow-hidden min-h-screen">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-bg.png"
                        alt="FlareLink Network Background"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    {/* Detailed Overlay for readability and premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 to-transparent" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="px-4 py-1 border border-red-500/30 rounded-full bg-red-900/20 backdrop-blur-sm text-red-400 text-sm font-medium tracking-wider uppercase">
                            V2.0 is Live on Mainnet
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-tight"
                    >
                        <span className="text-white drop-shadow-2xl">The Future of</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-300 to-white drop-shadow-2xl filter brightness-125">Interoperability.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-3xl text-gray-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Move assets instantly across Avalanche, Flare, Polygon, and Ethereum.
                        <br />
                        No bridges. Just <span className="text-white font-medium">Portals</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col md:flex-row justify-center gap-6 items-center"
                    >
                        <Link href="/dashboard" className="group relative px-10 py-5 bg-red-600 rounded-full text-xl font-bold overflow-hidden shadow-[0_0_40px_-10px_rgba(220,20,60,0.5)] hover:shadow-[0_0_60px_-10px_rgba(220,20,60,0.7)] transition-all">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <span className="relative text-white">Enter App</span>
                        </Link>
                        <button className="px-10 py-5 rounded-full border border-white/20 hover:bg-white/10 hover:border-white transition-all text-white text-lg backdrop-blur-md">
                            Protocol Docs
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-y border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">$1.2B+</div>
                        <div className="text-gray-500 uppercase tracking-widest text-sm">Total Value Locked</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">2.5M+</div>
                        <div className="text-gray-500 uppercase tracking-widest text-sm">Transactions</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">4</div>
                        <div className="text-gray-500 uppercase tracking-widest text-sm">Supported Networks</div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold mb-16 text-center">Why FlareLink?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-panel p-8 hover:transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 text-red-500 text-2xl">
                                🔒
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Bank-Grade Security</h3>
                            <p className="text-gray-400">
                                Secured by unforgeable Merkle proofs and Flare's State Connector protocol.
                            </p>
                        </div>

                        <div className="glass-panel p-8 hover:transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 text-red-500 text-2xl">
                                ⚡
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Instant Finality</h3>
                            <p className="text-gray-400">
                                Experience sub-minute bridging with our optimized relay network.
                            </p>
                        </div>

                        <div className="glass-panel p-8 hover:transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 text-red-500 text-2xl">
                                🌍
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Universal Access</h3>
                            <p className="text-gray-400">
                                Connect seamlessly between EVM chains with a single interface.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* How It Works Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center text-white">
                        Bridging in <span className="text-gradient-red">Three Simple Steps</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 border-t border-dashed border-white/20" />

                        {/* Step 1 */}
                        <div className="relative flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-4xl mb-8 z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-red-500/50 group-hover:shadow-[0_0_30px_rgba(220,20,60,0.3)] transition-all duration-500 text-white">
                                🔒
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">1. Lock Assets</h3>
                            <p className="text-gray-400 leading-relaxed px-4">
                                Deposit your tokens into the FlareLink smart contract on the source chain.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-4xl mb-8 z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-red-500/50 group-hover:shadow-[0_0_30px_rgba(220,20,60,0.3)] transition-all duration-500 text-white">
                                📡
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">2. Attest</h3>
                            <p className="text-gray-400 leading-relaxed px-4">
                                Flare's State Connector verifies the transaction, providing a decentralized proof.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-4xl mb-8 z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-red-500/50 group-hover:shadow-[0_0_30px_rgba(220,20,60,0.3)] transition-all duration-500 text-white">
                                💸
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">3. Mint & Receive</h3>
                            <p className="text-gray-400 leading-relaxed px-4">
                                Wrapped tokens are instantly minted to your wallet on the destination chain.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Supported Ecosystems */}
            <section className="py-24 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-bold text-red-500 tracking-widest uppercase mb-12">Trusted by the best ecosystems</p>
                    <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <div className="text-3xl font-bold text-white flex items-center gap-3 select-none"><span className="text-red-500 text-4xl">🔺</span> Avalanche</div>
                        <div className="text-3xl font-bold text-white flex items-center gap-3 select-none"><span className="text-pink-500 text-4xl">☀️</span> Flare</div>
                        <div className="text-3xl font-bold text-white flex items-center gap-3 select-none"><span className="text-purple-500 text-4xl">♾️</span> Polygon</div>
                        <div className="text-3xl font-bold text-white flex items-center gap-3 select-none"><span className="text-blue-500 text-4xl">Ξ</span> Ethereum</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="max-w-5xl mx-auto glass-panel p-16 text-center relative z-10 border-red-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent opacity-50 rounded-2xl" />
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10">
                        Ready to go <span className="text-gradient-red">cross-chain?</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto relative z-10">
                        Join thousands of users bridging millions in volume every day.
                        The future is interoperable.
                    </p>
                    <div className="relative z-10">
                        <Link href="/dashboard" className="neon-button px-12 py-5 rounded-full text-xl inline-block hover:shadow-[0_0_30px_rgba(220,20,60,0.6)]">
                            Launch Bridge App
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
