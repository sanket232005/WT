@echo off
echo =======================================
echo     Starting Dairy Manager Project      
echo =======================================

echo.
echo [1/2] Installing dependencies (if needed)...
call npm install

echo.
echo [2/2] Starting Express Server...
call npm run dev

pause
