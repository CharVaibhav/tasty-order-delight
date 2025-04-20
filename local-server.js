import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost',
  'https://tasty-order-delight.netlify.app',
  'https://tastyorderdelight.netlify.app',
  'https://tasty-order-delight-1.netlify.app',
  'https://digital-diner.netlify.app',
  'file://'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Log the origin for debugging
    console.log(`Received request from origin: ${origin}`);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      console.log(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tasty Order Delight API (Local Server)' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock data for menu items
const menuItems = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 9.99,
    category: 'Burgers',
    image: 'https://example.com/classic-burger.jpg',
    isPopular: true
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'Pizza',
    image: 'https://example.com/margherita-pizza.jpg',
    isPopular: true
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with Caesar dressing and croutons',
    price: 7.99,
    category: 'Salads',
    image: 'https://example.com/caesar-salad.jpg',
    isPopular: false
  }
];

// Menu items endpoint
app.get('/api/menu', (req, res) => {
  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems
  });
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  // Extract unique categories from menu items
  const categories = [...new Set(menuItems.map(item => item.category))];
  res.status(200).json(categories);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  res.status(statusCode).json({ 
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ===============================================
  🚀 Local API Server running on port ${PORT} 🚀
  
  Available endpoints:
  - GET /                 - Welcome message
  - GET /api/health       - Health check
  - GET /api/menu         - Menu items
  - GET /api/categories   - Categories
  
  Access the API at: http://localhost:${PORT}
  ===============================================
  `);
});