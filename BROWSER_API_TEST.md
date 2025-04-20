# Browser-Based API Test

This is a simple browser-based tool to test your API endpoints without requiring Node.js or any dependencies.

## How to Use

1. Open the `api-test.html` file in your web browser
2. Enter your API URL (default: `https://tasty-order-delight-api.onrender.com`)
3. Enter your Frontend URL (default: `https://digital-diner.netlify.app`)
4. Click "Run Tests"

## What It Tests

The tool will test the following endpoints:

1. Health Check: `/api/health`
2. Menu Items: `/api/menu`
3. Categories: `/api/categories`

## Interpreting Results

For each endpoint, you'll see:

- Status code and message
- Response data (if successful)
- Error message (if failed)

A summary at the bottom will show how many endpoints are working.

## Troubleshooting

If endpoints fail, check:

1. **API URL**: Make sure the API URL is correct and includes `https://`
2. **CORS**: Ensure your API allows requests from your frontend domain
3. **API Status**: Verify that your API is running on Render

## Next Steps

After confirming your API is working:

1. Visit your frontend site to test the full user experience
2. Test user authentication and order creation
3. Check that data is being properly stored in your database