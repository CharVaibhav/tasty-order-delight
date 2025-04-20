import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment variables or use the direct connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://23r11a05j1:UN8rMW9ZH9fhCQxQ@cluster0.bgrefss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log('=== MongoDB URI Verification Tool ===');
console.log(`Current MongoDB URI: ${uri.replace(/:[^:]*@/, ':****@')}`);

// Function to test MongoDB connection
async function testConnection(connectionUri) {
  console.log(`\nTesting connection with URI: ${connectionUri.replace(/:[^:]*@/, ':****@')}`);
  
  const client = new MongoClient(connectionUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Connection successful!');
    
    // List databases
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach(db => console.log(`- ${db.name}`));
    
    await client.close();
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    await client.close();
    return false;
  }
}

// Function to update .env file
function updateEnvFile(newUri) {
  const envPath = path.join(__dirname, '.env');
  
  try {
    // Check if .env file exists
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update MONGODB_URI if it exists
      if (envContent.includes('MONGODB_URI=')) {
        envContent = envContent.replace(/MONGODB_URI=.*(\r?\n|$)/g, `MONGODB_URI=${newUri}$1`);
      } else {
        // Add MONGODB_URI if it doesn't exist
        envContent += `\nMONGODB_URI=${newUri}\n`;
      }
    } else {
      // Create new .env file
      envContent = `MONGODB_URI=${newUri}\n`;
    }
    
    // Write to .env file
    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅ Updated .env file with new MongoDB URI`);
    return true;
  } catch (err) {
    console.error(`\n❌ Failed to update .env file:`, err.message);
    return false;
  }
}

// Main function
async function main() {
  // Test current connection
  const isCurrentConnectionWorking = await testConnection(uri);
  
  if (isCurrentConnectionWorking) {
    console.log('\n✅ Your current MongoDB URI is working correctly!');
    console.log('\nRecommendations:');
    console.log('1. Make sure this URI is set in your Render.com environment variables');
    console.log('2. Update your .env file if needed');
    
    // Ask if user wants to update .env file
    console.log('\nWould you like to update your .env file with this URI? (y/n)');
    console.log('Since this is a script, we\'ll automatically update it for demonstration.');
    updateEnvFile(uri);
  } else {
    console.log('\n❌ Your current MongoDB URI is not working.');
    console.log('\nPossible issues:');
    console.log('1. Incorrect username or password');
    console.log('2. Database name is missing');
    console.log('3. MongoDB Atlas cluster is not accessible');
    console.log('4. Network connectivity issues');
    
    // Suggest a fix
    console.log('\nTry using this format:');
    console.log('mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority');
    
    // Extract parts from the current URI
    const uriParts = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)(\/.+)?/);
    
    if (uriParts) {
      const [, username, password, cluster, dbPart] = uriParts;
      const dbName = dbPart ? dbPart.split('?')[0].replace('/', '') : 'tasty_order_delight';
      
      console.log('\nBased on your current URI, here\'s a suggested fix:');
      const suggestedUri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;
      console.log(suggestedUri.replace(/:[^:]*@/, ':****@'));
      
      // Test the suggested URI
      console.log('\nTesting the suggested URI...');
      const isSuggestedUriWorking = await testConnection(suggestedUri);
      
      if (isSuggestedUriWorking) {
        console.log('\n✅ The suggested URI works! Updating your .env file...');
        updateEnvFile(suggestedUri);
      } else {
        console.log('\n❌ The suggested URI also failed.');
        console.log('\nPlease check your MongoDB Atlas credentials and try again.');
      }
    } else {
      console.log('\nCould not parse your current URI format.');
      console.log('Please check your MongoDB Atlas dashboard for the correct connection string.');
    }
  }
}

main().catch(console.error);