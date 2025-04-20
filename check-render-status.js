import https from 'https';

// Configuration
const apiUrl = 'tasty-order-delight-api.onrender.com';

// Function to make a simple HTTP request
function checkUrl(url) {
  return new Promise((resolve) => {
    console.log(`Checking ${url}...`);
    
    const req = https.request({
      hostname: url,
      path: '/',
      method: 'GET',
      timeout: 10000,
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
        console.log(`Body: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
        
        resolve({
          url,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      console.error(`Error: ${error.message}`);
      resolve({
        url,
        success: false,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      console.error('Request timed out');
      req.destroy();
      resolve({
        url,
        success: false,
        error: 'Request timed out'
      });
    });
    
    req.end();
  });
}

// Main function
async function checkRenderStatus() {
  console.log('=== Checking Render Service Status ===\n');
  
  // Check the main domain
  const result = await checkUrl(apiUrl);
  
  console.log('\n=== Summary ===');
  if (result.success) {
    console.log(`✅ The service at ${result.url} is running!`);
  } else {
    console.log(`❌ The service at ${result.url} is not responding properly.`);
    console.log('\nPossible issues:');
    console.log('1. The service might be in a sleep state (free Render services sleep after inactivity)');
    console.log('2. The service might be down or experiencing issues');
    console.log('3. The service might be deploying or restarting');
    console.log('\nRecommendations:');
    console.log('1. Check your Render dashboard to see the service status');
    console.log('2. If the service is sleeping, it should wake up after this request (try again in a minute)');
    console.log('3. If the service is down, you may need to redeploy it');
  }
}

// Run the check
checkRenderStatus();