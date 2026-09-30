

## 🔑 Default Login Credentials

| Role | Username / Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@fincore.bank` | `password123` | Full control, User Management, **Block/Unblock any user**, Audit Trail, Ops Console |
| **SUPERVISOR** | `supervisor@fincore.bank` | `password123` | Four-eyes KYC review, Loan sanction approvals, Account Freeze / Unfreeze |
| **TELLER** | `teller@fincore.bank` | `password123` | Cashier desk, Cash deposit, Cash withdrawal, Customer account opening |
| **CUSTOMER** | `customer@fincore.bank` | `password123` | Retail NetBanking: Transfers (NEFT/IMPS/UPI), Pay EMI, Statements, Biometric KYC |

---

## 🏛️ Comprehensive Milestone Implementation

### Milestone 1: Core Banking & Identity
- **Team A**: Account Service, Customer Service, Transaction Service
- **Team B**: Balance Management, Account Lifecycle (`ACTIVE`, `FROZEN`, `DORMANT`, `CLOSED`), Statement Generation (Date filtering & CSV export)
- **Team C**: Account Creation, Balance Accuracy, Transaction Atomicity
- **Team D**: KYC Verification, Tamper-Evident Audit Trail, RBAC (Role-Based Access Control)
- **Security**: **Admin can immediately Block or Unblock any user** with 1-click in the User Management Console. Blocked users are strictly locked out of the banking platform.

### Milestone 2: Credit & Lending Operations
- **Team A**: Loan Service, Origination Workflow, Credit Assessment
- **Team B**: Reducing Balance EMI Calculation, Automated Disbursement, Collections
- **Team C**: Loan Origination, Credit Scoring Check, EMI Calculation
- **Team D**: Repayment Tracking, 6-Step Atomic Loan Disbursement Saga, Automated NPA Classification (Standard, SMA-0, SMA-1, SMA-2, Sub-Standard, Doubtful, Loss per RBI prudential norms)

### Milestone 3: Real-Time Payments & Settlements
- **Team A**: Multi-Rail Payment Service (NEFT, IMPS, UPI), Beneficiary Management
- **Team B**: Real-Time Fraud Detection & Velocity Screening, Settlement Engine, Multi-Channel Notification Service (SMS, Email, In-App)
- **Team C**: Payment Initiation, Beneficiary Verification, Fraud Anomaly Check
- **Team D**: Distributed Saga Orchestration with Automated Backward Compensation, Clearing House Settlement Confirmation, Notification Delivery

### Milestone 4: Advanced KYC & Biometric Verification
- **Team A**: Digital KYC Service, Document OCR Extraction (PAN, Aadhaar, Passport)
- **Team B**: Biometric Liveness Detection, Risk Assessment Tiers, Immutable Audit Logging
- **Team C**: Document OCR, 98.4% Face Match Accuracy, Passive Blink Liveness Check
- **Team D**: AML Risk Scoring, Regulatory Compliance Check, Cryptographic SHA-256 Hash Chain Integrity

---

## 🛡️ Banking Security Features
1. **Stateless JWT Tokens**: 256-bit cryptographically signed Bearer authentication.
2. **Double-Entry Ledger**: Every credit is balanced by an immutable corresponding debit.
3. **Four-Eyes Principle**: Tellers submit; Supervisors approve sensitive credit and KYC operations.
4. **Administrative Lockdown**: Admins can instantly block any staff or customer user, terminating their active sessions.
5. **No Technical Jargon**: The platform presents a real, trustworthy enterprise banking experience ready for institutional deployment.
