import { Request, Response } from 'express';
import { Menu } from '../models/Menu';
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
            const { breakfast, lunch, dinner } = await this.aiService.generateDailyMenu();

            // Delete any existing menus first
            await Menu.deleteMany({});

            // Create new menu
            await Menu.create({
                breakfast,
                lunch,
                dinner,
                date: today,
            });

            console.log('Daily menu regenerated successfully');
        } catch (error) {
            console.error('Error regenerating daily menu:', error);
        }
    }

    getTodayMenu = async (_req: Request, res: Response) => {
        try {
            let menu = await Menu.findOne().sort({ date: -1 });

            if (!menu || isAfter(new Date(), new Date(menu.date + 'T23:59:59'))) {
                console.log('No valid menu found, generating new menu...');
                const { breakfast, lunch, dinner } = await this.aiService.generateDailyMenu();

                // Delete any existing menus first
                await Menu.deleteMany({});

                // Create new menu
                menu = await Menu.create({
                    breakfast,
                    lunch,
                    dinner,
                    date: format(new Date(), 'yyyy-MM-dd'),
                });
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

    regenerateMenu = async (_req: Request, res: Response) => {
        try {
            console.log('Manually regenerating menu...');
            const { breakfast, lunch, dinner } = await this.aiService.generateDailyMenu();

            // Delete any existing menus first
            await Menu.deleteMany({});

            // Create new menu
            const menu = await Menu.create({
                breakfast,
                lunch,
                dinner,
                date: format(new Date(), 'yyyy-MM-dd'),
            });

            console.log('Menu regenerated successfully');
            res.json(menu);
        } catch (error: any) {
            console.error('Error in regenerateMenu:', error);
            res.status(500).json({
                error: 'Menü oluşturulurken bir hata oluştu',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    };
} 