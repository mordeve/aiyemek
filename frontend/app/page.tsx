'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';


interface Meal {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: string;
  difficulty: string;
  calories: number;
  imagePrompt?: string;
}

interface Menu {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  date: string;
}

interface IngredientModalProps {
  meal: Meal;
  mealTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const IngredientModal = ({ meal, mealTitle, isOpen, onClose }: IngredientModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">{mealTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        <h3 className="text-xl font-medium text-purple-600 mb-4">{meal.name}</h3>
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Tüm Malzemeler</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {meal.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<{ meal: Meal; title: string } | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/today`);
        if (!response.ok) {
          throw new Error('Menü yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setMenu(data);
      } catch (err) {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menu && ['breakfast', 'lunch', 'dinner'].map((mealType, index) => {
            const meal = menu[mealType as keyof typeof menu] as Meal;
            const mealTitles = {
              breakfast: 'Kahvaltı',
              lunch: 'Öğle Yemeği',
              dinner: 'Akşam Yemeği'
            };
            const mealTitle = mealTitles[mealType as keyof typeof mealTitles];

            return (
              <motion.div
                key={mealType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {mealTitle}
                  </h2>
                  <h3 className="text-xl font-medium text-purple-600 mb-3">
                    {meal.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{meal.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>🕒 {meal.preparationTime}</span>
                    <span>🔥 {meal.calories} kcal</span>
                    <span>📊 {meal.difficulty}</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Malzemeler</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {meal.ingredients.slice(0, 5).map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                      {meal.ingredients.length > 5 && (
                        <li
                          onClick={() => setSelectedMeal({ meal, title: mealTitle })}
                          className="text-purple-600 cursor-pointer hover:text-purple-700 transition-colors duration-200 mt-2"
                        >
                          + {meal.ingredients.length - 5} daha...
                        </li>
                      )}
                    </ul>
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
          <p>Her gün 00:00'da yeni menü oluşturulur</p>
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
