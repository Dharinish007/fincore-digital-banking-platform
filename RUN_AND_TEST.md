# FinCore – Run and Test Guide (Windows)

This guide explains how to run the frontend and all backend services on Windows without the PowerShell script execution issue.

## 1. Prerequisites

Make sure you have installed:

- Node.js and npm
- Java JDK 17 or 21
- Maven
- Git

Verify them with:

```powershell
node -v
npm -v
java -version
mvn -version
```

If `mvn` or `java` is not recognized, install JDK + Maven and reopen the terminal.

---

## 2. Fix PowerShell execution policy (if npm fails)

If you see this error:

```powershell
npm.ps1 cannot be loaded because running scripts is disabled on this system
```

Use one of these options:

### Option A: Run in Command Prompt (easiest)
Open `cmd.exe` instead of PowerShell and run the commands below.

### Option B: Fix PowerShell policy
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then press `Y` and continue.

---

## 3. Start the frontend

Open a terminal in the project root and run:

```cmd
cd "C:\Users\w11 3\Downloads\fincore-digital-banking-platform-team-a-milestone-2\fincore-digital-banking-platform-team-a-milestone-2\Frontend"
npm install
npm run dev
```

The frontend should start in Vite. Usually it runs at:

```text
http://localhost:5173
```

---

## 4. Start the backend services

Open separate terminals for each service.

### Account service
```cmd
cd "C:\Users\w11 3\Downloads\fincore-digital-banking-platform-team-a-milestone-2\fincore-digital-banking-platform-team-a-milestone-2\account-service"
mvn spring-boot:run
```

### Customer service
```cmd
cd "C:\Users\w11 3\Downloads\fincore-digital-banking-platform-team-a-milestone-2\fincore-digital-banking-platform-team-a-milestone-2\customer-service"
mvn spring-boot:run
```

### Transaction service
```cmd
cd "C:\Users\w11 3\Downloads\fincore-digital-banking-platform-team-a-milestone-2\fincore-digital-banking-platform-team-a-milestone-2\fincore-transaction-service"
mvn spring-boot:run
```

The transaction service runs on:

```text
http://localhost:8081
```

It includes seeded demo data and an H2 in-memory database by default.

---

## 5. Test the backend APIs

### Example 1: create an account
```bash
curl -X POST http://localhost:8081/api/v1/accounts \
  -H "Content-Type: application/json" \
  -d '{"customerName":"John Smith","accountType":"SAVINGS","openingBalance":1000}'
```

### Example 2: deposit money
```bash
curl -X POST http://localhost:8081/api/v1/transactions/deposit \
  -H "Content-Type: application/json" \
  -d '{"accountNumber":"1234-5678-9012","amount":500,"remarks":"salary"}'
```

### Example 3: withdraw money
```bash
curl -X POST http://localhost:8081/api/v1/transactions/withdraw \
  -H "Content-Type: application/json" \
  -d '{"accountNumber":"1234-5678-9012","amount":200,"remarks":"ATM"}'
```

### Example 4: transfer money
```bash
curl -X POST http://localhost:8081/api/v1/transactions/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromAccountNumber":"1234-5678-9012","toAccountNumber":"2222-3333-4444","amount":100,"remarks":"rent"}'
```

### Example 5: check transaction history
```bash
curl "http://localhost:8081/api/v1/transactions/history/1234-5678-9012?page=0&size=20"
```

---

## 6. Run tests

### Frontend build check
```cmd
cd "C:\Users\w11 3\Downloads\fincore-digital-banking-platform-team-a-milestone-2\fincore-digital-banking-platform-team-a-milestone-2\Frontend"
npm run build
```

### Backend tests
For each service:

```cmd
cd "C:\Users\w11 3\Downloads\fincore-digital-banking-platform-team-a-milestone-2\fincore-digital-banking-platform-team-a-milestone-2\customer-service"
mvn test
```

```cmd
cd "C:\Users\w11 3\Downloads\fincore-digital-banking-platform-team-a-milestone-2\fincore-digital-banking-platform-team-a-milestone-2\account-service"
mvn test
```

```cmd
cd "C:\Users\w11 3\Downloads\fincore-digital-banking-platform-team-a-milestone-2\fincore-digital-banking-platform-team-a-milestone-2\fincore-transaction-service"
mvn test
```

---

## 7. Quick start batch file

A Windows batch file is also included at the project root called `start-fincore.bat`.

It opens separate terminals and starts:

- Frontend
- Account service
- Customer service
- Transaction service

Double-click the file or run:

```cmd
start-fincore.bat
```

---

## 8. Common issues

### npm blocked by PowerShell policy
Use `cmd` or run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Java not found
Install JDK 17 or 21 and open a new terminal.

### Port already in use
Stop the old process or change the port in the service config.

### Failed Maven build
Delete target folders and retry:

```cmd
rmdir /s /q target
mvn clean install
```

---

## 9. Recommended test flow

1. Start database-related services
2. Start all Spring Boot services
3. Confirm each service responds on its port
4. Run `mvn test` for all Java services
5. Run `npm run build` for frontend
6. Test API endpoints with Postman or curl
7. Verify frontend pages load in browser

This is the simplest process to validate the project before demo or submission.
