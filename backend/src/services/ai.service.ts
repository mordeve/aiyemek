import { GoogleGenerativeAI } from '@google/generative-ai';
import { Meal, DailyMenu } from '../types';
import { format } from 'date-fns';

export class AIService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private maxRetries = 2;
    private retryDelay = 1000;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getDefaultMeal(type: string, isOption2: boolean = false): Meal {
        const suffix = isOption2 ? ' (Alternatif)' : '';
        return {
            name: `Örnek ${type}${suffix}`,
            description: 'Geçici olarak oluşturulmuş örnek yemek',
            ingredients: ['Malzeme 1', 'Malzeme 2', 'Malzeme 3'],
            preparationTime: '30 dakika',
            difficulty: 'Orta',
            calories: 500,
            imagePrompt: 'A delicious Turkish meal',
            nutritionalInfo: {
                protein: '20g',
                carbs: '30g',
                fat: '15g',
                fiber: '5g'
            },
            servingSize: '1 porsiyon',
            cuisine: 'Türk Mutfağı'
        };
    }

    private cleanJsonResponse(text: string): string {
        try {
            // Remove markdown code blocks if present
            text = text.replace(/```(json|JSON)?\n/g, '').replace(/```/g, '');
            // Remove any leading/trailing whitespace
            text = text.trim();
            // Remove any non-JSON text before or after the JSON object
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            if (jsonStart >= 0 && jsonEnd > 0) {
                text = text.slice(jsonStart, jsonEnd);
            }
            // Validate that it's parseable JSON
            JSON.parse(text);
            return text;
        } catch (error) {
            console.error('Failed to clean JSON response:', error);
            // Return a valid default JSON structure
            return JSON.stringify({
                option1: this.getDefaultMeal('kahvaltı'),
                option2: this.getDefaultMeal('kahvaltı', true)
            });
        }
    }

    private async generateMealOptionsWithRetry(mealType: string, retryCount = 0): Promise<{ option1: Meal; option2?: Meal }> {
        try {
            let prompt;
            if (mealType === 'kahvaltı') {
                prompt = `Generate ONE healthy Turkish breakfast option. The meal should be nutritious and traditional.

Important rules:
1. Must be a traditional Turkish breakfast item
2. Include detailed nutritional information
3. All string values must be in quotes
4. NO processed foods or ready-made items
5. Return ONLY a valid JSON object, no other text

Return in this exact format:
{
  "option1": {
    "name": "breakfast name in Turkish",
    "description": "brief description in Turkish",
    "ingredients": ["list of ingredients in Turkish"],
    "preparationTime": "preparation time in format like '30 dakika'",
    "difficulty": "one of: Kolay, Orta, Zor",
    "calories": 300,
    "nutritionalInfo": {
      "protein": "25g",
      "carbs": "30g",
      "fat": "15g",
      "fiber": "5g"
    },
    "servingSize": "portion size in Turkish",
    "cuisine": "type of Turkish cuisine"
  }
}`;
            } else {
                prompt = `Generate TWO DIFFERENT healthy Turkish food options for ${mealType}. These should be homemade, nutritious meals.

Important rules:
1. Both options must be completely different from each other
2. Both must be suitable for ${mealType === 'öğle yemeği' ? 'lunch' : 'dinner'} time
3. NO processed foods, canned soups, or ready-made items
4. Focus on traditional, homemade Turkish dishes
5. Include detailed nutritional information
6. All string values must be in quotes
7. Return ONLY a valid JSON object, no other text

Return in this exact format:
{
  "option1": {
    "name": "first option name in Turkish",
    "description": "brief description in Turkish",
    "ingredients": ["list of main ingredients in Turkish"],
    "preparationTime": "preparation time in format like '30 dakika'",
    "difficulty": "one of: Kolay, Orta, Zor",
    "calories": 300,
    "nutritionalInfo": {
      "protein": "25g",
      "carbs": "30g",
      "fat": "15g",
      "fiber": "5g"
    },
    "servingSize": "portion size in Turkish",
    "cuisine": "type of Turkish cuisine"
  },
  "option2": {
    "name": "second option name in Turkish",
    "description": "brief description in Turkish",
    "ingredients": ["list of main ingredients in Turkish"],
    "preparationTime": "preparation time in format like '30 dakika'",
    "difficulty": "one of: Kolay, Orta, Zor",
    "calories": 400,
    "nutritionalInfo": {
      "protein": "20g",
      "carbs": "35g",
      "fat": "18g",
      "fiber": "4g"
    },
    "servingSize": "portion size in Turkish",
    "cuisine": "type of Turkish cuisine"
  }
}`;
            }

            const result = await this.model.generateContent(prompt, {
                generationConfig: {
                    temperature: 0.7,
                    topK: 20,
                    topP: 0.8,
                }
            });

            const response = await result.response;
            const text = response.text();
            const cleanedText = this.cleanJsonResponse(text);

            try {
                const parsed = JSON.parse(cleanedText);

                // Validate the response has required options
                if (!parsed.option1 || (mealType !== 'kahvaltı' && !parsed.option2)) {
                    throw new Error('Missing meal options in AI response');
                }

                // Clean up each option to ensure it only has the expected fields
                const cleanMealOption = (meal: any): Meal => {
                    const cleanedMeal = {
                        name: meal.name || 'Örnek Yemek',
                        description: meal.description || 'Geçici olarak oluşturulmuş örnek yemek',
                        ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : ['Malzeme 1', 'Malzeme 2'],
                        preparationTime: meal.preparationTime || '30 dakika',
                        difficulty: meal.difficulty || 'Orta',
                        calories: typeof meal.calories === 'number' ? meal.calories : 500,
                        imagePrompt: meal.imagePrompt || 'A delicious Turkish meal',
                        nutritionalInfo: {
                            protein: typeof meal.nutritionalInfo?.protein === 'string' ? meal.nutritionalInfo.protein : '20g',
                            carbs: typeof meal.nutritionalInfo?.carbs === 'string' ? meal.nutritionalInfo.carbs : '30g',
                            fat: typeof meal.nutritionalInfo?.fat === 'string' ? meal.nutritionalInfo.fat : '15g',
                            fiber: typeof meal.nutritionalInfo?.fiber === 'string' ? meal.nutritionalInfo.fiber : '5g'
                        },
                        servingSize: meal.servingSize || '1 porsiyon',
                        cuisine: meal.cuisine || 'Türk Mutfağı'
                    };
                    return cleanedMeal;
                };

                const cleanedOption1 = cleanMealOption(parsed.option1);
                const cleanedOption2 = mealType !== 'kahvaltı' ? cleanMealOption(parsed.option2) : undefined;

                // For lunch and dinner, validate that options are different
                if (mealType !== 'kahvaltı' && cleanedOption2 && this.areMealsSimilar(cleanedOption1, cleanedOption2)) {
                    console.warn('Generated meal options are too similar, using default meals');
                    return {
                        option1: this.getDefaultMeal(mealType),
                        option2: this.getDefaultMeal(mealType, true)
                    };
                }

                return {
                    option1: cleanedOption1,
                    ...(cleanedOption2 && { option2: cleanedOption2 })
                };
            } catch (parseError) {
                console.error('Error parsing AI response:', parseError);
                console.error('Raw response:', text);
                console.error('Cleaned response:', cleanedText);

                // Return default meals if parsing fails
                return {
                    option1: this.getDefaultMeal(mealType),
                    ...(mealType !== 'kahvaltı' && { option2: this.getDefaultMeal(mealType, true) })
                };
            }
        } catch (error) {
            console.error(`Error generating ${mealType} options (attempt ${retryCount + 1}):`, error);

            if (retryCount < this.maxRetries) {
                await this.sleep(this.retryDelay * (retryCount + 1));
                return this.generateMealOptionsWithRetry(mealType, retryCount + 1);
            }

            console.warn(`Failed to generate ${mealType} options after ${this.maxRetries} attempts, using default meals`);
            return {
                option1: this.getDefaultMeal(mealType),
                ...(mealType !== 'kahvaltı' && { option2: this.getDefaultMeal(mealType, true) })
            };
        }
    }

    private areMealsSimilar(meal1: Meal, meal2: Meal): boolean {
        // Check if the main ingredients are too similar
        const mainIngredients1 = new Set(meal1.ingredients.slice(0, 3).map(i => i.toLowerCase()));
        const mainIngredients2 = new Set(meal2.ingredients.slice(0, 3).map(i => i.toLowerCase()));

        let commonIngredients = 0;
        mainIngredients1.forEach(ingredient => {
            if (mainIngredients2.has(ingredient)) {
                commonIngredients++;
            }
        });

        // If more than one main ingredient is common, consider them similar
        if (commonIngredients > 1) {
            return true;
        }

        // Check if the calorie difference is too small
        const calorieDiff = Math.abs(meal1.calories - meal2.calories);
        if (calorieDiff < 100) {
            return true;
        }

        return false;
    }

    async generateDailyMenu(): Promise<DailyMenu> {
        try {
            const [breakfast, lunch, dinner] = await Promise.all([
                this.generateMealOptionsWithRetry('kahvaltı'),
                this.generateMealOptionsWithRetry('öğle yemeği'),
                this.generateMealOptionsWithRetry('akşam yemeği')
            ]);

            // Ensure we have valid meal options for each meal time
            const defaultBreakfast = {
                option1: this.getDefaultMeal('kahvaltı')
            };

            const defaultLunch = {
                option1: this.getDefaultMeal('öğle yemeği'),
                option2: this.getDefaultMeal('öğle yemeği', true)
            };

            const defaultDinner = {
                option1: this.getDefaultMeal('akşam yemeği'),
                option2: this.getDefaultMeal('akşam yemeği', true)
            };

            // Use default meals if any meal time failed to generate or missing option2
            const breakfastMenu = breakfast ? { option1: breakfast.option1 } : defaultBreakfast;
            const lunchMenu = lunch?.option2 ? lunch : defaultLunch;
            const dinnerMenu = dinner?.option2 ? dinner : defaultDinner;

            // Ensure option2 is always present for lunch and dinner
            const validLunchMenu = {
                option1: lunchMenu.option1,
                option2: lunchMenu.option2 || this.getDefaultMeal('öğle yemeği', true)
            };

            const validDinnerMenu = {
                option1: dinnerMenu.option1,
                option2: dinnerMenu.option2 || this.getDefaultMeal('akşam yemeği', true)
            };

            return {
                breakfast: breakfastMenu,
                lunch: validLunchMenu,
                dinner: validDinnerMenu,
                date: format(new Date(), 'yyyy-MM-dd')
            };
        } catch (error) {
            console.error('Error generating daily menu:', error);
            // Return default meals for all meal times if something goes wrong
            return {
                breakfast: {
                    option1: this.getDefaultMeal('kahvaltı')
                },
                lunch: {
                    option1: this.getDefaultMeal('öğle yemeği'),
                    option2: this.getDefaultMeal('öğle yemeği', true)
                },
                dinner: {
                    option1: this.getDefaultMeal('akşam yemeği'),
                    option2: this.getDefaultMeal('akşam yemeği', true)
                },
                date: format(new Date(), 'yyyy-MM-dd')
            };
        }
    }

    private isValidMealOptions(mealOptions: any): boolean {
        if (!mealOptions || typeof mealOptions !== 'object') return false;
        if (!mealOptions.option1 || !mealOptions.option2) return false;

        const option1Valid = this.isValidMeal(mealOptions.option1);
        const option2Valid = this.isValidMeal(mealOptions.option2);

        return option1Valid && option2Valid;
    }

    private isValidMeal(meal: any): boolean {
        if (!meal || typeof meal !== 'object') return false;

        const requiredFields = [
            'name',
            'description',
            'ingredients',
            'preparationTime',
            'difficulty',
            'calories',
            'nutritionalInfo',
            'servingSize',
            'cuisine'
        ];

        const hasAllFields = requiredFields.every(field => {
            if (field === 'nutritionalInfo') {
                return meal[field] && typeof meal[field] === 'object' &&
                    meal[field].protein && meal[field].carbs &&
                    meal[field].fat && meal[field].fiber;
            }
            return meal[field] !== undefined && meal[field] !== null;
        });

        return hasAllFields;
    }
} 