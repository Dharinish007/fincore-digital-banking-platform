# 🏦 FinCore Digital Banking Platform - Unified Enterprise System
### Infosys Internship 7.0 — Consolidated Team B & Team C Production Integration

The **FinCore Digital Banking Platform** is an enterprise-grade digital banking, credit risk, interbank settlement, and AI biometric identity system. This branch integrates the full scope of **Milestone 1, Milestone 2, Milestone 3, and Milestone 4** from both **Team B** and **Team C** into a unified, tested, and runnable multi-tier solution.

---

## 🏛️ Integrated Architecture & Features

```
                                  ┌──────────────────────────────────────────────┐
                                  │      Angular 19 Enterprise Client (4200)     │
                                  │  • Executive & Core Banking Dashboards       │
                                  │  • Account Lifecycle & Balance Accuracy      │
                                  │  • Fund Transfers & Payment Initiation (IMPS)│
                                  │  • Loan Origination & EMI Amortization Calc  │
                                  │  • AI Biometric KYC Suite (OCR & Face Match) │
                                  │  • Real-Time Fraud Matrix & Audit Trail      │
                                  └──────────────────────┬───────────────────────┘
                                                         │ REST APIs (Port 8080)
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │     Spring Boot 3.3.5 Backend (Java 21)      │
                                  │  • Core Operations & Double-Entry Ledger     │
                                  │  • Credit Risk Bureau & Lending Workflow     │
                                  │  • Interbank RTGS & Net Settlement Engine    │
                                  │  • Multi-Channel Notifications (Email/SMS)   │
                                  │  • Security RBAC Filter & Passcode Gate      │
                                  │  • AI KYC Orchestration & Audit Service      │
                                  └───────────────┬──────────────┬───────────────┘
                                                  │              │
                   ┌──────────────────────────────┘              └──────────────────────────────┐
                   ▼                                                                            ▼
┌──────────────────────────────────────┐                                     ┌──────────────────────────────────────┐
│        MySQL 8.0+ / PostgreSQL       │                                     │     Python AI Microservice (8000)    │
│  • Digital Banking Unified Schemas   │                                     │  • FastAPI + OpenCV + DeepFace       │
│  • Milestones 1 to 4 Tables & Seeds  │                                     │  • PyTesseract Document OCR          │
└──────────────────────────────────────┘                                     └──────────────────────────────────────┘
```

### Milestone Coverage Map

| Milestone | Team B Contribution | Team C Contribution | Unified Capabilities |
|---|---|---|---|
| **M1: Core Banking** | Customer & Account Lifecycle, Statements (PDF/Excel), Double-Entry Ledger, Balance Adjustments | Balance Accuracy & Drift Detection, Customer Onboarding Form, Fund Transfers, Transaction Explorer | Full account opening, real-time balance reconciliation, ledger audit, and multi-format statement export. |
| **M2: Lending & Credit** | Reducing-Balance EMI Amortization, Principal Disbursement Engine, Delinquency Collections & Penalties | Loan Origination Pipeline (5 stages), Credit Bureau Score Check, Previous Loan Evaluation | Complete lifecycle: from application and underwriting to automated EMI calculation, disbursement, and collections. |
| **M3: Payments & Settlement** | Interbank Settlement Engine (RTGS & Net Batch clearing), Multi-Channel Notifications (Email/SMS) | Payment Initiation (NEFT/RTGS/IMPS), Beneficiary Verification & Management, Payment Review Queue | End-to-end payments with beneficiary lookup, payment review queue, fraud scoring, and interbank batch settlement. |
| **M4: Identity & AI KYC** | MediaPipe Face Mesh client challenge, Passcode Hash Verification, Risk Assessment Engine | Document OCR Scanner, Face Match Accuracy comparison, AI Webcam Liveness, KYC Verification Audit | Comprehensive AI Identity Suite: ID Card OCR, live challenge liveness, facial similarity scoring, and final audit. |

---

## 📂 Project Structure

```
fincore-digital-banking-platform/
│
├── frontend/                          # Unified Angular 19 SPA (Port 4200)
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/               # Team B banking modules (Dashboard, Ledger, Settlement, Risk, etc.)
│   │   │   ├── features/              # Team C feature modules (Balance Accuracy, Loan Origination, OCR, etc.)
│   │   │   ├── pages/                 # Face Match & KYC Verification Summary pages
│   │   │   ├── components/            # Shared modals, filters, and metrics headers
│   │   │   ├── services/              # API clients, export tools, authentication
│   │   │   ├── shared/                # Unified Sidebar, Header, KYC Shell, Status Badges
│   │   │   └── app.routes.ts          # Consolidated routing table for all features
│   │   └── styles.scss                # Consolidated design system with Angular Material & theme tokens
│   ├── angular.json
│   └── package.json                   # Consolidated frontend dependencies
│
├── backend/                           # Unified Spring Boot 3.3.5 Backend (Port 8080)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   ├── com/fincore/       # Main App, CORS, Banking Management, Entities, Repositories, Services
│   │   │   │   └── com/example/milestone3/ # Operations, Settlement Engine, Lending, Fraud, Biometrics, Audit
│   │   │   └── resources/
│   │   │       ├── application.properties          # Default MySQL connection
│   │   │       ├── application-mysql.properties    # Explicit MySQL profile
│   │   │       └── application-h2.properties       # Zero-config embedded test profile
│   │   └── test/                      # Unified context tests
│   ├── pom.xml                        # Maven parent POM (Java 21, Spring Boot 3.3.5)
│   └── mvnw / mvnw.cmd
│
├── database/                          # Unified database schemas, migrations & seed scripts
│   ├── mysql/                         # MySQL 8.0+ scripts
│   │   ├── 01_create_database.sql     # Database creation (`digital_banking`)
│   │   ├── 02_fincore_master_schema_mysql.sql # Master schema (all M1-M4 tables)
│   │   ├── 03_fincore_seed_data_mysql.sql     # Unified sample seed records
│   │   └── 04_ to 17_                 # Milestone-specific queries & tests
│   ├── postgresql/                    # PostgreSQL 14+ schemas (Team B)
│   │   └── fincore_master_schema.sql
│   └── README.md                      # Detailed database setup guide
│
├── face-recognition-service/          # Python AI Microservice (Port 8000)
│   ├── main.py                        # FastAPI server
│   ├── face_service.py                # DeepFace facial comparison
│   ├── liveness.py                    # OpenCV motion and blink verification
│   ├── ocr_service.py                 # PyTesseract document parser
│   └── requirements.txt
│
├── docs/                              # Project reports & milestone presentations
│   ├── FINCORE Banking System.pdf
│   ├── Fincore Banking management system-Report.md
│   └── Secure_Project_Report.pdf
│
├── .env.example                       # Environment configuration template
├── .gitignore                         # Comprehensive repository ignore rules
└── README.md                          # Master documentation
```

---

## 📋 System Requirements

| Tool | Recommended Version | Verified On System |
|---|---|---|
| **Operating System** | Windows 10/11, macOS, or Linux | Windows 11 |
| **Java Development Kit (JDK)** | OpenJDK / Oracle JDK 21+ | JDK 21.0.5 LTS |
| **Apache Maven** | Maven 3.9+ (or included Maven Wrapper) | Maven 3.9.16 |
| **Node.js** | Node 20 LTS (v20.11+) | Node v20.18.0 |
| **npm** | npm 10+ | npm 10.9.0 |
| **MySQL Server** | MySQL Community 8.0 or 9.1 | MySQL 8.0 / 9.1 (Port 3306) |
| **Python (Optional for AI)** | Python 3.10 or 3.11 | Python 3.11.9 |

---

## 🚀 Execution & Run Order

Follow this sequence to launch the complete platform:

```
Step 1: Start Database (MySQL on Port 3306)
          ↓
Step 2: Initialize Database Schemas & Seed Data
          ↓
Step 3: Launch Spring Boot Backend (Port 8080)
          ↓
Step 4: (Optional) Launch Python AI Service (Port 8000)
          ↓
Step 5: Launch Angular Frontend (Port 4200)
```

---

### Step 1 & 2: Database Initialization

1. Ensure MySQL is running on `localhost:3306`.
2. Connect using `mysql` client or MySQL Workbench:
   ```bash
   mysql -u root -p < database/mysql/01_create_database.sql
   mysql -u root -p digital_banking < database/mysql/02_fincore_master_schema_mysql.sql
   mysql -u root -p digital_banking < database/mysql/03_fincore_seed_data_mysql.sql
   ```

*Detailed guide and PostgreSQL instructions: [database/README.md](./database/README.md)*

---

### Step 3: Start Spring Boot Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure credentials in `src/main/resources/application.properties` (or copy `.env.example`):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/digital_banking?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Compile and start the backend:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *The backend will boot up at `http://localhost:8080`.*

> **Tip (Zero-Config In-Memory Test):**  
> If MySQL is not locally configured, boot using the embedded H2 profile:  
> `.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2`

---

### Step 4: (Optional) Start Python AI Microservice

1. Navigate to `face-recognition-service`:
   ```bash
   cd face-recognition-service
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

### Step 5: Start Angular Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
4. Access the web interface at `http://localhost:4200`.

---

## 🌐 Application URL Directory

| Module / Feature | Frontend URL | Backend API Mapping |
|---|---|---|
| **Executive Dashboard** | `http://localhost:4200/dashboard` | `/api/health`, `/api/operations/**` |
| **Core Operations Dashboard** | `http://localhost:4200/core-dashboard` | `/api/operations/**` |
| **Open New Account** | `http://localhost:4200/open-account` | `POST /api/accounts/accountCreation` |
| **Account Lifecycle** | `http://localhost:4200/accounts` | `GET /api/operations/accounts` |
| **Balance Accuracy & Drift** | `http://localhost:4200/balance-accuracy` | `GET /api/balance-accuracy/reconcile` |
| **Instant Fund Transfer** | `http://localhost:4200/fund-transfer` | `POST /api/transactions/transfer` |
| **Transactions Explorer** | `http://localhost:4200/transactions` | `GET /api/transactions/history` |
| **Payment Initiation (IMPS/RTGS)**| `http://localhost:4200/payment-initiation`| `POST /api/payments` |
| **Payment Review Queue** | `http://localhost:4200/payment-review` | `GET /api/payments` |
| **Beneficiary Verification** | `http://localhost:4200/beneficiary-verification`| `GET /beneficiary-verification/getList` |
| **Interbank Settlement Engine**| `http://localhost:4200/settlement` | `GET/POST /api/settlements/**` |
| **Loan Servicing Desk** | `http://localhost:4200/loans` | `GET /api/operations/loans` |
| **Loan Origination Pipeline**| `http://localhost:4200/loan-origination` | `GET/POST /api/loan-origination/**` |
| **Credit Risk Bureau** | `http://localhost:4200/credit-check` | `GET/POST /api/credit-check/**` |
| **EMI Amortization Calc** | `http://localhost:4200/emi-calculator` | `POST /api/emi/calculate` |
| **Loan Disbursement** | `http://localhost:4200/loans/disbursement` | `GET/POST /api/operations/disbursements`|
| **Loan Collections** | `http://localhost:4200/loans/collections` | `GET/POST /api/operations/collections` |
| **Real-Time Fraud Matrix** | `http://localhost:4200/fraud-detection` | `GET /api/fraud/events`, `/api/fraud/evaluate`|
| **Payment Fraud Rules** | `http://localhost:4200/fraud-check` | `GET/PUT /fraud-check/**` |
| **Customer Risk Assessment** | `http://localhost:4200/risk` | `GET/POST /api/risk/**` |
| **Biometric Face Liveness** | `http://localhost:4200/liveness` | `POST /api/liveness/verify` |
| **Document OCR Scanner** | `http://localhost:4200/document-ocr` | `POST /api/document-ocr` |
| **AI Webcam Liveness** | `http://localhost:4200/liveness-detection`| `POST /api/v1/kyc/liveness` |
| **Face Match Accuracy** | `http://localhost:4200/face-match` | `POST /api/face/verify` |
| **KYC Verification Summary** | `http://localhost:4200/verification-summary`| `POST /api/kyc/verify` |
| **Certified Statement Export**| `http://localhost:4200/statements` | `GET /api/operations/accounts/{id}/statement` |
| **Enterprise Audit Trail** | `http://localhost:4200/audit` | `GET /api/audit/logs` |
| **Notifications Dispatch** | `http://localhost:4200/notifications` | `GET/POST /api/notification/**` |
| **Platform Settings** | `http://localhost:4200/settings` | Local & Session Config |

---

## 🛡️ Role-Based Access Control (RBAC)

The header features a quick-role switcher that dynamically alters the navigation sidebar and privileges:

1. **ADMIN**: Unrestricted master access across all Core, Lending, Clearing, Fraud, and AI KYC tools.
2. **BANK_STAFF**: Operations desk for account lifecycle, counter transfers, statement issuance, and collections.
3. **LOAN_OFFICER**: End-to-end loan evaluation, credit bureau queries, underwriting approvals, and disbursement.
4. **FRAUD_OFFICER**: Real-time fraud detection matrix, AML investigation, settlement releases, and audit review.
5. **AUDITOR**: Read-only compliance portal across general ledgers, certified statements, and risk records.
6. **CUSTOMER**: Self-service portal for accounts, instant transfers, loan applications, and biometric verification.

---

## 🔒 Security & Data Integrity

- **Database Credentials**: Zero plain-text credentials hard-coded in the repository. Safe default variables with `.env.example`.
- **CORS Protection**: Filter allowing legitimate local frontend origins (`http://localhost:4200`, `http://localhost:3000`, `http://localhost:5173`).
- **Passcode Hashing**: BCrypt encryption for customer credentials.
- **Transaction Atomicity**: Strict Spring `@Transactional` boundaries on all multi-account transfers and disbursements.
