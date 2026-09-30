@echo off
title FinCore Banking Platform - React Frontend
echo ========================================================
echo    FinCore Secure Digital Banking Platform (Frontend)
echo    Pure HTML5 + Vanilla CSS + JavaScript + React
echo ========================================================
echo.

if not exist node_modules (
    echo Installing npm dependencies...
    npm install
)

echo Starting FinCore Frontend on http://localhost:3000 ...
npm run dev
