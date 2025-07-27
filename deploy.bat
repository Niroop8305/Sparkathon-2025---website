@echo off
echo 🚀 Preparing Sparkathon Project for Deployment...

REM Check if we're in the right directory
if not exist "Sparkathon_Backend" (
    echo ❌ Please run this script from the project root directory
    exit /b 1
)
if not exist "Sparkathon_frontend" (
    echo ❌ Please run this script from the project root directory
    exit /b 1
)

echo 📦 Installing dependencies...

REM Install backend dependencies
echo Installing backend dependencies...
cd Sparkathon_Backend
call npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd Sparkathon_frontend
call npm install
cd ..

echo 🔧 Building frontend for production...
cd Sparkathon_frontend
call npm run build
cd ..

echo ✅ Project prepared for deployment!
echo.
echo Next steps:
echo 1. Deploy backend to Railway: https://railway.app
echo 2. Deploy frontend to Vercel: https://vercel.com
echo 3. Update VITE_API_URL in Vercel with your Railway backend URL
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions

pause
