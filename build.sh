#!/bin/bash

# Build script for Netlify deployment
echo "🚀 Starting build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Go to client directory and install dependencies
echo "📦 Installing client dependencies..."
cd client && npm install

# Build React app in client directory
echo "🔨 Building React app..."
npm run build

# Move build folder to root directory
echo "📁 Moving build to root directory..."
mv build ../build

echo "✅ Build completed! Files are in build/ (root directory)"
