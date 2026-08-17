# 🏦 Loan Management Database

A structured **Loan Management Database** designed for the **Digital Banking Platform**.
This database manages the complete loan lifecycle — from loan application and credit verification to EMI calculation and loan history.

---

## 📌 Overview

The Loan Management module provides database support for:

* 📝 Loan Applications
* 📊 Credit Checks
* 💰 EMI Calculations
* 📚 Loan History
* 👤 Customer-wise Loan Management
* 🔄 Loan Status Tracking

The schema is designed using **MySQL** and integrates with the existing `digital_banking` database and `customer` table.

---

## 🛠️ Technology Used

| Technology                       | Purpose                                     |
| -------------------------------- | ------------------------------------------- |
| **MySQL**                        | Database Management System                  |
| **phpMyAdmin / MySQL Workbench** | Database Administration                     |
| **SQL**                          | Database Schema & Queries                   |
| **PHP**                          | Database Connectivity / Backend Integration |
| **XAMPP**                        | Local Development Environment               |

---

## 🗄️ Database

```sql
USE digital_banking;
```

The Loan Management module contains **4 main tables**:

```text
digital_banking
│
├── customer
│
├── loan_application
│
├── loan_history
│
├── credit_check
│
└── emi_calculation
```

---

# 📋 Database Tables

## 1️⃣ Loan Application

### `loan_application`

Stores all loan applications submitted by customers.

| Column               | Data Type     | Description                   |
| -------------------- | ------------- | ----------------------------- |
| `loan_id`            | BIGINT        | Primary Key                   |
| `customer_id`        | BIGINT        | Customer reference            |
| `loan_type`          | ENUM          | Type of loan                  |
| `loan_amount`        | DECIMAL(15,2) | Requested loan amount         |
| `tenure_months`      | INT           | Loan tenure                   |
| `interest_rate`      | DECIMAL(5,2)  | Applicable interest rate      |
| `purpose`            | VARCHAR(255)  | Purpose of loan               |
| `application_status` | ENUM          | Pending / Approved / Rejected |
| `application_date`   | TIMESTAMP     | Application creation date     |

### Supported Loan Types

```text
Personal
Home
Vehicle
Education
Gold
Other
```

### Application Status

```text
Pending
Approved
Rejected
```

### Relationship

```text
customer
   │
   │ 1
   │
   │ *
   ▼
loan_application
```

A customer can submit multiple loan applications.

---

# 2️⃣ Loan History

### `loan_history`

Maintains the historical information of loans associated with customers.

This table helps track the complete lifecycle of a loan, including active, closed, and defaulted loans.

| Column               | Data Type     | Description                 |
| -------------------- | ------------- | --------------------------- |
| `history_id`         | BIGINT        | Primary Key                 |
| `customer_id`        | BIGINT        | Customer reference          |
| `loan_id`            | BIGINT        | Loan application reference  |
| `loan_type`          | ENUM          | Type of loan                |
| `loan_amount`        | DECIMAL(15,2) | Original loan amount        |
| `outstanding_amount` | DECIMAL(15,2) | Remaining loan amount       |
| `loan_status`        | ENUM          | Active / Closed / Defaulted |
| `start_date`         | DATE          | Loan start date             |
| `end_date`           | DATE          | Loan closure date           |
| `created_at`         | TIMESTAMP     | Record creation date        |

### Loan Status

```text
Active
Closed
Defaulted
```

### Relationships

```text
customer
   │
   └──────────────► loan_history

loan_application
   │
   └──────────────► loan_history
```

---

# 3️⃣ Credit Check

### `credit_check`

Stores the credit evaluation information associated with a loan application.

It can be used to evaluate a customer's creditworthiness before approving a loan.

| Column                 | Data Type     | Description                |
| ---------------------- | ------------- | -------------------------- |
| `credit_check_id`      | BIGINT        | Primary Key                |
| `loan_id`              | BIGINT        | Loan application reference |
| `credit_score`         | INT           | Customer credit score      |
| `monthly_income`       | DECIMAL(15,2) | Monthly income             |
| `existing_loan_count`  | INT           | Number of existing loans   |
| `previous_loan_status` | ENUM          | Previous loan availability |
| `credit_status`        | ENUM          | Pass / Review / Fail       |
| `remarks`              | VARCHAR(255)  | Credit evaluation remarks  |
| `checked_at`           | TIMESTAMP     | Credit check timestamp     |

### Previous Loan Status

```text
Yes
No
```

### Credit Status

```text
Pass
Review
Fail
```

### Relationship

```text
loan_application
       │
       │ 1
       │
       │ *
       ▼
  credit_check
```

---

# 4️⃣ EMI Calculation

### `emi_calculation`

Stores the EMI calculation details for a loan.

The table keeps the calculated monthly EMI, total interest, and total payable amount.

| Column             | Data Type     | Description                |
| ------------------ | ------------- | -------------------------- |
| `emi_id`           | BIGINT        | Primary Key                |
| `loan_id`          | BIGINT        | Loan application reference |
| `principal_amount` | DECIMAL(15,2) | Principal loan amount      |
| `interest_rate`    | DECIMAL(5,2)  | Annual interest rate       |
| `tenure_months`    | INT           | Loan tenure                |
| `monthly_emi`      | DECIMAL(15,2) | Monthly EMI                |
| `total_interest`   | DECIMAL(15,2) | Total interest payable     |
| `total_payable`    | DECIMAL(15,2) | Principal + interest       |
| `calculated_at`    | TIMESTAMP     | Calculation timestamp      |

### Relationship

```text
loan_application
       │
       │ 1
       │
       │ *
       ▼
emi_calculation
```

---

# 🔗 Entity Relationship Overview

```text
                         ┌──────────────────┐
                         │     customer     │
                         │──────────────────│
                         │ customer_id (PK) │
                         └────────┬─────────┘
                                  │
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
          ┌──────────────────┐        ┌──────────────────┐
          │ loan_application │        │   loan_history   │
          │──────────────────│        │──────────────────│
          │ loan_id (PK)     │◄──────►│ history_id (PK)  │
          │ customer_id (FK) │        │ customer_id (FK) │
          │ loan_type        │        │ loan_id (FK)     │
          │ loan_amount      │        │ loan_amount      │
          │ tenure_months    │        │ outstanding_amt  │
          │ interest_rate    │        │ loan_status      │
          │ purpose          │        │ start_date       │
          │ status           │        │ end_date         │
          └────────┬─────────┘        └──────────────────┘
                   │
             ┌─────┴─────┐
             │           │
             ▼           ▼
   ┌────────────────┐  ┌──────────────────┐
   │  credit_check  │  │ emi_calculation  │
   │────────────────│  │──────────────────│
   │ credit_id (PK) │  │ emi_id (PK)      │
   │ loan_id (FK)   │  │ loan_id (FK)     │
   │ credit_score   │  │ principal_amount │
   │ income         │  │ interest_rate    │
   │ loan_count     │  │ tenure_months    │
   │ credit_status  │  │ monthly_emi      │
   └────────────────┘  │ total_interest   │
                       │ total_payable    │
                       └──────────────────┘
```

---

# 🔐 Foreign Key Relationships

| Child Table        | Foreign Key   | Parent Table       | Parent Key    |
| ------------------ | ------------- | ------------------ | ------------- |
| `loan_application` | `customer_id` | `customer`         | `customer_id` |
| `loan_history`     | `customer_id` | `customer`         | `customer_id` |
| `loan_history`     | `loan_id`     | `loan_application` | `loan_id`     |
| `credit_check`     | `loan_id`     | `loan_application` | `loan_id`     |
| `emi_calculation`  | `loan_id`     | `loan_application` | `loan_id`     |

Foreign keys maintain **referential integrity** between customers, loans, credit checks, EMI calculations, and loan history.

---

# 🔄 Loan Processing Flow

```text
Customer
   │
   ▼
Loan Application
   │
   ▼
Credit Check
   │
   ├── Fail ───────► Loan Rejected
   │
   └── Pass/Review
           │
           ▼
      Loan Approval
           │
           ▼
      EMI Calculation
           │
           ▼
       Loan Active
           │
           ▼
      Loan History
           │
      ┌────┴────┐
      ▼         ▼
   Closed    Defaulted
```

---

# 💰 EMI Calculation

The EMI table stores the output of the standard reducing-balance EMI calculation.

### Formula

```text
EMI = P × R × (1 + R)^N
     ─────────────────────
        (1 + R)^N - 1
```

Where:

```text
P = Principal Loan Amount

R = Monthly Interest Rate
    Annual Interest Rate / (12 × 100)

N = Loan Tenure in Months
```

### Example

For:

```text
Principal       = ₹5,00,000
Interest Rate   = 10%
Tenure          = 60 months
```

The calculated values can be stored in:

```text
principal_amount
interest_rate
tenure_months
monthly_emi
total_interest
total_payable
```

---

# 📊 Data Integrity

The schema implements several database-level constraints:

### Primary Keys

Every table has a unique primary key:

```text
loan_application → loan_id
loan_history     → history_id
credit_check     → credit_check_id
emi_calculation  → emi_id
```

### Foreign Keys

Foreign keys ensure that loan-related records reference valid customers and loan applications.

### NOT NULL

Mandatory fields such as:

```text
customer_id
loan_type
loan_amount
tenure_months
interest_rate
```

cannot contain NULL values.

### ENUM

ENUM values restrict columns to predefined valid values, reducing invalid status/type entries.

### DEFAULT Values

Examples:

```text
application_status → Pending
outstanding_amount → 0.00
existing_loan_count → 0
previous_loan_status → No
credit_status → Review
```

---

# 📁 Suggested Project Structure

```text
Digital-Banking-Database/
│
├── sql/
│   ├── loan_application.sql
│   ├── loan_history.sql
│   ├── credit_check.sql
│   └── emi_calculation.sql
│
├── php/
│   ├── db_connect.php
│   ├── loan_application.php
│   ├── credit_check.php
│   └── emi_calculation.php
│
└── README.md
```

---

# 🚀 Setup Instructions

### 1. Start XAMPP

Start:

```text
Apache
MySQL
```

### 2. Open phpMyAdmin

Create or select:

```sql
digital_banking
```

### 3. Verify Customer Table

The existing `customer` table must contain:

```text
customer_id
```

as its primary key.

### 4. Execute Loan Schema

Run the loan-management SQL script in phpMyAdmin.

### 5. Verify Tables

Run:

```sql
SHOW TABLES;
```

You should see:

```text
loan_application
loan_history
credit_check
emi_calculation
```

### 6. Verify Table Structures

```sql
DESCRIBE loan_application;
DESCRIBE loan_history;
DESCRIBE credit_check;
DESCRIBE emi_calculation;
```

---

# 🧪 Basic Verification Queries

### View Loan Applications

```sql
SELECT * 
FROM loan_application;
```

### View Loan History

```sql
SELECT * 
FROM loan_history;
```

### View Credit Checks

```sql
SELECT * 
FROM credit_check;
```

### View EMI Calculations

```sql
SELECT * 
FROM emi_calculation;
```

### View Customer-wise Loans

```sql
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    l.loan_id,
    l.loan_type,
    l.loan_amount,
    l.application_status
FROM customer c
JOIN loan_application l
    ON c.customer_id = l.customer_id;
```

### View Loan with EMI Details

```sql
SELECT
    l.loan_id,
    l.loan_type,
    l.loan_amount,
    e.monthly_emi,
    e.total_interest,
    e.total_payable
FROM loan_application l
JOIN emi_calculation e
    ON l.loan_id = e.loan_id;
```

---

# ✅ Key Features

* ✔ Customer-linked loan applications
* ✔ Multiple loan types
* ✔ Loan approval status tracking
* ✔ Credit score and income evaluation
* ✔ Existing loan tracking
* ✔ EMI calculation storage
* ✔ Total interest calculation
* ✔ Total payable amount tracking
* ✔ Loan lifecycle management
* ✔ Referential integrity using foreign keys
* ✔ Timestamp-based record tracking

---

# 🔒 Database Design Benefits

The schema provides a normalized structure where different responsibilities are separated into dedicated tables:

```text
Loan Application
       ↓
Credit Evaluation
       ↓
EMI Calculation
       ↓
Loan History
```

This separation makes the database easier to:

* Maintain
* Query
* Extend
* Integrate with backend APIs
* Integrate with Angular frontend
* Manage loan lifecycle information

---

# 👨‍💻 Module

**Digital Banking Platform — Loan Management Module**

### Database Technology

**MySQL**

### Database

```text
digital_banking
```

---

## 📌 Conclusion

The Loan Management Database provides a structured foundation for handling the complete loan process in a digital banking system. It maintains relationships between customers, loan applications, credit evaluations, EMI calculations, and historical loan records while enforcing database-level integrity and consistency.
