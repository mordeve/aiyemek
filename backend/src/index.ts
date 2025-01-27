import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { MenuController } from './controllers/menu.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Initialize controllers
const menuController = new MenuController(process.env.GEMINI_API_KEY!);

// Routes
app.get('/api/menu/today', menuController.getTodayMenu);
app.post('/api/menu/regenerate', menuController.regenerateMenu);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 