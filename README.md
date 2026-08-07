# FinCore Digital Banking Platform

Enterprise Digital Banking Platform integrating **Balance Accuracy**, **Account Creation**, and **Transaction Atomicity**.

---

## Workspace Structure

```
.
├── frontend/                     # Unified Angular 19/20 Standalone Application
│   └── balance-accuracy-app/
├── backend/                      # Spring Boot REST API Service
│   └── src/main/java/com/fincore/BankingManagement/
├── DB/                           # SQL Schema & Seed Scripts
└── README.md
```

---

## Quick Start

### 1. Frontend Setup (Angular)
```bash
cd frontend/balance-accuracy-app
npm install
npm start
```
App runs at: `http://localhost:4200`

### 2. Backend Setup (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
API runs at: `http://localhost:8080`

---

## Core Features
- **Balance Accuracy Dashboard**: Real-time ledger discrepancy monitoring & balance audit.
- **Account Creation**: Enterprise customer account opening with full validation.
- **Transaction Atomicity**: Two-phase commit ledger synchronization, transfer execution, and instant rollback.
