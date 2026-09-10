# 💳 Secure Digital Banking Platform — Milestone 3

> **Payment initiation, Beneficiary verification & Fraud Check**

---

## 📌 Introduction

Milestone 3 extends the **FinCore Digital Banking Platform** with secure digital payment functionality, beneficiary management, and fraud detection.

The module is designed to support a complete payment workflow while maintaining integration with the existing customer and account information developed in previous milestones.

---

## 🎯 Objectives

* Enable secure digital payments and fund transfers
* Manage customer beneficiaries
* Maintain payment and transaction information
* Perform fraud detection and risk analysis
* Integrate payment operations with existing banking data
* Provide a structured and scalable database foundation

---

## 🚀 Key Components

### 👤 1. Beneficiary  Verification

Allows customers to add and manage beneficiaries for making digital payments and fund transfers.

**Key functionality:**

* Add beneficiary
* Store beneficiary banking details
* Manage beneficiary status
* Connect beneficiaries with existing customers

### 📸 Screenshot

<img width="1600" height="900" alt="Beneficiary verification" src="https://github.com/user-attachments/assets/13642f4f-ec38-4459-99c9-2f9328febb52" />


```text
![Beneficiary Management](./screenshots/beneficiary-management.png)
```

---

### 💳 2. Payment Initiation

Handles digital payment and fund-transfer operations between customer accounts and registered beneficiaries.

**Key functionality:**

* Select beneficiary
* Enter payment amount
* Initiate payment
* Generate transaction reference
* Track payment status
* Maintain payment history

### 📸 Screenshot

<img width="1600" height="900" alt="Payment Initiation" src="https://github.com/user-attachments/assets/e9eee296-720c-4ab2-83e1-2534e5e49ebd" />


```text
![Payment & Fund Transfer](./screenshots/payment-transfer.png)
```

---

### 🛡️ 3. Fraud Check

The fraud detection component analyses payment activity and identifies potentially suspicious transactions.

**Key functionality:**

* Analyse payment transactions
* Calculate risk score
* Identify risk level
* Detect suspicious transactions
* Flag potentially fraudulent payments
* Store fraud-check results

### 📸 Screenshot

<img width="1600" height="781" alt="Fraud check" src="https://github.com/user-attachments/assets/e21c1449-2efe-4af3-a69b-2ed0d5b2029c" />


```text
![Fraud Detection](./screenshots/fraud-detection.png)
```

---

# 🔄 M3 Payment Flow

```text
Customer
   ↓
Select / Add Beneficiary
   ↓
Enter Payment Details
   ↓
Initiate Payment
   ↓
Fraud Detection
   ↓
Risk Analysis
   ↓
┌─────────────────────────────┐
│                             │
▼                             ▼
Low / Safe Risk          High / Suspicious Risk
│                             │
▼                             ▼
Payment Success          Verification / Block
```

---

# 🗄️ Database Integration

Milestone 3 is integrated with the existing **`digital_banking`** database used in the previous milestones.

The module maintains relationships with existing customer and account information instead of creating an isolated banking system.

### Integration

```text
M1 / M2
Customer + Account
        │
        ▼
       M3
        │
 ┌──────┼──────────┐
 ▼      ▼          ▼
Beneficiary   Payment   Fraud Detection
```

---

# 🧩 Entity Relationship Diagram

The ER diagram represents the relationship between the existing banking entities and the Milestone 3 payment and fraud-detection components.

### 📊 ER Diagram

<img width="1536" height="1024" alt="DB ER diagram M3" src="https://github.com/user-attachments/assets/3be3be1c-93a9-434a-a703-c7fe7e8a4976" />


---

# 🛠️ Technologies Used

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| **MySQL**      | Database Management           |
| **SQL**        | Database Design & Queries     |
| **PHP**        | Database Connectivity         |
| **XAMPP**      | Local Development Environment |
| **phpMyAdmin** | Database Administration       |

---

# 📁 Project Structure

```text
M3/
│
├── DB/
│   ├── SQL Files
│   └── Queries
│
├── PHP/
│   ├── Database Connection
│   └── Payment Operations
│
├── screenshots/
│   ├── beneficiary-management.png
│   ├── payment-transfer.png
│   ├── fraud-detection.png
│   └── m3-er-diagram.png
│
└── README.md
```

---



# 👥 Team

| Team Member    | Role     |
| -------------- | -------- |
| **Manikandan** | Frontend |
| **Pavithra**   | Frontend |
| **Kousalya**   | Frontend |
| **Nithish**    | Backend  |
| **Jeevana**    | Backend  |
| **Raghvendra** | Database |




