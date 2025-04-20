const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const menuRoutes = require('./routes/menu');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://tasty-order-delight.netlify.app',
  'https://tastyorderdelight.netlify.app',
  'https://tasty-order-delight-1.netlify.app',
  'https://digital-diner.netlify.app',
  'http://localhost:5173',
  'http://localhost',
  'file://',
  // Add your custom domain here if you have one
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
  res.json({ message: 'Welcome to Tasty Order Delight API' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Categories endpoint
app.get('/api/categories', async (req, res, next) => {
  try {
    // Get unique categories from menu items
    const MenuItem = require('./models/Menu');
    const categories = await MenuItem.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);

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

// Import the MongoDB connection module
const connectDB = require('./config/db');

// Start the server after MongoDB connection
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    startServer();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB. Server not started:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit the process in production, just log the error
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error after initial connection:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
}); 