# Update MongoDB Connection in Render

Follow these steps to update your MongoDB connection string in Render with the correct format.

## Step 1: Verify Your MongoDB URI

First, make sure your MongoDB URI is correct and working:

```bash
node verify-mongodb-uri.js
```

If the script shows "Connection successful!", your URI is working correctly.

## Step 2: Update Environment Variables in Render

1. Log in to your Render dashboard: https://dashboard.render.com/
2. Select your "tasty-order-delight-api" service
3. Go to the "Environment" tab
4. Find the `MONGODB_URI` environment variable
5. Update its value to the correct format with database name:
   ```
   mongodb+srv://23r11a05j1:UN8rMW9ZH9fhCQxQ@cluster0.bgrefss.mongodb.net/tasty_order_delight?retryWrites=true&w=majority
   ```
6. Click "Save Changes"

## Step 3: Redeploy Your Service

1. After saving the environment variables, go to the "Manual Deploy" section
2. Click "Deploy latest commit"
3. Wait for the deployment to complete

## Step 4: Verify the Connection

1. Once the deployment is complete, go to the "Logs" tab
2. Look for messages indicating a successful MongoDB connection
3. If you see "Connected to MongoDB" in the logs, the connection is working

## Troubleshooting

If you still encounter connection issues:

1. **Check MongoDB Atlas Network Access**:
   - Log in to MongoDB Atlas
   - Go to "Network Access" under Security
   - Ensure `0.0.0.0/0` is in the allowed IP addresses list

2. **Verify Database User**:
   - Go to "Database Access" under Security
   - Confirm the user "23r11a05j1" exists with the correct password
   - Check that the user has appropriate permissions

3. **Run Diagnostic Tool**:
   - If issues persist, run the diagnostic tool in your Render service:
   ```bash
   cd server && node diagnose-mongodb.js
   ```

## Need More Help?

If you continue to experience issues, refer to the `FIX_MONGODB_CONNECTION.md` file for more detailed troubleshooting steps.