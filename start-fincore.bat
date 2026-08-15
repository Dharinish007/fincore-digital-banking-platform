@echo off
cd /d "%~dp0"

start "Frontend" cmd /k "cd /d "%~dp0Frontend" && npm install && npm run dev"
start "Account Service" cmd /k "cd /d "%~dp0account-service" && mvn spring-boot:run"
start "Customer Service" cmd /k "cd /d "%~dp0customer-service" && mvn spring-boot:run"
start "Transaction Service" cmd /k "cd /d "%~dp0fincore-transaction-service" && mvn spring-boot:run"

echo.
echo FinCore startup process launched in separate terminals.
echo Frontend: http://localhost:5173
echo Transaction Service: http://localhost:8081
echo.
pause
