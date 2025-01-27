export interface Meal {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    preparationTime: string;
    difficulty: string;
    calories: number;
    imagePrompt?: string;
}

export interface Menu {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    date: string;
} 