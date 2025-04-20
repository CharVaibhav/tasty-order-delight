import fetch from 'node-fetch';
import https from 'https';

// Create an HTTPS agent with longer timeout
const agent = new https.Agent({
  timeout: 60000, // 60 seconds
  keepAlive: true
});

// API URL to test
const API_URL = 'https://tasty-order-delight-api.onrender.com';
const FRONTEND_URL = 'https://digital-diner.netlify.app';

// Endpoints to test
const endpoints = [
  { name: 'Root', path: '/' },
  { name: 'Health Check', path: '/api/health' },
  { name: 'Menu Items', path: '/api/menu' },
  { name: 'Categories', path: '/api/categories' }
];

// Function to wait for a specified time
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to test an endpoint with retries
async function testEndpointWithRetry(endpoint, maxRetries = 3, retryDelay = 10000) {
  console.log(`\n\n=== Testing ${endpoint.name} (${API_URL}${endpoint.path}) ===`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: Sending request to: ${API_URL}${endpoint.path}`);
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
      
      // Check for Render-specific headers
      const renderHeader = response.headers.get('x-render-routing');
      if (renderHeader) {
        console.log(`\nRender.com header found: x-render-routing: ${renderHeader}`);
        if (renderHeader === 'no-server') {
          console.log('\n❌ The Render.com service is not running!');
          if (attempt < maxRetries) {
            console.log(`Waiting ${retryDelay/1000} seconds before retrying...`);
            await wait(retryDelay);
            continue;
          }
        }
      }
      
      // Check for CORS headers
      const corsHeader = response.headers.get('access-control-allow-origin');
      if (corsHeader) {
        console.log(`\nCORS is configured. Access-Control-Allow-Origin: ${corsHeader}`);
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
        
        // If we got a 404 and this is not the last attempt, retry
        if (response.status === 404 && attempt < maxRetries) {
          console.log(`\nGot 404 response. The service might be starting up. Waiting ${retryDelay/1000} seconds before retrying...`);
          await wait(retryDelay);
          continue;
        }
        
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
      
      if (attempt < maxRetries) {
        console.log(`\nRetrying in ${retryDelay/1000} seconds... (Attempt ${attempt}/${maxRetries})`);
        await wait(retryDelay);
      } else {
        return { success: false, error: error.message };
      }
    }
  }
  
  console.log(`\nAll ${maxRetries} attempts failed for ${endpoint.name}.`);
  return { success: false, error: 'Max retries exceeded' };
}

async function runTests() {
  console.log('=== API Diagnostics Tool with Retry Logic ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log(`Using Origin: ${FRONTEND_URL}`);
  console.log('==========================\n');
  
  console.log('NOTE: Free tier Render.com services sleep after inactivity.');
  console.log('The first request will wake up the service, but it may take 30-60 seconds to fully start.');
  console.log('This script will automatically retry failed requests.\n');
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    const result = await testEndpointWithRetry(endpoint);
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
  } else if (successCount < endpoints.length) {
    console.log('\nSome endpoints are working, but not all. This could indicate:');
    console.log('1. The service is still starting up');
    console.log('2. There are issues with specific routes');
    console.log('3. MongoDB connection is working but some collections might be missing');
  } else {
    console.log('\n✅ All endpoints are working correctly!');
    console.log('Your API is fully operational.');
  }
}

runTests().catch(console.error);