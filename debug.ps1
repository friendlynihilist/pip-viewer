Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  TEI-IIIF Viewer - Diagnostics" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Checking Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java NOT found" -ForegroundColor Red
    Write-Host "   Please install Java 11+ from https://adoptium.net/" -ForegroundColor Red
}
Write-Host ""

Write-Host "2. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js NOT found" -ForegroundColor Red
}
Write-Host ""

Write-Host "3. Checking if Cantaloupe JAR exists..." -ForegroundColor Yellow
if (Test-Path "cantaloupe\cantaloupe-5.0.6\cantaloupe-5.0.6.jar") {
    Write-Host "✓ Cantaloupe JAR found" -ForegroundColor Green
} else {
    Write-Host "❌ Cantaloupe JAR NOT found" -ForegroundColor Red
    Write-Host "   Run .\setup.ps1 to download it" -ForegroundColor Red
}
Write-Host ""

Write-Host "4. Checking if frontend dependencies are installed..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend dependencies NOT installed" -ForegroundColor Red
    Write-Host "   Run .\setup.ps1 to install them" -ForegroundColor Red
}
Write-Host ""

Write-Host "5. Checking for images..." -ForegroundColor Yellow
$imageCount = (Get-ChildItem -Path "cantaloupe\images\*.jpg" -ErrorAction SilentlyContinue).Count
if ($imageCount -gt 0) {
    Write-Host "✓ Found $imageCount images" -ForegroundColor Green
} else {
    Write-Host "⚠️  No images found in cantaloupe\images\" -ForegroundColor Yellow
    Write-Host "   Run .\create-sample-images.ps1 for test images" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "6. Checking if services are running..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Checking Cantaloupe (port 8182)..." -ForegroundColor Yellow
$cantaloupe = Get-NetTCPConnection -LocalPort 8182 -ErrorAction SilentlyContinue
if ($cantaloupe) {
    Write-Host "   ✓ Cantaloupe is running" -ForegroundColor Green
} else {
    Write-Host "   ❌ Cantaloupe is NOT running" -ForegroundColor Red
}
Write-Host ""

Write-Host "   Checking Frontend (port 5173)..." -ForegroundColor Yellow
$frontend = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($frontend) {
    Write-Host "   ✓ Frontend is running on port 5173" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Frontend is NOT running on port 5173" -ForegroundColor Yellow
    Write-Host "   (May be using a different port - check start output)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "7. Testing Cantaloupe connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8182/" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Cantaloupe responds correctly" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Cantaloupe is not responding" -ForegroundColor Red
    Write-Host "   Make sure it's running" -ForegroundColor Red
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Diagnostics Complete" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
