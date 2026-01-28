'use client';

import React, { useState } from 'react';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "What is FlareLink?",
            answer: "FlareLink is a next-generation interoperability protocol that uses Flare's State Connector to bridge assets across chains without relying on centralized relayers or trusted third parties."
        },
        {
            question: "Which chains are supported?",
            answer: "Currently, we support Avalanche (C-Chain), Polygon (PoS), Flare Network, and Ethereum. More EVM-compatible chains are coming in Q3 2026."
        },
        {
            question: "How long do transfers take?",
            answer: "Transfers typically reach finality within 1-3 minutes, depending on the source and destination chain block times. Our 'Fast-Track' mode offers sub-minute speeds."
        },
        {
            question: "Is it secure?",
            answer: "Yes. FlareLink uses a 7/11 multi-sig relayer network combined with cryptographic attestation from the Flare State Connector. This ensures that no single entity can forge a bridging transaction."
        },
        {
            question: "What are the fees?",
            answer: "We charge a flat 0.1% protocol fee on all volume, plus the destination chain gas fees. This is significantly lower than traditional bridges."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-white mb-6">Frequently Asked Questions</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Everything you need to know about the FlareLink protocol.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="glass-panel border border-white/10 overflow-hidden text-left"
                    >
                        <button
                            className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <span className="font-bold text-lg text-white">{faq.question}</span>
                            <span className={`text-2xl text-red-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                                ↓
                            </span>
                        </button>

                        {openIndex === index && (
                            <div className="p-6 pt-0 text-gray-400 border-t border-white/5">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
