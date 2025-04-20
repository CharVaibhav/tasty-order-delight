# Deploying the Backend API to Render

This README provides a quick guide to deploying the Tasty Order Delight backend API to Render.

## Quick Start

1. **Create a Render account** at [render.com](https://render.com)

2. **Deploy the backend API**:
   - Go to the Render dashboard
   - Click "New" and select "Web Service"
   - Connect your Git repository
   - Select "Docker" as the environment
   - Set the name to "tasty-order-delight-api"
   - Set the plan to "Free" (or choose a paid plan for production)
   - Add the required environment variables (see below)
   - Click "Create Web Service"

3. **Set environment variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `FRONTEND_URL`: Your Netlify frontend URL (e.g., `https://tasty-order-delight.netlify.app`)

4. **Update your Netlify frontend**:
   - Go to your Netlify dashboard
   - Navigate to your site's settings
   - Go to "Build & deploy" > "Environment variables"
   - Set `VITE_API_URL` to your Render API URL (e.g., `https://tasty-order-delight-api.onrender.com`)
   - Trigger a new deployment

## Files for Render Deployment

This repository includes the following files for Render deployment:

- `Dockerfile`: Configures the Docker container for the backend API
- `render.yaml`: Defines the Render service configuration
- `RENDER_DEPLOYMENT.md`: Detailed deployment instructions

## Need More Help?

For more detailed instructions, see the [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) file.