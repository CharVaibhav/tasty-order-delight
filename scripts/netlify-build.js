#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Starting Netlify build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  // Ensure TypeScript is available
  console.log('Ensuring TypeScript is available...');
  execSync('npm install typescript --no-save', { stdio: 'inherit' });
  
  // Skip TypeScript compilation for Netlify build
  console.log('Building with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}