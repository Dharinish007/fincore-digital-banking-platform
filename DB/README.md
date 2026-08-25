# 🔐 Secure Digital Banking Platform

A structured **Payment & Transfer Database** designed for the **Secure Digital Banking Platform**. This database manages the complete payment lifecycle — from payment initiation and beneficiary verification to fraud checking and payment processing.

---

## 📌 Overview

The Payment & Transfer module provides database support for:

- 💳 Payment Initiation
- 👤 Beneficiary Management
- 🔐 Beneficiary Verification
- 🛡️ Fraud Detection
- 💰 Payment Status Tracking
- 🔄 Fund Transfer Management
- 📊 Transaction Risk Evaluation

The schema is designed using **MySQL** and integrates with the existing `digital_banking` database, `customer` table, and `account` table.

---

## 🛠️ Technology Used

| **Technology** | **Purpose** |
|---|---|
| **MySQL** | Database Management System |
| **phpMyAdmin / MySQL Workbench** | Database Administration |
| **SQL** | Database Schema & Queries |
| **PHP** | Database Connectivity / Backend Integration |
| **MySQLi** | PHP–MySQL Connectivity |
| **XAMPP** | Local Development Environment |

---

## 🗄️ Database

```sql
USE digital_banking;
```
The Payment & Transfer module contains 3 main tables:

digital_banking
│
├── customer
│
├── account
│
├── beneficiary
│
├── payment
│
└── fraud_check
📋 Database Tables
1️⃣ Beneficiary
beneficiary

Stores beneficiary information used for customer fund transfers.

Column	Data Type	Description
beneficiary_id	BIGINT	Primary Key
customer_id	BIGINT	Customer reference
beneficiary_name	VARCHAR(100)	Beneficiary name
account_no	VARCHAR(20)	Beneficiary account number
ifsc_code	VARCHAR(20)	Bank IFSC code
bank_name	VARCHAR(100)	Beneficiary bank
beneficiary_type	ENUM	Internal / External
status	ENUM	Pending / Verified / Blocked
created_at	TIMESTAMP	Record creation time
Beneficiary Type
Internal
External
Beneficiary Status
Pending
Verified
Blocked
Relationship
customer
   │
   │ 1
   │
   │ *
   ▼
beneficiary

A customer can have multiple beneficiaries.

2️⃣ Payment
payment

Stores customer payment and fund transfer information.

Column	Data Type	Description
payment_id	BIGINT	Primary Key
from_account_no	VARCHAR(20)	Sender account
to_account_no	VARCHAR(20)	Receiver account
beneficiary_id	BIGINT	Beneficiary reference
amount	DECIMAL(15,2)	Payment amount
payment_type	ENUM	Transfer / Bill Payment / Other
payment_mode	ENUM	IMPS / NEFT / RTGS / UPI
payment_status	ENUM	Pending / Processing / Success / Failed / Cancelled
transaction_ref	VARCHAR(50)	Unique transaction reference
description	TEXT	Payment description
initiated_at	DATETIME	Payment initiation time
updated_at	DATETIME	Last update time
Payment Type
Transfer
Bill Payment
Other
Payment Mode
IMPS
NEFT
RTGS
UPI
Payment Status
Pending
Processing
Success
Failed
Cancelled
Relationships
account
   │
   ├──────────────► payment
   │
beneficiary
   │
   └──────────────► payment

A payment is associated with a sender account, receiver account, and beneficiary.

3️⃣ Fraud Check
fraud_check

Stores fraud evaluation results associated with a payment.

The table helps identify potentially suspicious transactions using risk scores and predefined fraud rules.

Column	Data Type	Description
fraud_check_id	BIGINT	Primary Key
payment_id	BIGINT	Payment reference
risk_score	INT	Transaction risk score
fraud_status	ENUM	Pending / Safe / Suspicious / Blocked
rule_triggered	VARCHAR(255)	Fraud detection rule
remarks	TEXT	Fraud evaluation remarks
checked_at	DATETIME	Fraud check timestamp
Fraud Status
Pending
Safe
Suspicious
Blocked
Relationship
payment
   │
   │ 1
   │
   │ 1
   ▼
fraud_check

Each payment can have one fraud-check record.

🔗 Entity Relationship Overview
                    ┌──────────────────┐
                    │     customer     │
                    │──────────────────│
                    │ customer_id (PK) │
                    └────────┬─────────┘
                             │
                             │
                             ▼
                    ┌──────────────────┐
                    │   beneficiary   │
                    │──────────────────│
                    │ beneficiary_id  │
                    │     (PK)        │
                    │ customer_id (FK)│
                    │ beneficiary_name│
                    │ account_no      │
                    │ ifsc_code       │
                    │ bank_name       │
                    │ status          │
                    └────────┬─────────┘
                             │
                             │
                             ▼
┌──────────────────┐   ┌──────────────────┐
│     account      │   │     payment      │
│──────────────────│   │──────────────────│
│ account_no (PK)  │◄──│ from_account_no  │
│ customer_id (FK) │   │ to_account_no    │
│ account_type     │   │ beneficiary_id   │
│ balance          │   │ amount           │
│ status           │   │ payment_type     │
└──────────────────┘   │ payment_mode     │
                       │ payment_status    │
                       │ transaction_ref   │
                       └────────┬─────────┘
                                │
                                │
                                ▼
                       ┌──────────────────┐
                       │   fraud_check    │
                       │──────────────────│
                       │ fraud_check_id   │
                       │ payment_id (FK)  │
                       │ risk_score       │
                       │ fraud_status     │
                       │ rule_triggered   │
                       │ remarks          │
                       └──────────────────┘
🔐 Foreign Key Relationships
Child Table	Foreign Key	Parent Table	Parent Key
beneficiary	customer_id	customer	customer_id
payment	from_account_no	account	account_no
payment	to_account_no	account	account_no
payment	beneficiary_id	beneficiary	beneficiary_id
fraud_check	payment_id	payment	payment_id

Foreign keys maintain referential integrity between customers, accounts, beneficiaries, payments, and fraud-check records.

🔄 Payment & Transfer Flow
Customer
   │
   ▼
Payment Initiation
   │
   ▼
Beneficiary Verification
   │
   ├── Failed ───────► Payment Rejected
   │
   └── Verified
          │
          ▼
      Fraud Check
          │
      ┌───┴────┐
      ▼        ▼
    Safe    Suspicious
      │        │
      ▼        ▼
 Processing   Review / Block
      │
      ▼
Payment Success
🛡️ Fraud Detection

The fraud-check module evaluates each payment using a risk score and predefined transaction rules.

Example Risk Levels
0 – 29
Safe

30 – 69
Suspicious

70 – 100
Blocked
Fraud Check Data
risk_score
fraud_status
rule_triggered
remarks
checked_at

The fraud result is stored against the corresponding payment_id.

📊 Data Integrity

The schema implements several database-level constraints.

Primary Keys

Every table has a unique primary key:

beneficiary  → beneficiary_id
payment      → payment_id
fraud_check  → fraud_check_id
Foreign Keys

Foreign keys ensure that:

customer_id
account_no
beneficiary_id
payment_id

always reference valid records.

UNIQUE Constraint

The transaction_ref field in the payment table is unique.

transaction_ref → UNIQUE

This prevents duplicate transaction references.

NOT NULL

Important fields such as:

customer_id
beneficiary_name
account_no
from_account_no
to_account_no
amount
payment_id

cannot contain NULL values.

ENUM

ENUM values restrict important status and type fields to predefined valid values.

📁 Project Structure
Digital-Banking-Database/
│
├── SQL/
│   ├── 07_create_milestone3_tables.sql
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
🚀 Setup Instructions
1. Start XAMPP

Start:

Apache
MySQL
2. Open phpMyAdmin

Select:

digital_banking
3. Create Milestone 3 Tables

Run:

07_create_milestone3_tables.sql
4. Insert Beneficiary Data

Run:

11_insert_beneficiary_data.sql
5. Insert Payment Data

Run:

12_insert_payment_data.sql
6. Insert Fraud Check Data

Run:

13_insert_fraud_check_data.sql
7. Verify Tables

Run:

SHOW TABLES;

The following tables should be available:

beneficiary
payment
fraud_check
🧪 Basic Verification Queries
View Beneficiaries
SELECT *
FROM beneficiary;
View Payments
SELECT *
FROM payment;
View Fraud Checks
SELECT *
FROM fraud_check;
View Complete Payment & Fraud Information
SELECT
    p.payment_id,
    p.from_account_no,
    p.to_account_no,
    p.amount,
    p.payment_mode,
    p.payment_status,
    p.transaction_ref,
    f.risk_score,
    f.fraud_status
FROM payment p
LEFT JOIN fraud_check f
    ON p.payment_id = f.payment_id;
View Payment with Beneficiary
SELECT
    p.payment_id,
    b.beneficiary_name,
    b.account_no,
    p.amount,
    p.payment_mode,
    p.payment_status
FROM payment p
JOIN beneficiary b
    ON p.beneficiary_id = b.beneficiary_id;
✅ Key Features
✔ Customer-linked beneficiary management
✔ Internal and external beneficiary support
✔ Beneficiary verification status
✔ Multiple payment modes
✔ Payment status tracking
✔ Unique transaction references
✔ Account-linked fund transfers
✔ Fraud risk scoring
✔ Suspicious transaction detection
✔ Fraud status tracking
✔ Referential integrity using foreign keys
✔ PHP–MySQL integration
🔒 Database Design Benefits

The Payment & Transfer database separates different responsibilities into dedicated tables:

Customer
   ↓
Beneficiary
   ↓
Payment
   ↓
Fraud Check

This modular design makes the database easier to:

Maintain
Query
Extend
Integrate with backend APIs
Integrate with Angular frontend
Monitor payment risks
Manage secure fund transfers
📌 Module

Secure Digital Banking Platform — Payment & Transfer Module

Database Technology

MySQL

Database
digital_banking
📌 Conclusion

The Payment & Transfer Database provides a structured foundation for secure digital payment processing. It manages beneficiaries, payment transactions, and fraud-check results while maintaining strong relationships between customers, accounts, payments, and fraud records through database-level constraints and foreign keys.
