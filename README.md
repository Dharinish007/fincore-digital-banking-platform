# 🏦 FinCore - Next-Gen Digital Banking & Settlement Platform

**FinCore** is an enterprise-grade digital banking system engineered with a decoupled multi-tier architecture. It features a responsive **Angular 18 frontend**, a high-throughput **Spring Boot 4 / Java 23 backend**, and a scalable **PostgreSQL database**.

---

## 📂 Repository Structure

```
├── Frontend/           # Angular 18 Single-Page Banking Application
├── Backend/            # Spring Boot REST API & Business Logic Engine
├── Database/           # PostgreSQL Master Schemas, Triggers, ER Diagram & Queries
├── .gitignore          # Root Git ignore configuration
└── README.md           # Master project overview & quickstart
```

---

## 📊 Database Architecture & Overall ER Diagram

The FinCore platform is backed by a PostgreSQL database structured across Core Banking, Amortized Loan Management, Interbank Settlement, and AI Biometric Security:

```mermaid
erDiagram
    CUSTOMERS ||--o{ ACCOUNTS : "owns (1:N)"
    CUSTOMERS ||--o{ LOANS : "applies_for (1:N)"
    CUSTOMERS ||--o{ EMI_COLLECTIONS : "pays (1:N)"
    CUSTOMERS ||--|| CUSTOMER_SECURITY_CREDENTIALS : "has (1:1)"
    CUSTOMERS ||--o{ LIVENESS_VERIFICATION : "verifies (1:N)"
    CUSTOMERS ||--o{ NOTIFICATIONS : "receives (1:N)"
    CUSTOMERS ||--o{ FRAUD_EVENTS : "flagged_in (1:N)"
    CUSTOMERS ||--o{ RISK_ASSESSMENT : "assessed_for (1:N)"

    ACCOUNTS ||--o{ TRANSACTION_DETAILS : "executes (1:N)"
    ACCOUNTS ||--o{ STATEMENT_ARCHIVE : "generates (1:N)"
    ACCOUNTS ||--o{ ACCOUNT_STATUS_HISTORY : "tracks (1:N)"
    ACCOUNTS ||--o{ LOANS : "disbursement_target (1:N)"
    ACCOUNTS ||--o{ LOAN_DISBURSEMENT : "receives_funds (1:N)"

    TRANSACTION_DETAILS ||--|| LEDGER : "records_in (1:1)"

    LOANS ||--o{ LOAN_DISBURSEMENT : "disburses_via (1:N)"
    LOANS ||--o{ EMI_SCHEDULE : "amortized_into (1:N)"
    LOANS ||--o{ EMI_COLLECTIONS : "collected_via (1:N)"

    EMI_SCHEDULE ||--o{ EMI_COLLECTIONS : "satisfies (1:N)"

    SETTLEMENT_BATCHES ||--o{ SETTLEMENT : "contains (1:N)"

    CUSTOMERS {
        bigserial customer_id PK
        varchar first_name
        varchar last_name
        varchar full_name
        varchar email UK
        varchar phone UK
        varchar kyc_status
        timestamptz created_at
    }

    ACCOUNTS {
        bigserial account_id PK
        bigint customer_id FK
        varchar account_number UK
        varchar account_type
        numeric balance
        numeric available_balance
        varchar currency
        varchar status
        timestamptz created_at
    }

    TRANSACTION_DETAILS {
        bigserial transaction_id PK
        bigint account_id FK
        varchar transaction_reference UK
        varchar transaction_type
        numeric amount
        varchar transaction_status
        timestamptz transaction_date
    }

    LEDGER {
        bigserial ledger_id PK
        bigint transaction_id FK
        numeric debit
        numeric credit
        numeric balance_after
        timestamptz ledger_date
    }

    LOANS {
        bigserial loan_id PK
        bigint customer_id FK
        bigint account_id FK
        varchar loan_number UK
        varchar loan_type
        numeric principal_amount
        numeric annual_interest_rate
        integer tenure_months
        numeric monthly_emi
        numeric outstanding_principal
        varchar loan_status
    }

    EMI_SCHEDULE {
        bigserial emi_id PK
        bigint loan_id FK
        integer emi_number
        date due_date
        numeric emi_amount
        numeric principal_component
        numeric interest_component
        varchar emi_status
    }

    EMI_COLLECTIONS {
        bigserial collection_id PK
        bigint emi_id FK
        bigint loan_id FK
        bigint customer_id FK
        numeric payment_amount
        varchar payment_method
        varchar transaction_reference UK
        varchar collection_status
        timestamptz payment_date
    }

    SETTLEMENT_BATCHES {
        varchar batch_id PK
        varchar clearing_window
        varchar clearing_method
        numeric gross_volume
        numeric net_obligation
        varchar status
        timestamptz settled_at
    }

    CUSTOMER_SECURITY_CREDENTIALS {
        bigserial credential_id PK
        bigint customer_id FK,UK
        varchar passcode_hash
        integer failed_attempts
        boolean is_locked
    }

    LIVENESS_VERIFICATION {
        bigserial verification_id PK
        bigint customer_id FK
        varchar session_id UK
        numeric confidence_score
        varchar challenges_passed
        varchar status
        timestamptz created_at
    }

    FRAUD_EVENTS {
        bigserial event_id PK
        bigint customer_id
        varchar transaction_reference
        integer fraud_score
        varchar threat_level
        text reason
        varchar status
        timestamptz created_at
    }

    RISK_ASSESSMENT {
        bigserial assessment_id PK
        bigint customer_id
        varchar transaction_reference
        integer risk_score
        varchar risk_level
        varchar decision
        text reasons
        timestamptz assessed_at
    }

    AUDIT_LOG {
        bigserial audit_id PK
        bigint user_id
        varchar username
        varchar action
        varchar module
        varchar entity
        text details
        timestamptz created_at
    }
```

---

## 🌟 Key Platform Capabilities

1. **🏛️ Core Banking Operations**
   - Customer account lifecycle (Savings, Current, Term Deposits).
   - Automated double-entry ledger balancing with real-time credit/debit triggers.
   - Comprehensive account statement exports in PDF and Excel formats.

2. **💳 Loan Servicing & Collections Engine**
   - Loan origination, multi-tier approval workflows, and principal disbursement.
   - Reducing-balance EMI amortization calculator and repayment schedule tracker.
   - Automated collections receipt generation and delinquency penalty calculation.

3. **⚡ Interbank Settlement Engine**
   - Real-time gross settlement (RTGS) and multi-party net clearing batch execution.
   - Bank-to-bank balance reconciliation and settlement audit logs.

4. **🛡️ Real-Time Fraud Detection Engine**
   - High-speed rule evaluation based purely on transaction context (velocity, geofencing, IP anomalies, device signatures, authentication failures).
   - Immediate threat score computation (`SAFE`, `SUSPICIOUS`, `UNDER_REVIEW`, `BLOCKED`).
   - Live activity monitoring feed.

5. **👁️ Biometric KYC & Face Liveness Verification**
   - Client-side AI face mesh analysis powered by **Google MediaPipe Vision**.
   - Active user challenge detection (Blink, Turn Left/Right, Smile).
   - Tamper-proof verification certificate storage.

6. **📜 Enterprise Audit Trail**
   - Centralized, immutable audit logging capturing actor, action, timestamp, entity ID, and IP address.

---

## 🚀 Quick Start Guide

### 1. Database Setup
1. Open PostgreSQL (e.g. Supabase, AWS RDS, or local pgAdmin).
2. Execute the master schema:
   ```bash
   psql -h <HOST> -U <USERNAME> -d <DB> -f Database/fincore_master_schema.sql
   ```
   *Detailed guide: [Database/README.md](./Database/README.md)*

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Configure database credentials in `src/main/resources/application.properties`.
3. Launch the Spring Boot application:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *The backend will run on `http://localhost:8080`.*  
   *Detailed guide: [Backend/README.md](./Backend/README.md)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies and start the dev server:
   ```bash
   npm install
   npm start
   ```
3. Access the web interface at `http://localhost:4200`.  
   *Detailed guide: [Frontend/README.md](./Frontend/README.md)*

---

## 📚 Component Documentation

- 🌐 **[Frontend Documentation](./Frontend/README.md)** - Component architecture, UI routes, MediaPipe KYC, and export tools.
- ⚙️ **[Backend Documentation](./Backend/README.md)** - Spring Boot REST APIs, services, security, and endpoints.
- 🗄️ **[Database Documentation](./Database/README.md)** - Complete Mermaid ER Diagram, SQL schemas, entity relationships, triggers, and analytical queries.
