# Vercel Environment Variables Setup Script

Write-Host "Setting up Vercel Environment Variables..." -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

$API_URL = "https://sparkathon-2025-website-production.up.railway.app/api"

Write-Host "`nYour Railway API URL: $API_URL" -ForegroundColor Cyan

Write-Host "`nVercel Environment Variable Setup Options:" -ForegroundColor White
Write-Host "1. Use Vercel CLI (Recommended)" -ForegroundColor Green
Write-Host "2. Manual setup via Vercel Dashboard" -ForegroundColor Yellow

$choice = Read-Host "`nChoose option (1 or 2)"

if ($choice -eq "1") {
    Write-Host "`nSetting up environment variable via Vercel CLI..." -ForegroundColor Cyan
    
    # Change to frontend directory
    Set-Location "Sparkathon_frontend"
    
    try {
        # Check if Vercel CLI is available
        $vercelVersion = vercel --version
        Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
        
        # Add environment variable
        Write-Host "`nAdding VITE_API_URL environment variable..." -ForegroundColor Cyan
        vercel env add VITE_API_URL production
        Write-Host "When prompted, enter: $API_URL" -ForegroundColor Yellow
        
        # Trigger a new deployment
        Write-Host "`nTriggering new deployment..." -ForegroundColor Cyan
        vercel --prod
        
    } catch {
        Write-Host "❌ Vercel CLI not found. Please install it first:" -ForegroundColor Red
        Write-Host "npm install -g vercel" -ForegroundColor Yellow
        Write-Host "Then run this script again." -ForegroundColor Yellow
    }
    
} elseif ($choice -eq "2") {
    Write-Host "`nManual Setup Instructions:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Select your project (Sparkathon frontend)" -ForegroundColor White
    Write-Host "3. Go to Settings → Environment Variables" -ForegroundColor White
    Write-Host "4. Add a new environment variable:" -ForegroundColor White
    Write-Host "   Name: VITE_API_URL" -ForegroundColor Green
    Write-Host "   Value: $API_URL" -ForegroundColor Green
    Write-Host "   Environment: Production" -ForegroundColor Green
    Write-Host "5. Save and redeploy your project" -ForegroundColor White
    
    Write-Host "`nThen commit and push the updated vercel.json:" -ForegroundColor Cyan
    Set-Location ".."
    git add .
    git commit -m "Fix: Add environment variable to vercel.json and debug API config"
    git push origin main
    
    Write-Host "✅ Changes pushed. Vercel will auto-deploy with the new configuration." -ForegroundColor Green
    
} else {
    Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
}

Write-Host "`n==========================================" -ForegroundColor Yellow
Write-Host "Environment setup complete!" -ForegroundColor Yellow
Write-Host "`nAfter deployment, check the browser console for debug logs." -ForegroundColor Cyan
