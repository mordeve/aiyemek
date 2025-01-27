"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const menu_controller_1 = require("./controllers/menu.controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
// Initialize controllers
const menuController = new menu_controller_1.MenuController(process.env.GEMINI_API_KEY);
// Routes
app.get('/api/menu/today', menuController.getTodayMenu);
app.post('/api/menu/regenerate', menuController.regenerateMenu);
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
