-- ==========================================================
-- FINCORE NEXUS ENTERPRISE BANKING PLATFORM - MYSQL SCHEMA
-- Comprehensive Database Definition for Milestones 1, 2, 3, 4
-- ==========================================================

DROP TABLE IF EXISTS audit_alerts;
DROP TABLE IF EXISTS audit_integrity;
DROP TABLE IF EXISTS audit_logs;

DROP TABLE IF EXISTS compliance_documents;
DROP TABLE IF EXISTS compliance_details;
DROP TABLE IF EXISTS compliance_checks;

DROP TABLE IF EXISTS risk_score_history;
DROP TABLE IF EXISTS risk_factors;
DROP TABLE IF EXISTS risk_scores;

DROP TABLE IF EXISTS notification_records;
DROP TABLE IF EXISTS settlement_records;
DROP TABLE IF EXISTS saga_steps;
DROP TABLE IF EXISTS disbursement_sagas;

DROP TABLE IF EXISTS repayment_schedules;
DROP TABLE IF EXISTS loans;

DROP TABLE IF EXISTS kyc_documents;
DROP TABLE IF EXISTS kyc_records;
DROP TABLE IF EXISTS customers;

DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

-- ----------------------------------------------------------
-- 1. AUTHENTICATION & RBAC (Milestone 1)
-- ----------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 2. CUSTOMERS & KYC (Milestone 1)
-- ----------------------------------------------------------
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(25) NOT NULL,
    account_number VARCHAR(30) NOT NULL UNIQUE,
    account_type VARCHAR(50) NOT NULL,
    account_balance DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, UNDER_REVIEW, RESTRICTED
    kyc_status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    risk_score INT DEFAULT 50,
    risk_level VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
    pep_status VARCHAR(10) DEFAULT 'NO', -- YES, NO
    sanctions_status VARCHAR(20) DEFAULT 'CLEAR', -- CLEAR, FLAGGED
    joined_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE kyc_records (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    reviewed_by VARCHAR(50),
    reviewed_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_kyc_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 3. LOANS, REPAYMENTS & NPA CLASSIFICATION (Milestone 2)
-- ----------------------------------------------------------
CREATE TABLE loans (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    outstanding_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    tenor_months INT NOT NULL,
    emi_amount DECIMAL(15, 2) NOT NULL,
    total_installments INT NOT NULL,
    paid_installments INT DEFAULT 0,
    pending_installments INT NOT NULL,
    overdue_installments INT DEFAULT 0,
    overdue_amount DECIMAL(15, 2) DEFAULT 0.00,
    dpd INT DEFAULT 0, -- Days Past Due
    payment_status VARCHAR(30) DEFAULT 'CURRENT', -- CURRENT, OVERDUE, PARTIAL_PENDING, DEFAULTED
    npa_classification VARCHAR(30) DEFAULT 'STANDARD', -- STANDARD (0 DPD), SMA-0 (1-30 DPD), SMA-1 (31-60 DPD), SMA-2 (61-90 DPD), NPA (>90 DPD)
    disbursement_date DATE,
    next_due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE repayment_schedules (
    id VARCHAR(36) PRIMARY KEY,
    loan_id VARCHAR(36) NOT NULL,
    installment_number INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    amount_paid DECIMAL(15, 2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    payment_mode VARCHAR(50),
    transaction_ref VARCHAR(100),
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE, PARTIAL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_repayment_loan FOREIGN KEY (loan_id) REFERENCES loans (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 4. DISBURSEMENT SAGA & EXECUTION (Milestone 2 & 3)
-- ----------------------------------------------------------
CREATE TABLE disbursement_sagas (
    id VARCHAR(36) PRIMARY KEY,
    loan_id VARCHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED, FAILED, COMPENSATING
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_saga_loan FOREIGN KEY (loan_id) REFERENCES loans (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE saga_steps (
    id VARCHAR(36) PRIMARY KEY,
    saga_id VARCHAR(36) NOT NULL,
    step_name VARCHAR(100) NOT NULL, -- Document Verification, Loan Approval, Account Credited, Completed
    step_order INT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, FAILED, COMPENSATED
    executed_at TIMESTAMP NULL,
    error_message TEXT,
    step_details TEXT,
    CONSTRAINT fk_sagastep_saga FOREIGN KEY (saga_id) REFERENCES disbursement_sagas (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 5. SETTLEMENT CONFIRMATION & NOTIFICATIONS (Milestone 3)
-- ----------------------------------------------------------
CREATE TABLE settlement_records (
    id VARCHAR(36) PRIMARY KEY,
    reference_id VARCHAR(100) NOT NULL UNIQUE,
    batch_id VARCHAR(100) NOT NULL,
    counterparty_bank VARCHAR(100) NOT NULL,
    settlement_amount DECIMAL(15, 2) NOT NULL,
    settlement_date TIMESTAMP NOT NULL,
    channel VARCHAR(30) NOT NULL, -- RTGS, NEFT, SWIFT
    confirmation_status VARCHAR(30) DEFAULT 'PENDING', -- CONFIRMED, PENDING, FAILED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE notification_records (
    id VARCHAR(36) PRIMARY KEY,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_id VARCHAR(36),
    channel VARCHAR(30) NOT NULL, -- SMS, Email, In-App
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    delivery_status VARCHAR(30) DEFAULT 'DELIVERED', -- DELIVERED, PENDING, FAILED
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 6. RISK SCORING & COMPLIANCE CHECKS (Milestone 4)
-- ----------------------------------------------------------
CREATE TABLE risk_scores (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL UNIQUE,
    credit_score INT NOT NULL,
    debt_to_income_ratio DECIMAL(5, 2),
    dpd_count INT DEFAULT 0,
    calculated_score INT NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH
    last_assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE risk_factors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    risk_score_id VARCHAR(36) NOT NULL,
    factor_name VARCHAR(150) NOT NULL,
    impact_type VARCHAR(20) NOT NULL, -- POSITIVE, NEGATIVE, NEUTRAL
    weight_score INT NOT NULL,
    CONSTRAINT fk_rf_riskscore FOREIGN KEY (risk_score_id) REFERENCES risk_scores (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE risk_score_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    score INT NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    reason TEXT,
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rsh_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE compliance_checks (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    check_type VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, PASS, FAIL
    submitted_by VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by VARCHAR(50),
    reviewed_at TIMESTAMP NULL,
    risk_level VARCHAR(20),
    findings TEXT,
    CONSTRAINT fk_compliance_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE compliance_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    check_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL, -- KYC, AML, Transaction Limit, Document Verification, PEP, Sanctions
    result VARCHAR(30) NOT NULL, -- PASS, FAIL, PENDING
    notes TEXT,
    CONSTRAINT fk_cd_check FOREIGN KEY (check_id) REFERENCES compliance_checks (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE compliance_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    check_id VARCHAR(36) NOT NULL,
    document_name VARCHAR(100) NOT NULL,
    document_type VARCHAR(50),
    document_url VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_doc_check FOREIGN KEY (check_id) REFERENCES compliance_checks (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 7. AUDIT TRAIL & SHA-256 INTEGRITY CHAIN (Milestone 1 & 4)
-- ----------------------------------------------------------
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_index INT NOT NULL UNIQUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50) NOT NULL,
    role VARCHAR(30) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    payload TEXT NOT NULL,
    INDEX idx_audit_prev_hash (previous_hash),
    INDEX idx_audit_curr_hash (current_hash)
) ENGINE=InnoDB;

CREATE TABLE audit_integrity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by VARCHAR(50) NOT NULL,
    total_blocks INT NOT NULL,
    is_valid BOOLEAN NOT NULL,
    tampered_index INT NULL,
    verification_details TEXT
) ENGINE=InnoDB;

CREATE TABLE audit_alerts (
    id VARCHAR(36) PRIMARY KEY,
    severity VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, MEDIUM
    alert_type VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN', -- OPEN, INVESTIGATING, RESOLVED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    block_index INT NULL,
    description TEXT NOT NULL,
    investigated_by VARCHAR(50),
    resolution_notes TEXT
) ENGINE=InnoDB;
