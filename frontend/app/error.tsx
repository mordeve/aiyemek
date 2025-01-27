'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
            <div className="text-center p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
                <p className="text-gray-700 mb-4">Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );
} 