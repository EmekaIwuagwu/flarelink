'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
];

export default function AnalyticsPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-gray-400">Track cross-chain volume and performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Total Volume (24h)</h3>
                    <div className="text-3xl font-bold text-white">$1,245,678</div>
                    <div className="text-green-500 text-sm mt-2">↑ 12.5% vs yesterday</div>
                </div>
                <div className="glass-panel p-6">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Total Transactions</h3>
                    <div className="text-3xl font-bold text-white">8,432</div>
                    <div className="text-green-500 text-sm mt-2">↑ 5.2% vs yesterday</div>
                </div>
                <div className="glass-panel p-6">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Avg. Bridge Time</h3>
                    <div className="text-3xl font-bold text-white">45s</div>
                    <div className="text-green-500 text-sm mt-2">⚡ Super Fast</div>
                </div>
            </div>

            <div className="glass-panel p-8 h-[400px]">
                <h3 className="text-xl font-bold text-white mb-6">Volume Trend</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#DC143C" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#DC143C" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#555" />
                        <YAxis stroke="#555" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#DC143C" fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
