@echo off
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo May chua co Node.js. Dang tu dong tai va cai dat...
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    echo Cai dat xong! Hay tat cua so nay va double-click lai file bat de chay app.
    pause
    exit
)

cd /d "%~dp0"
if not exist "node_modules" (
    echo Dang cai dat thu vien lan dau cho Phan B...
    call npm install
)
call npm run dev -- --open
pause