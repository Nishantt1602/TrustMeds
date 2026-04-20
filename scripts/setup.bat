@echo off
REM TrustMeds Setup Script for Windows
REM Automated setup for development environment

echo.
echo ========================================
echo   TrustMeds Setup Script
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION%

REM Setup Backend
echo.
echo Setting up Backend...
cd backend

if not exist ".env" (
    copy .env.example .env
    echo [OK] Created .env
    echo [WARNING] Edit backend\.env with your MongoDB URI
) else (
    echo [OK] .env exists
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

cd ..

REM Setup Frontend
echo.
echo Setting up Frontend...
cd frontend

if not exist ".env" (
    copy .env.example .env
    echo [OK] Created .env
) else (
    echo [OK] .env exists
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

cd ..

REM Summary
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend ^&^& npm run dev
echo.
echo 2. Start Frontend (Terminal 2):
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:5173
echo.
echo ========================================
echo.
pause
