'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
    { name: 'Overview', icon: '📊', path: '/dashboard' },
    { name: 'Transfer Funds', icon: '💸', path: '/dashboard/transfer' },
    { name: 'Transactions', icon: '📝', path: '/dashboard/history' },
    { name: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen fixed left-0 top-0 pt-24 border-r border-white/5 bg-black/40 backdrop-blur-md hidden md:flex flex-col">
            <div className="flex flex-col gap-2 px-4">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            href={item.path}
                            key={item.path}
                            className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-red-900/40 to-transparent text-white border-l-2 border-red-500'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto p-6">
                <div className="glass-panel p-4 bg-gradient-to-br from-gray-900 to-black">
                    <h5 className="text-sm text-gray-400 mb-1">Status</h5>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-green-500 font-bold">SYSTEM OPERATIONAL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
