"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mealSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    preparationTime: { type: String, required: true },
    difficulty: { type: String, required: true },
    calories: { type: Number, required: true },
    imagePrompt: { type: String }
});
const menuSchema = new mongoose_1.default.Schema({
    breakfast: { type: mealSchema, required: true },
    lunch: { type: mealSchema, required: true },
    dinner: { type: mealSchema, required: true },
    date: { type: String, required: true, unique: true }
});
exports.Menu = mongoose_1.default.model('Menu', menuSchema);
