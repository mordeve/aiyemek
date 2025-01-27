import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    preparationTime: { type: String, required: true },
    difficulty: { type: String, required: true },
    calories: { type: Number, required: true },
    imagePrompt: { type: String }
});

const menuSchema = new mongoose.Schema({
    breakfast: { type: mealSchema, required: true },
    lunch: { type: mealSchema, required: true },
    dinner: { type: mealSchema, required: true },
    date: { type: String, required: true, unique: true }
});

export const Menu = mongoose.model('Menu', menuSchema); 