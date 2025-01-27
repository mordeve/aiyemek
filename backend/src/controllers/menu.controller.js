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
exports.MenuController = void 0;
const Menu_1 = require("../models/Menu");
const ai_service_1 = require("../services/ai.service");
const date_fns_1 = require("date-fns");
class MenuController {
    constructor(geminiApiKey) {
        this.menuRegenerationInterval = null;
        this.getTodayMenu = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let menu = yield Menu_1.Menu.findOne().sort({ date: -1 });
                if (!menu || (0, date_fns_1.isAfter)(new Date(), new Date(menu.date + 'T23:59:59'))) {
                    console.log('No valid menu found, generating new menu...');
                    const { breakfast, lunch, dinner } = yield this.aiService.generateDailyMenu();
                    // Delete any existing menus first
                    yield Menu_1.Menu.deleteMany({});
                    // Create new menu
                    menu = yield Menu_1.Menu.create({
                        breakfast,
                        lunch,
                        dinner,
                        date: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd'),
                    });
                    console.log('New menu generated and saved successfully');
                }
                res.json(menu);
            }
            catch (error) {
                console.error('Error in getTodayMenu:', error);
                res.status(500).json({
                    error: 'Menü yüklenirken bir hata oluştu',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
        this.regenerateMenu = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Manually regenerating menu...');
                const { breakfast, lunch, dinner } = yield this.aiService.generateDailyMenu();
                // Delete any existing menus first
                yield Menu_1.Menu.deleteMany({});
                // Create new menu
                const menu = yield Menu_1.Menu.create({
                    breakfast,
                    lunch,
                    dinner,
                    date: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd'),
                });
                console.log('Menu regenerated successfully');
                res.json(menu);
            }
            catch (error) {
                console.error('Error in regenerateMenu:', error);
                res.status(500).json({
                    error: 'Menü oluşturulurken bir hata oluştu',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        });
        if (!geminiApiKey) {
            console.warn('Warning: GEMINI_API_KEY is not set. AI features may not work properly.');
        }
        this.aiService = new ai_service_1.AIService(geminiApiKey);
        this.setupDailyMenuRegeneration();
    }
    setupDailyMenuRegeneration() {
        // Calculate time until next midnight
        const now = new Date();
        const tomorrow = (0, date_fns_1.startOfDay)(new Date(now));
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
    regenerateMenuForToday() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Regenerating menu for today at midnight...');
                const today = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
                const { breakfast, lunch, dinner } = yield this.aiService.generateDailyMenu();
                // Delete any existing menus first
                yield Menu_1.Menu.deleteMany({});
                // Create new menu
                yield Menu_1.Menu.create({
                    breakfast,
                    lunch,
                    dinner,
                    date: today,
                });
                console.log('Daily menu regenerated successfully');
            }
            catch (error) {
                console.error('Error regenerating daily menu:', error);
            }
        });
    }
}
exports.MenuController = MenuController;
