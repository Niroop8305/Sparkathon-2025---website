#!/bin/bash

# Quick Deployment Script for Sparkathon Project
# Run this script to prepare your project for deployment

echo "🚀 Preparing Sparkathon Project for Deployment..."

# Check if we're in the right directory
if [ ! -d "Sparkathon_Backend" ] || [ ! -d "Sparkathon_frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd Sparkathon_Backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd Sparkathon_frontend
npm install
cd ..

echo "🔧 Building frontend for production..."
cd Sparkathon_frontend
npm run build
cd ..

echo "✅ Project prepared for deployment!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Railway: https://railway.app"
echo "2. Deploy frontend to Vercel: https://vercel.com"
echo "3. Update VITE_API_URL in Vercel with your Railway backend URL"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
