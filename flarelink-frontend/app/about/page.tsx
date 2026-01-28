'use client';

import React from 'react';

export default function AboutPage() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="text-center mb-24">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                    Building the <span className="text-gradient-red">Invisible Bridge</span>.
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    FlareLink was born from a simple belief: moving value across blockchains should be as easy as sending an email. No wrapping complications, no security fears, just pure interoperability.
                </p>
            </div>

            {/* Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                <div className="glass-panel p-12 h-full flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        To unify the fragmented blockchain liquidity landscape by providing a secure, trust-minimized, and user-friendly bridging infrastructure that empowers the next billion users.
                    </p>
                </div>
                <div className="relative h-[400px] w-full bg-gradient-to-tr from-red-900/20 to-black rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
                    <div className="absolute w-64 h-64 bg-red-600/30 rounded-full blur-3xl animate-pulse"></div>
                    <span className="text-9xl">🌐</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">2026</div>
                    <div className="text-sm text-red-500 uppercase tracking-widest font-bold">Founded</div>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">15+</div>
                    <div className="text-sm text-red-500 uppercase tracking-widest font-bold">Team Members</div>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">4</div>
                    <div className="text-sm text-red-500 uppercase tracking-widest font-bold">Audits Passed</div>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">0</div>
                    <div className="text-sm text-red-500 uppercase tracking-widest font-bold">Security Incidents</div>
                </div>
            </div>
        </div>
    );
}
