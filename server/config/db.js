const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

// Get MongoDB URI from environment variables or use the direct connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://23r11a05j1:UN8rMW9ZH9fhCQxQ@cluster0.bgrefss.mongodb.net/tasty_order_delight?retryWrites=true&w=majority";

// MongoDB connection options using the Atlas recommended settings
const mongooseOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Additional options for better stability
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  w: 'majority'
};

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Attempting to connect to MongoDB Atlas...');
      console.log(`Using URI: ${uri.replace(/:[^:]*@/, ':****@')}`);
      
      // Disconnect if already connected
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log('Disconnected from previous MongoDB connection');
      }
      
      await mongoose.connect(uri, mongooseOptions);
      
      // Test the connection with a simple operation
      await mongoose.connection.db.admin().ping();
      
      console.log('MongoDB Atlas connection successful!');
      
      // Set up connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. The connection was lost.');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected successfully');
      });
      
      return mongoose.connection;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
      
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Max retries reached. Could not connect to MongoDB.');
        throw err;
      }
    }
  }
};

module.exports = connectDB;