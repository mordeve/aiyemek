import { GoogleGenerativeAI } from '@google/generative-ai';
import { Meal } from '../types';

export class AIService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private maxRetries = 2;
    private retryDelay = 1000;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getDefaultMeal(type: string): Meal {
        return {
            name: `Örnek ${type}`,
            description: 'Geçici olarak oluşturulmuş örnek yemek',
            ingredients: ['Malzeme 1', 'Malzeme 2', 'Malzeme 3'],
            instructions: ['Adım 1', 'Adım 2', 'Adım 3'],
            preparationTime: '30 dakika',
            difficulty: 'Orta',
            calories: 500,
            imagePrompt: 'A delicious Turkish meal'
        };
    }

    private cleanJsonResponse(text: string): string {
        // Remove markdown code blocks if present
        text = text.replace(/```(json|JSON)?\n/g, '').replace(/```/g, '');
        // Remove any leading/trailing whitespace
        text = text.trim();
        return text;
    }

    private async generateMealWithRetry(mealType: string, retryCount = 0): Promise<Meal> {
        try {
            const prompt = `Generate a detailed Turkish recipe for ${mealType}. The food should be a main course (not a dessert or snack or soup). Return ONLY the JSON object without any markdown formatting or explanation. The response should be a valid JSON object in this exact format:
{
  "name": "dish name in Turkish",
  "description": "brief description in Turkish",
  "ingredients": ["list of ingredients in Turkish"],
  "instructions": ["step by step instructions in Turkish"],
  "preparationTime": "preparation time in format like '30 dakika'",
  "difficulty": "one of: Kolay, Orta, Zor",
  "calories": approximate calories as number,
}`;

            const result = await this.model.generateContent(prompt, {
                generationConfig: {
                    temperature: 0.7,
                    topK: 1,
                    topP: 1,
                }
            });

            const response = await result.response;
            const text = response.text();
            const cleanedText = this.cleanJsonResponse(text);

            try {
                return JSON.parse(cleanedText);
            } catch (parseError) {
                console.error('Error parsing AI response:', parseError);
                console.error('Raw response:', text);
                console.error('Cleaned response:', cleanedText);
                throw new Error('Invalid JSON response from AI');
            }
        } catch (error) {
            console.error(`Error generating meal (attempt ${retryCount + 1}):`, error);

            if (retryCount < this.maxRetries) {
                await this.sleep(this.retryDelay * (retryCount + 1));
                return this.generateMealWithRetry(mealType, retryCount + 1);
            }

            console.warn(`Failed to generate ${mealType} after ${this.maxRetries} attempts, using default meal`);
            return this.getDefaultMeal(mealType);
        }
    }

    async generateDailyMenu(): Promise<{
        breakfast: Meal;
        lunch: Meal;
        dinner: Meal;
    }> {
        const [breakfast, lunch, dinner] = await Promise.all([
            this.generateMealWithRetry('kahvaltı'),
            this.generateMealWithRetry('öğle yemeği'),
            this.generateMealWithRetry('akşam yemeği'),
        ]);

        return {
            breakfast,
            lunch,
            dinner,
        };
    }
} 