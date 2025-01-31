import { Request, Response } from 'express';
import Menu from '../models/Menu';
import { AIService } from '../services/ai.service';
import { format, startOfDay, isAfter } from 'date-fns';

export class MenuController {
    private aiService: AIService;
    private menuRegenerationInterval: NodeJS.Timeout | null = null;

    constructor(geminiApiKey: string) {
        if (!geminiApiKey) {
            console.warn('Warning: GEMINI_API_KEY is not set. AI features may not work properly.');
        }
        this.aiService = new AIService(geminiApiKey);
        this.setupDailyMenuRegeneration();
    }

    private setupDailyMenuRegeneration() {
        // Calculate time until next midnight
        const now = new Date();
        const tomorrow = startOfDay(new Date(now));
        tomorrow.setDate(tomorrow.getDate() + 1);
        const msUntilMidnight = tomorrow.getTime() - now.getTime();

        // Set up initial timer for next midnight
        setTimeout(() => {
            this.regenerateMenuForToday();
            // Then set up daily interval
            this.menuRegenerationInterval = setInterval(() => {
                this.regenerateMenuForToday();
            }, 24 * 60 * 60 * 1000); // 24 hours
        }, msUntilMidnight);
    }

    private async regenerateMenuForToday() {
        try {
            console.log('Regenerating menu for today at midnight...');
            const today = format(new Date(), 'yyyy-MM-dd');
            const menu = await this.aiService.generateDailyMenu();

            console.log('AI Generated Menu:', JSON.stringify(menu, null, 2));

            // Delete any existing menus first
            await Menu.deleteMany({});

            // Create new menu with properly structured data
            const newMenu = await Menu.create({
                date: today,
                breakfast: menu.breakfast,
                lunch: menu.lunch,
                dinner: menu.dinner
            });

            console.log('Successfully regenerated menu for today');
            return newMenu;
        } catch (error) {
            console.warn('Error in regenerateMenu:', error);
            // In case of error, create a menu with default meals
            const today = format(new Date(), 'yyyy-MM-dd');

            console.log('Attempting to create default menu...');
            const defaultMenu = {
                date: today,
                breakfast: {
                    option1: this.aiService.getDefaultMeal('kahvaltı'),
                    option2: this.aiService.getDefaultMeal('kahvaltı', true)
                },
                lunch: {
                    option1: this.aiService.getDefaultMeal('öğle yemeği'),
                    option2: this.aiService.getDefaultMeal('öğle yemeği', true)
                },
                dinner: {
                    option1: this.aiService.getDefaultMeal('akşam yemeği'),
                    option2: this.aiService.getDefaultMeal('akşam yemeği', true)
                }
            };

            console.log('Default Menu Structure:', JSON.stringify(defaultMenu, null, 2));

            return Menu.create(defaultMenu);
        }
    }

    getTodayMenu = async (_req: Request, res: Response) => {
        try {
            let menu = await Menu.findOne().sort({ date: -1 });

            if (!menu || isAfter(new Date(), new Date(menu.date + 'T23:59:59'))) {
                console.log('No valid menu found, generating new menu...');
                menu = await this.regenerateMenuForToday();
                console.log('New menu generated and saved successfully');
            }

            res.json(menu);
        } catch (error: any) {
            console.error('Error in getTodayMenu:', error);
            res.status(500).json({
                error: 'Menü yüklenirken bir hata oluştu',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    };

    regenerateMenu = async (req: Request, res: Response) => {
        console.log('Received regenerateMenu request with body:', JSON.stringify(req.body, null, 2));

        try {
            // If request body is empty, generate a new menu using AI service
            if (!req.body || Object.keys(req.body).length === 0) {
                console.log('Empty request body, generating new menu using AI service...');
                const menu = await this.regenerateMenuForToday();
                res.status(201).send(menu);
                return;
            }

            // If request body is provided, use it to create a menu
            const menuData = {
                date: format(new Date(), 'yyyy-MM-dd'),
                breakfast: {
                    option1: {
                        name: req.body.breakfast?.name || 'Kahvaltı',
                        description: req.body.breakfast?.description || 'Türk kahvaltısı',
                        calories: req.body.breakfast?.calories || 500,
                        difficulty: req.body.breakfast?.difficulty || 'Orta',
                        preparationTime: req.body.breakfast?.preparationTime || '30 dakika',
                        ingredients: req.body.breakfast?.ingredients || ['Default ingredient'],
                        nutritionalInfo: {
                            protein: '20g',
                            carbs: '30g',
                            fat: '15g',
                            fiber: '5g'
                        },
                        servingSize: '1 porsiyon',
                        cuisine: 'Türk Mutfağı'
                    },
                    option2: {
                        name: (req.body.breakfast?.name || 'Kahvaltı') + ' (Alternatif)',
                        description: req.body.breakfast?.description || 'Türk kahvaltısı',
                        calories: req.body.breakfast?.calories || 500,
                        difficulty: req.body.breakfast?.difficulty || 'Orta',
                        preparationTime: req.body.breakfast?.preparationTime || '30 dakika',
                        ingredients: req.body.breakfast?.ingredients || ['Default ingredient'],
                        nutritionalInfo: {
                            protein: '20g',
                            carbs: '30g',
                            fat: '15g',
                            fiber: '5g'
                        },
                        servingSize: '1 porsiyon',
                        cuisine: 'Türk Mutfağı'
                    }
                },
                lunch: {
                    option1: {
                        name: req.body.lunch?.name || 'Öğle Yemeği',
                        description: req.body.lunch?.description || 'Türk mutfağından öğle yemeği',
                        calories: req.body.lunch?.calories || 600,
                        difficulty: req.body.lunch?.difficulty || 'Orta',
                        preparationTime: req.body.lunch?.preparationTime || '45 dakika',
                        ingredients: req.body.lunch?.ingredients || ['Default ingredient'],
                        nutritionalInfo: {
                            protein: '25g',
                            carbs: '35g',
                            fat: '20g',
                            fiber: '6g'
                        },
                        servingSize: '1 porsiyon',
                        cuisine: 'Türk Mutfağı'
                    },
                    option2: {
                        name: (req.body.lunch?.name || 'Öğle Yemeği') + ' (Alternatif)',
                        description: req.body.lunch?.description || 'Türk mutfağından öğle yemeği',
                        calories: req.body.lunch?.calories || 600,
                        difficulty: req.body.lunch?.difficulty || 'Orta',
                        preparationTime: req.body.lunch?.preparationTime || '45 dakika',
                        ingredients: req.body.lunch?.ingredients || ['Default ingredient'],
                        nutritionalInfo: {
                            protein: '25g',
                            carbs: '35g',
                            fat: '20g',
                            fiber: '6g'
                        },
                        servingSize: '1 porsiyon',
                        cuisine: 'Türk Mutfağı'
                    }
                },
                dinner: {
                    option1: {
                        name: req.body.dinner?.name || 'Akşam Yemeği',
                        description: req.body.dinner?.description || 'Türk mutfağından akşam yemeği',
                        calories: req.body.dinner?.calories || 700,
                        difficulty: req.body.dinner?.difficulty || 'Orta',
                        preparationTime: req.body.dinner?.preparationTime || '60 dakika',
                        ingredients: req.body.dinner?.ingredients || ['Default ingredient'],
                        nutritionalInfo: {
                            protein: '30g',
                            carbs: '40g',
                            fat: '25g',
                            fiber: '7g'
                        },
                        servingSize: '1 porsiyon',
                        cuisine: 'Türk Mutfağı'
                    },
                    option2: {
                        name: (req.body.dinner?.name || 'Akşam Yemeği') + ' (Alternatif)',
                        description: req.body.dinner?.description || 'Türk mutfağından akşam yemeği',
                        calories: req.body.dinner?.calories || 700,
                        difficulty: req.body.dinner?.difficulty || 'Orta',
                        preparationTime: req.body.dinner?.preparationTime || '60 dakika',
                        ingredients: req.body.dinner?.ingredients || ['Default ingredient'],
                        nutritionalInfo: {
                            protein: '30g',
                            carbs: '40g',
                            fat: '25g',
                            fiber: '7g'
                        },
                        servingSize: '1 porsiyon',
                        cuisine: 'Türk Mutfağı'
                    }
                }
            };

            console.log('Attempting to create menu with data:', JSON.stringify(menuData, null, 2));

            const menu = new Menu(menuData);
            await menu.save();
            res.status(201).send(menu);
        } catch (error) {
            console.error('Error in regenerateMenu:', error);
            res.status(400).send(error);
        }
    };
} 