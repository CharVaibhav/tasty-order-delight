import fetch from 'node-fetch';

// Configuration - replace with your actual URLs
const API_URL = 'https://tasty-order-delight-api.onrender.com';
const FRONTEND_URL = 'https://digital-diner.netlify.app';

// Test endpoints
const endpoints = [
  { name: 'Health Check', path: '/api/health', method: 'GET' },
  { name: 'Menu Items', path: '/api/menu', method: 'GET' },
  { name: 'Categories', path: '/api/categories', method: 'GET' }
];

// Function to test an endpoint
async function testEndpoint(endpoint) {
  console.log(`\nTesting ${endpoint.name} (${endpoint.path})...`);
  
  try {
    const response = await fetch(`${API_URL}${endpoint.path}`, {
      method: endpoint.method,
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    
    const status = response.status;
    console.log(`Status: ${status} (${response.statusText})`);
    
    if (status >= 200 && status < 300) {
      try {
        const data = await response.json();
        console.log('Response data:', 
          Array.isArray(data) 
            ? `Array with ${data.length} items` 
            : `Object with keys [${Object.keys(data).join(', ')}]`
        );
        return { success: true, data };
      } catch (e) {
        console.log('Error parsing JSON response:', e.message);
        return { success: false, error: 'Invalid JSON response' };
      }
    } else {
      console.log('Error response:', await response.text());
      return { success: false, status };
    }
  } catch (error) {
    console.log('Request failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Main function
async function runTests() {
  console.log(`\n=== Testing API at ${API_URL} ===`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result.success) successCount++;
  }
  
  console.log(`\n=== Summary: ${successCount}/${endpoints.length} endpoints working ===`);
  
  if (successCount === endpoints.length) {
    console.log('✅ All API endpoints are working!');
  } else {
    console.log('⚠️ Some API endpoints are not working properly.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution error:', error);
});