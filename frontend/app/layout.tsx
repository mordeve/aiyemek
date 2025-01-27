export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Günün Yemeği - AI Destekli Günlük Menü Önerileri',
    description: 'Yapay zeka tarafından özenle hazırlanmış günlük Türk mutfağı menü önerileri.',
    keywords: 'yemek tarifleri, günlük menü, türk mutfağı, yapay zeka, ai menü, yemek önerileri',
    authors: [{ name: 'Günün Yemeği' }],
    openGraph: {
        title: 'Günün Yemeği - AI Powered Daily Menu',
        description: 'Yapay zeka tarafından özenle hazırlanmış günlük menü önerileri',
        url: 'https://gununyemegi.com',
        siteName: 'Günün Yemeği',
        locale: 'tr_TR',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
} 