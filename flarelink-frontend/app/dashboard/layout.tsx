'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-900/5 via-transparent to-transparent" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-900/3 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-900/3 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="lg:ml-72 p-6 lg:p-10 pt-28 min-h-screen"
            >
                {children}
            </motion.div>
        </div>
    );
}
