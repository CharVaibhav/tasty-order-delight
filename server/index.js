const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const menuRoutes = require('./routes/menu');

// Import database connections
const connectMongoDB = require('./config/db');
const postgres = require('./config/postgres');

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
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databases: {
      mongodb: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
      },
      postgresql: {
        status: 'checking'
      }
    }
  };
  
  // Check PostgreSQL connection
  try {
    const pgConnected = await postgres.testConnection();
    health.databases.postgresql.status = pgConnected ? 'connected' : 'disconnected';
  } catch (error) {
    health.databases.postgresql.status = 'error';
    health.databases.postgresql.error = error.message;
  }
  
  // If both databases are connected, return 200
  if (health.databases.mongodb.status === 'connected' && 
      health.databases.postgresql.status === 'connected') {
    return res.status(200).json(health);
  }
  
  // If any database is disconnected, return 503 Service Unavailable
  res.status(503).json(health);
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

// Start the server after database connections
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`==> Your service is live 🎉`);
  });
  
  // Handle server errors
  server.on('error', (error) => {
    console.error('Server error:', error);
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        // Close PostgreSQL pool
        postgres.pool.end().then(() => {
          console.log('PostgreSQL connection closed.');
          process.exit(0);
        });
      });
    });
    
    // Force close if graceful shutdown takes too long
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        // Close PostgreSQL pool
        postgres.pool.end().then(() => {
          console.log('PostgreSQL connection closed.');
          process.exit(0);
        });
      });
    });
  });
  
  return server;
};

// Connect to databases and start server with retry logic
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;
let mongoRetries = 0;
let pgRetries = 0;

const initializeDatabases = async () => {
  let mongoConnected = false;
  let pgConnected = false;
  
  // Try to connect to MongoDB
  try {
    console.log(`MongoDB connection attempt ${mongoRetries + 1}/${MAX_RETRIES}`);
    await connectMongoDB();
    console.log('MongoDB connected successfully');
    mongoConnected = true;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    if (mongoRetries < MAX_RETRIES) {
      mongoRetries++;
      console.log(`Will retry MongoDB in ${RETRY_DELAY/1000} seconds...`);
     // We'll retry in the next iteration
    } else {
      console.error('Max retries reached. Could not connect to MongoDB.');
      // Continue with PostgreSQL only
    }
  }
  
  // Try to connect to PostgreSQL
  try {
    console.log(`PostgreSQL connection attempt ${pgRetries + 1}/${MAX_RETRIES}`);
    pgConnected = await postgres.testConnection();
    if (pgConnected) {
      // Initialize PostgreSQL tables
      await postgres.initDatabase();
    }
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
    if (pgRetries < MAX_RETRIES) {
      pgRetries++;
      console.log(`Will retry PostgreSQL in ${RETRY_DELAY/1000} seconds...`);
      // We'll retry in the next iteration
     } else {
      console.error('Max retries reached. Could not connect to PostgreSQL.');
      // Continue with MongoDB only
    }
  }
  
  // If at least one database is connected, start the server
  if (mongoConnected || pgConnected) {
    startServer();
    return true;
  }
  
  // If both databases failed to connect and we haven't reached max retries
  if ((mongoRetries < MAX_RETRIES || pgRetries < MAX_RETRIES)) {
    console.log(`Retrying database connections in ${RETRY_DELAY/1000} seconds...`);
    setTimeout(initializeDatabases, RETRY_DELAY);
    return false;
  }
  
  // If we've reached max retries for both databases
  console.error('Could not connect to any database after maximum retries.');
  process.exit(1);
};

// Start the initialization process
initializeDatabases();

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