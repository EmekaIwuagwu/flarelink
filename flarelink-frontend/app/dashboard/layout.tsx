'use client';

import Sidebar from '@/components/Dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-24 min-h-screen">
                {children}
            </div>
        </div>
    );
}
