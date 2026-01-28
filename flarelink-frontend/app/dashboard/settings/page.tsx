'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
    const [allowNotifications, setAllowNotifications] = useState(true);
    const [fastMode, setFastMode] = useState(false);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your bridge preferences.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Settings */}
                <div className="glass-panel p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Profile Settings</h3>

                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white">Display Currency</div>
                            <div className="text-sm text-gray-500">Select your preferred fiat currency</div>
                        </div>
                        <select className="bg-black border border-white/20 rounded-lg px-4 py-2 text-white">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white">Language</div>
                            <div className="text-sm text-gray-500">Choose your interface language</div>
                        </div>
                        <select className="bg-black border border-white/20 rounded-lg px-4 py-2 text-white">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </div>
                </div>

                {/* Bridge Preferences */}
                <div className="glass-panel p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Bridge Preferences</h3>

                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white">Fast-Track Mode</div>
                            <div className="text-sm text-gray-500">Pay higher gas for prioritized relaying (Coming Soon)</div>
                        </div>
                        <button
                            onClick={() => setFastMode(!fastMode)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${fastMode ? 'bg-red-600' : 'bg-gray-700'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${fastMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <div>
                            <div className="font-bold text-white">Email Notifications</div>
                            <div className="text-sm text-gray-500">Receive alerts when bridges complete</div>
                        </div>
                        <button
                            onClick={() => setAllowNotifications(!allowNotifications)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${allowNotifications ? 'bg-red-600' : 'bg-gray-700'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${allowNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
