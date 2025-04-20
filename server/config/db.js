const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

// Get MongoDB URI from environment variables or use the direct connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://23r11a05j1:UN8rMW9ZH9fhCQxQ@cluster0.bgrefss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB connection options using the Atlas recommended settings
const mongooseOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Attempting to connect to MongoDB Atlas...');
      console.log(`Using URI: ${uri.replace(/:[^:]*@/, ':****@')}`);
      
      await mongoose.connect(uri, mongooseOptions);
      
      console.log('MongoDB Atlas connection successful!');
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