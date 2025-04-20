# Fix MongoDB Connection Issues in Render

Follow this step-by-step guide to resolve MongoDB connection issues when deploying to Render.

## Step 1: Run the MongoDB Diagnostic Tool

This tool will help identify the exact issue with your MongoDB connection.

```bash
# Navigate to your server directory
cd server

# Run the diagnostic tool
node diagnose-mongodb.js
```

Review the output for specific errors and recommendations.

## Step 2: Fix Your MongoDB Connection String

Use the connection string fixer tool to correct common issues:

```bash
# Run the connection string fixer
node fix-mongodb-uri.js
```

This tool will:
- Check if your password needs URL encoding
- Verify if a database name is specified
- Test the connection with the fixed string

## Step 3: Update Your MongoDB Atlas Settings

1. **Check Network Access**:
   - Log in to MongoDB Atlas
   - Go to "Network Access" under Security
   - Add entry `0.0.0.0/0` to allow connections from anywhere
   - Click "Confirm"

2. **Verify Database User**:
   - Go to "Database Access" under Security
   - Check if your user exists with the correct username
   - Ensure the user has appropriate permissions (at least "readWrite")
   - Consider creating a new database user:
     - Click "Add New Database User"
     - Authentication Method: Password
     - Password: Use a simple password without special characters
     - Database User Privileges: "Atlas admin" or at least "readWrite" on your database
     - Click "Add User"

## Step 4: Update Environment Variables in Render

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Update the `MONGODB_URI` variable with the fixed connection string
5. Click "Save Changes"
6. Click "Manual Deploy" > "Deploy latest commit"

## Step 5: Monitor Deployment Logs

1. After triggering a new deployment, click on "Logs"
2. Watch for any MongoDB connection errors
3. If you see "Connected to MongoDB" message, the issue is resolved

## Common Issues and Solutions

### Authentication Failed

If you see `MongoServerError: bad auth : Authentication failed`:

1. **Check credentials**: Verify username and password in MongoDB Atlas
2. **URL encode password**: Ensure special characters are properly encoded
3. **Create new user**: Try creating a new database user with a simple password

### Cannot Reach Server

If you see `MongoServerSelectionError: connection <monitor> to <server> timed out`:

1. **Network access**: Ensure `0.0.0.0/0` is added to allowed IP addresses
2. **Cluster status**: Verify your MongoDB Atlas cluster is running
3. **Region**: Check if your MongoDB Atlas cluster is in a region with connectivity issues

### Missing Database Name

If your connection works but you see errors accessing collections:

1. **Add database name**: Ensure your connection string includes a database name
2. **Example**: `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`

## Need More Help?

If you're still experiencing issues after following these steps, consider:

1. Temporarily using a different MongoDB provider for testing
2. Creating a new MongoDB Atlas cluster
3. Checking MongoDB Atlas status page for service issues