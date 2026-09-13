# ⚙️ FinCore Backend - Spring Boot REST API & Business Engines

The **FinCore Backend** is an enterprise-grade banking server built with **Java 23**, **Spring Boot 4 / 3.x**, and **Spring Data JPA**. It connects to a **PostgreSQL** database (via Supabase / RDS / Local) and orchestrates core financial workflows including double-entry ledger operations, reducing-balance loan servicing, settlement clearing, rule-based fraud detection, biometric KYC authentication, risk assessment, and tamper-proof audit logging.

---

## 🏛️ Architecture & Modules

```
com.example.milestone3
├── accounts/               # Account lifecycle, ledger posting, deposits & withdrawals
├── audit/                  # Centralized immutable audit logging service
├── auth/                   # Security credentials & BCrypt passcodes
├── customer/               # Customer master record and onboarding
├── fraudDetection/         # Real-time transaction fraud evaluation engine
├── kyc/                    # MediaPipe biometric liveness challenge validation
├── loanmanagement/         # Loan portfolio, EMI schedule, disbursements & collections
├── notificationService/    # Multi-channel notification delivery (SMS, Email, Push)
├── operations/             # Core banking operations and balance management
├── risk/                   # Credit risk & transaction risk assessment engine
├── settlementEngine/       # Interbank batch clearing & gross settlement
└── statement/              # Account statement generation & financial history
```

---

## 🛠️ Tech Stack & Key Libraries

| Component | Technology | Description |
|---|---|---|
| **Language** | Java 23 / 21 | Modern LTS Java |
| **Framework** | Spring Boot | REST APIs, Dependency Injection, Transaction Management |
| **Persistence** | Spring Data JPA / Hibernate | Object-Relational Mapping & Repositories |
| **Database** | PostgreSQL | Relational Database (Supabase Cloud / Local) |
| **Security** | Spring Security Crypto | BCrypt Passcode Hashing & Secure Credentials |
| **Mail** | Spring Mail Starter | Notification Delivery Engine |
| **Productivity**| Lombok | Boilerplate elimination (`@Data`, `@AllArgsConstructor`) |
| **Build Tool** | Maven (`mvnw`) | Build lifecycle & dependency management |

---

## 🔌 API Endpoints Reference

### 1. 🛡️ Fraud Detection (`/api/fraud`)
- `POST /api/fraud/evaluate` - Evaluates a transaction against multi-factor risk rules without DB delays, creates transaction record, logs event, and saves assessment.
- `GET /api/fraud/recent-events` - Retrieves the most recent fraud detection events for UI activity monitoring.
- `GET /api/fraud/events` - Retrieves all fraud events.
- `POST /api/fraud/check` - Checks existing transaction by ID.

### 2. 🏦 Accounts & Operations (`/api/accounts`, `/api/operations`)
- `GET /api/accounts` - List all bank accounts.
- `POST /api/accounts` - Create new customer account.
- `POST /api/accounts/{id}/deposit` - Credit funds to account.
- `POST /api/accounts/{id}/withdraw` - Debit funds from account.
- `GET /api/accounts/{id}/balance` - Real-time balance enquiry.

### 3. 💳 Loan Management (`/api/loans`)
- `GET /api/loans` - List active loans and portfolios.
- `POST /api/loans/apply` - Submit a new loan application.
- `POST /api/loans/calculate-emi` - Generate reducing-balance EMI amortization schedule.
- `POST /api/loans/{id}/disburse` - Disburse loan principal to linked account.
- `POST /api/loans/{id}/collect-emi` - Process EMI repayment and update balances.

### 4. ⚡ Settlement Engine (`/api/settlement`)
- `GET /api/settlement/batches` - View interbank clearing batches.
- `POST /api/settlement/process` - Execute net batch or gross settlement.

### 5. 👁️ KYC & Biometric Liveness (`/api/kyc`, `/api/liveness`)
- `POST /api/liveness/verify` - Record AI face liveness challenge results.
- `GET /api/liveness/customer/{id}` - Fetch customer liveness verification history.

### 6. 📜 Audit Trail (`/api/audit`)
- `GET /api/audit/logs` - Query immutable audit trail with filtering by actor, module, and timestamp.

---

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK)**: JDK 21 or JDK 23
- **Maven**: Maven Wrapper (`mvnw` / `mvnw.cmd`) is included in the project directory.

### Configuration (`application.properties`)

Ensure database settings in `Backend/src/main/resources/application.properties` match your PostgreSQL instance:

```properties
spring.datasource.url=jdbc:postgresql://<HOST>:<PORT>/<DATABASE>?sslmode=require
spring.datasource.username=<USERNAME>
spring.datasource.password=<PASSWORD>
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

### Running the Application

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Compile and run using the Maven Wrapper:
   - **Windows**:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **Linux / macOS**:
     ```bash
     ./mvnw spring-boot:run
     ```

3. The server will start on:
   ```
   http://localhost:8080
   ```


Contributor

Janhvi Pandey
