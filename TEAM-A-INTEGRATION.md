# FinCore Digital Banking Platform — Team A Integration Guide

## Overview
**Team A (Core Banking)** provides the central digital banking platform, including customer management, account operations, transaction processing, dashboard aggregation, loans, payments, beneficiaries, payment modes (IMPS/NEFT/UPI), KYC verification, and biometric face match.

The primary frontend is the Angular application in `frontend_fincore/`, interacting exclusively with the backend via the **API Gateway** on port `8080`.

---

## 1. Team A Services & Architecture

| # | Service Name | Directory | Port | Database | Primary Responsibility |
|---|-------------|-----------|------|----------|------------------------|
| 1 | **API Gateway** | `backend/api-gateway` | `8080` | None | Single entry point, routing, CORS handler |
| 2 | **Customer / Auth Service** | `backend/customer-service` | `8081` | `customerdb` | JWT authentication, user & customer profiles |
| 3 | **Account Service** | `backend/account-service` | `8082` | `accountdb` | Account creation, balances, account queries |
| 4 | **Transaction Service** | `backend/transaction-service` | `8083` | `transactiondb` | Transfers, deposits, withdrawals, ledger |
| 5 | **Dashboard Service** | `backend/dashboard-service` | `8084` | In-memory | Aggregated metrics, activity streams |
| 6 | **Loan Service** | `backend/loan-service` | `8085` | `loandb` | Loan products, applications, approvals |
| 7 | **Beneficiary Service** | `backend/beneficiary-service` | `8086` | `beneficiarydb` | Payee management, IFSC / account mapping |
| 8 | **Payment Service** | `backend/payment-service` | `8087` | `paymentdb` | Payment orchestration & lifecycle tracking |
| 9 | **IMPS-NEFT-UPI Service** | `backend/imps-neft-upi-service` | `8088` | `impsdb` | Rail routing for IMPS, NEFT, and UPI |
| 10 | **KYC Service** | `backend/kyc-service` | `8089` | `kycdb` | Document verification & status management |
| 11 | **Face Match Service** | `backend/face-match-service` | `8090` | `facematchdb` | Biometric face verification (ONNX / SFace) |
| 12 | **Angular Frontend UI** | `frontend_fincore` | `4200` | Browser storage | Main user interface for customers and staff |

> **Note on Port Allocation:** Team A exclusively utilizes ports `8080`–`8090`. Team D will occupy ports `8091`–`8096`, guaranteeing zero port collisions when both teams are running concurrently.

---

## 2. API Gateway Routing Table (`:8080`)

All client requests from the Angular frontend go to `http://localhost:8080`. The Spring Cloud Gateway routes traffic to internal microservices as follows:

| Route Path Pattern | Downstream Microservice | Target Port |
|--------------------|-------------------------|-------------|
| `/api/v1/auth/**` | Customer / Auth Service | `http://localhost:8081` |
| `/api/v1/customers/**` | Customer / Auth Service | `http://localhost:8081` |
| `/api/v1/accounts/**` | Account Service | `http://localhost:8082` |
| `/api/v1/transactions/**` | Transaction Service | `http://localhost:8083` |
| `/api/v1/dashboard/**` | Dashboard Service | `http://localhost:8084` |
| `/api/v1/loans/**` | Loan Service | `http://localhost:8085` |
| `/api/v1/beneficiaries/**` | Beneficiary Service | `http://localhost:8086` |
| `/api/v1/payments/**` | Payment Service | `http://localhost:8087` |
| `/api/v1/payment-modes/**` | IMPS-NEFT-UPI Service | `http://localhost:8088` |
| `/api/v1/kyc/**` | KYC Service | `http://localhost:8089` |
| `/api/v1/face-match/**` | Face Match Service | `http://localhost:8090` |

---

## 3. Authentication & JWT Specifications

### Authentication Flow
1. User navigates to `http://localhost:4200/login`.
2. User submits credentials (`username` and `password`).
3. Frontend dispatches `POST http://localhost:8080/api/v1/auth/login`.
4. API Gateway forwards the request to Customer Service (`:8081`).
5. Customer Service validates credentials with `BCryptPasswordEncoder` and generates a signed JWT.
6. Frontend receives `{ token, tokenType: "Bearer", username, role, customerId, ... }`.
7. Token is stored in `localStorage` under key `fincore_token` and the user profile is stored in `fincore_user`.
8. The Angular `authInterceptor` automatically attaches header `Authorization: Bearer <token>` to all HTTP requests routed through `:8080`.
9. The `authGuard` verifies real session state; unauthenticated users are redirected to `/login`.

### JWT Configuration
- **Algorithm**: HMAC-SHA512
- **Shared Secret**:
  `FinCoreDigitalBankingPlatformSecureJwtSecretKey2026WithSufficientBitsForHmacSha256`
- **Token Validity**: 24 hours (`86,400,000` ms)
- **Token Claims**:
  - `sub`: Username
  - `role`: Role string (e.g. `ROLE_ADMIN`, `ROLE_CUSTOMER`, `ROLE_EMPLOYEE`)
  - `userId`: Numeric identifier
  - `customerId`: Associated customer ID (if applicable)
  - `iat`: Issued at timestamp
  - `exp`: Expiration timestamp

### Seeded Test Accounts
| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `admin123` | `ROLE_ADMIN` | Full banking administration access |
| `employee` | `employee123` | `ROLE_EMPLOYEE` | Operational teller / officer access |
| `customer` | `customer123` | `ROLE_CUSTOMER` | Standard retail customer access |

---

## 4. Key REST Endpoints

### Authentication & Customers
- `POST /api/v1/auth/login` — Authenticate user and issue JWT.
- `POST /api/v1/auth/register` — Register new online banking user.
- `GET /api/v1/customers` — List all customers *(Requires JWT)*.
- `GET /api/v1/customers/{id}` — Get customer details *(Requires JWT)*.
- `POST /api/v1/customers` — Create customer profile *(Requires JWT)*.

### Accounts & Transactions
- `GET /api/v1/accounts` — List bank accounts.
- `GET /api/v1/accounts/{accountNumber}` — Retrieve account details by number.
- `POST /api/v1/accounts` — Create new checking/savings account.
- `GET /api/v1/transactions` — List transactions.
- `GET /api/v1/transactions/account/{accountNumber}` — Get transaction history for an account.
- `POST /api/v1/transactions` — Record new deposit, withdrawal, or transfer.

### Loans & Beneficiaries
- `GET /api/v1/loans/products` — List available loan products (Personal, Home, Auto, etc.).
- `POST /api/v1/loans/apply` — Submit loan application.
- `GET /api/v1/beneficiaries/customer/{customerId}` — List active beneficiaries for a customer.
- `POST /api/v1/beneficiaries` — Register a new beneficiary.

### Payments & Rails
- `GET /api/v1/payments` — Retrieve payment transaction log.
- `POST /api/v1/payments/initiate` — Initiate payment workflow.
- `POST /api/v1/payment-modes/process` — Process payment through selected rail (IMPS / NEFT / UPI).

### KYC & Biometric Verification
- `GET /api/v1/kyc/{customerId}` — Check KYC status.
- `POST /api/v1/kyc/verify` — Submit identity documents for verification.
- `POST /api/v1/face-match/compare` — Compare two face images using SFace ONNX model.

---

## 5. Database Configuration

All 11 microservices use self-contained embedded **H2 databases** running in PostgreSQL compatibility mode:
- **Driver**: `org.h2.Driver`
- **URL Pattern**: `jdbc:h2:mem:<service_db>;DB_CLOSE_DELAY=-1;MODE=PostgreSQL`
- **Credentials**: `username: sa`, `password: `
- **Hibernate DDL**: `update` (auto-creates tables and constraints on startup)

Each service initializes realistic demo data on boot via Spring Boot `CommandLineRunner` beans:
- `CustomerService`: Default admin, employee, customer users and retail customer records.
- `AccountService`: Checking and savings accounts linked to customer IDs.
- `TransactionService`: Initial deposits and transfer ledger records.
- `LoanService`: 5 standard loan products (Home, Personal, Auto, Education, Business).
- `BeneficiaryService`: Pre-configured payees with IFSC codes.
- `PaymentService`: Sample payment history (UPI, NEFT, IMPS).

Zero external database installation (PostgreSQL, MySQL, Redis, etc.) is required for local operation.

---

## 6. Angular Frontend Configuration (`frontend_fincore`)

- **Environment**: Configured in `src/environments/environment.ts`:
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080'
  };
  ```
- **Authentication**:
  - `AuthService` (`src/app/core/services/auth.service.ts`) handles JWT authentication via `http://localhost:8080/api/v1/auth/login`.
  - `AuthInterceptor` (`src/app/core/interceptors/auth.interceptor.ts`) attaches `Authorization: Bearer <token>` to all HTTP calls directed to `:8080`.
  - `AuthGuard` (`src/app/core/guards/auth.guard.ts`) checks real token validity before activating protected routes.
- **Banking Service**:
  - `BankingService` (`src/app/core/services/banking.service.ts`) dispatches real REST requests via Gateway for customers, accounts, transactions, dashboard, loans, beneficiaries, and payments.
  - Removed artificial random audit hash generators and simulated role switchers.

---

## 7. How to Run

### Prerequisite Check
- **Java 17+** (`java -version`)
- **Maven 3.8+** (`mvn -v`)
- **Node.js 18+ & npm** (`node -v`, `npm -v`)
- **Python 3.8+** (`python --version`)

### Quick Start (All 12 Services at Once)
Run the master supervisor script from the repository root:
```powershell
python run_all.py
```
This command:
1. Spawns 11 backend service terminals and 1 Angular frontend terminal.
2. Monitors port health in real-time (`[STARTING...]` -> `[ONLINE]`).
3. Automatically opens `http://localhost:4200` in your default browser once services are online.
4. Pressing `Ctrl+C` in the supervisor terminal cleanly shuts down all processes and frees all ports.

### Stopping Services
To manually free all ports:
```powershell
python stop_all.py
```

### Manual Individual Service Startup
If running services individually:
```bash
# Terminal 1: API Gateway
cd backend/api-gateway && mvn spring-boot:run

# Terminal 2: Customer Service
cd backend/customer-service && mvn spring-boot:run

# Terminal 3: Account Service
cd backend/account-service && mvn spring-boot:run

# Terminal 4: Transaction Service
cd backend/transaction-service && mvn spring-boot:run

# Terminal 5: Dashboard Service
cd backend/dashboard-service && mvn spring-boot:run

# Terminal 6: Loan Service
cd backend/loan-service && mvn spring-boot:run

# Terminal 7: Beneficiary Service
cd backend/beneficiary-service && mvn spring-boot:run

# Terminal 8: Payment Service
cd backend/payment-service && mvn spring-boot:run

# Terminal 9: IMPS Service
cd backend/imps-neft-upi-service && mvn spring-boot:run

# Terminal 10: KYC Service
cd backend/kyc-service && mvn spring-boot:run

# Terminal 11: Face Match Service
cd backend/face-match-service && mvn spring-boot:run

# Terminal 12: Angular Frontend
cd frontend_fincore && npm start
```

---

## 8. Limitations & Team D Integration Notes (Step 3)

1. **Team D Preparedness**:
   - Team D services (Risk Scoring `:8091`, Compliance `:8092`, Notifications `:8093`, Disbursement Saga `:8094`, Settlement `:8095`, Audit Trail `:8096`) are fully isolated and do not conflict with Team A.
   - When connecting Team D in Step 3, Team D services can consume the exact same JWT generated by Team A by using the shared secret `FinCoreDigitalBankingPlatformSecureJwtSecretKey2026WithSufficientBitsForHmacSha256`.
2. **Audit Trail Handoff**:
   - The fake random audit hash generator in the Angular frontend has been cleanly removed. In Step 3, real cryptographic audit hashes will be produced by Team D's Audit Trail Service (`:8096`).
3. **Face Match Model Weights**:
   - OpenCV ONNX models (`face_detection_yunet_2023mar.onnx` and `face_recognition_sface_2021dec.onnx`) are bundled directly within `face-match-service/src/main/resources/models/`. No external download is required.
