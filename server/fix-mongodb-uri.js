const readline = require('readline');
const mongoose = require('mongoose');
const { URL } = require('url');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to test MongoDB connection
async function testConnection(uri) {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ Successfully connected to MongoDB!');
    await mongoose.connection.close();
    console.log('Connection closed.');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

// Function to parse and fix MongoDB URI
function parseAndFixURI(uri) {
  try {
    // Check if it's a valid MongoDB URI format
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      return { valid: false, error: 'Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://' };
    }
    
    // For mongodb+srv:// URLs, we need special handling
    if (uri.startsWith('mongodb+srv://')) {
      // Extract parts manually since URL parser doesn't handle mongodb+srv:// well
      const withoutProtocol = uri.replace(/^mongodb\+srv:\/\//, '');
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
        
        // URL encode the password if it has special characters
        const encodedPassword = encodeURIComponent(password);
        if (password !== encodedPassword) {
          console.log('⚠️ Password contains special characters that need URL encoding');
          console.log(`Original: ${password}`);
          console.log(`Encoded: ${encodedPassword}`);
          
          // Reconstruct the URI with encoded password
          const newUri = `mongodb+srv://${username}:${encodedPassword}@${host}`;
          const finalUri = rest ? `${newUri}/${rest}` : newUri;
          
          return {
            valid: true,
            fixed: true,
            originalUri: uri,
            fixedUri: finalUri,
            changes: ['URL encoded password special characters']
          };
        }
      }
      
      // Check if database name is missing
      let database = '';
      let params = '';
      if (rest) {
        const dbAndParams = rest.split('?', 2);
        database = dbAndParams[0];
        params = dbAndParams[1] ? `?${dbAndParams[1]}` : '';
      }
      
      if (!database) {
        console.log('⚠️ No database name specified in the connection string');
        // Suggest adding a database name
        const suggestedDbName = 'tasty_order_delight';
        const newUri = `mongodb+srv://${credentials ? credentials + '@' : ''}${host}/${suggestedDbName}${params}`;
        
        return {
          valid: true,
          fixed: true,
          originalUri: uri,
          fixedUri: newUri,
          changes: ['Added database name']
        };
      }
    } else {
      // For standard mongodb:// URLs, we can use the URL parser
      try {
        // Replace mongodb:// with http:// temporarily for URL parsing
        const httpUrl = uri.replace(/^mongodb:\/\//, 'http://');
        const parsedUrl = new URL(httpUrl);
        
        // Check and encode password if needed
        if (parsedUrl.password) {
          const decodedPassword = decodeURIComponent(parsedUrl.password);
          const encodedPassword = encodeURIComponent(decodedPassword);
          
          if (parsedUrl.password !== encodedPassword) {
            // Password needs encoding
            parsedUrl.password = encodedPassword;
            const fixedHttpUrl = parsedUrl.toString();
            const fixedMongoUrl = fixedHttpUrl.replace(/^http:\/\//, 'mongodb://');
            
            return {
              valid: true,
              fixed: true,
              originalUri: uri,
              fixedUri: fixedMongoUrl,
              changes: ['URL encoded password special characters']
            };
          }
        }
        
        // Check if database name is missing (path will be / or empty)
        if (!parsedUrl.pathname || parsedUrl.pathname === '/') {
          const suggestedDbName = 'tasty_order_delight';
          parsedUrl.pathname = `/${suggestedDbName}`;
          const fixedHttpUrl = parsedUrl.toString();
          const fixedMongoUrl = fixedHttpUrl.replace(/^http:\/\//, 'mongodb://');
          
          return {
            valid: true,
            fixed: true,
            originalUri: uri,
            fixedUri: fixedMongoUrl,
            changes: ['Added database name']
          };
        }
      } catch (error) {
        return { valid: false, error: `Error parsing standard MongoDB URI: ${error.message}` };
      }
    }
    
    // If we got here, the URI seems valid and doesn't need fixing
    return { valid: true, fixed: false, originalUri: uri };
  } catch (error) {
    return { valid: false, error: `Error analyzing connection string: ${error.message}` };
  }
}

// Main function
async function main() {
  console.log('=== MongoDB Connection String Fixer ===');
  console.log('This tool will help you fix your MongoDB connection string for Render deployment.');
  
  rl.question('\nPlease enter your MongoDB connection string: ', async (uri) => {
    if (!uri) {
      console.log('No connection string provided. Exiting...');
      rl.close();
      return;
    }
    
    console.log('\nAnalyzing connection string...');
    const result = parseAndFixURI(uri);
    
    if (!result.valid) {
      console.log(`❌ ${result.error}`);
      rl.close();
      return;
    }
    
    if (result.fixed) {
      console.log('✅ Found issues that can be fixed:');
      result.changes.forEach(change => console.log(`- ${change}`));
      
      console.log('\nOriginal connection string:');
      console.log(result.originalUri);
      
      console.log('\nFixed connection string:');
      console.log(result.fixedUri);
      
      rl.question('\nWould you like to test the fixed connection string? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          const success = await testConnection(result.fixedUri);
          
          if (success) {
            console.log('\n✅ Connection successful! Use this connection string in your Render environment variables:');
            console.log(result.fixedUri);
          } else {
            console.log('\n❌ Connection failed even with the fixed string.');
            console.log('Please check your MongoDB Atlas settings:');
            console.log('1. Verify the username and password are correct');
            console.log('2. Ensure the user has appropriate permissions');
            console.log('3. Check that your IP is whitelisted in MongoDB Atlas (add 0.0.0.0/0 to allow all IPs)');
            console.log('4. Verify your MongoDB Atlas cluster is running');
          }
        }
        
        rl.close();
      });
    } else {
      console.log('✅ Your connection string format looks good.');
      
      rl.question('\nWould you like to test this connection string? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          await testConnection(uri);
        }
        
        rl.close();
      });
    }
  });
}

// Run the main function
main();