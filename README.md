# 🏦 Secure Digital Banking Platform

> An enterprise-grade digital banking platform designed to provide secure, reliable, and intelligent banking services with AI-powered KYC and Compliance.

---

## 🚀 Milestone 4 — AI Integrated KYC & Compliance

Milestone 4 introduces an **AI Integrated KYC & Compliance Module** to automate customer identity verification and improve the security of digital banking operations.

The module consists of three major components:

- 🤖 **Document OCR**
- 🧍 **Liveness Detection**
- 👤 **Face Match Accuracy**

These components work together to verify customer identity and provide a secure and automated KYC verification process.

---

## 📌 Introduction

FinCore is a comprehensive digital banking management platform developed to simplify and modernize banking operations.

Milestone 4 extends the platform with **AI-powered KYC verification**, allowing the system to automatically process identity documents, verify customer liveness, and perform face matching.

The M4 architecture follows a modular approach with dedicated:

- 🖥️ Frontend
- ⚙️ Backend
- 🗄️ Database
- 🤖 AI / Face Recognition Service

This enables better scalability, maintainability, security, and integration between different components of the banking platform.

---

# 🧩 M4 Components

| Component | Description | Output |
|---|---|---|
| 🤖 **Document OCR** | Extracts customer information from identity documents using AI | Extracted details + OCR confidence |
| 🧍 **Liveness Detection** | Verifies whether the captured person is a real/live person | Liveness score + detection result |
| 👤 **Face Match Accuracy** | Compares faces and calculates matching confidence | Match result + confidence |
| ✅ **Final KYC Verification** | Combines verification results | KYC verification status |

---

# 🔄 M4 System Flow

```text
                         👤 CUSTOMER
                              │
                              ▼
                    📄 DOCUMENT UPLOAD
                              │
                              ▼
                       🤖 DOCUMENT OCR
                              │
                    Extract Customer Data
                              │
                              ▼
                    🧍 LIVENESS DETECTION
                              │
                       Live / Not Live
                              │
                              ▼
                       👤 FACE MATCH
                              │
                     Match + Confidence
                              │
                              ▼
                    ✅ FINAL KYC RESULT
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                 PASSED               FAILED
```

---

# ⚙️ Technology Stack

| Layer | Technology |
|---|---|
| 🖥️ Frontend | Angular 19/20 |
| ⚙️ Backend | Java, Spring Boot, REST API |
| 🗄️ Database | MySQL |
| 🔧 Database Management | XAMPP, phpMyAdmin |
| 🤖 AI Service | Face Recognition / AI Service |
| 📦 Build Tool | Maven |
| 🔗 Version Control | Git & GitHub |

---


# 🤖 AI Models & Microservices

Milestone 4 uses AI-based microservices for automated KYC and identity verification. The AI services communicate with the main Spring Boot backend through REST APIs.

## 🔹 AI Models / Technologies

| Component | Model / Technology | Purpose |
|---|---|---|
| 🤖 Document OCR | Tesseract OCR | Extracts text from uploaded identity documents |
| 🧍 Liveness Detection | AI Liveness Model | Verifies whether the captured person is live |
| 👤 Face Match Accuracy | VGG-Face | Compares faces and calculates similarity |

## 🔹 Microservices

| Microservice | Technology | Responsibility |
|---|---|---|
| 🤖 OCR Service | Python, FastAPI, Tesseract OCR | Document text extraction |
| 🧍 Liveness Service | Python, FastAPI, AI Model | Liveness verification |
| 👤 Face Recognition Service | Python, FastAPI, VGG-Face | Face comparison and matching |

## 🔹 Backend Communication

The Spring Boot backend communicates with the AI services through REST APIs.

```text
Angular Frontend
       │
       ▼
Spring Boot Backend
       │
       ├──────────────► FastAPI OCR Service
       │                    │
       │                    ▼
       │               Tesseract OCR
       │
       ├──────────────► FastAPI Liveness Service
       │                    │
       │                    ▼
       │              Liveness AI Model
       │
       └──────────────► FastAPI Face Recognition Service
                            │
                            ▼
                       DeepFace / VGG-Face

```
---

# 📁 Project Structure

```text
fincore-digital-banking-platform/
│
├── 📂 Backend-M4/
│   └── Backend implementation for Milestone 4
│
├── 📂 DB/
│   └── M4 database scripts and SQL files
│
├── 📂 Frontend-M4/
│   └── Angular frontend for M4 components
│
├── 📂 face-recognition-service/
│   └── Face recognition / face matching service
│
├── 📂 public/
│   └── 📂 assets/
│       └── 📂 images/
│
├── 📂 src/
│   └── Application source files
│
├── 📄 Secure_Banking_M4_Report.pdf
│
└── 📄 README.md
```

---

# 🖼️ M4 Component Screenshots

## 🤖 1. Document OCR

The **Document OCR** component processes the uploaded identity document and extracts important customer information automatically.

### 📸 Screenshot

<img width="1600" height="918" alt="Document OCR" src="https://github.com/user-attachments/assets/1027ab28-477d-4846-9cc3-fa6879f19005" />


### 🔍 Features

| Feature | Description |
|---|---|
| 📄 Document Upload | Upload customer identity document |
| 🤖 AI OCR | Automatically extracts document information |
| 👤 Name Extraction | Extracts customer name |
| 🪪 ID Extraction | Extracts document identification number |
| 🎂 DOB Extraction | Extracts date of birth |
| 🏠 Address Extraction | Extracts customer address |
| 📊 OCR Confidence | Displays OCR confidence percentage |
| ✅ Verification Status | Displays OCR processing status |

---

## 🧍 2. Liveness Detection

The **Liveness Detection** component verifies whether the person captured through the camera is a genuine live person.

### 📸 Screenshot

<img width="1600" height="843" alt="Liveliness Detection" src="https://github.com/user-attachments/assets/942ef578-b524-40c7-8532-33c0ae0b9406" />



### 🔍 Features

| Feature | Description |
|---|---|
| 📹 Live Capture | Captures customer face/video |
| 🤖 AI Detection | Analyzes the captured person |
| 📊 Liveness Score | Generates confidence score |
| 🎯 Threshold | Defines minimum passing score |
| ✅ Detection Result | Passed / Failed |
| ⏱️ Verification Time | Stores verification timestamp |

---

## 👤 3. Face Match Accuracy

The **Face Match Accuracy** component compares the customer's face and generates a confidence percentage.

### 📸 Screenshot

<img width="1600" height="836" alt="Face Match Accuracy" src="https://github.com/user-attachments/assets/b45d702d-30af-4b57-86ae-faffeb65bd65" />


### 🔍 Features

| Feature | Description |
|---|---|
| 👤 Face Comparison | Compares customer faces |
| 🤖 AI Face Matching | Performs face similarity analysis |
| 📊 Confidence Score | Displays matching confidence |
| ✅ Match Result | SUCCESS / FAILED |
| 🔗 Customer Mapping | Uses customer ID for verification |

---

# 🗺️ Database ER Diagram

The Milestone 4 database is designed to store the results generated by the AI-based KYC components.

All M4 KYC tables are connected to the existing `customer` table using `customer_id`.

### 📊 ER Diagram

<img width="1536" height="1024" alt="M4 Database ER diagram" src="https://github.com/user-attachments/assets/d46e7ad8-62f2-414c-8bec-891c18aa03f5" />

---

# 🛢️ Database Details

| Property | Details |
|---|---|
| 🗄️ **Database** | `digital_banking` |
| 🔧 **DBMS** | MySQL |
| 🌐 **Local Server** | XAMPP |
| 🖥️ **Database Tool** | phpMyAdmin |
| 🔗 **Main Relationship** | `customer_id` |
| 🤖 **Module** | AI Integrated KYC |
| 📦 **Milestone** | M4 |


# 🔗 M4 Database Relationship

```text
                       ┌─────────────────────┐
                       │      CUSTOMER       │
                       ├─────────────────────┤
                       │ customer_id (PK)    │
                       └──────────┬──────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
        ┌───────────────┐ ┌─────────────────┐ ┌───────────────┐
        │ document_ocr  │ │liveness_detection│ │  face_match  │
        ├───────────────┤ ├─────────────────┤ ├───────────────┤
        │ ocr_id (PK)   │ │liveness_id (PK) │ │face_match_id │
        │ customer_id FK│ │ customer_id FK  │ │customer_id FK│
        │ document_type │ │ liveness_score  │ │ match_result │
        │ OCR Details   │ │ detection_result│ │ confidence   │
        └───────────────┘ └─────────────────┘ └───────────────┘
```

---

# 🤖 AI KYC Verification Flow

The three AI components work together to complete the customer KYC verification.

```text
                  📄 DOCUMENT OCR
                         │
                         ▼
                OCR = VERIFIED
                         │
                         ▼
               🧍 LIVENESS CHECK
                         │
                         ▼
                LIVENESS = PASSED
                         │
                         ▼
                  👤 FACE MATCH
                         │
                         ▼
                MATCH = SUCCESS
                         │
                         ▼
              ┌──────────────────┐
              │  ✅ KYC PASSED   │
              └──────────────────┘
```

If any critical verification fails:

```text
OCR FAILED
    OR
LIVENESS FAILED
    OR
FACE MATCH FAILED
       │
       ▼
❌ KYC VERIFICATION FAILED
```

---

# 🔌 Backend / API Integration

The Spring Boot backend communicates with the AI microservices through REST APIs and handles validation, processing, and database integration.

```text
                 🤖 AI SERVICES
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
     OCR AI       Liveness AI     Face Match AI
        │              │              │
        ▼              ▼              ▼
   OCR Result     Liveness       Face Match
                     Result          Result
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                🔌 Backend/API
                       │
                       ▼
                🗄️ MySQL Database
                       │
                       ▼
               ✅ KYC Verification
```

> **Note:** AI services generate the verification results, while the application/backend layer handles communication, validation, and database storage.

---

# 🛡️ Validation & Security

| Feature | Implementation |
|---|---|
| 🔐 Database | MySQL |
| 🔗 Data Integrity | Foreign Key using `customer_id` |
| 📊 Confidence Validation | Scores restricted between 0–100 |
| 🚫 Invalid Values | ENUM constraints |
| 🛡️ API Validation | Required fields validated |
| 📦 Data Format | JSON-based API communication |
| 👤 Customer Mapping | All M4 results linked with customer |

---

# 📈 Sample AI Verification Result

| Component | Sample Result |
|---|---|
| 🤖 Document OCR | Verified |
| 📊 OCR Confidence | 96.50% |
| 🧍 Liveness Detection | Passed |
| 📊 Liveness Score | 98.10% |
| 👤 Face Match | SUCCESS |
| 📊 Face Match Confidence | 92.35% |
| ✅ Overall KYC Status | **AI VERIFICATION PASSED** |

---

# 🔗 Integration with Previous Milestones

Milestone 4 extends the existing FinCore Digital Banking Platform and uses the existing customer information as the foundation for KYC verification.

```text
                    🏦 FINCORE PLATFORM
                            │
                            ▼
                       👤 CUSTOMER
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
             M1/M2          M3            M4
           Accounts       Payments      AI KYC
           & Banking     & Transfers   & Compliance
                                         │
                            ┌────────────┼────────────┐
                            ▼            ▼            ▼
                           OCR       Liveness     Face Match
```

The common `customer_id` maintains the relationship between the existing customer records and the M4 KYC verification results.

---

# 🚀 Quick Start

## 🖥️ Frontend

Navigate to the M4 frontend folder:

```bash
cd Frontend-M4
npm install
npm start
```

Frontend runs on:

```text
http://localhost:4200
```

---

## ⚙️ Backend

Navigate to the backend folder:

```bash
cd Backend-M4
```

Run the Spring Boot application using Maven:

```bash
./mvnw spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

## 🗄️ Database

1. Start **Apache** and **MySQL** from XAMPP.
2. Open phpMyAdmin.
3. Select/create the `digital_banking` database.
4. Execute the M4 SQL scripts from the `DB` folder.
5. Verify that the M4 tables are created successfully.

Database:

```text
Database Name : digital_banking
DBMS          : MySQL
Server        : XAMPP
Port          : 3306
```

---

# 📂 M4 Database Files

The `DB` folder contains the SQL scripts required for Milestone 4.

| File | Purpose |
|---|---|
| `01_create_document_ocr.sql` | Creates Document OCR table |
| `02_create_liveness_detection.sql` | Creates Liveness Detection table |
| `03_create_face_match.sql` | Creates Face Match table |
| `04_m4_sample_data_and_queries.sql` | Sample data and verification queries |

---

# 🏆 Milestone 4 Highlights

- 🤖 AI-powered Document OCR
- 📄 Automated document information extraction
- 🧍 AI Liveness Detection
- 👤 AI Face Match Accuracy
- 📊 Confidence score management
- 🔗 Customer-based KYC mapping
- 🗄️ MySQL database integration
- 🔌 Backend/API integration
- ✅ Automated KYC verification
- 🛡️ Secure and validated data handling
- 🔄 Integration with previous milestones

---

# 👥 Team Members

| 👤 Team Member | 💼 Role |
|---|---|
| **Manikandan** | Frontend Developer |
| **Pavithra** | Frontend Developer |
| **Kousalya** | Frontend Developer |
| **Nithish** | Backend Developer |
| **Jeevana** | Backend Developer |
| **Raghvendra** | Database Developer |

---

# 📄 Project Report

The complete Milestone 4 project report is available in:

```text
Secure_Banking_M4_Report.pdf
```

---

# 🎯 Milestone 4

> **Secure • Intelligent • Automated • AI-Powered**

### 🏦 Secure Digital Banking Platform

---
