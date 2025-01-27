'use client';

import { motion } from 'framer-motion';
import { Meal } from '../types';

interface IngredientModalProps {
    meal: Meal;
    mealTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export const IngredientModal = ({ meal, mealTitle, isOpen, onClose }: IngredientModalProps) => {
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
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
                        {meal.ingredients.map((ingredient: string, i: number) => (
                            <li key={i}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </motion.div>
    );
}; 