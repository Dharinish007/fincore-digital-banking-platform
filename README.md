

---

# Secure Digital Banking Platform with Transaction Management System

## Project Title

**Secure Digital Banking Platform with Transaction Management System**

### Milestone 4 – 

### Team D

Team D is responsible for the following security and compliance-related modules:

* Risk Scoring
* Compliance Check
* Audit Integrity

---

## Project Overview

The **Secure Digital Banking Platform with Transaction Management System** is a digital banking application designed to provide secure and reliable banking operations through a centralized web-based platform.

**Milestone 4** focuses on improving the security, compliance, and reliability of the banking platform through three major modules:

* **Risk Scoring** – evaluates and classifies customer or transaction risk.
* **Compliance Check** – validates banking operations against predefined compliance requirements.
* **Audit Integrity** – ensures the integrity and traceability of audit records.

The platform follows a layered architecture consisting of a **React frontend, Spring Boot backend, REST APIs, and MySQL database**.

### Milestone 4 Core Workflow

```text
                    User
                      |
                      v
              React Frontend
                      |
                      v
             Spring Boot Backend
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
    Risk Scoring  Compliance   Audit Integrity
       Service      Check         Service
          |           |           |
          +-----------+-----------+
                      |
                      v
                MySQL Database
```

---

# Team Contributions

Team D developed the Risk, Compliance, and Audit Integrity components of **Milestone 4**.

### Frontend Contributions

* Designed the banking dashboard interface.
* Implemented module-specific navigation.
* Developed the Risk Scoring interface.
* Developed the Compliance Check interface.
* Developed the Audit Integrity interface.
* Added risk-level and status indicators.
* Added data tables and result displays.
* Integrated frontend components with REST APIs.
* Implemented responsive and user-friendly interfaces.
* Added role-based access and logout functionality.

### Backend Contributions

* Implemented backend services for Risk Scoring.
* Implemented backend services for Compliance Check.
* Implemented backend services for Audit Integrity.
* Developed REST APIs for frontend-backend communication.
* Implemented business logic for risk evaluation.
* Implemented compliance validation and status management.
* Implemented audit integrity verification.
* Connected backend services with the database.

### Database Contributions

* Designed and maintained the MySQL database required by Milestone 4.
* Stored data required by Risk Scoring.
* Stored compliance-related records.
* Stored audit and integrity-related information.
* Implemented required relationships and constraints according to the actual SQL schema.
* Added and managed required sample/test data.
* Integrated the database with the Spring Boot backend.

---

# Modules Developed

## 1. Risk Scoring

The **Risk Scoring** module evaluates the risk associated with customers or transactions and assigns an appropriate risk level.

The module helps identify potentially risky activities and supports better decision-making within the banking platform.

### Main Functions

* Collects relevant customer or transaction information.
* Performs risk evaluation.
* Calculates a risk score.
* Classifies the risk level.
* Stores risk-related results.
* Displays risk information through the frontend.
* Supports identification of high-risk activities.

### Example Risk Classification

```text
Low Risk
Medium Risk
High Risk
```



---

## 2. Compliance Check

The **Compliance Check** module verifies customers or banking transactions against predefined compliance requirements and rules.

It helps identify whether a particular operation satisfies the required banking compliance conditions.

### Main Functions

* Validates customer or transaction information.
* Performs compliance checks.
* Applies predefined compliance rules.
* Identifies potential violations.
* Maintains compliance status.
* Stores compliance results and remarks.
* Displays compliance results through the frontend.

### Supported Compliance Status

```text
PENDING
PASSED
FAILED
UNDER REVIEW
```


---

## 3. Audit Integrity

The **Audit Integrity** module is responsible for maintaining the reliability and integrity of audit records.

It helps detect unauthorized modification or tampering of important audit information.

### Main Functions

* Maintains audit-related records.
* Generates or maintains integrity information.
* Performs integrity verification.
* Detects potential record modifications.
* Maintains traceability of important operations.
* Stores verification results.
* Displays audit integrity status.

### Audit Integrity Workflow

```text
System Activity
       |
       v
    Audit Log
       |
       v
 Integrity Value
       |
       v
    Storage
       |
       v
   Verification
       |
       v
Verification Result
```

---

# 4. Risk, Compliance and Audit Integration

The three Milestone 4 modules work together to improve the overall security and reliability of the banking platform.

```text
                   Banking Operation
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
     Risk Scoring   Compliance Check  Audit Integrity
          |               |               |
          v               v               v
     Risk Result     Compliance       Integrity
                       Result           Result
          |               |               |
          +---------------+---------------+
                          |
                          v
                    MySQL Database
                          |
                          v
                    React Dashboard
```

---

# Database Design

The database is designed to provide centralized storage for the data required by the three Milestone 4 modules.

The database supports:

* Risk-related information.
* Compliance check information.
* Audit and integrity information.
* Required customer and transaction references.
* Relationships between relevant banking records.
* Data required for reporting and verification.

The database follows a relational design using **MySQL**.

### Database Interaction Flow

```text
React Frontend
      |
      v
Spring Boot REST APIs
      |
      v
Service Layer
      |
      v
Repository / Data Access Layer
      |
      v
MySQL Database
      |
      +-------------------------+
      |            |            |
      v            v            v
 Risk Data   Compliance Data  Audit Data
```


# Security Features

The platform provides security features to protect banking operations and information.

These include:

* Role-based access.
* Authentication.
* Authorized access to banking operations.
* Secure REST API communication.
* Database constraints.
* Risk identification.
* Compliance validation.
* Audit traceability.
* Audit integrity verification.
* Customer-specific data access.

---

# Testing and Validation

The Milestone 4 modules are tested at different levels.

### Functional Testing

Verifies that each module performs its intended function.

```text
Risk Scoring
     |
     v
Risk Result
```

```text
Compliance Check
     |
     v
Compliance Result
```

```text
Audit Integrity
     |
     v
Integrity Result
```

### Integration Testing

Checks communication between:

```text
React
  |
  v
REST API
  |
  v
Spring Boot
  |
  v
MySQL
```

### Error Testing

The system is also tested with:

* Invalid input.
* Missing information.
* Invalid requests.
* Database-related errors.
* Incorrect module operations.

---

# How to Run

## Frontend

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

The frontend normally runs at:

```text
http://localhost:5173
```

---

## Database

Open **MySQL Workbench** or MySQL Command Line.

Execute the project's final SQL files according to the implemented database structure.

For example:

```sql
SOURCE schema.sql;
SOURCE sample_data.sql;
```
---

## Backend

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

---

# Team Members

| Sr. No. | Team Member          |
| ------: | -------------------- |
|       1 | Soumya Ranjan Puthal |
|       2 | Vaishnavi Mahadik    |
|       3 | Thejashree B         |
|       4 | Tharun M             |
|       5 | Sathiya Priya T      |
|       6 | Sharvari Shalgar     |
|       7 | Vaishnavi Warkar     |

---

# Team Responsibility Summary

| Module               | Frontend             | Backend          | Database         |
| -------------------- | -------------------- | ---------------- | ---------------- |
| Risk Scoring         | Vaishnavi Mahadik    | Sathiya Priya T  | Vaishnavi Warkar |
| Compliance Check     | Soumya Ranjan Puthal | Sharvari Shalgar | Vaishnavi Warkar |
| Audit Integrity      | Thejashree B         | Tharun M         | Vaishnavi Warkar |
| Testing & Validation | Team D               | Team D           | Vaishnavi Warkar |
| Overall Integration  | Team D               | Team D           | Vaishnavi Warkar |

---

# Advantages

* Improves identification of risky banking activities.
* Supports compliance monitoring.
* Helps detect potential audit record tampering.
* Improves audit traceability.
* Provides centralized security-related information.
* Supports better banking decision-making.
* Provides a structured and maintainable architecture.
* Integrates frontend, backend, and database components.

---


# Conclusion

The **Secure Digital Banking Platform with Transaction Management System – Milestone 4** enhances the security, compliance, and reliability of the digital banking platform through three major modules:

**Risk Scoring, Compliance Check, and Audit Integrity.**

The project combines **React.js, Spring Boot, REST APIs, Java, and MySQL** to provide a structured and maintainable banking solution.

The integration of risk assessment, compliance validation, and audit integrity helps the platform provide better security, traceability, and reliability for digital banking operations.
