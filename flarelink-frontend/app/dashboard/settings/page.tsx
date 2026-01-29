'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

interface SettingItemProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

function SettingItem({ title, description, children }: SettingItemProps) {
    return (
        <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0">
            <div className="flex-1 mr-4">
                <div className="font-medium text-white mb-1">{title}</div>
                <div className="text-sm text-gray-500">{description}</div>
            </div>
            {children}
        </div>
    );
}

interface ToggleProps {
    enabled: boolean;
    onChange: () => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onChange}
            className={`relative w-14 h-8 rounded-full p-1 transition-colors ${enabled
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : 'bg-gray-700'
                }`}
        >
            <motion.div
                initial={false}
                animate={{ x: enabled ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
            />
        </motion.button>
    );
}

export default function SettingsPage() {
    const { address } = useAccount();
    const [notifications, setNotifications] = useState(true);
    const [fastMode, setFastMode] = useState(false);
    const [autoApprove, setAutoApprove] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [currency, setCurrency] = useState('USD');
    const [language, setLanguage] = useState('en');
    const [slippage, setSlippage] = useState('0.5');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500/20 to-gray-900/20 flex items-center justify-center">
                        <span className="text-2xl">⚙️</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Settings</h1>
                        <p className="text-gray-400">Manage your bridge preferences and account settings.</p>
                    </div>
                </div>
            </motion.div>

            {/* Account Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel-elevated p-8"
            >
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span>👤</span> Account
                </h3>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                        {address?.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-white mb-1">Connected Wallet</div>
                        <div className="text-sm text-gray-500 font-mono">{address}</div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Copy
                    </motion.button>
                </div>

                <SettingItem
                    title="Display Currency"
                    description="Select your preferred fiat currency for value display"
                >
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 transition-colors cursor-pointer"
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                    </select>
                </SettingItem>

                <SettingItem
                    title="Language"
                    description="Choose your interface language"
                >
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 transition-colors cursor-pointer"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                    </select>
                </SettingItem>

                <SettingItem
                    title="Dark Mode"
                    description="Use dark theme throughout the app"
                >
                    <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </SettingItem>
            </motion.div>

            {/* Bridge Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel-elevated p-8"
            >
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span>🌉</span> Bridge Preferences
                </h3>

                <SettingItem
                    title="Slippage Tolerance"
                    description="Maximum price movement you'll accept"
                >
                    <div className="flex items-center gap-2">
                        {['0.1', '0.5', '1.0'].map((value) => (
                            <button
                                key={value}
                                onClick={() => setSlippage(value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${slippage === value
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-white/5 text-gray-400 border border-transparent hover:border-white/10'
                                    }`}
                            >
                                {value}%
                            </button>
                        ))}
                    </div>
                </SettingItem>

                <SettingItem
                    title="Fast-Track Mode"
                    description="Pay higher gas for prioritized relaying"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-yellow-500 px-2 py-0.5 bg-yellow-500/10 rounded">Soon</span>
                        <Toggle enabled={fastMode} onChange={() => setFastMode(!fastMode)} />
                    </div>
                </SettingItem>

                <SettingItem
                    title="Auto-Approve Tokens"
                    description="Automatically approve tokens for bridging"
                >
                    <Toggle enabled={autoApprove} onChange={() => setAutoApprove(!autoApprove)} />
                </SettingItem>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel-elevated p-8"
            >
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span>🔔</span> Notifications
                </h3>

                <SettingItem
                    title="Email Notifications"
                    description="Receive alerts when bridge transfers complete"
                >
                    <Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />
                </SettingItem>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel p-8 border border-red-500/20"
            >
                <h3 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-2">
                    <span>⚠️</span> Danger Zone
                </h3>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-white mb-1">Clear Local Data</div>
                        <div className="text-sm text-gray-500">Remove all cached data and reset preferences</div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/20 transition-colors"
                    >
                        Clear Data
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
