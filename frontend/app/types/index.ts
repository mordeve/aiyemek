export interface NutritionalInfo {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
}

export interface Meal {
    name: string;
    description: string;
    ingredients: string[];
    preparationTime: string;
    difficulty: string;
    calories: number;
    imagePrompt?: string;
    nutritionalInfo: NutritionalInfo;
    servingSize: string;
    cuisine: string;
}

export interface BreakfastOptions {
    option1: Meal;
}

export interface MealOptions {
    option1: Meal;
    option2: Meal;
}

export interface Menu {
    breakfast: BreakfastOptions;
    lunch: MealOptions;
    dinner: MealOptions;
    date: string;
} 