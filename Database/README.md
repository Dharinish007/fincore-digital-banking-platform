# 🗄️ FinCore Unified Database

This directory contains the database setup and SQL scripts for the **FinCore Digital Banking Platform**, combining all database designs, entities, constraints, and seeds from Milestones 1, 2, 3, and 4.

---

## 📂 File Index

| File | Milestone | Description |
|---|---|---|
| **[fincore_master_schema.sql](./fincore_master_schema.sql)** | **Unified (All)** | **Consolidated Master PostgreSQL Script** containing the complete schema across all 4 milestones: Core Banking, Loan Servicing, Settlement Engine, and Biometric Security, with automated balance triggers and sample data. |
| **[database_queries.sql](./database_queries.sql)** | **All Modules** | **Production & Analytical SQL Queries**: Account statements, EMI reconciliation, delinquent loan tracking, settlement netting, AI risk flagging, and security audit logs. |
| **[milestone-1-core-banking.sql](./milestone-1-core-banking.sql)** | Milestone 1 | Customer profiles, bank accounts, double-entry ledger, statement archive, and deposit procedure. |
| **[milestone-2-loan-management.sql](./milestone-2-loan-management.sql)** | Milestone 2 | Loan portfolio, loan disbursements, reducing-balance EMI schedule, collections receipts, and loan transaction records. |
| **[milestone-3-enterprise-settlement.sql](./milestone-3-enterprise-settlement.sql)** | Milestone 3 | Interbank netting batches, settlement allocation records, fraud detection events, and notification delivery logs. |
| **[milestone-4-security-liveness.sql](./milestone-4-security-liveness.sql)** | Milestone 4 | Customer security credentials, MediaPipe AI face liveness verifications, transaction risk assessments, and audit logs. |

---

## 🏛️ Schema Architecture

```
Customers
   │
   ├── Accounts ────── Transaction Details ──── Ledger
   │      │                    │
   │      │                    └─► Statement Archive
   │      │
   │      └── Loans ────── Loan Disbursement
   │             │
   │             ├─────── EMI Schedule ────── EMI Collections
   │             │
   │             └─────── Settlement Engine
   │
   ├── Customer Security Credentials (BCrypt Passcode)
   ├── MediaPipe Liveness Verifications (AI Face Landmark Challenges)
   ├── AI Risk Assessments (Transaction Scoring & Decisioning)
   ├── Fraud Alert Events
   ├── Multi-Channel Notifications (SMS, Email, Push)
   └── Centralized Immutable Audit Trail
```

---

## 🚀 How to Execute

### Option 1: Run the Complete Master Schema (Recommended)
Connect to your PostgreSQL instance (e.g. Supabase, AWS RDS, or local PostgreSQL):

```bash
psql -h <HOST> -p <PORT> -U <USERNAME> -d <DATABASE_NAME> -f fincore_master_schema.sql
```

### Option 2: Run Individual Milestone Scripts
If you want to run or test a specific module separately:

```bash
# Milestone 1: Core Banking
psql -h <HOST> -U <USERNAME> -d <DB> -f milestone-1-core-banking.sql

# Milestone 2: Loan Management
psql -h <HOST> -U <USERNAME> -d <DB> -f milestone-2-loan-management.sql

# Milestone 3: Settlement Engine
psql -h <HOST> -U <USERNAME> -d <DB> -f milestone-3-enterprise-settlement.sql

# Milestone 4: Security & Liveness
psql -h <HOST> -U <USERNAME> -d <DB> -f milestone-4-security-liveness.sql
```
