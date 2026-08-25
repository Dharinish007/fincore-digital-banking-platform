# 💳 FinCore Digital Banking Platform – Milestone 3

## 💰 Payment & Transfer Management Database

The **Payment & Transfer Database** is a core module of the **FinCore Digital Banking Platform**. It manages beneficiary registration, fund transfers, payment processing, and fraud detection.

The database ensures **secure payments, transaction tracking, beneficiary management, fraud monitoring, and data integrity** through primary keys, foreign keys, unique constraints, and appropriate data types.

---

## 📌 Module Overview

| Feature                   | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| 👤 Beneficiary Management | Stores and manages customer beneficiaries                    |
| 💸 Payment Processing     | Handles transfers and payments between accounts              |
| 🔍 Fraud Detection        | Evaluates payments for potential fraudulent activity         |
| 📊 Risk Monitoring        | Stores fraud risk scores and verification status             |
| 🔐 Data Integrity         | Maintained using PK, FK, UNIQUE and NOT NULL constraints     |
| 📝 Transaction Tracking   | Maintains payment references, amounts, status and timestamps |

---

# 🗄️ Database Details

| Property             | Value                |
| -------------------- | -------------------- |
| Database Name        | `digital_banking`    |
| Database System      | MySQL                |
| Development Tool     | XAMPP / phpMyAdmin   |
| Module               | Payment & Transfer   |
| Milestone            | M3                   |
| Backend Integration  | Spring Boot REST API |
| Frontend Integration | Angular              |

---

# 📋 Database Tables

## 1. 👤 Beneficiary Table

The `beneficiary` table stores the beneficiaries added by customers for making payments and fund transfers.

| Field              | Data Type    | Constraints                 | Description                        |
| ------------------ | ------------ | --------------------------- | ---------------------------------- |
| `beneficiary_id`   | BIGINT       | PRIMARY KEY, AUTO_INCREMENT | Unique beneficiary ID              |
| `customer_id`      | BIGINT       | NOT NULL, FOREIGN KEY       | Customer who added the beneficiary |
| `beneficiary_name` | VARCHAR(100) | NOT NULL                    | Name of the beneficiary            |
| `account_no`       | VARCHAR(20)  | NOT NULL                    | Beneficiary bank account number    |
| `ifsc_code`        | VARCHAR(20)  | NOT NULL                    | Beneficiary bank IFSC code         |
| `bank_name`        | VARCHAR(100) | NOT NULL                    | Beneficiary bank name              |
| `status`           | ENUM         | DEFAULT 'Active'            | Beneficiary status                 |
| `created_at`       | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Beneficiary creation time          |

### Relationship

`customer.customer_id` → `beneficiary.customer_id`

---

## 2. 💸 Payment Table

The `payment` table stores payment and fund transfer details between bank accounts.

| Field               | Data Type     | Constraints                 | Description                             |
| ------------------- | ------------- | --------------------------- | --------------------------------------- |
| `payment_id`        | BIGINT        | PRIMARY KEY, AUTO_INCREMENT | Unique payment ID                       |
| `customer_id`       | BIGINT        | NOT NULL, FOREIGN KEY       | Customer initiating the payment         |
| `source_account_no` | VARCHAR(20)   | NOT NULL, FOREIGN KEY       | Account from which money is transferred |
| `beneficiary_id`    | BIGINT        | NOT NULL, FOREIGN KEY       | Selected beneficiary                    |
| `amount`            | DECIMAL(15,2) | NOT NULL                    | Payment amount                          |
| `payment_type`      | ENUM          | NOT NULL                    | Type of payment                         |
| `transaction_ref`   | VARCHAR(100)  | UNIQUE, NOT NULL            | Unique payment transaction reference    |
| `description`       | VARCHAR(255)  | NULL                        | Payment description                     |
| `payment_status`    | ENUM          | DEFAULT 'Pending'           | Current payment status                  |
| `created_at`        | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP   | Payment creation time                   |
| `updated_at`        | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP   | Last update time                        |

### Relationship

`customer.customer_id` → `payment.customer_id`

`account.account_no` → `payment.source_account_no`

`beneficiary.beneficiary_id` → `payment.beneficiary_id`

---

## 3. 🔍 Fraud Check Table

The `fraud_check` table stores fraud evaluation results for each payment.

| Field            | Data Type    | Constraints                   | Description                 |
| ---------------- | ------------ | ----------------------------- | --------------------------- |
| `fraud_check_id` | BIGINT       | PRIMARY KEY, AUTO_INCREMENT   | Unique fraud check ID       |
| `payment_id`     | BIGINT       | NOT NULL, UNIQUE, FOREIGN KEY | Payment being evaluated     |
| `risk_score`     | INT          | NOT NULL, DEFAULT 0           | Calculated fraud risk score |
| `risk_level`     | ENUM         | NOT NULL                      | Risk classification         |
| `check_status`   | ENUM         | DEFAULT 'Pending'             | Fraud verification status   |
| `fraud_reason`   | VARCHAR(255) | NULL                          | Reason for fraud flag       |
| `checked_at`     | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP     | Fraud check timestamp       |

### Relationship

`payment.payment_id` → `fraud_check.payment_id`

### Fraud Flow

```text
Payment Created
      │
      ▼
Fraud Check
      │
      ▼
Risk Score Calculation
      │
 ┌────┴─────┐
 ▼          ▼
Low/Medium  High Risk
 ▼          ▼
Proceed     Flag / Review
```

---

# 🔗 Table Relationships

```text
                    ┌──────────────┐
                    │   CUSTOMER   │
                    └──────┬───────┘
                           │
                           │ customer_id
                           ▼
                    ┌──────────────┐
                    │ BENEFICIARY  │
                    └──────┬───────┘
                           │
                           │ beneficiary_id
                           ▼
┌──────────────┐    ┌──────────────┐
│   ACCOUNT    │───▶│    PAYMENT   │
└──────────────┘    └──────┬───────┘
                           │
                           │ payment_id
                           ▼
                    ┌──────────────┐
                    │ FRAUD_CHECK  │
                    └──────────────┘
```

---

# 🔄 Payment & Transfer Workflow

```text
Customer
   │
   ▼
Select Beneficiary
   │
   ▼
Enter Payment Details
   │
   ▼
Payment Created
   │
   ▼
Fraud Check
   │
   ├───────────────┐
   ▼               ▼
Low Risk        High Risk
   │               │
   ▼               ▼
Process Payment   Flag Payment
   │               │
   ▼               ▼
Update Status    Manual Review
   │
   ▼
Transaction Completed
```

---

# 🔐 Database Constraints

| Constraint     | Purpose                                   |
| -------------- | ----------------------------------------- |
| PRIMARY KEY    | Uniquely identifies each record           |
| FOREIGN KEY    | Maintains relationships between tables    |
| UNIQUE         | Prevents duplicate transaction references |
| NOT NULL       | Ensures mandatory fields contain values   |
| ENUM           | Restricts fields to predefined values     |
| DEFAULT        | Automatically assigns predefined values   |
| AUTO_INCREMENT | Generates unique numeric IDs              |

---

# 🛡️ Fraud Detection

The fraud detection module helps identify suspicious payment activity.

### Fraud Check Parameters

| Parameter      | Purpose                                    |
| -------------- | ------------------------------------------ |
| `risk_score`   | Represents the calculated fraud risk       |
| `risk_level`   | Categorizes payment risk                   |
| `check_status` | Tracks fraud verification                  |
| `fraud_reason` | Stores the reason for suspicious activity  |
| `checked_at`   | Records when the fraud check was performed |

### Risk Processing

```text
Risk Score
    │
    ▼
┌───────────────┐
│ Risk Analysis │
└───────┬───────┘
        │
   ┌────┼────┐
   ▼    ▼    ▼
  Low  Medium High
   │    │     │
   ▼    ▼     ▼
Proceed Review Block/Flag
```

---

# 📂 Database SQL Files

```text
Digital-Banking-Database/
│
├── ├── 10_create_milestone3_tables.sql
│   ├── 11_insert_beneficiary_data.sql
│   ├── 12_insert_payment_data.sql
│   └── 13_insert_fraud_check_data.sql
│
├── PHP/
│   ├── db_connect.php
│   ├── beneficiary_verification.php
│   ├── payment_initiation.php
│   └── fraud_check.php
│
└── README.md
```

---

# 🧪 Data Integrity & Validation

The M3 database maintains data consistency by:

* Using **foreign key relationships** between related tables.
* Preventing duplicate `transaction_ref` values using a **UNIQUE constraint**.
* Ensuring every payment is associated with a valid customer, account and beneficiary.
* Ensuring every fraud check is associated with a valid payment.
* Using appropriate `DECIMAL(15,2)` precision for monetary values.
* Using controlled `ENUM` values for payment and fraud statuses.

---

# 🚀 M3 Database Objectives

* ✅ Beneficiary management
* ✅ Payment and fund transfer management
* ✅ Payment status tracking
* ✅ Unique transaction reference generation
* ✅ Fraud risk evaluation
* ✅ Fraud status tracking
* ✅ Referential integrity
* ✅ Secure and structured payment data management

---

## 👨‍💻 Database Role

**Database Developer:** Raghvendra Singh Pawar

**Module:** Payment & Transfer Management

**Milestone:** M3 – Payment & Transfer
