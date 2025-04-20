# Deploying Tasty Order Delight Backend API to Render

This guide will walk you through deploying the Tasty Order Delight backend API to Render while keeping your frontend on Netlify.

## Prerequisites

1. A [Render](https://render.com/) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or any MongoDB provider
3. Your project code in a Git repository (GitHub, GitLab, etc.)
4. Frontend already deployed on Netlify

## Deployment Steps

### 1. Set Up MongoDB

1. Create a MongoDB Atlas cluster if you don't have one already
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) or just Render's IPs
4. Get your MongoDB connection string

### 2. Deploy Backend to Render

#### Option 1: Using the Render Dashboard

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - Name: `tasty-order-delight-api`
   - Environment: `Node`
   - Branch: `main` (or your default branch)
   - Root Directory: Leave empty
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Plan: Free (or select a paid plan for production)
5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB connection string (make sure it's correctly formatted)
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `FRONTEND_URL`: Your Netlify frontend URL (e.g., `https://tasty-order-delight.netlify.app`)
6. Click "Create Web Service"

#### Option 2: Using the Render YAML Configuration

1. Push the `render.yaml` file to your Git repository
2. Log in to your Render account
3. Click on "New" and select "Blueprint"
4. Connect your Git repository
5. Render will automatically detect the `render.yaml` file and create the services
6. Add the secret environment variables that were marked with `sync: false` in the YAML file:
   - `MONGODB_URI`: Your MongoDB connection string (make sure it's correctly formatted)
   - `JWT_SECRET`: A secure random string for JWT token generation

#### Important Notes About MongoDB Connection String

When setting up your MongoDB connection string, ensure:

1. The format is correct: `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`
2. Special characters in your password are URL encoded
3. The database name is explicitly included in the connection string
4. Your MongoDB Atlas cluster allows connections from anywhere (IP address: `0.0.0.0/0`)
5. The database user has the correct permissions (at least "readWrite" on your database)

### 3. Update Frontend Configuration on Netlify

After your backend API is deployed on Render, you need to update your frontend to use the new API URL:

1. Go to your Netlify dashboard
2. Navigate to your site's settings
3. Go to "Build & deploy" > "Environment variables"
4. Add or update the `VITE_API_URL` environment variable with your Render API URL (e.g., `https://tasty-order-delight-api.onrender.com`)
5. Trigger a new deployment of your Netlify site

### 4. Configure CORS on Backend

Make sure your backend allows requests from your Netlify frontend:

1. The server is already configured to accept requests from Netlify domains
2. If you're using a custom domain, add it to the `allowedOrigins` array in `server/index.js`

### 5. Verify Deployment

1. Wait for both deployments to complete
2. Visit your Netlify frontend URL
3. Test the functionality that requires backend API calls
4. Check the browser console for any CORS or connection errors

## Troubleshooting

If you encounter issues:

1. Check the Render logs for any backend errors
2. Verify your environment variables are set correctly on both Netlify and Render
3. Ensure your MongoDB connection string is correct and the database is accessible
4. Check if your backend is listening on the correct port (should be `process.env.PORT`)
5. Verify that CORS is properly configured to allow requests from your Netlify domain

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)