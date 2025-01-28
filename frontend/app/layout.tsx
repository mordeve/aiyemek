import { Inter } from 'next/font/google';
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
        <html lang="tr">
            <head>
                <title>{metadata.title as string}</title>
                <meta name="description" content={metadata.description as string} />
            </head>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
} 