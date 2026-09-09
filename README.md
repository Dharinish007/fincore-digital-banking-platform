# 💳 FinCore Digital Banking Platform

## 📖 Overview

FinCore Digital Banking Platform is a full-stack banking application built using **Spring Boot**, **Angular**, and **PostgreSQL**. 

**Milestone 2** focuses on loan management functionalities including **EMI Calculation, Loan Disbursement, and Collections**. These modules support loan repayment planning, release of sanctioned loan amounts, and tracking of customer repayments.

The application follows a layered architecture with an Angular-based UI, RESTful APIs, Spring Boot services, Hibernate, and PostgreSQL for secure and efficient banking operations.

---

## ✨ Features

### 🧮 EMI Calculation

- Calculate EMI based on loan amount, interest rate, and tenure
- Display monthly EMI
- Calculate total interest
- Calculate total repayment amount
- Display repayment / amortization schedule

### 💰 Loan Disbursement

- View approved loan details
- Enter disbursement amount
- Validate eligible disbursement amount
- Capture beneficiary account details
- Record disbursement details
- View disbursement history

### 💳 Collections

- View EMI and repayment details
- Record customer loan payments
- Capture payment mode and transaction reference
- Track EMI payment status
- View outstanding loan amount
- View payment / collection history

### 🛡 Validation

- Required field validation
- Amount validation
- Interest rate validation
- Loan tenure validation
- Disbursement amount validation
- Payment amount validation
- Date and transaction reference validation

### 💻 User Interface

- Responsive Angular frontend
- User-friendly loan management screens
- Easy navigation between EMI, Disbursement, and Collections
- Clear display of financial information and transaction status

---

## 🛠 Tech Stack

**Frontend**

- Angular
- TypeScript
- HTML
- CSS
- Angular Reactive Forms
- Angular HttpClient

**Backend**

- Java
- Spring Boot
- Spring Data JPA
- REST APIs

**Database**

- PostgreSQL

---

## 📷 Application Screenshots

### 🧮 EMI Calculation

<img width="990" height="715" alt="image" src="https://github.com/user-attachments/assets/a0bc07ce-89f1-4c2a-a816-da20e2465435" />


---

### 💰 Loan Disbursement

<img width="953" height="636" alt="image" src="https://github.com/user-attachments/assets/bb561833-7aa2-4571-ab40-92105fb733db" />


---

### 💳 Collections and Repayment Schedule

<img width="634" height="452" alt="image" src="https://github.com/user-attachments/assets/642549e6-ac78-4d88-878a-95a1a94ec005" />

---

## 🔄 Application Flow

```text
EMI Calculation
       ↓
Repayment Schedule
       ↓
Loan Disbursement
       ↓
Loan Amount Released
       ↓
Collections
       ↓
EMI Payments
       ↓
Outstanding Balance
```
## ▶️ Running the Project
### Frontend
cd Frontend-milestone2

npm install

ng serve

Open the application in the browser:

http://localhost:4200
### Backend
cd Backend

mvn spring-boot:run

### Database
```
PostgreSQL is used as the database for storing loan, EMI, disbursement, and collection-related information.
```
---
## 👥 Contributors
Bharati Bhat

Ramya Chava

Janhvi Pandey

Indu Patil

Shanmukha Sai
Raziya
