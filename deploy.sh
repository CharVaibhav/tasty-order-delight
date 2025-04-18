#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying The Digital Diner..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Build backend
echo "📦 Building backend..."
npm run build:server

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Not logged in to Heroku. Please run 'heroku login' first."
    exit 1
fi

# Check if Heroku app exists
if ! heroku apps:info the-digital-diner-api &> /dev/null; then
    echo "❌ Heroku app 'the-digital-diner-api' does not exist. Creating..."
    heroku create the-digital-diner-api
fi

# Add MongoDB add-on if not already added
if ! heroku addons:info mongolab --app the-digital-diner-api &> /dev/null; then
    echo "➕ Adding MongoDB add-on..."
    heroku addons:create mongolab --app the-digital-diner-api
fi

# Add PostgreSQL add-on if not already added
if ! heroku addons:info heroku-postgresql --app the-digital-diner-api &> /dev/null; then
    echo "➕ Adding PostgreSQL add-on..."
    heroku addons:create heroku-postgresql:mini --app the-digital-diner-api
fi

# Set environment variables
echo "🔧 Setting environment variables..."
heroku config:set NODE_ENV=production --app the-digital-diner-api

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git push heroku main

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://the-digital-diner.netlify.app"
echo "🌐 Backend: https://the-digital-diner-api.herokuapp.com" 