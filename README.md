# Secure Digital Banking Platform with Transaction Management System

## Project Title

**Secure Digital Banking Platform with Transaction Management System**

### Team D

Team D is responsible for the following loan management and transaction-related modules:

* Repayment Tracking
* Disbursement Saga
* NPA Classification


---

## Project Overview

The **Secure Digital Banking Platform with Transaction Management System** is a digital banking application designed to manage customers, accounts, loans, repayments, disbursements, transactions, and loan-risk classification.

The system provides role-based access for:

* Administrator
* Bank Teller
* Customer

Customers can access only their own account, loan, repayment, transaction, and eligibility information, while authorized bank staff can access operational banking functions.

The platform provides a centralized interface for managing loan servicing and transaction-related activities.

### Team D Core Workflow

```text
Customer
    |
    v
   Loan
    |
    +------------------+
    |                  |
    v                  v
Disbursement       Repayment
   Saga             Tracking
    |                  |
    +--------+---------+
             |
             v
      NPA Classification
             |
             v
       Transactions
             |
             v
         Audit Trail
```

---

## Team Contributions

Team D developed the loan management and servicing components of the platform.

### Frontend Contributions

* Designed the banking dashboard interface.
* Implemented role-based navigation.
* Developed Repayment Tracking frontend.
* Developed Disbursement Saga frontend.
* Developed NPA Classification frontend.
* Implemented customer-specific views.
* Implemented loan, repayment, disbursement and NPA dashboards.
* Added status indicators and data tables.
* Added responsive and user-friendly UI.
* Added logout and role-specific access.

### Backend Contributions

* Implemented backend services for Repayment Tracking.
* Implemented backend services for Disbursement Saga.
* Connected frontend operations with backend APIs.
* Supported loan and repayment business workflows.

### Database Contributions

* Designed and implemented the common MySQL database.
* Created relationships between customers, loans, repayments, disbursements, NPA classifications, accounts and transactions.
* Added sample data and common SQL queries.
* Created indexes and foreign-key relationships.
* Integrated the database with the banking modules.

---

## Modules Developed

### 1. Repayment Tracking

The Repayment Tracking module manages loan EMI and repayment information.

It provides:

* Installment number
* Due date
* Amount due
* Amount paid
* Payment date
* Payment status
* Remaining amount
* Loan-wise repayment schedule
* Pending and overdue repayment tracking

### Supported Payment Status

```text
PAID
PARTIAL
PENDING
OVERDUE
```

### Repayment Workflow

```text
Loan
  |
  v
Repayment Schedule
  |
  +--> Paid
  |
  +--> Partial
  |
  +--> Pending
  |
  +--> Overdue
```

### 2. Disbursement Saga

The Disbursement Saga module manages the loan disbursement process as a sequence of tracked steps.

### Disbursement Workflow

```text
Document Verification
        |
        v
Loan Approval
        |
        v
Account Credited
        |
        v
Disbursement Completed
```

The module tracks:

* Disbursement ID
* Loan ID
* Amount
* Disbursement date
* Status
* Transaction reference
* Current Saga step
* Failure reason
* Step status
* Start and completion time
* Error messages

The `disbursement_steps` table maintains the individual Saga steps.

### 3. NPA Classification

The NPA Classification module monitors loan repayment risk and overdue conditions.

It tracks:

* Overdue days
* Outstanding amount
* Classification
* Classification date
* Reason
* Status

### Example Classifications

```text
STANDARD
SMA-1
NPA
```

### NPA Workflow

```text
Repayment
    |
    v
Overdue Days
    |
    v
Outstanding Amount
    |
    v
NPA Evaluation
    |
    v
Classification
```

### 4. Customer Access

The platform provides a separate customer view.

A customer can view only their own:

* Profile
* Accounts
* Loan details
* Repayment schedule
* Outstanding amount
* Transactions
* Loan eligibility

### Sample Customers

```text
CUST001 → Amit Patil
CUST002 → Sneha Joshi
CUST003 → Rahul Shinde
```

Customer access is restricted according to the logged-in customer's identity.

### 5. Transaction Management

The Transaction Management component records banking transactions associated with accounts and loans.

It stores:

* Transaction ID
* Account ID
* Loan ID
* Transaction type
* Amount
* Transaction date
* Reference number
* Transaction status

### Example Transaction Types

```text
LOAN_DISBURSEMENT
LOAN_REPAYMENT
TRANSFER
```

### 6. Audit Trail

The Audit Trail provides traceability of important banking operations such as:

* Login
* Logout
* Loan operations
* Repayment operations
* Disbursement operations
* NPA classification changes
* Account operations
* Administrative actions

---

## Technology Stack

### Frontend

* React.js
* JSX
* JavaScript
* Vite
* HTML5
* CSS3

### Backend

* Java
* Spring Boot
* REST APIs
* Maven

### Database

* MySQL 8
* SQL
* Foreign Keys
* Indexes

### Development Tools

* Visual Studio Code
* Git
* GitHub
* MySQL Workbench / MySQL Command Line
* Node.js
* npm

---

## Screenshots

### 1. Login Page

The login page provides role-based authentication for:

* Administrator
* Teller
* Customer

![Login Page](screenshots/login.jpg)

### 2. Teller Dashboard

The teller dashboard provides access to operational banking activities.

![Teller Dashboard](screenshots/teller-dashboard.jpg)

### 3. Customer Dashboard

The customer dashboard displays only the logged-in customer's information.

It includes:

* Account details
* Loan information
* Repayment information
* Transactions
* Loan eligibility

![Customer Dashboard](screenshots/customer-dashboard.jpg)

### 4. Repayment Tracking

The Repayment Tracking page displays:

* Loan ID
* Installment number
* Due date
* Amount due
* Amount paid
* Remaining amount
* Payment status

![Repayment Tracking](screenshots/repayment-tracking.jpg)

### 5. Disbursement Saga

The Disbursement Saga page displays:

* Disbursement amount
* Disbursement status
* Transaction reference
* Current Saga step
* Saga step history
* Completed/failed steps

![Disbursement Saga](screenshots/disbursement-saga.jpg)

### 6. NPA Classification

The NPA Classification page displays:

* Loan ID
* Customer
* Overdue days
* Outstanding amount
* Classification
* Classification date
* Reason
* Status

![NPA Classification](screenshots/npa-classification.jpg)



## Backend / Database Components

### Database Name

```text
bank_loan_management
```

### Main Database Tables

```text
customers
loans
accounts
repayments
disbursements
disbursement_steps
npa_classifications
transactions
```

### Database Files

The database implementation contains:

```text
schema.sql
sample_data.sql
queries.sql
```

### schema.sql

Creates:

* Database
* Customers table
* Loans table
* Accounts table
* Repayments table
* Disbursements table
* Disbursement steps table
* NPA classifications table
* Transactions table
* Foreign keys
* Indexes

### sample_data.sql

Provides sample records for:

* Customers
* Accounts
* Loans
* Repayments
* Disbursements
* Disbursement Saga steps
* NPA classifications
* Transactions

### queries.sql

Contains common queries for:

* Viewing customers
* Viewing loans
* Viewing repayment schedules
* Finding pending/overdue repayments
* Viewing disbursements
* Viewing Saga steps
* Viewing NPA classifications
* Viewing transactions
* Counting loans by status
* Calculating total repayments
* Calculating outstanding amounts

---

## Backend APIs

The React frontend communicates with Spring Boot REST APIs.

Example API structure:

```text
GET  /api/customers
GET  /api/customers/{id}

GET  /api/loans
GET  /api/loans/{id}

GET  /api/repayments
GET  /api/repayments/loan/{loanId}

GET  /api/disbursements
GET  /api/disbursements/{id}
GET  /api/disbursements/{id}/steps

GET  /api/npa
GET  /api/npa/loan/{loanId}

GET  /api/accounts
GET  /api/transactions
GET  /api/audit
```

The exact endpoint names should match the Spring Boot controllers implemented in the project.

---

## How to Run (Commands)

### Frontend

Open the frontend directory:

```bash
cd SecureDigitalBanking-TeamD-Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

### Database

Open MySQL and execute:

```sql
SOURCE schema.sql;
SOURCE sample_data.sql;
```

Or execute the SQL files using MySQL Workbench.

The database name is:

```text
bank_loan_management
```

After creating the database and inserting the sample data, `queries.sql` can be executed to test the database operations.

### Backend

Open the Spring Boot backend directory:

```bash
cd backend
```

Build the project:

```bash
mvn clean install
```

Run the application:

```bash
mvn spring-boot:run
```

### Windows Maven Wrapper

```bash
mvnw.cmd spring-boot:run
```

### Linux/macOS Maven Wrapper

```bash
./mvnw spring-boot:run
```

The backend port depends on the project's `application.properties`.

---

## Demo Login Credentials

### Administrator

```text
User ID: admin
Password: admin123
```

### Bank Teller

```text
User ID: TELLER001
Password: teller123
```

### Customers

| User ID | Password | Customer     |
| ------- | -------- | ------------ |
| CUST001 | cust123  | Amit Patil   |
| CUST002 | cust123  | Sneha Joshi  |
| CUST003 | cust123  | Rahul Shinde |

### Customer Information

| Customer ID | Customer Name | Account              | Loan          |
| ----------- | ------------- | -------------------- | ------------- |
| 1           | Amit Patil    | ACC100001, ACC100002 | Home Loan     |
| 2           | Sneha Joshi   | ACC100003            | Personal Loan |
| 3           | Rahul Shinde  | ACC100004            | Vehicle Loan  |

> These credentials are for development/demo purposes only. Production authentication should be handled securely by the backend.

---



### Team Responsibility Summary

| Module                 | Frontend               | Backend             | Database         |
| ---------------------- | ---------------------- | ------------------- | ---------------- |
| Repayment Tracking     | Thejashree B, Tharun M | Sathiya Priya T     | Vaishnavi Warkar |
| Disbursement Saga      | Soumya Ranjan Puthal   | Sharvari Shalgar    | Vaishnavi Warkar |
| NPA Classification     | Vaishnavi Mahadik      | —                   | Vaishnavi Warkar |
| Transaction Management | Team D Frontend        | Backend Integration | Vaishnavi Warkar |
| Customer Access        | Team D Frontend        | Backend Integration | Vaishnavi Warkar |
| Database Management    | —                      | —                   | Vaishnavi Warkar |

---

## Conclusion

The **Secure Digital Banking Platform with Transaction Management System** integrates customer banking operations with loan servicing and transaction management.

Team D specifically contributes the three core loan management modules:

**Disbursement Saga, Repayment Tracking, and NPA Classification**

The project combines a **React frontend, Spring Boot backend, and MySQL database** to provide a structured, role-based, secure, and maintainable digital banking platform.
