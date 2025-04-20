import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection options
const mongoOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  retryReads: true,
  maxIdleTimeMS: 30000,
};

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log(`Using URI: ${process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);
    
    await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
    console.log('✅ MongoDB Atlas connection successful!');
    
    // Create a simple test model
    const Test = mongoose.model('Test', new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    }));
    
    // Create a test document
    const testDoc = new Test({ name: 'Connection Test' });
    await testDoc.save();
    console.log('✅ Successfully created a test document');
    
    // Find the test document
    const foundDoc = await Test.findOne({ name: 'Connection Test' });
    console.log('✅ Successfully retrieved the test document:', foundDoc);
    
    // Clean up - delete the test document
    await Test.deleteOne({ _id: testDoc._id });
    console.log('✅ Successfully deleted the test document');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
  }
}

testConnection();