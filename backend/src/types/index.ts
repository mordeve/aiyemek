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
    nutritionalInfo: {
        protein: string;
        carbs: string;
        fat: string;
        fiber: string;
    };
    servingSize: string;
    cuisine: string;
}

export interface MealOptions {
    option1: Meal;
    option2?: Meal;
}

export interface DailyMenu {
    breakfast: { option1: Meal };
    lunch: { option1: Meal; option2: Meal };
    dinner: { option1: Meal; option2: Meal };
    date?: string;
} 