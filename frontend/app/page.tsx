'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Meal, Menu, MealOptions } from './types';

export default function Home() {
  const router = useRouter();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
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
        console.log('Fetched menu data:', data);

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid menu data structure');
        }

        ['breakfast', 'lunch', 'dinner'].forEach(mealTime => {
          if (!data[mealTime] || !data[mealTime].option1 || (mealTime !== 'breakfast' && !data[mealTime].option2)) {
            throw new Error(`Invalid meal options for ${mealTime}`);
          }
        });

        setMenu(data as Menu);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchMenu();
    }
  }, [mounted]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Günün menüsü hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-700">{error || 'Menü yüklenemedi'}</p>
        </div>
      </div>
    );
  }

  const mealTimes = [
    {
      key: 'breakfast',
      title: 'Kahvaltı',
      emoji: '☀️',
      bgGradient: 'from-amber-100 via-orange-50 to-yellow-100',
      hoverGradient: 'hover:from-amber-200 hover:via-orange-100 hover:to-yellow-200',
      pattern: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)]',
      bgElements: ['🥚', '🥐', '🥖', '🧀', '🫖', '🍯', '🥗', '🥑', '🫐', '🍅']
    },
    {
      key: 'lunch',
      title: 'Öğle Yemeği',
      emoji: '🌤️',
      bgGradient: 'from-sky-100 via-blue-50 to-cyan-100',
      hoverGradient: 'hover:from-sky-200 hover:via-blue-100 hover:to-cyan-200',
      pattern: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)]',
      bgElements: ['🥘', '🥗', '🥙', '🥪', '🍖', '🥩', '🍗', '🥣', '🥬', '🍚']
    },
    {
      key: 'dinner',
      title: 'Akşam Yemeği',
      emoji: '🌙',
      bgGradient: 'from-indigo-100 via-purple-50 to-violet-100',
      hoverGradient: 'hover:from-indigo-200 hover:via-purple-100 hover:to-violet-200',
      pattern: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)]',
      bgElements: ['🍽️', '🥘', '🥗', '🥙', '🍖', '🥩', '🍗', '🥣', '🥬', '🍲']
    }
  ] as const;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIHN0cm9rZT0iI2ZkYmE3NCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        {/* Floating food emojis */}
        {mealTimes.map(({ bgElements }, index) => (
          <div key={index} className="absolute inset-0">
            {bgElements.map((emoji, emojiIndex) => (
              <motion.div
                key={emojiIndex}
                className="absolute text-2xl opacity-10"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  rotate: Math.random() * 360,
                  scale: 0.8 + Math.random() * 0.4
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
                {emoji}
              </motion.div>
            ))}
          </div>
        ))}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent animate-slide"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-slide-reverse"></div>
      </div>

      {/* Content container with glass effect */}
      <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-20 -left-20 w-40 h-40 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-20 left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
          ></motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-center text-gray-900 mb-4 drop-shadow-sm"
          >
            Günün Menüsü
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-gray-600 mb-12"
          >
            Yapay zeka tarafından özenle hazırlanmış günlük yemek önerileri
          </motion.p>
          <div className="space-y-8">
            {mealTimes.map(({ key, title, emoji, bgGradient, hoverGradient, pattern }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/${key}`)}
                className={`cursor-pointer rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r ${bgGradient} ${hoverGradient} ${pattern} transition-all duration-300 border border-white/50 backdrop-blur-sm`}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                      {emoji} {title}
                    </h2>
                    <div className="bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      {key === 'breakfast' ? '1 Yemek' : '2 Yemek'}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:bg-white/70 transition-colors duration-200">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">1. Yemek</h3>
                      <p className="text-gray-800 text-lg font-medium">{menu[key].option1.name}</p>
                      <p className="text-gray-600 mt-2">{menu[key].option1.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="text-base">🔥</span> {menu[key].option1.calories} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-base">⏱️</span> {menu[key].option1.preparationTime}
                        </span>
                      </div>
                    </div>
                    {key !== 'breakfast' && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:bg-white/70 transition-colors duration-200">
                        <h3 className="font-semibold text-gray-900 mb-2 text-lg">2. Yemek</h3>
                        <p className="text-gray-800 text-lg font-medium">{menu[key].option2.name}</p>
                        <p className="text-gray-600 mt-2">{menu[key].option2.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="text-base">🔥</span> {menu[key].option2.calories} kcal
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-base">⏱️</span> {menu[key].option2.preparationTime}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <span className="text-gray-600 flex items-center gap-2 text-sm font-medium group-hover:text-gray-800">
                      Detaylar için tıklayın
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
