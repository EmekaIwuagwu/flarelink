'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const faqs = [
    {
        category: "General",
        questions: [
            {
                question: "What is FlareLink?",
                answer: "FlareLink is a next-generation interoperability protocol that uses Flare's State Connector to bridge assets across chains without relying on centralized relayers or trusted third parties. It enables seamless cross-chain transfers with cryptographic security."
            },
            {
                question: "Which chains are supported?",
                answer: "Currently, we support Avalanche (Fuji), Polygon (Amoy), Flare (Coston2), and Ethereum (Sepolia) testnets. Mainnet deployment across more EVM-compatible chains is planned for Q4 2026."
            },
            {
                question: "How is FlareLink different from other bridges?",
                answer: "Unlike traditional bridges that rely on trusted relayers or validators, FlareLink uses Flare's State Connector for cryptographic attestation. This means transactions are verified by mathematical proofs, not trust assumptions."
            },
        ]
    },
    {
        category: "Transfers",
        questions: [
            {
                question: "How long do transfers take?",
                answer: "Transfers typically complete within 2-5 minutes, depending on the source and destination chain block times. Most transfers are confirmed in under 3 minutes."
            },
            {
                question: "What are the fees?",
                answer: "We charge a flat 0.05% protocol fee on all volume, plus the destination chain gas fees. This is significantly lower than traditional bridges, which typically charge 0.3-1%."
            },
            {
                question: "Is there a minimum or maximum transfer amount?",
                answer: "There is no minimum transfer amount. Maximum amounts are determined by available liquidity on the destination chain, typically supporting transfers up to $1M equivalent."
            },
        ]
    },
    {
        category: "Security",
        questions: [
            {
                question: "Is it secure?",
                answer: "Yes. FlareLink uses cryptographic Merkle proofs combined with Flare's State Connector for attestation. All smart contracts have been audited by top-tier security firms. We maintain a $100K bug bounty program."
            },
            {
                question: "What happens if a transfer fails?",
                answer: "Failed transfers are automatically refunded to your source wallet. The protocol includes automatic retry mechanisms and circuit breakers to prevent fund loss."
            },
            {
                question: "Are the smart contracts upgradeable?",
                answer: "Yes, but all upgrades are protected by a 48-hour timelock and require multi-signature approval. This gives users time to review changes and exit if needed."
            },
        ]
    },
];

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel overflow-hidden"
        >
            <button
                onClick={onToggle}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
            >
                <span className="font-semibold text-white pr-4">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                >
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pb-6 pt-0 border-t border-white/5">
                            <p className="text-gray-400 leading-relaxed pt-4">{answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (key: string) => {
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6"
                        >
                            <span className="text-lg">💡</span>
                            Help Center
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Frequently Asked<br />
                            <span className="text-gradient-red">Questions</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Everything you need to know about the FlareLink protocol.
                            Can't find what you're looking for? Reach out to our team.
                        </p>
                    </motion.div>

                    {/* Search (decorative) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl mx-auto mb-16"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search questions..."
                                className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                            />
                            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    {faqs.map((category, catIndex) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + catIndex * 0.1 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                {category.category}
                            </h2>

                            <div className="space-y-3">
                                {category.questions.map((faq, qIndex) => {
                                    const key = `${catIndex}-${qIndex}`;
                                    return (
                                        <FAQItem
                                            key={key}
                                            question={faq.question}
                                            answer={faq.answer}
                                            isOpen={openItems[key] || false}
                                            onToggle={() => toggleItem(key)}
                                        />
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Still have questions CTA */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass-panel-elevated p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent" />
                        <div className="relative">
                            <div className="text-5xl mb-6">🤔</div>
                            <h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
                            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                                Our team is here to help. Join our Discord community or reach out directly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.a
                                    href="#"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/20"
                                >
                                    <span>💬</span> Join Discord
                                </motion.a>
                                <Link href="/about">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                                    >
                                        Contact Team
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
