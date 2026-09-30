-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - COMPLETE FINAL SCHEMA
-- Combining Milestone 1, Milestone 2, and Milestone 3 into One Unified Relational Schema
-- Database: fincore_db
-- =========================================================

CREATE DATABASE IF NOT EXISTS fincore_db;
USE fincore_db;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    customer_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    customer_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    kyc_status ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'LOW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cust_kyc (kyc_status),
    INDEX idx_cust_risk (risk_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. KYC Records Table
CREATE TABLE IF NOT EXISTS kyc_records (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    document_type ENUM('AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID') NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_url VARCHAR(500),
    verification_status ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED') DEFAULT 'UNDER_REVIEW',
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'LOW',
    submitted_by VARCHAR(100) NOT NULL,
    verified_by VARCHAR(100),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    remarks TEXT,
    CONSTRAINT fk_kyc_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_kyc_status (verification_status),
    INDEX idx_kyc_doc (document_type, document_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(36) PRIMARY KEY,
    account_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    account_type ENUM('SAVINGS', 'CURRENT', 'LOAN_DISBURSEMENT', 'ESCROW') DEFAULT 'SAVINGS',
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(5) DEFAULT 'INR',
    status ENUM('ACTIVE', 'FROZEN', 'DORMANT', 'CLOSED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_acc_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_acc_customer (customer_id),
    INDEX idx_acc_number (account_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Loans Table
CREATE TABLE IF NOT EXISTS loans (
    id VARCHAR(36) PRIMARY KEY,
    loan_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    loan_type ENUM('HOME_LOAN', 'PERSONAL_LOAN', 'BUSINESS_LOAN', 'AUTO_LOAN', 'EDUCATION_LOAN') NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    tenure_months INT NOT NULL,
    emi_amount DECIMAL(15, 2) NOT NULL,
    total_payable DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    outstanding_principal DECIMAL(15, 2) NOT NULL,
    status ENUM('APPLIED', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED', 'ACTIVE', 'CLOSED', 'REJECTED') DEFAULT 'APPLIED',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP NULL,
    disbursed_date TIMESTAMP NULL,
    approved_by VARCHAR(100),
    CONSTRAINT fk_loan_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_loan_account FOREIGN KEY (account_id) REFERENCES accounts(id),
    INDEX idx_loan_status (status),
    INDEX idx_loan_cust (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Repayment Schedules Table
CREATE TABLE IF NOT EXISTS repayment_schedules (
    id VARCHAR(36) PRIMARY KEY,
    loan_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    emi_amount DECIMAL(15, 2) NOT NULL,
    principal_component DECIMAL(15, 2) NOT NULL,
    interest_component DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    paid_date TIMESTAMP NULL,
    overdue_amount DECIMAL(15, 2) DEFAULT 0.00,
    days_past_due INT DEFAULT 0,
    status ENUM('UPCOMING', 'DUE', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'DEFAULTED') DEFAULT 'UPCOMING',
    penalty_amount DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rep_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
    INDEX idx_rep_loan (loan_id),
    INDEX idx_rep_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. NPA Records Table
CREATE TABLE IF NOT EXISTS npa_records (
    id VARCHAR(36) PRIMARY KEY,
    loan_id VARCHAR(36) NOT NULL UNIQUE,
    loan_number VARCHAR(50) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    outstanding_principal DECIMAL(15, 2) NOT NULL,
    overdue_amount DECIMAL(15, 2) NOT NULL,
    days_past_due INT NOT NULL,
    last_payment_date TIMESTAMP NULL,
    npa_status ENUM('STANDARD', 'SMA', 'NPA') NOT NULL DEFAULT 'STANDARD',
    sma_category ENUM('SMA-0', 'SMA-1', 'SMA-2', 'NONE') DEFAULT 'NONE',
    classification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    provision_percentage DECIMAL(5, 2) DEFAULT 0.40,
    provision_amount DECIMAL(15, 2) DEFAULT 0.00,
    remarks TEXT,
    CONSTRAINT fk_npa_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
    INDEX idx_npa_status (npa_status),
    INDEX idx_npa_dpd (days_past_due)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    source_account_id VARCHAR(36),
    destination_account_id VARCHAR(36),
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'FEE_CHARGE', 'REVERSAL') NOT NULL,
    status ENUM('INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED', 'REVERSED') DEFAULT 'INITIATED',
    description VARCHAR(255),
    saga_id VARCHAR(36),
    settlement_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_txn_ref (transaction_reference),
    INDEX idx_txn_cust (customer_id),
    INDEX idx_txn_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Saga Instances Table
CREATE TABLE IF NOT EXISTS saga_instances (
    id VARCHAR(36) PRIMARY KEY,
    saga_type ENUM('DISBURSEMENT', 'REPAYMENT', 'PAYMENT', 'SETTLEMENT') NOT NULL,
    transaction_id VARCHAR(36),
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    loan_id VARCHAR(36),
    account_id VARCHAR(36),
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    current_step INT NOT NULL DEFAULT 0,
    total_steps INT NOT NULL DEFAULT 6,
    status ENUM('INITIATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'COMPENSATING', 'COMPENSATED') DEFAULT 'INITIATED',
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    idempotency_key VARCHAR(150) NOT NULL UNIQUE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    failure_reason TEXT,
    INDEX idx_saga_status (status),
    INDEX idx_saga_type (saga_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Saga Steps Table
CREATE TABLE IF NOT EXISTS saga_steps (
    id VARCHAR(36) PRIMARY KEY,
    saga_id VARCHAR(36) NOT NULL,
    step_number INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    action TEXT NOT NULL,
    compensation_action TEXT NOT NULL,
    status ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'COMPENSATED') DEFAULT 'PENDING',
    executed_at TIMESTAMP NULL,
    error_message TEXT,
    payload JSON,
    CONSTRAINT fk_step_saga FOREIGN KEY (saga_id) REFERENCES saga_instances(id) ON DELETE CASCADE,
    INDEX idx_step_saga (saga_id, step_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Settlements Table
CREATE TABLE IF NOT EXISTS settlements (
    id VARCHAR(36) PRIMARY KEY,
    settlement_reference VARCHAR(100) NOT NULL UNIQUE,
    transaction_id VARCHAR(36) NOT NULL,
    saga_id VARCHAR(36),
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    settlement_type ENUM('RTGS', 'NEFT', 'IMPS', 'ACH', 'INTERNAL_CLEARING') NOT NULL,
    bank_reference VARCHAR(100) NOT NULL,
    clearing_house VARCHAR(150) NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REVERSED') DEFAULT 'PENDING',
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    failure_reason TEXT,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    INDEX idx_settl_ref (settlement_reference),
    INDEX idx_settl_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    customer_id VARCHAR(36),
    transaction_id VARCHAR(36),
    saga_id VARCHAR(36),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    channel ENUM('IN_APP', 'EMAIL', 'SMS') DEFAULT 'IN_APP',
    status ENUM('DELIVERED', 'SENT', 'FAILED') DEFAULT 'DELIVERED',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    INDEX idx_notif_cust (customer_id),
    INDEX idx_notif_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Audit Trail Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45) NOT NULL,
    status ENUM('SUCCESS', 'FAILURE', 'WARNING') DEFAULT 'SUCCESS',
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (user),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
