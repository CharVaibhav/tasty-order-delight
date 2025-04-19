import mongoose from 'mongoose';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
export const connectMongoDB = async () => {
  const mongoOptions = {
    serverApi: {
      version: '1' as const,
      strict: true,
      deprecationErrors: true,
    },
    retryWrites: true,
    w: 'majority' as const,
    maxPoolSize: 10,
    minPoolSize: 5,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    retryReads: true,
    maxIdleTimeMS: 30000,
  };

  const connectWithRetry = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2', mongoOptions);
        console.log('MongoDB connected successfully');
        return;
      } catch (error) {
        console.error(`MongoDB connection attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          console.log(`Retrying in ${delay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error('Max retries reached. Exiting...');
          process.exit(1);
        }
      }
    }
  };

  await connectWithRetry();
};

// PostgreSQL Connection
export const pgPool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'tasty_order_delight',
  password: process.env.PG_PASSWORD || 'postgres',
  port: parseInt(process.env.PG_PORT || '5432'),
});

// Test PostgreSQL connection
export const testPGConnection = async () => {
  try {
    const client = await pgPool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
}; 