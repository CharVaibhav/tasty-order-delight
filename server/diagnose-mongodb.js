const connectionString = "mongodb+srv://23r11a05j1:VaibhavJ1@cluster0.bgrefss.mongodb.net/tasty_order_delight?retryWrites=true&w=majority";
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const { promisify } = require('util');

// Load environment variables
dotenv.config();

// Get the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Function to mask sensitive information in the connection string
function maskConnectionString(connectionString) {
  if (!connectionString) return 'undefined';
  return connectionString.replace(/:([^@]+)@/, ':****@');
}

// Function to parse MongoDB connection string
function parseMongoURI(uri) {
  try {
    if (!uri) return { valid: false, error: 'Connection string is undefined' };
    
    // Check if it's a valid MongoDB URI format
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      return { valid: false, error: 'Invalid MongoDB URI format' };
    }
    
    // Extract parts of the connection string
    const isSrv = uri.startsWith('mongodb+srv://');
    const withoutProtocol = uri.replace(/^mongodb(\+srv)?:\/\//, '');
    
    // Extract credentials and host
    const [credentialsAndHost, rest] = withoutProtocol.split('/', 2);
    const [credentials, host] = credentialsAndHost.split('@', 2);
    
    if (!host) {
      return { valid: false, error: 'Missing host in connection string' };
    }
    
    // Extract username and password
    let username, password;
    if (credentials && credentials.includes(':')) {
      [username, password] = credentials.split(':', 2);
      if (!username || !password) {
        return { valid: false, error: 'Invalid credentials format' };
      }
    } else if (credentials) {
      return { valid: false, error: 'Credentials format is invalid (missing : separator)' };
    }
    
    // Extract database name
    let database = '';
    if (rest) {
      const dbAndParams = rest.split('?', 2);
      database = dbAndParams[0];
    }
    
    return {
      valid: true,
      protocol: isSrv ? 'mongodb+srv' : 'mongodb',
      username,
      password: password ? '****' : undefined,
      host,
      database,
      hasCredentials: !!credentials,
      hasDatabase: !!database
    };
  } catch (error) {
    return { valid: false, error: `Error parsing connection string: ${error.message}` };
  }
}

// Function to check DNS resolution
async function checkDNS(hostname) {
  const lookup = promisify(dns.lookup);
  try {
    const result = await lookup(hostname);
    return { success: true, ip: result.address };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main diagnostic function
async function diagnoseMongoDB() {
  console.log('=== MongoDB Connection Diagnostic ===');
  console.log('Node.js version:', process.version);
  console.log('Mongoose version:', mongoose.version);
  
  // Check if MONGODB_URI is defined
  console.log('\n1. Checking environment variables:');
  if (!uri) {
    console.log('❌ MONGODB_URI is not defined in environment variables');
    return;
  }
  console.log('✅ MONGODB_URI is defined');
  console.log('   Connection string (masked):', maskConnectionString(uri));
  
  // Parse and validate the connection string
  console.log('\n2. Validating connection string format:');
  const parsedURI = parseMongoURI(uri);
  if (!parsedURI.valid) {
    console.log(`❌ ${parsedURI.error}`);
    return;
  }
  
  console.log('✅ Connection string format is valid');
  console.log('   Protocol:', parsedURI.protocol);
  console.log('   Host:', parsedURI.host);
  console.log('   Username:', parsedURI.username || 'none');
  console.log('   Password:', parsedURI.password ? 'provided' : 'none');
  console.log('   Database:', parsedURI.database || 'none');
  
  if (!parsedURI.hasCredentials) {
    console.log('⚠️ No credentials in connection string');
  }
  
  if (!parsedURI.hasDatabase) {
    console.log('⚠️ No database specified in connection string');
  }
  
  // Check DNS resolution for the hostname
  console.log('\n3. Checking DNS resolution:');
  const hostname = parsedURI.host.split(':')[0];
  const dnsCheck = await checkDNS(hostname);
  
  if (!dnsCheck.success) {
    console.log(`❌ Cannot resolve hostname: ${dnsCheck.error}`);
    return;
  }
  console.log(`✅ Hostname resolved to IP: ${dnsCheck.ip}`);
  
  // Attempt to connect to MongoDB
  console.log('\n4. Attempting MongoDB connection:');
  try {
    console.log('   Connecting...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('   Connection state:', mongoose.connection.readyState);
    
    // Check database access
    console.log('\n5. Checking database access:');
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`✅ Successfully accessed database. Found ${collections.length} collections.`);
      if (collections.length > 0) {
        console.log('   Collections:', collections.map(c => c.name).join(', '));
      }
    } catch (error) {
      console.log('❌ Error accessing database collections:', error.message);
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\n✅ Connection closed successfully');
    
  } catch (error) {
    console.log('❌ MongoDB connection error:');
    console.log('   Error name:', error.name);
    console.log('   Error message:', error.message);
    
    if (error.name === 'MongoServerError' && error.message.includes('bad auth')) {
      console.log('\n🔍 Authentication Error Analysis:');
      console.log('   - Your username or password is incorrect');
      console.log('   - Check if your MongoDB Atlas user credentials are correct');
      console.log('   - Ensure special characters in password are properly URL encoded');
      console.log('   - Verify the user has appropriate permissions for the database');
    }
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔍 Server Selection Error Analysis:');
      console.log('   - Cannot reach MongoDB server');
      console.log('   - Check if your IP is whitelisted in MongoDB Atlas');
      console.log('   - Verify that your MongoDB Atlas cluster is running');
      console.log('   - Check if there are any network restrictions');
    }
  }
  
  console.log('\n=== Diagnostic Complete ===');
}

// Run the diagnostic
diagnoseMongoDB().catch(console.error);