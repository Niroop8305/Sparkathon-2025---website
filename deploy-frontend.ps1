# Vercel Deployment Script

Write-Host "Deploying Frontend to Vercel..." -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Change to frontend directory
Set-Location "Sparkathon_frontend"

# Show current environment configuration
Write-Host "`nCurrent environment configuration:" -ForegroundColor Cyan
if (Test-Path ".env.production") {
    Write-Host "✅ .env.production found:" -ForegroundColor Green
    Get-Content ".env.production"
} else {
    Write-Host "❌ .env.production not found!" -ForegroundColor Red
}

Write-Host "`nDeployment options:" -ForegroundColor Cyan
Write-Host "1. Deploy using Vercel CLI (recommended)" -ForegroundColor White
Write-Host "2. Push to GitHub and let Vercel auto-deploy" -ForegroundColor White

$choice = Read-Host "`nChoose option (1 or 2)"

if ($choice -eq "1") {
    Write-Host "`nChecking Vercel CLI..." -ForegroundColor Cyan
    
    # Check if Vercel CLI is installed
    try {
        $vercelVersion = vercel --version
        Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
        
        Write-Host "`nDeploying to production..." -ForegroundColor Cyan
        vercel --prod
        
    } catch {
        Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
        npm install -g vercel
        
        Write-Host "`nPlease login to Vercel:" -ForegroundColor Cyan
        vercel login
        
        Write-Host "`nDeploying to production..." -ForegroundColor Cyan
        vercel --prod
    }
    
} elseif ($choice -eq "2") {
    Write-Host "`nCommitting changes and pushing to GitHub..." -ForegroundColor Cyan
    
    # Go back to root directory
    Set-Location ".."
    
    # Add, commit, and push
    git add .
    git commit -m "Fix: Update API URL for production deployment"
    git push origin main
    
    Write-Host "✅ Changes pushed to GitHub. Vercel will auto-deploy." -ForegroundColor Green
    Write-Host "Check your Vercel dashboard for deployment status." -ForegroundColor Yellow
    
} else {
    Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
}

Write-Host "`n=================================" -ForegroundColor Yellow
Write-Host "Deployment script complete!" -ForegroundColor Yellow
