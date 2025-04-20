const mongoose = require('mongoose');

// The updated MongoDB connection string
const uri = "mongodb+srv://23r11a05j1:UN8rMW9ZH9fhCQxQ@cluster0.bgrefss.mongodb.net/tasty_order_delight?retryWrites=true&w=majority";

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
    console.log('Attempting to connect to MongoDB Atlas with new credentials...');
    console.log(`Using URI: ${uri.replace(/:[^:]*@/, ':****@')}`);
    
    await mongoose.connect(uri, mongoOptions);
    console.log('✅ MongoDB Atlas connection successful!');
    
    // Check database connection
    const admin = mongoose.connection.db.admin();
    const dbInfo = await admin.serverInfo();
    console.log('✅ Connected to MongoDB version:', dbInfo.version);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Database has ${collections.length} collections:`);
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
  }
}

// Run the test
testConnection();