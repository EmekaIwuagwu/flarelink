'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const MENU_ITEMS = [
    { name: 'Overview', icon: '📊', path: '/dashboard', description: 'Dashboard home' },
    { name: 'Bridge', icon: '🌉', path: '/dashboard/transfer', description: 'Transfer assets' },
    { name: 'History', icon: '📜', path: '/dashboard/history', description: 'Past transactions' },
    { name: 'Settings', icon: '⚙️', path: '/dashboard/settings', description: 'Preferences' },
];

const QUICK_LINKS = [
    { name: 'Documentation', icon: '📚', href: '/faq' },
    { name: 'Security', icon: '🔒', href: '/security' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-72 h-screen fixed left-0 top-0 pt-24 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-xl border-r border-white/5 hidden lg:flex flex-col z-40"
        >
            {/* Main Navigation */}
            <div className="flex-1 px-4 py-6">
                <div className="mb-6">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Navigation
                    </p>
                    <div className="space-y-1">
                        {MENU_ITEMS.map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={item.path}
                                        className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                                ? 'text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {/* Active Background */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-red-900/20 to-transparent rounded-xl border-l-2 border-red-500"
                                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <span className={`relative text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {item.icon}
                                        </span>

                                        {/* Text */}
                                        <div className="relative">
                                            <span className="font-medium">{item.name}</span>
                                            <span className={`block text-xs transition-colors ${isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {item.description}
                                            </span>
                                        </div>

                                        {/* Hover Arrow */}
                                        {!isActive && (
                                            <svg
                                                className="absolute right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                {/* Quick Links */}
                <div>
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Resources
                    </p>
                    <div className="space-y-1">
                        {QUICK_LINKS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm"
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Card */}
            <div className="p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-4 bg-gradient-to-br from-gray-900/80 to-black/80"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-400">System Status</h5>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 rounded-full">
                            Live
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Relayer</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-green-500">Operational</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Contracts</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Latency</span>
                            <span className="text-gray-400">~2.5s</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Version Badge */}
            <div className="px-4 pb-6">
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-red-500/50" />
                    FlareLink v2.0.0
                </div>
            </div>
        </motion.div>
    );
}
