# Deployment Guide

This guide explains how to deploy the Tasty Order Delight application to production.

## Frontend Deployment (Netlify)

1. Push your code to a GitHub repository.

2. Log in to [Netlify](https://www.netlify.com/) and create a new site from your GitHub repository.

3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. Add the following environment variables in the Netlify dashboard:
   - `VITE_API_URL`: Your backend API URL (e.g., https://tasty-order-delight-api.onrender.com)

5. Deploy the site.

## Backend Deployment (Render.com)

1. Create a new account on [Render.com](https://render.com/) if you don't have one.

2. Create a new Web Service:
   - Connect your GitHub repository
   - Select the `server` directory as the root directory
   - Set the build command: `npm install`
   - Set the start command: `node index.js`
   - Select the free plan

3. Add the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `FRONTEND_URL`: Your Netlify frontend URL (e.g., https://tasty-order-delight.netlify.app)
   - `NODE_ENV`: Set to `production`

4. Deploy the service.

## MongoDB Atlas Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account if you don't have one.

2. Create a new cluster (the free tier is sufficient for development).

3. Create a database user with read/write permissions.

4. Add your IP address to the IP Access List or allow access from anywhere (for testing only).

5. Get your connection string from the "Connect" button and replace `<password>` with your database user's password.

6. Use this connection string as the `MONGODB_URI` environment variable in your backend deployment.

## Testing the Deployment

1. After deploying both the frontend and backend, visit your Netlify URL.

2. Try to sign up for a new account and log in.

3. Test the checkout process to ensure everything is working correctly.

## Troubleshooting

- If you encounter CORS errors, make sure your backend's CORS configuration includes your Netlify domain.
- Check the Netlify and Render.com logs for any deployment errors.
- Verify that all environment variables are set correctly.