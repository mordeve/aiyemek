"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class AIService {
    constructor(apiKey) {
        this.maxRetries = 2;
        this.retryDelay = 1000;
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    getDefaultMeal(type) {
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
    cleanJsonResponse(text) {
        // Remove markdown code blocks if present
        text = text.replace(/```(json|JSON)?\n/g, '').replace(/```/g, '');
        // Remove any leading/trailing whitespace
        text = text.trim();
        return text;
    }
    generateMealWithRetry(mealType_1) {
        return __awaiter(this, arguments, void 0, function* (mealType, retryCount = 0) {
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
                const result = yield this.model.generateContent(prompt, {
                    generationConfig: {
                        temperature: 0.7,
                        topK: 1,
                        topP: 1,
                    }
                });
                const response = yield result.response;
                const text = response.text();
                const cleanedText = this.cleanJsonResponse(text);
                try {
                    return JSON.parse(cleanedText);
                }
                catch (parseError) {
                    console.error('Error parsing AI response:', parseError);
                    console.error('Raw response:', text);
                    console.error('Cleaned response:', cleanedText);
                    throw new Error('Invalid JSON response from AI');
                }
            }
            catch (error) {
                console.error(`Error generating meal (attempt ${retryCount + 1}):`, error);
                if (retryCount < this.maxRetries) {
                    yield this.sleep(this.retryDelay * (retryCount + 1));
                    return this.generateMealWithRetry(mealType, retryCount + 1);
                }
                console.warn(`Failed to generate ${mealType} after ${this.maxRetries} attempts, using default meal`);
                return this.getDefaultMeal(mealType);
            }
        });
    }
    generateDailyMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const [breakfast, lunch, dinner] = yield Promise.all([
                this.generateMealWithRetry('kahvaltı'),
                this.generateMealWithRetry('öğle yemeği'),
                this.generateMealWithRetry('akşam yemeği'),
            ]);
            return {
                breakfast,
                lunch,
                dinner,
            };
        });
    }
}
exports.AIService = AIService;
