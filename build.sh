#!/bin/bash

# Exit on error
set -e

echo "🚀 Building Tasty Order Delight..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Verify dist directory exists
if [ ! -d "dist" ]; then
  echo "❌ Build failed: dist directory not found"
  exit 1
fi

echo "✅ Build complete!"
echo "📁 The built files are in the 'dist' directory" 