#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Netlify build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  // Ensure TypeScript is available
  console.log('Ensuring TypeScript is available...');
  execSync('npm install typescript --no-save', { stdio: 'inherit' });
  
  // Install additional dependencies that might be needed
  console.log('Installing additional dependencies...');
  execSync('npm install react-router-dom@latest @tanstack/react-query@latest framer-motion@latest react-fast-marquee@latest --legacy-peer-deps', { stdio: 'inherit' });
  
  // Skip TypeScript compilation for Netlify build
  console.log('Building with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Ensure _redirects file exists for SPA routing
  console.log('Creating _redirects file for SPA routing...');
  const redirectsPath = path.join(process.cwd(), 'dist', '_redirects');
  fs.writeFileSync(redirectsPath, '/* /index.html 200');
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}