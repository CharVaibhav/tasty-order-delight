#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying The Digital Diner Frontend to Netlify..."

# Build frontend
echo "📦 Building frontend..."
npm run build

echo "✅ Build complete!"
echo "📁 The built files are in the 'dist' directory"
echo ""
echo "To deploy to Netlify:"
echo "1. Create an account on https://www.netlify.com/"
echo "2. Connect your GitHub repository to Netlify"
echo "3. Set the build command to: npm run build"
echo "4. Set the publish directory to: dist"
echo "5. Add environment variables:"
echo "   - VITE_API_URL: Your backend API URL (e.g., https://your-backend.herokuapp.com/api)"
echo ""
echo "Alternatively, you can use the Netlify CLI:"
echo "1. Install Netlify CLI: npm install -g netlify-cli"
echo "2. Login to Netlify: netlify login"
echo "3. Deploy: netlify deploy --dir=dist --prod" 