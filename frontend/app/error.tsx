'use client';

import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
    const error = useRouteError();

    useEffect(() => {
        console.error('Route error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
            <div className="text-center p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
                <p className="text-gray-700 mb-4">
                    {error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'}
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Ana Sayfaya Dön
                </button>
            </div>
        </div>
    );
} 