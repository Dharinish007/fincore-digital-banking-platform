@echo off
title Start FinCore Digital Banking System
echo Starting FinCore Java Spring Boot Backend and React Frontend...
echo.

start "FinCore Java Spring Boot Backend" cmd /k "run-backend.bat"
start "FinCore React Frontend" cmd /k "run-frontend.bat"

echo.
echo Both services are launching!
echo Frontend will be accessible at: http://localhost:3000
echo Backend API will be accessible at: http://localhost:8080
echo.
pause
