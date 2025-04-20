const mongoose = require('mongoose');
require('dotenv').config();

// Use the connection string from your .env file
const uri = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB...');
console.log('Connection string (partially masked):', 
  uri.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
  console.log('Connection state:', mongoose.connection.readyState);
  return mongoose.connection.db.admin().listDatabases();
})
.then(result => {
  console.log('Available databases:');
  result.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
  return mongoose.connection.close();
})
.then(() => {
  console.log('Connection closed successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});