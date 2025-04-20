import axios from 'axios';
import readline from 'readline';
import colors from 'colors';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
let config = {
  apiUrl: 'https://tasty-order-delight-api.onrender.com', // Default backend URL
  frontendUrl: 'https://digital-diner.netlify.app', // Default frontend URL
  authToken: null,
  userId: null
};

// Test user credentials
const testUser = {
  name: 'Test User',
  email: `test.user.${Date.now()}@example.com`,
  password: 'Test@123456'
};

// Helper function to prompt for input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Helper function to make API requests with error handling
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const url = `${config.apiUrl}${endpoint}`;
    console.log(colors.gray(`${method.toUpperCase()} ${url}`));
    
    const response = await axios({
      method,
      url,
      data,
      headers
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    return { 
      success: false, 
      status: error.response?.status,
      error: errorMessage
    };
  }
}

// Test functions
async function testPublicEndpoints() {
  console.log(colors.cyan('\n=== Testing Public Endpoints ==='));
  
  // Test API health check
  console.log('\nTesting API health check...');
  const healthResult = await makeRequest('get', '/api/health');
  if (healthResult.success) {
    console.log(colors.green('✓ API health check successful'));
    console.log(colors.gray(`Response: ${JSON.stringify(healthResult.data)}`));
  } else {
    console.log(colors.red(`✗ API health check failed: ${healthResult.error}`));
  }
  
  // Test menu items endpoint
  console.log('\nTesting menu items endpoint...');
  const menuResult = await makeRequest('get', '/api/menu');
  if (menuResult.success) {
    console.log(colors.green(`✓ Menu items retrieved successfully (${menuResult.data.length || 0} items)`));
    if (menuResult.data.length > 0) {
      console.log(colors.gray(`First item: ${JSON.stringify(menuResult.data[0])}`));
    }
  } else {
    console.log(colors.red(`✗ Menu items retrieval failed: ${menuResult.error}`));
  }
  
  return healthResult.success && menuResult.success;
}

async function testUserAuthentication() {
  console.log(colors.cyan('\n=== Testing User Authentication ==='));
  
  // Test user registration
  console.log('\nTesting user registration...');
  const registerResult = await makeRequest('post', '/api/users/register', testUser);
  if (registerResult.success) {
    console.log(colors.green('✓ User registration successful'));
    console.log(colors.gray(`User ID: ${registerResult.data.user._id}`));
    config.userId = registerResult.data.user._id;
  } else {
    if (registerResult.status === 400 && registerResult.error.includes('already exists')) {
      console.log(colors.yellow('! User already exists, proceeding to login'));
    } else {
      console.log(colors.red(`✗ User registration failed: ${registerResult.error}`));
      return false;
    }
  }
  
  // Test user login
  console.log('\nTesting user login...');
  const loginResult = await makeRequest('post', '/api/users/login', {
    email: testUser.email,
    password: testUser.password
  });
  
  if (loginResult.success) {
    console.log(colors.green('✓ User login successful'));
    config.authToken = loginResult.data.token;
    if (!config.userId) {
      config.userId = loginResult.data.user._id;
    }
    console.log(colors.gray(`Auth Token: ${config.authToken.substring(0, 15)}...`));
  } else {
    console.log(colors.red(`✗ User login failed: ${loginResult.error}`));
    return false;
  }
  
  // Test get user profile
  console.log('\nTesting user profile retrieval...');
  const profileResult = await makeRequest('get', '/api/users/profile', null, config.authToken);
  if (profileResult.success) {
    console.log(colors.green('✓ User profile retrieved successfully'));
    console.log(colors.gray(`Profile: ${JSON.stringify(profileResult.data)}`));
  } else {
    console.log(colors.red(`✗ User profile retrieval failed: ${profileResult.error}`));
  }
  
  return loginResult.success && profileResult.success;
}

async function testOrderFunctionality() {
  console.log(colors.cyan('\n=== Testing Order Functionality ==='));
  
  if (!config.authToken) {
    console.log(colors.red('✗ Cannot test orders: No authentication token available'));
    return false;
  }
  
  // Get menu items for order
  const menuResult = await makeRequest('get', '/api/menu');
  if (!menuResult.success || !menuResult.data.length) {
    console.log(colors.red('✗ Cannot test orders: No menu items available'));
    return false;
  }
  
  // Create a test order
  const menuItem = menuResult.data[0];
  const orderData = {
    items: [
      {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 2
      }
    ],
    totalAmount: menuItem.price * 2,
    deliveryAddress: '123 Test Street, Test City',
    paymentMethod: 'COD'
  };
  
  console.log('\nTesting order creation...');
  const createOrderResult = await makeRequest('post', '/api/orders', orderData, config.authToken);
  if (createOrderResult.success) {
    console.log(colors.green('✓ Order created successfully'));
    console.log(colors.gray(`Order ID: ${createOrderResult.data._id}`));
    
    // Test get order details
    console.log('\nTesting order retrieval...');
    const orderId = createOrderResult.data._id;
    const getOrderResult = await makeRequest('get', `/api/orders/${orderId}`, null, config.authToken);
    if (getOrderResult.success) {
      console.log(colors.green('✓ Order retrieved successfully'));
      console.log(colors.gray(`Order Status: ${getOrderResult.data.status}`));
    } else {
      console.log(colors.red(`✗ Order retrieval failed: ${getOrderResult.error}`));
    }
    
    // Test get all user orders
    console.log('\nTesting user orders retrieval...');
    const userOrdersResult = await makeRequest('get', '/api/orders/my-orders', null, config.authToken);
    if (userOrdersResult.success) {
      console.log(colors.green(`✓ User orders retrieved successfully (${userOrdersResult.data.length} orders)`));
    } else {
      console.log(colors.red(`✗ User orders retrieval failed: ${userOrdersResult.error}`));
    }
    
    return createOrderResult.success && getOrderResult.success && userOrdersResult.success;
  } else {
    console.log(colors.red(`✗ Order creation failed: ${createOrderResult.error}`));
    return false;
  }
}

async function testCORSAndHeaders() {
  console.log(colors.cyan('\n=== Testing CORS and Headers ==='));
  
  try {
    // Test CORS headers
    console.log('\nTesting CORS headers...');
    const response = await axios({
      method: 'options',
      url: `${config.apiUrl}/api/health`,
      headers: {
        'Origin': config.frontendUrl,
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers'
    ];
    
    let corsSuccess = true;
    corsHeaders.forEach(header => {
      if (response.headers[header]) {
        console.log(colors.green(`✓ ${header} header present: ${response.headers[header]}`));
      } else {
        console.log(colors.red(`✗ ${header} header missing`));
        corsSuccess = false;
      }
    });
    
    if (corsSuccess) {
      console.log(colors.green('✓ CORS headers are properly configured'));
    } else {
      console.log(colors.yellow('! Some CORS headers are missing, frontend might have issues'));
    }
    
    return corsSuccess;
  } catch (error) {
    console.log(colors.red(`✗ CORS test failed: ${error.message}`));
    return false;
  }
}

// Main test function
async function runIntegrationTests() {
  console.log(colors.bold.yellow('=== Tasty Order Delight Frontend-Backend Integration Test ==='));
  
  // Get API URL from user
  const apiUrl = await prompt(`Enter backend API URL [${config.apiUrl}]: `);
  if (apiUrl) config.apiUrl = apiUrl;
  
  const frontendUrl = await prompt(`Enter frontend URL [${config.frontendUrl}]: `);
  if (frontendUrl) config.frontendUrl = frontendUrl;
  
  console.log(colors.bold(`\nTesting integration between:`));
  console.log(colors.bold(`Frontend: ${config.frontendUrl}`));
  console.log(colors.bold(`Backend: ${config.apiUrl}`));
  
  // Run tests
  const publicEndpointsSuccess = await testPublicEndpoints();
  const authSuccess = await testUserAuthentication();
  const orderSuccess = await testOrderFunctionality();
  const corsSuccess = await testCORSAndHeaders();
  
  // Summary
  console.log(colors.bold.yellow('\n=== Integration Test Summary ==='));
  console.log(colors.bold(`Public Endpoints: ${publicEndpointsSuccess ? colors.green('PASS') : colors.red('FAIL')}`));
  console.log(colors.bold(`User Authentication: ${authSuccess ? colors.green('PASS') : colors.red('FAIL')}`));
  console.log(colors.bold(`Order Functionality: ${orderSuccess ? colors.green('PASS') : colors.red('FAIL')}`));
  console.log(colors.bold(`CORS Configuration: ${corsSuccess ? colors.green('PASS') : colors.red('FAIL')}`));
  
  const overallSuccess = publicEndpointsSuccess && authSuccess && orderSuccess && corsSuccess;
  console.log(colors.bold(`\nOverall Integration: ${overallSuccess ? colors.green('PASS') : colors.red('FAIL')}`));
  
  if (overallSuccess) {
    console.log(colors.bold.green('\n✓ Frontend and Backend are successfully integrated!'));
  } else {
    console.log(colors.bold.yellow('\n! Some integration tests failed. Review the issues above.'));
  }
  
  rl.close();
}

// Run the tests
runIntegrationTests().catch(error => {
  console.error(colors.red(`Test execution error: ${error.message}`));
  rl.close();
});