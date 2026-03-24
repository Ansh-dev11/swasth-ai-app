@echo off
REM Swasth AI - Run Frontend and Backend Together

echo.
echo ============================================
echo   Starting Swasth AI Development Servers
echo ============================================
echo.

echo Starting Backend Server on port 5000...
start "Swasth AI Backend" cmd /k "cd backend && npm run dev"

timeout /t 3

echo Starting Frontend Server on port 3000...
start "Swasth AI Frontend" cmd /k "npm run dev"

timeout /t 3

echo.
echo ============================================
echo   Servers Started:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:5000
echo ============================================
echo.
echo Open your browser to http://localhost:3000
echo Press Ctrl+C in each terminal to stop
pause
