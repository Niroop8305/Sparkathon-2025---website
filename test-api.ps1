# Test Railway Backend API Endpoints

$baseUrl = "https://sparkathon-2025-website-production.up.railway.app"

Write-Host "Testing Railway Backend API..." -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Test 1: Root health check
Write-Host "`n1. Testing root endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    Write-Host "✅ Root endpoint working!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Root endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: API health check
Write-Host "`n2. Testing API health endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET
    Write-Host "✅ API health endpoint working!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ API health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Auth login endpoint structure (should return 400 with no body)
Write-Host "`n3. Testing auth login endpoint structure..." -ForegroundColor Cyan
try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    $body = @{} | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "✅ Login endpoint accessible!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Login endpoint accessible (returned 400 as expected for empty body)" -ForegroundColor Green
    } else {
        Write-Host "❌ Login endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 4: Test with sample credentials (will likely fail but shows endpoint works)
Write-Host "`n4. Testing login with sample credentials..." -ForegroundColor Cyan
try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    $loginData = @{
        email = "test@example.com"
        password = "testpassword"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Headers $headers -Body $loginData -ErrorAction Stop
    Write-Host "✅ Login successful (unexpected but good!)" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Login endpoint working (returned 400 for invalid credentials)" -ForegroundColor Green
    } else {
        Write-Host "❌ Login failed with unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`n=================================" -ForegroundColor Yellow
Write-Host "API Testing Complete!" -ForegroundColor Yellow
