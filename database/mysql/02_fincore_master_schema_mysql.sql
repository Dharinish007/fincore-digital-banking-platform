-- ============================================================================
-- FINCORE DIGITAL BANKING PLATFORM - UNIFIED MASTER DATABASE SCHEMA (MySQL 8.0+)
-- Functional Integration: Team B + Team C (Milestones 1, 2, 3, 4)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS digital_banking
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE digital_banking;

-- ============================================================================
-- 1. CORE BANKING & CUSTOMER LIFECYCLE (Milestone 1)
-- ============================================================================

-- Customers Table (Team C & Team B compatible)
CREATE TABLE IF NOT EXISTS customer (
    customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) UNIQUE,
    date_of_birth DATE,
    address TEXT,
    tier VARCHAR(30) DEFAULT 'STANDARD',
    kyc_status VARCHAR(30) DEFAULT 'VERIFIED',
    status VARCHAR(30) DEFAULT 'ACTIVE',
    credit_score INT DEFAULT 750,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts Table (Team C primary)
CREATE TABLE IF NOT EXISTS account (
    account_no VARCHAR(30) PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    account_type ENUM('Savings', 'Current', 'Checking', 'Commercial') NOT NULL DEFAULT 'Savings',
    balance DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('Active', 'Blocked', 'Closed', 'Dormant') DEFAULT 'Active',
    branch_name VARCHAR(100) DEFAULT 'Main Branch',
    ifsc_code VARCHAR(20) DEFAULT 'FINC0001234',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Accounts Table (Team B operations view/table)
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    account_type VARCHAR(30) NOT NULL DEFAULT 'SAVINGS',
    balance DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    opened_at DATE DEFAULT (CURRENT_DATE),
    closed_at DATE NULL
);

-- Transactions Table (Double Entry & Payment Records)
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_no VARCHAR(30) NULL,
    transaction_reference VARCHAR(64) UNIQUE,
    customer_id BIGINT NULL,
    loan_id BIGINT NULL,
    transaction_type VARCHAR(30) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'SUCCESS',
    transaction_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_txn_account FOREIGN KEY (account_no) REFERENCES account(account_no) ON DELETE SET NULL
);

-- Account Statements Table
CREATE TABLE IF NOT EXISTS account_statement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_id BIGINT NOT NULL,
    transaction_id BIGINT NULL,
    type VARCHAR(30) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    reference VARCHAR(64),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. LOAN MANAGEMENT & CREDIT RISK (Milestone 2)
-- ============================================================================

-- Loan Origination & Applications (Team C)
CREATE TABLE IF NOT EXISTS loan_application (
    loan_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    amount_requested DECIMAL(15,2) NOT NULL,
    annual_income DECIMAL(15,2) NOT NULL,
    tenure_months INT NOT NULL,
    interest_rate DECIMAL(5,2) DEFAULT 8.50,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_app_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Loan History (Bureau & Past Performance)
CREATE TABLE IF NOT EXISTS loan_history (
    history_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    closed_date DATE,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_loan_hist_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Credit Check Evaluations
CREATE TABLE IF NOT EXISTS credit_check (
    check_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    credit_score INT NOT NULL,
    credit_status VARCHAR(50) NOT NULL,
    previous_loans_count INT DEFAULT 0,
    active_loans_count INT DEFAULT 0,
    default_history BOOLEAN DEFAULT FALSE,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_credit_check_cust FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- EMI Calculations Log
CREATE TABLE IF NOT EXISTS emi_calculation (
    emi_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    loan_id BIGINT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    tenure_months INT NOT NULL,
    monthly_emi DECIMAL(15,2) NOT NULL,
    total_interest DECIMAL(15,2) NOT NULL,
    total_payable DECIMAL(15,2) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loans Servicing (Team B)
CREATE TABLE IF NOT EXISTS loans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    loan_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    account_number VARCHAR(30),
    principal DECIMAL(15,2) NOT NULL,
    annual_interest_rate DECIMAL(5,2) NOT NULL,
    tenure_months INT NOT NULL,
    monthly_emi DECIMAL(15,2) NOT NULL,
    outstanding_balance DECIMAL(15,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    disbursed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Disbursements
CREATE TABLE IF NOT EXISTS disbursements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    loan_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    disbursement_method VARCHAR(50) DEFAULT 'DIRECT_DEPOSIT',
    target_account_number VARCHAR(30) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    disbursed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Collections
CREATE TABLE IF NOT EXISTS collections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    loan_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    amount_paid DECIMAL(15,2) NOT NULL,
    penalty_applied DECIMAL(15,2) DEFAULT 0.00,
    payment_channel VARCHAR(50) DEFAULT 'ONLINE_BANKING',
    receipt_number VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'COMPLETED',
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Repayment Schedule
CREATE TABLE IF NOT EXISTS loan_schedule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    loan_id BIGINT NOT NULL,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    emi_amount DECIMAL(15,2) NOT NULL,
    principal_component DECIMAL(15,2) NOT NULL,
    interest_component DECIMAL(15,2) NOT NULL,
    remaining_balance DECIMAL(15,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING'
);

-- ============================================================================
-- 3. PAYMENTS & SETTLEMENT ENGINE (Milestone 3)
-- ============================================================================

-- Beneficiaries
CREATE TABLE IF NOT EXISTS beneficiary (
    beneficiary_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    beneficiary_name VARCHAR(150) NOT NULL,
    beneficiary_account_no VARCHAR(30) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100),
    beneficiary_type VARCHAR(50) DEFAULT 'INTERNAL',
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ben_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Payments (Team C)
CREATE TABLE IF NOT EXISTS payment (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source_account_no VARCHAR(30) NOT NULL,
    destination_account_no VARCHAR(30) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL, -- NEFT, RTGS, IMPS, INTERNAL
    payment_type VARCHAR(30) DEFAULT 'TRANSFER',
    status VARCHAR(30) DEFAULT 'PENDING',
    transaction_ref VARCHAR(64) UNIQUE,
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interbank Settlements (Team B)
CREATE TABLE IF NOT EXISTS settlements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id BIGINT,
    settlement_reference VARCHAR(64) UNIQUE NOT NULL,
    sender_bank_code VARCHAR(20) NOT NULL,
    receiver_bank_code VARCHAR(20) NOT NULL,
    gross_amount DECIMAL(15,2) NOT NULL,
    net_amount DECIMAL(15,2) NOT NULL,
    clearing_type VARCHAR(20) NOT NULL, -- RTGS, NET_BATCH
    status VARCHAR(30) DEFAULT 'SETTLED',
    settled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud Check Events (Team C)
CREATE TABLE IF NOT EXISTS fraud_check (
    fraud_check_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT NOT NULL,
    risk_score INT NOT NULL,
    fraud_status VARCHAR(30) NOT NULL, -- SAFE, SUSPICIOUS, BLOCKED
    flagged_reasons TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud Events Stream (Team B)
CREATE TABLE IF NOT EXISTS fraud_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    transaction_ref VARCHAR(64),
    threat_level VARCHAR(30) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    fraud_score INT NOT NULL,
    reason TEXT,
    status VARCHAR(30) DEFAULT 'DETECTED',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Multi-channel Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    recipient_email VARCHAR(150),
    recipient_phone VARCHAR(30),
    channel VARCHAR(20) NOT NULL, -- EMAIL, SMS, IN_APP
    subject VARCHAR(200),
    message TEXT NOT NULL,
    event_type VARCHAR(50),
    status VARCHAR(30) DEFAULT 'SENT',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessment
CREATE TABLE IF NOT EXISTS risk_assessment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    transaction_reference VARCHAR(64),
    customer_name VARCHAR(150),
    risk_score INT,
    risk_level VARCHAR(20),
    assessment_status VARCHAR(30),
    account_number VARCHAR(30),
    account_type VARCHAR(50),
    account_balance DECIMAL(15,2),
    annual_income DECIMAL(15,2),
    amount DECIMAL(15,2),
    transaction_type VARCHAR(50),
    location VARCHAR(150),
    device_type VARCHAR(80),
    decision VARCHAR(30),
    reasons TEXT,
    ai_analysis TEXT,
    ai_model VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passcode Credentials
CREATE TABLE IF NOT EXISTS customer_security_credentials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT UNIQUE NOT NULL,
    passcode_hash VARCHAR(255) NOT NULL,
    failed_attempts INT DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Trail
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id VARCHAR(100),
    details TEXT,
    status VARCHAR(30) DEFAULT 'SUCCESS',
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. AI BIOMETRIC KYC & IDENTITY (Milestone 4)
-- ============================================================================

-- Document OCR (Team C)
CREATE TABLE IF NOT EXISTS document_ocr (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    document_type VARCHAR(50) NOT NULL, -- PASSPORT, DRIVING_LICENSE, NATIONAL_ID, AADHAAR, PAN
    document_number VARCHAR(100),
    full_name VARCHAR(150),
    date_of_birth VARCHAR(50),
    expiry_date VARCHAR(50),
    confidence_score DECIMAL(5,2),
    raw_ocr_text TEXT,
    status VARCHAR(30) DEFAULT 'VERIFIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Webcam Liveness (Team C)
CREATE TABLE IF NOT EXISTS liveness_verification (
    verification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(100),
    success BOOLEAN NOT NULL DEFAULT TRUE,
    passed BOOLEAN NOT NULL DEFAULT TRUE,
    confidence_score DOUBLE,
    liveness_score DOUBLE,
    verification_status VARCHAR(50) DEFAULT 'PASSED',
    message VARCHAR(255),
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MediaPipe Biometric Liveness Sessions (Team B)
CREATE TABLE IF NOT EXISTS biometric_liveness (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(30) NOT NULL,
    confidence_score DECIMAL(5,2),
    verification_method VARCHAR(50) DEFAULT 'MEDIAPIPE_FACE_MESH',
    ip_address VARCHAR(50),
    failure_reason VARCHAR(255),
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Face Match AI Verification (Team C)
CREATE TABLE IF NOT EXISTS face_match_verification (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    similarity_score DECIMAL(5,2) NOT NULL,
    quality_score DECIMAL(5,2),
    match_status VARCHAR(30) NOT NULL, -- MATCHED, MISMATCH
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KYC Overall Verification Audit (Team C)
CREATE TABLE IF NOT EXISTS kyc_verification (
    kyc_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    document_status VARCHAR(30) DEFAULT 'VERIFIED',
    liveness_status VARCHAR(30) DEFAULT 'PASSED',
    face_match_status VARCHAR(30) DEFAULT 'MATCHED',
    overall_status VARCHAR(30) DEFAULT 'APPROVED',
    remarks TEXT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_kyc_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);
