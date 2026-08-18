# 🔐 Secure Digital Banking Management System

> A secure and scalable digital banking platform designed to manage essential banking operations with reliable workflows, structured data management, and secure transaction processing.

---

## 🎯 Milestone 2 — Loan Management

Milestone 2 introduces the **Loan Management Module**, enabling the system to process loan applications through validation, credit assessment, previous-loan verification, and EMI calculation.

### ✨ Key Components

| Module | Description |
|---|---|
| 📝 **Loan Origination** | Captures and validates customer loan applications. |
| 🔍 **Credit Check** | Evaluates credit score, income, previous loans, and active loans. |
| 🧮 **EMI Calculation** | Calculates monthly EMI based on loan amount, interest rate, and tenure. |

---

## 🚀 Key Features

- 📝 Secure loan application and origination
- 🔍 Customer credit eligibility verification
- 📊 Previous loan history checking
- 💳 Existing active loan verification
- 🧮 Automated EMI calculation
- ✅ Loan application validation
- 🗄️ Structured relational database management
- 🔐 Secure and modular banking workflow

---

## 🛠️ Technology Used

| Category | Technology |
|---|---|
| 🎨 Frontend | Angular |
| ⚙️ Backend | Spring Boot / PHP |
| 🗄️ Database | MySQL |
| 🧰 Database Management | XAMPP & phpMyAdmin |
| 🔗 Version Control | Git & GitHub |
| 🌐 API Testing | Postman |

---

## 🗄️ Database Details

**Database Name:** `digital_banking`

### Core Loan Management Tables

| Table | Purpose |
|---|---|
| `loan_application` | Stores new loan application details. |
| `loan_history` | Maintains previous and existing loan records. |
| `credit_check` | Stores credit assessment and eligibility results. |
| `emi_calculation` | Stores calculated EMI details. |

### 🔗 Database ER Diagram

<img width="1536" height="1024" alt="DB ER Diagram M2" src="https://github.com/user-attachments/assets/e45f730c-0124-42c9-a5da-d18147d119bb" />


---

## 🖥️ Application Screens

### 📝 Loan Origination

> Customer loan application and validation screen.

<img width="1050" height="484" alt="Loan Origination" src="https://github.com/user-attachments/assets/9d75a815-f0fb-48ec-9484-f996a633f0ec" />

---

### 🔍 Credit Check

> Credit score, income, previous loan and eligibility verification.

<img width="1050" height="519" alt="Credit check " src="https://github.com/user-attachments/assets/ad893541-4757-45a4-9583-4d404341c9cc" />


---

### 🧮 EMI Calculation

> Automated EMI calculation based on loan amount, interest rate and tenure.

<img width="1050" height="522" alt="emi calculator " src="https://github.com/user-attachments/assets/c3a16377-7d5d-45c4-a6dc-48340c549fe2" />


---

## 🔄 Loan Management Workflow

```text
                 👤 Customer
                      │
                      ▼
              📝 Loan Origination
                      │
                      ▼
                 🔍 Credit Check
                      │
             ┌────────┴────────┐
             ▼                 ▼
       Previous Loans      Active Loans
             │                 │
             └────────┬────────┘
                      ▼
              🧮 EMI Calculation
                      │
                      ▼
               ✅ Loan Processing

```


## 🌐 Port Details

| Service                    | Port / URL                     | Purpose                       |
| -------------------------- | ------------------------------ | ----------------------------- |
| 🎨 **Angular Frontend**    | `http://localhost:4200`        | User Interface                |
| ⚙️ **Spring Boot Backend** | `http://localhost:8080`        | REST APIs & Backend Services  |
| 🐘 **XAMPP / PHP**         | `http://localhost/`            | PHP-based Database Operations |
| 🗄️ **phpMyAdmin**         | `http://localhost/phpmyadmin/` | MySQL Database Management     |

> 💡 **Note:** Make sure XAMPP (Apache & MySQL) and the Spring Boot/Angular services are running before accessing these URLs.


## 👥 Team Members

| 👤 Team Member | 💼 Role |
|---|---|
| **Manikandan** | Frontend Developer |
| **Pavithra** | Frontend Developer |
| **Kousalya** | Frontend Developer |
| **Nithish** | Backend Developer |
| **Jeevana** | Backend Developer |
| **Raghvendra** | Database Developer |
