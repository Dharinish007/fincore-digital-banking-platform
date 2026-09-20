# 🗄️ FinCore Unified Database Architecture

This directory houses the consolidated database schemas, tables, relationships, and seed data for the **FinCore Digital Banking Platform**, uniting the database specifications of **Team B** and **Team C** across all 4 Milestones.

---

## 📂 Directory Layout

```
database/
├── mysql/                            # Complete MySQL 8.0+ schemas & migrations
│   ├── 01_create_database.sql        # Database initialization (`digital_banking`)
│   ├── 02_fincore_master_schema_mysql.sql # Unified Master Schema (Milestones 1-4)
│   ├── 03_fincore_seed_data_mysql.sql     # Unified sample seed records
│   ├── 04_balance_accuracy.sql       # Balance accuracy views & checks
│   ├── 05_transaction_atomicity.sql  # Atomicity validation procedures
│   ├── 06_create_loan_tables.sql     # Loan applications & history
│   ├── 07_insert_loan_sample_data.sql# Loan seed data
│   ├── 08_credit_check.sql           # Credit bureau check queries
│   ├── 09_emi_calculation.sql        # EMI calculation records
│   ├── 10_create_payment_transfer_tables.sql # Payment & transfers
│   ├── 11_insert_beneficiary_data.sql# Beneficiaries seed data
│   ├── 12_insert_payment_data.sql    # Payment history seed data
│   ├── 13_insert_fraud_check_data.sql# Fraud checks seed data
│   ├── 14_create_document_ocr.sql    # KYC Document OCR table
│   ├── 15_create_liveness_detection.sql # AI Liveness records
│   ├── 16_create_face_match.sql      # Face Match accuracy records
│   ├── 17_m4_sample_data_and_queries.sql # KYC verification audit data
│   └── php/                          # PHP database connectors & utilities
│
├── postgresql/                       # PostgreSQL 14+ schemas (Team B)
│   ├── fincore_master_schema.sql     # PostgreSQL master schema
│   ├── milestone-1-core-banking.sql
│   ├── milestone-2-loan-management.sql
│   ├── milestone-3-enterprise-settlement.sql
│   ├── milestone-4-security-liveness.sql
│   ├── database_queries.sql
│   └── README.md
│
└── README.md                         # This guide
```

---

## 🚀 Quick Setup Guide (MySQL)

### Prerequisites
- **MySQL Server 8.0+** running on `localhost:3306`
- Command-line client `mysql` or MySQL Workbench / phpMyAdmin

### Execution Options

#### Option A: One-Command Master Schema & Seed Data
Execute the unified master schema and seed records:
```bash
mysql -u root -p < database/mysql/01_create_database.sql
mysql -u root -p digital_banking < database/mysql/02_fincore_master_schema_mysql.sql
mysql -u root -p digital_banking < database/mysql/03_fincore_seed_data_mysql.sql
```

#### Option B: Step-by-Step Milestone Scripts
Run the individual numbered scripts sequentially:
```bash
mysql -u root -p < database/mysql/01_create_database.sql
for script in database/mysql/[0-9]*.sql; do
    mysql -u root -p digital_banking < "$script"
done
```

---

## ⚙️ Backend Connection Settings

Configure Spring Boot connection properties in `backend/src/main/resources/application.properties` (or environment variables):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/digital_banking?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

*Note: The backend also contains an embedded H2 configuration profile for testing without a local database installation.*
