import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { metadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <head>
                <title>{metadata.title as string}</title>
                <meta name="description" content={metadata.description as string} />
            </head>
            <body className={inter.className} suppressHydrationWarning>
                {children}
                <Analytics />
            </body>
        </html>
    );
} 