'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meal, Menu } from './types';
import { IngredientModal } from './components/IngredientModal';

export default function Home() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<{ meal: Meal; title: string } | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/menu/today`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error('Menü yüklenirken bir hata oluştu');
        }

        const data = await response.json();
        setMenu(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Günün menüsü yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Günün Menüsü
          </h1>
          <p className="text-lg text-gray-600">
            Yapay zeka tarafından özenle hazırlanmış günlük menü önerileri
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {menu && Object.entries(menu).map(([mealTime, meal]) => {
            return (
              <motion.div
                key={mealTime}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedMeal({ meal, title: mealTime })}
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                    {mealTime}
                  </h2>
                  <p className="text-gray-600 mb-4">{meal.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-600">
                      {meal.calories} kalori
                    </span>
                    <button
                      className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMeal({ meal, title: mealTime });
                      }}
                    >
                      Detaylar →
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-12 text-sm text-gray-500"
        >
          <p>Her gün 00:00&apos;da yeni menü oluşturulur</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedMeal && (
          <IngredientModal
            meal={selectedMeal.meal}
            mealTitle={selectedMeal.title}
            isOpen={!!selectedMeal}
            onClose={() => setSelectedMeal(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
