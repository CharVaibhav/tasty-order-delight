import fetch from 'node-fetch';
import https from 'https';

// API URL to test
const API_URL = 'https://tasty-order-delight-api.onrender.com';
const FRONTEND_URL = 'https://digital-diner.netlify.app';

// Create an HTTPS agent with longer timeout
const agent = new https.Agent({
  timeout: 30000, // 30 seconds
  keepAlive: true
});

// Endpoints to test
const endpoints = [
  { name: 'Root', path: '/' },
  { name: 'Health Check', path: '/api/health' },
  { name: 'Menu Items', path: '/api/menu' },
  { name: 'Categories', path: '/api/categories' }
];

async function testEndpoint(endpoint) {
  console.log(`\n\n=== Testing ${endpoint.name} (${API_URL}${endpoint.path}) ===`);
  
  try {
    console.log(`Sending request to: ${API_URL}${endpoint.path}`);
    console.log(`With Origin header: ${FRONTEND_URL}`);
    
    const response = await fetch(`${API_URL}${endpoint.path}`, {
      method: 'GET',
      headers: {
        'Origin': FRONTEND_URL,
        'Accept': 'application/json'
      },
      agent
    });
    
    console.log(`Response Status: ${response.status} (${response.statusText})`);
    
    // Log headers
    console.log('\nResponse Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // Check for CORS headers
    const corsHeader = response.headers.get('access-control-allow-origin');
    if (corsHeader) {
      console.log(`\nCORS is configured. Access-Control-Allow-Origin: ${corsHeader}`);
      if (corsHeader !== '*' && corsHeader !== FRONTEND_URL) {
        console.log(`WARNING: CORS header doesn't match frontend URL (${FRONTEND_URL})`);
      }
    } else {
      console.log('\nWARNING: No CORS headers found in response!');
    }
    
    // Get response body
    const text = await response.text();
    
    try {
      // Try to parse as JSON
      const data = JSON.parse(text);
      console.log('\nResponse Body (JSON):');
      console.log(JSON.stringify(data, null, 2));
      return { success: true, status: response.status, data };
    } catch (e) {
      // Not JSON, show as text
      console.log('\nResponse Body (Text):');
      console.log(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      return { success: response.ok, status: response.status, text };
    }
  } catch (error) {
    console.error(`\nRequest failed: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('The server refused the connection. The API server might be down.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('The connection timed out. The API server might be slow or unresponsive.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('The hostname could not be resolved. Check if the API URL is correct.');
    }
    
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('=== API Diagnostics Tool ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log(`Using Origin: ${FRONTEND_URL}`);
  console.log('==========================\n');
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result.success) successCount++;
  }
  
  console.log('\n=== Summary ===');
  console.log(`${successCount}/${endpoints.length} endpoints working`);
  
  if (successCount === 0) {
    console.log('\nTroubleshooting steps:');
    console.log('1. Check if the API server is running on Render.com');
    console.log('2. Verify the MongoDB connection is working');
    console.log('3. Check CORS configuration in server/index.js');
    console.log('4. Ensure the API URL is correct');
    console.log('5. Check for any firewall or network issues');
  }
}

runTests().catch(console.error);