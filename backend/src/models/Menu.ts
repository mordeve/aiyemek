import mongoose, { Schema, Document } from 'mongoose';

const nutritionalInfoSchema = new mongoose.Schema({
    protein: { type: String, required: true },
    carbs: { type: String, required: true },
    fat: { type: String, required: true },
    fiber: { type: String, required: true }
});

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    preparationTime: { type: String, required: true },
    difficulty: { type: String, required: true },
    calories: { type: Number, required: true },
    imagePrompt: { type: String },
    nutritionalInfo: { type: nutritionalInfoSchema, required: true },
    servingSize: { type: String, required: true },
    cuisine: { type: String, required: true }
});

const breakfastOptionsSchema = new mongoose.Schema({
    option1: { type: mealSchema, required: true }
});

const mealOptionsSchema = new mongoose.Schema({
    option1: { type: mealSchema, required: true },
    option2: { type: mealSchema, required: true }
});

const menuSchema = new mongoose.Schema({
    breakfast: { type: breakfastOptionsSchema, required: true },
    lunch: { type: mealOptionsSchema, required: true },
    dinner: { type: mealOptionsSchema, required: true },
    date: { type: String, required: true }
});

interface INutritionalInfo {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
}

interface IMeal {
    name: string;
    description: string;
    ingredients: string[];
    preparationTime: string;
    difficulty: string;
    calories: number;
    imagePrompt?: string;
    nutritionalInfo: INutritionalInfo;
    servingSize: string;
    cuisine: string;
}

interface IBreakfastOptions {
    option1: IMeal;
}

interface IMealOptions {
    option1: IMeal;
    option2: IMeal;
}

interface IMenu extends Document {
    breakfast: IBreakfastOptions;
    lunch: IMealOptions;
    dinner: IMealOptions;
    date: string;
}

const Menu = mongoose.model<IMenu>('Menu', menuSchema);

export default Menu; 