'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DisconnectPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-12 max-w-lg w-full text-center border-red-500/20 shadow-[0_0_50px_rgba(220,20,60,0.1)]"
            >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                    <span className="text-4xl">👋</span>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Disconnect Successful</h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    You have been securely logged out of your session. We hope to see you bridge again soon.
                </p>

                <div className="w-full bg-black/50 rounded-full h-1.5 mb-8 overflow-hidden">
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 15, ease: "linear" }}
                        className="h-full bg-red-600 rounded-full shadow-[0_0_10px_#dc2626]"
                    />
                </div>

                <p className="text-sm text-gray-500 mb-8">
                    Redirecting to home in <span className="text-white font-bold">{countdown}</span> seconds...
                </p>

                <Link href="/" className="block w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white font-medium">
                    Return Home Now
                </Link>
            </motion.div>
        </div>
    );
}
