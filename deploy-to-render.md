# Deploying to Render.com - Step by Step Guide

This guide will help you deploy your Tasty Order Delight API to Render.com.

## Prerequisites

1. A [Render](https://render.com/) account
2. Your MongoDB Atlas connection string
3. Your project code in a Git repository (GitHub, GitLab, etc.)

## Step 1: Prepare Your Project

Make sure your project is ready for deployment:

1. Ensure your MongoDB connection is working locally
2. Verify that your server code is in the `server` directory
3. Check that your `package.json` files are correctly set up

## Step 2: Deploy to Render.com

### Option 1: Using the Render Dashboard (Recommended)

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click on "New" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `tasty-order-delight-api`
   - **Environment**: `Node`
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or select a paid plan for production)
5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://digital-diner.netlify.app`)
6. Click "Create Web Service"

### Option 2: Using the Render YAML Configuration

1. Make sure your `render.yaml` file is up to date
2. Log in to your Render account
3. Click on "New" and select "Blueprint"
4. Connect your Git repository
5. Render will automatically detect the `render.yaml` file and create the services
6. Add the secret environment variables that were marked with `sync: false` in the YAML file

## Step 3: Monitor Deployment

1. After triggering a deployment, click on "Logs"
2. Watch for any errors during the build and startup process
3. Pay special attention to MongoDB connection errors

## Step 4: Test Your Deployed API

1. Wait for the deployment to complete
2. Run the `diagnose-api.js` script to test your API endpoints
3. If the service is on a free tier, it may take a minute to wake up

```bash
node diagnose-api.js
```

## Step 5: Update Your Frontend

After your backend API is deployed on Render, update your frontend to use the new API URL:

1. Update your frontend code to use the Render.com API URL
2. If you're using environment variables, update `VITE_API_URL` or similar to point to your Render API

## Troubleshooting

If you encounter issues:

### 1. Service Not Starting

- Check the Render logs for any errors
- Verify that your MongoDB connection string is correct
- Make sure your start command is correct (`cd server && npm start`)

### 2. MongoDB Connection Issues

- Check if your MongoDB Atlas cluster is running
- Verify that your MongoDB connection string is correctly formatted
- Ensure your MongoDB Atlas cluster allows connections from anywhere (IP address: `0.0.0.0/0`)
- Check if your MongoDB Atlas user has the correct permissions

### 3. CORS Issues

- Make sure your CORS configuration includes your frontend URL
- Check that your frontend is sending the correct Origin header

### 4. Service Sleeping

- Free tier Render services sleep after inactivity
- The first request after a period of inactivity will take longer to respond
- Consider upgrading to a paid plan for production use

## Need More Help?

If you're still experiencing issues after following these steps, consider:

1. Checking the Render.com documentation
2. Looking at the MongoDB Atlas documentation
3. Reviewing your server logs for specific errors