#!/usr/bin/env pwsh
# Swasth AI - Automated Startup Script
# Run this in PowerShell to start both frontend and backend

Write-Host "🚀 Swasth AI - Application Startup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "  Found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js not found! Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if npm dependencies are installed
Write-Host "✓ Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "  Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
}
if (!(Test-Path "backend/node_modules")) {
    Write-Host "  Installing backend dependencies..." -ForegroundColor Cyan
    cd backend
    npm install
    cd ..
}
Write-Host "  ✓ Dependencies ready" -ForegroundColor Green

# Check environment files
Write-Host "✓ Checking configuration..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Write-Host "  Creating .env.local..." -ForegroundColor Cyan
    @"
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Swasth AI
VITE_LOG_LEVEL=info
"@ | Out-File ".env.local"
}
if (!(Test-Path "backend/.env")) {
    Write-Host "  Creating backend/.env..." -ForegroundColor Cyan
    @"
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
JWT_SECRET=dev-secret-key
OPENAI_API_KEY=sk-your-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
"@ | Out-File "backend/.env"
}
Write-Host "  ✓ Configuration ready" -ForegroundColor Green

# Start servers
Write-Host ""
Write-Host "🎯 Starting servers..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Start frontend in a new window
Write-Host "▶ Starting Frontend (Vite)..."  -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm run dev" -WorkingDirectory $PSScriptRoot

# Start backend in a new window  
Write-Host "▶ Starting Backend (Express)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WorkingDirectory $PSScriptRoot

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Servers starting in new windows..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend URL: http://localhost:3000 (or 3001/3002)" -ForegroundColor Cyan
Write-Host "🔌 Backend URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop servers" -ForegroundColor Yellow
Write-Host ""
