#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  // Try to run tsc --version to check if TypeScript is installed
  execSync('npx tsc --version', { stdio: 'inherit' });
  console.log('TypeScript is already installed.');
} catch (error) {
  console.log('TypeScript is not installed. Installing...');
  try {
    // Install TypeScript globally
    execSync('npm install -g typescript', { stdio: 'inherit' });
    console.log('TypeScript installed successfully.');
  } catch (installError) {
    console.error('Failed to install TypeScript globally:', installError);
    process.exit(1);
  }
}