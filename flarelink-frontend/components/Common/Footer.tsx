'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900"></div>
                            <span className="text-2xl font-bold tracking-tighter text-white">
                                FLARE<span className="text-red-500">LINK</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The sovereign interoperability layer for the decentralized future.
                            Bridging assets with cryptographic proofs, not trust.
                        </p>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/dashboard" className="hover:text-red-500 transition-colors">Bridge</Link></li>
                            <li><Link href="/features" className="hover:text-red-500 transition-colors">Explorer</Link></li>
                            <li><Link href="/features" className="hover:text-red-500 transition-colors">Developers</Link></li>
                            <li><Link href="/about" className="hover:text-red-500 transition-colors">Status</Link></li>
                        </ul>
                    </div>

                    {/* Protocol Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Protocol</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/about" className="hover:text-red-500 transition-colors">Governance</Link></li>
                            <li><Link href="/security" className="hover:text-red-500 transition-colors">Audits</Link></li>
                            <li><Link href="/about" className="hover:text-red-500 transition-colors">Bug Bounty</Link></li>
                            <li><Link href="/faq" className="hover:text-red-500 transition-colors">Documentation</Link></li>
                        </ul>
                    </div>

                    {/* Community Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Community</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Discord</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Twitter</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-red-500 transition-colors">Forum</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-sm">
                        © 2026 FlareLink Protocol. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-600">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
