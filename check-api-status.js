import https from 'https';

// Configuration
const apiUrl = 'tasty-order-delight-api.onrender.com';
const endpoints = [
  { path: '/api/health', method: 'GET', name: 'Health Check' },
  { path: '/api/menu', method: 'GET', name: 'Menu Items' },
  { path: '/api/categories', method: 'GET', name: 'Categories' }
];

// Function to make a request to an endpoint
function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: apiUrl,
      path: endpoint.path,
      method: endpoint.method,
      timeout: 10000,
      headers: {
        'User-Agent': 'API-Status-Checker/1.0'
      }
    };

    const startTime = Date.now();
    
    const req = https.request(options, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        let responseData;
        try {
          responseData = JSON.parse(data);
        } catch (e) {
          responseData = { error: 'Invalid JSON response' };
        }
        
        resolve({
          endpoint: endpoint.name,
          path: endpoint.path,
          status: res.statusCode,
          responseTime: responseTime,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: responseData
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        endpoint: endpoint.name,
        path: endpoint.path,
        status: 'Error',
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        endpoint: endpoint.name,
        path: endpoint.path,
        status: 'Timeout',
        responseTime: Date.now() - startTime,
        success: false,
        error: 'Request timed out'
      });
    });
    
    req.end();
  });
}

// Main function to check all endpoints
async function checkApiStatus() {
  console.log(`\n=== Checking API Status for ${apiUrl} ===\n`);
  
  const results = await Promise.all(endpoints.map(endpoint => checkEndpoint(endpoint)));
  
  // Display results
  results.forEach(result => {
    const statusSymbol = result.success ? '✓' : '✗';
    const statusColor = result.success ? '\x1b[32m' : '\x1b[31m';
    const resetColor = '\x1b[0m';
    
    console.log(`${statusColor}${statusSymbol}${resetColor} ${result.endpoint} (${result.path})`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Response Time: ${result.responseTime}ms`);
    
    if (result.success) {
      if (result.data && typeof result.data === 'object') {
        if (Array.isArray(result.data)) {
          console.log(`  Response: Array with ${result.data.length} items`);
        } else {
          console.log(`  Response: Object with keys [${Object.keys(result.data).join(', ')}]`);
        }
      }
    } else {
      console.log(`  Error: ${result.error || 'Unknown error'}`);
    }
    
    console.log('');
  });
  
  // Summary
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const successRate = Math.round((successCount / totalCount) * 100);
  
  const summaryColor = successRate === 100 ? '\x1b[32m' : successRate >= 50 ? '\x1b[33m' : '\x1b[31m';
  
  console.log(`${summaryColor}=== Summary ====${resetColor}`);
  console.log(`${successCount}/${totalCount} endpoints available (${successRate}% success rate)`);
  
  if (successRate === 100) {
    console.log('\x1b[32mAPI is fully operational!\x1b[0m');
  } else if (successRate >= 50) {
    console.log('\x1b[33mAPI is partially operational.\x1b[0m');
  } else {
    console.log('\x1b[31mAPI appears to be down or experiencing significant issues.\x1b[0m');
  }
}

// Run the check
checkApiStatus();