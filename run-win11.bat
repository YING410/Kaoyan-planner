@echo off
echo =========================================
echo    MasterPlanner - Local Launcher
echo =========================================
echo.

:: Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [Error] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b
)

echo [Info] Node.js is installed.
echo.

:: Check dependencies
if not exist node_modules\ (
    echo [Info] First time setup. Installing dependencies...
    echo [Info] This may take a minute or two.
    call npm install
    echo [Success] Dependencies installed.
    echo.
) else (
    echo [Info] Dependencies ready.
    echo.
)

echo [Info] Starting local server...
echo [Info] Your browser should open automatically.
echo [Info] If not, please open http://localhost:5173 manually.
echo.

:: 稍微延迟一下确保服务器准备好然后再打开浏览器
start "" "http://localhost:5173"

:: 运行项目
call npm run dev

pause
