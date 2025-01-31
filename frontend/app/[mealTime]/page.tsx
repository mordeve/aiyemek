'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Meal, MealOptions, BreakfastOptions } from '../types';

const mealTimeMap = {
    breakfast: {
        title: 'Kahvaltı',
        emoji: '☀️',
        gradient: 'from-amber-100 via-orange-50 to-yellow-100',
        bgElements: [
            '🥚', '🥐', '🥖', '🧀', '🫖', '🍯', '🥗', '🥑', '🫐', '🍅'
        ] as string[]
    },
    lunch: {
        title: 'Öğle Yemeği',
        emoji: '🌤️',
        gradient: 'from-sky-100 via-blue-50 to-cyan-100',
        bgElements: [
            '🥘', '🥗', '🥙', '🥪', '🍖', '🥩', '🍗', '🥣', '🥬', '🍚'
        ] as string[]
    },
    dinner: {
        title: 'Akşam Yemeği',
        emoji: '🌙',
        gradient: 'from-indigo-100 via-purple-50 to-violet-100',
        bgElements: [
            '🍽️', '🥘', '🥗', '🥙', '🍖', '🥩', '🍗', '🥣', '🥬', '🍲'
        ] as string[]
    }
} as const;

type MealTime = keyof typeof mealTimeMap;

export default function MealDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [mealOptions, setMealOptions] = useState<MealOptions | BreakfastOptions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mealTime = params.mealTime as MealTime;
    const mealInfo = mealTimeMap[mealTime];

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/menu/today/`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (!response.ok) {
                    throw new Error('Menü yüklenirken bir hata oluştu');
                }

                const data = await response.json();
                if (!data[mealTime] || !data[mealTime].option1 || (mealTime !== 'breakfast' && !data[mealTime].option2)) {
                    throw new Error('Geçersiz menü verisi');
                }
                setMealOptions(data[mealTime]);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err instanceof Error ? err.message : 'Bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        if (mealTime && Object.keys(mealTimeMap).includes(mealTime)) {
            fetchMeal();
        } else {
            setError('Geçersiz öğün zamanı');
            setLoading(false);
        }
    }, [mealTime]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Yemek detayları hazırlanıyor...</p>
                </div>
            </div>
        );
    }

    if (error || !mealOptions) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
                <div className="text-center p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
                    <p className="text-gray-700 mb-4">{error || 'Yemek bulunamadı'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    const renderMealCard = (meal: Meal, index: number) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            <div className="space-y-6">
                {/* Başlık ve Temel Bilgiler */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{meal.name}</h3>
                    <p className="text-gray-600">{meal.description}</p>
                </div>

                {/* Hazırlama Bilgileri */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                        <span className="text-lg">⏳</span>
                        <span className="text-gray-700">{meal.preparationTime}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                        <span className="text-lg">🔥</span>
                        <span className="text-gray-700">{meal.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                        <span className="text-lg">{meal.difficulty === 'Kolay' ? '🟢' : meal.difficulty === 'Orta' ? '🟡' : '🔴'}</span>
                        <span className="text-gray-700">{meal.difficulty}</span>
                    </div>
                </div>

                {/* Malzemeler */}
                <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>🧂</span> Malzemeler
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {meal.ingredients.map((ingredient, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-700">
                                <span className="text-orange-500">•</span>
                                {ingredient}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Besin Değerleri */}
                <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>📊</span> Besin Değerleri
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white/50 p-4 rounded-xl text-center">
                            <div className="text-lg mb-1">🥩</div>
                            <div className="text-sm text-gray-500">Protein</div>
                            <div className="font-medium text-gray-900">{meal.nutritionalInfo.protein}</div>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl text-center">
                            <div className="text-lg mb-1">🌾</div>
                            <div className="text-sm text-gray-500">Karbonhidrat</div>
                            <div className="font-medium text-gray-900">{meal.nutritionalInfo.carbs}</div>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl text-center">
                            <div className="text-lg mb-1">🥑</div>
                            <div className="text-sm text-gray-500">Yağ</div>
                            <div className="font-medium text-gray-900">{meal.nutritionalInfo.fat}</div>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl text-center">
                            <div className="text-lg mb-1">🥬</div>
                            <div className="text-sm text-gray-500">Lif</div>
                            <div className="font-medium text-gray-900">{meal.nutritionalInfo.fiber}</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // Floating background elements animation
    const renderBackgroundElements = (elements: string[]) => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {elements.map((element, index) => (
                <motion.div
                    key={index}
                    className="absolute text-4xl opacity-10"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        rotate: Math.random() * 360
                    }}
                    animate={{
                        x: [
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerWidth
                        ],
                        y: [
                            Math.random() * window.innerHeight,
                            Math.random() * window.innerHeight,
                            Math.random() * window.innerHeight
                        ],
                        rotate: [
                            Math.random() * 360,
                            Math.random() * 360,
                            Math.random() * 360
                        ]
                    }}
                    transition={{
                        duration: 20 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {element}
                </motion.div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
            {/* Animated background patterns */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIHN0cm9rZT0iI2ZkYmE3NCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                {mealInfo && renderBackgroundElements(mealInfo.bgElements)}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent animate-slide"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-slide-reverse"></div>
            </div>

            {/* Content container with glass effect */}
            <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Ana Sayfaya Dön
                        </button>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-gradient-to-r ${mealInfo.gradient} p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-white/50`}
                        >
                            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                                {mealInfo.emoji} {mealInfo.title}
                            </h1>
                        </motion.div>
                    </div>

                    <div className="space-y-8">
                        {renderMealCard(mealOptions.option1, 0)}
                        {mealTime !== 'breakfast' && 'option2' in mealOptions && renderMealCard(mealOptions.option2, 1)}
                    </div>
                </div>
            </div>
        </div>
    );
} 