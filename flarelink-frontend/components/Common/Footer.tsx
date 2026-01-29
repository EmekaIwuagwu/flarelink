'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = {
    product: [
        { label: 'Bridge', href: '/dashboard' },
        { label: 'Explorer', href: '/features' },
        { label: 'API Docs', href: '/faq' },
        { label: 'Status', href: '/about' },
    ],
    protocol: [
        { label: 'Governance', href: '/about' },
        { label: 'Security Audits', href: '/security' },
        { label: 'Bug Bounty', href: '/about' },
        { label: 'Whitepaper', href: '/faq' },
    ],
    community: [
        { label: 'Discord', href: '#' },
        { label: 'Twitter', href: '#' },
        { label: 'GitHub', href: 'https://github.com/EmekaIwuagwu/flarelink' },
        { label: 'Blog', href: '#' },
    ],
};

const socialLinks = [
    { icon: '𝕏', href: '#', label: 'Twitter' },
    { icon: '💬', href: '#', label: 'Discord' },
    { icon: '📧', href: '#', label: 'Telegram' },
];

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-gradient-to-b from-transparent to-black/50">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/5 to-transparent pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group inline-flex">
                            <motion.div
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center"
                            >
                                <span className="text-white font-bold text-lg">F</span>
                            </motion.div>
                            <span className="text-2xl font-bold tracking-tight">
                                <span className="text-white">FLARE</span>
                                <span className="text-red-500">LINK</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            The sovereign interoperability layer for the decentralized future.
                            Bridging assets with cryptographic proofs, not trust.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500/30 hover:bg-white/10 transition-all"
                                    title={social.label}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Product</h4>
                        <ul className="space-y-4">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 text-sm hover:text-red-400 transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-red-500 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Protocol Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Protocol</h4>
                        <ul className="space-y-4">
                            {footerLinks.protocol.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 text-sm hover:text-red-400 transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-red-500 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Community</h4>
                        <ul className="space-y-4">
                            {footerLinks.community.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-500 text-sm hover:text-red-400 transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-red-500 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="glass-panel p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h5 className="text-white font-semibold text-lg mb-1">Stay Updated</h5>
                        <p className="text-gray-500 text-sm">Get the latest updates on protocol improvements and new features.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm shadow-lg shadow-red-500/20"
                        >
                            Subscribe
                        </motion.button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-sm">
                        © 2026 FlareLink Protocol. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-gray-600 text-sm hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-gray-600 text-sm hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            All systems operational
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
