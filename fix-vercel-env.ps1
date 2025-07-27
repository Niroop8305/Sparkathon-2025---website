# Quick Vercel Environment Variable Fix

Write-Host "🔧 Fixing Vercel Environment Variable..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

$CORRECT_API_URL = "https://sparkathon-2025-website-production.up.railway.app/api"

Write-Host "`n📋 Manual Setup Instructions (Required):" -ForegroundColor Cyan
Write-Host "1. Open: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Select your Sparkathon project" -ForegroundColor White
Write-Host "3. Go to: Settings → Environment Variables" -ForegroundColor White
Write-Host "4. Look for existing VITE_API_URL and delete it if found" -ForegroundColor Yellow
Write-Host "5. Add new environment variable:" -ForegroundColor White
Write-Host "   📝 Name: VITE_API_URL" -ForegroundColor Green
Write-Host "   🔗 Value: $CORRECT_API_URL" -ForegroundColor Green
Write-Host "   🎯 Environment: Production (and Preview if you want)" -ForegroundColor Green
Write-Host "6. Click 'Save'" -ForegroundColor White
Write-Host "7. Go to Deployments tab and click 'Redeploy' on the latest deployment" -ForegroundColor White

Write-Host "`n🚀 Alternative: Push changes to trigger auto-deploy" -ForegroundColor Cyan
$deploy = Read-Host "Do you want to commit and push changes now? (y/n)"

if ($deploy.ToLower() -eq "y" -or $deploy.ToLower() -eq "yes") {
    Write-Host "`n📤 Committing and pushing changes..." -ForegroundColor Cyan
    git add .
    git commit -m "Fix: Remove env from vercel.json, add fallback URL and debug logging"
    git push origin main
    
    Write-Host "`n✅ Changes pushed!" -ForegroundColor Green
    Write-Host "🔄 Vercel will auto-deploy, but you still need to set the environment variable manually." -ForegroundColor Yellow
}

Write-Host "`n⚠️  IMPORTANT:" -ForegroundColor Red
Write-Host "The environment variable MUST be set in Vercel dashboard for this to work!" -ForegroundColor Red
Write-Host "The fallback URL will work temporarily, but setting the env var is the proper solution." -ForegroundColor Yellow

Write-Host "`n========================================" -ForegroundColor Yellow
