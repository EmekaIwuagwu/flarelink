import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

export const metadata: Metadata = {
    title: 'FlareLink Bridge',
    description: 'Enterprise-Grade Cross-Chain Bridge Infrastructure',
};

import { Providers } from './providers';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${jetbrainsMono.variable}`}>
                <Providers>
                    <Header />
                    <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1 }}>
                            {children}
                        </div>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
