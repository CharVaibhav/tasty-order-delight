# Updating Your Render.com Deployment

Follow these steps to update your Render.com deployment with the latest changes:

## Step 1: Push Your Changes to Git

First, commit and push your changes to your Git repository:

```bash
git add .
git commit -m "Improved server resilience and MongoDB connection"
git push
```

## Step 2: Manual Deployment on Render.com

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Navigate to your `tasty-order-delight-api` service
3. Click on "Manual Deploy" > "Deploy latest commit"
4. Wait for the deployment to complete

## Step 3: Monitor the Deployment

1. Click on "Logs" to watch the deployment process
2. Look for any errors during the build and startup
3. Verify that the server connects to MongoDB successfully
4. Check for the "Your service is live 🎉" message

## Step 4: Update Environment Variables (If Needed)

1. Click on "Environment" in your service dashboard
2. Update the following variables if needed:
   - `FRONTEND_URL`: Set to `https://digital-diner.netlify.app`
   - `MONGODB_URI`: Verify your MongoDB connection string
   - `JWT_SECRET`: Ensure this is set to a secure random string
3. Click "Save Changes" if you made any updates
4. This will trigger a new deployment automatically

## Step 5: Test Your API

After the deployment is complete, run the diagnostic script to test your API:

```bash
node diagnose-api.js
```

## Step 6: Wake Up the Service

If your service is on a free tier, it will sleep after inactivity. To wake it up:

1. Visit your API URL in a browser: `https://tasty-order-delight-api.onrender.com`
2. Or run the diagnostic script: `node diagnose-api.js`
3. Wait for about 30-60 seconds for the service to fully wake up

## Troubleshooting

If you encounter issues:

### 1. Deployment Fails

- Check the build logs for errors
- Verify that your `package.json` files are correctly set up
- Make sure all dependencies are listed in your `package.json`

### 2. Service Starts But Then Crashes

- Check the logs for any errors
- Verify that your MongoDB connection is working
- Make sure your server is handling errors properly

### 3. Service Sleeps Too Quickly

- Free tier services on Render.com sleep after inactivity
- Consider upgrading to a paid plan for production use
- Use a service like UptimeRobot to ping your API regularly

### 4. CORS Issues

- Verify that your CORS configuration includes your frontend URL
- Check that your frontend is sending the correct Origin header

## Need More Help?

If you're still experiencing issues:

1. Check the Render.com documentation
2. Review your server logs for specific errors
3. Consider reaching out to Render.com support