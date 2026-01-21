Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  TEI-IIIF Viewer - Diagnostics" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Checking Java..." -ForegroundColor Yellow
$javaCheck = Get-Command java -ErrorAction SilentlyContinue
if ($javaCheck) {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "OK Java found: $javaVersion" -ForegroundColor Green
}
else {
    Write-Host "ERROR Java NOT found" -ForegroundColor Red
    Write-Host "   Please install Java 11+ from https://adoptium.net/" -ForegroundColor Red
}
Write-Host ""

Write-Host "2. Checking Node.js..." -ForegroundColor Yellow
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCheck) {
    $nodeVersion = node --version
    Write-Host "OK Node.js found: $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "ERROR Node.js NOT found" -ForegroundColor Red
}
Write-Host ""

Write-Host "3. Checking if Cantaloupe JAR exists..." -ForegroundColor Yellow
if (Test-Path "cantaloupe\cantaloupe-5.0.6\cantaloupe-5.0.6.jar") {
    Write-Host "OK Cantaloupe JAR found" -ForegroundColor Green
}
else {
    Write-Host "ERROR Cantaloupe JAR NOT found" -ForegroundColor Red
    Write-Host "   Need to download Cantaloupe manually or run setup" -ForegroundColor Red
}
Write-Host ""

Write-Host "4. Checking if frontend dependencies are installed..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "OK Frontend dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "ERROR Frontend dependencies NOT installed" -ForegroundColor Red
    Write-Host "   Run: cd frontend; npm install" -ForegroundColor Red
}
Write-Host ""

Write-Host "5. Checking for images..." -ForegroundColor Yellow
$imageCount = (Get-ChildItem -Path "cantaloupe\images\*.jpg" -ErrorAction SilentlyContinue).Count
if ($imageCount -gt 0) {
    Write-Host "OK Found $imageCount images" -ForegroundColor Green
}
else {
    Write-Host "WARNING No images found in cantaloupe\images\" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "6. Checking if Cantaloupe is responding..." -ForegroundColor Yellow
$ErrorActionPreference = 'SilentlyContinue'
$response = Invoke-WebRequest -Uri "http://localhost:8182/" -UseBasicParsing -TimeoutSec 2
$ErrorActionPreference = 'Continue'

if ($response -and $response.StatusCode -eq 200) {
    Write-Host "OK Cantaloupe is running and responding" -ForegroundColor Green
}
else {
    Write-Host "ERROR Cantaloupe is NOT responding on port 8182" -ForegroundColor Red
    Write-Host "   This is the main problem - Cantaloupe needs to be running" -ForegroundColor Red
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Diagnostics Complete" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
