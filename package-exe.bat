@echo off
echo =========================================
echo    MasterPlanner - Packaging Tool
echo =========================================
echo.

echo [Info] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [Error] Failed to install dependencies. Check your network or Node.js installation.
    pause
    exit /b
)

echo [Info] Building and packaging into .exe...
echo [Info] This might take a few minutes. Please wait!
call npm run build:exe

if %errorlevel% neq 0 (
    echo [Error] Packaging failed. Check the error output above.
    pause
    exit /b
)

echo.
echo [Success] Packaging complete!
echo You can find your .exe installer in the "release" folder.
echo.
pause
