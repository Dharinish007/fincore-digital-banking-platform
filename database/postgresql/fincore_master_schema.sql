-- ============================================================================
-- FINCORE DIGITAL BANKING PLATFORM - UNIFIED MASTER DATABASE SCHEMA
-- Target Database: PostgreSQL 14+
-- Consolidates:
--   Milestone 1: Core Banking, Account Lifecycle & Statement Generation
--   Milestone 2: Loan Servicing, Reducing-Balance EMI & Collections
--   Milestone 3: Interbank Settlement Engine & Multi-Channel Notifications
--   Milestone 4: Biometric Liveness AI, Risk Scoring & Audit Logging
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CORE BANKING TABLES (MILESTONE 1)
-- ============================================================================

-- Primary Customer Directory
CREATE TABLE IF NOT EXISTS customers (
    customer_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || COALESCE(last_name, '')) STORED,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    address TEXT,
    kyc_status VARCHAR(30) DEFAULT 'VERIFIED' CHECK (kyc_status IN ('NOT_SUBMITTED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED')),
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Core Bank Accounts (Savings, Checking/Current, Commercial)
CREATE TABLE IF NOT EXISTS accounts (
    account_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    account_number VARCHAR(30) UNIQUE NOT NULL,
    account_type VARCHAR(30) NOT NULL CHECK (account_type IN ('SAVINGS', 'CURRENT', 'CHECKING', 'COMMERCIAL', 'SALARY')),
    balance NUMERIC(15,2) DEFAULT 0.00 CHECK (balance >= 0.00),
    available_balance NUMERIC(15,2) DEFAULT 0.00 CHECK (available_balance >= 0.00),
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DORMANT', 'FROZEN', 'BLOCKED', 'CLOSED')),
    min_balance_threshold NUMERIC(15,2) DEFAULT 1000.00,
    overdraft_limit NUMERIC(15,2) DEFAULT 0.00,
    opening_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Core Transaction Ledger Details
CREATE TABLE IF NOT EXISTS transaction_details (
    transaction_id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('CREDIT', 'DEBIT', 'TRANSFER', 'INTEREST', 'FEE')),
    amount NUMERIC(15,2) NOT NULL CHECK (amount > 0.00),
    description VARCHAR(255),
    transaction_status VARCHAR(30) DEFAULT 'SUCCESS' CHECK (transaction_status IN ('SUCCESS', 'PENDING', 'FAILED', 'REVERSED')),
    channel VARCHAR(50) DEFAULT 'ONLINE_BANKING',
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tx_account FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- Double-Entry Accounting Ledger
CREATE TABLE IF NOT EXISTS ledger (
    ledger_id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL,
    debit NUMERIC(15,2) DEFAULT 0.00,
    credit NUMERIC(15,2) DEFAULT 0.00,
    balance_after NUMERIC(15,2),
    ledger_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ledger_transaction FOREIGN KEY (transaction_id) REFERENCES transaction_details(transaction_id) ON DELETE CASCADE
);

-- Generated Account Formal Statements Record
CREATE TABLE IF NOT EXISTS statement_archive (
    statement_id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statement_format VARCHAR(20) DEFAULT 'PDF' CHECK (statement_format IN ('PDF', 'EXCEL', 'CSV', 'JSON')),
    statement_template VARCHAR(30) DEFAULT 'CLASSIC' CHECK (statement_template IN ('CLASSIC', 'EXECUTIVE', 'TAX')),
    download_url TEXT,
    sha256_checksum VARCHAR(64),
    CONSTRAINT fk_statement_account FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- Account Lifecycle State Audit History
CREATE TABLE IF NOT EXISTS account_status_history (
    history_id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100) DEFAULT 'SYSTEM',
    reason VARCHAR(255),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_account FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- ============================================================================
-- 3. LOAN MANAGEMENT MODULE (MILESTONE 2)
-- ============================================================================

-- Loans Portfolio (Sanctioned, Disbursed, Repaying)
CREATE TABLE IF NOT EXISTS loans (
    loan_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    loan_number VARCHAR(50) UNIQUE NOT NULL,
    loan_type VARCHAR(50) NOT NULL CHECK (loan_type IN ('HOME_LOAN', 'PERSONAL_LOAN', 'CAR_LOAN', 'BUSINESS_LOAN', 'EDUCATION_LOAN')),
    principal_amount NUMERIC(15,2) NOT NULL CHECK (principal_amount > 0.00),
    annual_interest_rate NUMERIC(5,2) NOT NULL CHECK (annual_interest_rate >= 0.00),
    tenure_months INTEGER NOT NULL CHECK (tenure_months > 0),
    monthly_emi NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    total_interest NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    total_payable NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    disbursed_amount NUMERIC(15,2) DEFAULT 0.00,
    outstanding_principal NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    outstanding_interest NUMERIC(15,2) DEFAULT 0.00,
    auto_debit_enabled BOOLEAN DEFAULT TRUE,
    loan_status VARCHAR(30) DEFAULT 'APPROVED' CHECK (loan_status IN ('PENDING', 'APPROVED', 'DISBURSED', 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'CLOSED', 'FORECLOSED')),
    application_date DATE DEFAULT CURRENT_DATE,
    approval_date DATE,
    disbursement_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loans_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT fk_loans_account FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- Loan Disbursals Tracking
CREATE TABLE IF NOT EXISTS loan_disbursement (
    disbursement_id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    disbursement_amount NUMERIC(15,2) NOT NULL CHECK (disbursement_amount > 0.00),
    disbursement_channel VARCHAR(50) DEFAULT 'IMPS' CHECK (disbursement_channel IN ('IMPS', 'NEFT', 'RTGS', 'INTERNAL_TRANSFER')),
    disbursement_status VARCHAR(30) DEFAULT 'SUCCESS' CHECK (disbursement_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED')),
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    disbursement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    CONSTRAINT fk_disbursement_loan FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE,
    CONSTRAINT fk_disbursement_account FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- Reducing-Balance Monthly EMI Repayment Schedule
CREATE TABLE IF NOT EXISTS emi_schedule (
    emi_id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL,
    emi_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    opening_principal NUMERIC(15,2) NOT NULL,
    emi_amount NUMERIC(15,2) NOT NULL,
    principal_component NUMERIC(15,2) NOT NULL,
    interest_component NUMERIC(15,2) NOT NULL,
    closing_principal NUMERIC(15,2) NOT NULL,
    paid_amount NUMERIC(15,2) DEFAULT 0.00,
    remaining_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    emi_status VARCHAR(30) DEFAULT 'PENDING' CHECK (emi_status IN ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE')),
    payment_date DATE,
    CONSTRAINT fk_schedule_loan FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE,
    CONSTRAINT uq_loan_emi_number UNIQUE (loan_id, emi_number)
);

-- Customer EMI Collections & Repayment Receipts
CREATE TABLE IF NOT EXISTS emi_collections (
    collection_id BIGSERIAL PRIMARY KEY,
    emi_id BIGINT NOT NULL,
    loan_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    payment_amount NUMERIC(15,2) NOT NULL CHECK (payment_amount > 0.00),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('UPI', 'NET_BANKING', 'DEBIT_CARD', 'AUTO_DEBIT', 'CASH', 'CHEQUE')),
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    collection_status VARCHAR(30) DEFAULT 'SUCCESS' CHECK (collection_status IN ('SUCCESS', 'PENDING', 'FAILED', 'REVERSED')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    CONSTRAINT fk_coll_emi FOREIGN KEY (emi_id) REFERENCES emi_schedule(emi_id),
    CONSTRAINT fk_coll_loan FOREIGN KEY (loan_id) REFERENCES loans(loan_id),
    CONSTRAINT fk_coll_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- ============================================================================
-- 4. ENTERPRISE SETTLEMENT & COMMUNICATIONS (MILESTONE 3)
-- ============================================================================

-- Interbank Clearing & Settlement Netting Batches
CREATE TABLE IF NOT EXISTS settlement_batches (
    batch_id VARCHAR(50) PRIMARY KEY,
    clearing_window VARCHAR(50) NOT NULL,
    clearing_method VARCHAR(50) NOT NULL,
    gross_volume NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    net_obligation NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    transaction_count INTEGER NOT NULL DEFAULT 0,
    saga_status VARCHAR(50) DEFAULT 'COMPLETED',
    status VARCHAR(30) DEFAULT 'SETTLED' CHECK (status IN ('PENDING', 'PROCESSING', 'SETTLED', 'FAILED')),
    settled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Interbank Payment Settlement Records
CREATE TABLE IF NOT EXISTS settlement (
    settlement_id BIGSERIAL PRIMARY KEY,
    batch_id VARCHAR(50),
    transaction_reference VARCHAR(100) NOT NULL,
    loan_id BIGINT,
    settled_amount NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'SETTLED',
    settled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_settle_batch FOREIGN KEY (batch_id) REFERENCES settlement_batches(batch_id) ON DELETE SET NULL
);

-- Fraud Detection Alert Events
CREATE TABLE IF NOT EXISTS fraud_events (
    event_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT,
    transaction_reference VARCHAR(100),
    fraud_score INTEGER CHECK (fraud_score BETWEEN 0 AND 100),
    threat_level VARCHAR(30) DEFAULT 'LOW' CHECK (threat_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    reason TEXT,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'INVESTIGATING', 'BLOCKED', 'DISMISSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Multi-Channel Customer Notifications (SMS, Email, Push)
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT,
    recipient VARCHAR(255) NOT NULL,
    channel VARCHAR(50) DEFAULT 'EMAIL' CHECK (channel IN ('EMAIL', 'SMS', 'PUSH', 'WEBHOOK')),
    event_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'DELIVERED' CHECK (status IN ('QUEUED', 'DELIVERED', 'FAILED', 'RETRYING')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. AI RISK, BIOMETRICS & SECURITY AUDIT (MILESTONE 4)
-- ============================================================================

-- Customer Passcode Security (BCrypt Encrypted)
CREATE TABLE IF NOT EXISTS customer_security_credentials (
    credential_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL UNIQUE,
    passcode_hash VARCHAR(255) NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE,
    last_verified_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cred_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- MediaPipe AI Face Liveness Verifications
CREATE TABLE IF NOT EXISTS liveness_verification (
    verification_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    confidence_score NUMERIC(5,2),
    verification_method VARCHAR(50) DEFAULT 'WEBCAM_MEDIAPIPE',
    challenges_passed VARCHAR(100) DEFAULT 'BLINK,TURN,SMILE',
    status VARCHAR(30) DEFAULT 'VERIFIED' CHECK (status IN ('PENDING', 'VERIFIED', 'FAILED')),
    failure_reason TEXT,
    ip_address VARCHAR(45),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_liveness_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- AI Transaction Risk Assessments
CREATE TABLE IF NOT EXISTS risk_assessment (
    assessment_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT,
    transaction_reference VARCHAR(100),
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    decision VARCHAR(30) NOT NULL CHECK (decision IN ('APPROVE', 'CHALLENGE', 'FLAG', 'REJECT')),
    amount NUMERIC(15,2),
    transaction_type VARCHAR(50),
    location VARCHAR(150),
    device_type VARCHAR(80),
    international_transaction BOOLEAN DEFAULT FALSE,
    new_device BOOLEAN DEFAULT FALSE,
    previous_transaction_count INTEGER DEFAULT 0,
    reasons TEXT,
    ai_analysis TEXT,
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Centralized Immutable Audit Trail
CREATE TABLE IF NOT EXISTS audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(100) DEFAULT 'system_admin',
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity VARCHAR(80),
    entity_id VARCHAR(100),
    details TEXT,
    status VARCHAR(30) DEFAULT 'SUCCESS',
    ip VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_accounts_customer_id ON accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_tx_account_id ON transaction_details(account_id);
CREATE INDEX IF NOT EXISTS idx_tx_date ON transaction_details(transaction_date);
CREATE INDEX IF NOT EXISTS idx_loans_customer ON loans(customer_id);
CREATE INDEX IF NOT EXISTS idx_loans_number ON loans(loan_number);
CREATE INDEX IF NOT EXISTS idx_emi_loan ON emi_schedule(loan_id);
CREATE INDEX IF NOT EXISTS idx_emi_due_date ON emi_schedule(due_date);
CREATE INDEX IF NOT EXISTS idx_risk_score ON risk_assessment(risk_score);
CREATE INDEX IF NOT EXISTS idx_liveness_cust ON liveness_verification(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_module ON audit_log(module);

-- ============================================================================
-- 7. STORED PROCEDURES & TRIGGERS
-- ============================================================================

-- Automatic Balance Update Trigger on Transaction
CREATE OR REPLACE FUNCTION fn_update_account_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.transaction_status = 'SUCCESS' THEN
        IF NEW.transaction_type = 'CREDIT' THEN
            UPDATE accounts
            SET balance = balance + NEW.amount,
                available_balance = available_balance + NEW.amount
            WHERE account_id = NEW.account_id;
        ELSIF NEW.transaction_type = 'DEBIT' THEN
            UPDATE accounts
            SET balance = balance - NEW.amount,
                available_balance = available_balance - NEW.amount
            WHERE account_id = NEW.account_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_balance_update ON transaction_details;
CREATE TRIGGER trg_balance_update
AFTER INSERT ON transaction_details
FOR EACH ROW
EXECUTE FUNCTION fn_update_account_balance();

-- ============================================================================
-- 8. UNIFIED SEED DEMO DATA
-- ============================================================================

-- Customers
INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, kyc_status, date_of_birth)
VALUES
    (1, 'John', 'Smith', 'john.smith@example.com', '+91 98765 10001', 'Bandra West, Mumbai', 'VERIFIED', DATE '1990-08-15'),
    (2, 'Sarah', 'Jenkins', 'sarah.jenkins@example.com', '+91 98765 10002', 'Indiranagar, Bengaluru', 'VERIFIED', DATE '1988-03-22'),
    (3, 'TechCorp', 'Solutions', 'finance@techcorp.example.com', '+91 98765 10003', 'HITEC City, Hyderabad', 'VERIFIED', DATE '1985-11-05'),
    (4, 'Ananya', 'Verma', 'ananya.v@example.com', '+91 98765 10004', 'Koramangala, Bengaluru', 'VERIFIED', DATE '1994-01-12')
ON CONFLICT (customer_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('customers', 'customer_id'), (SELECT COALESCE(MAX(customer_id), 1) FROM customers), TRUE);

-- Bank Accounts
INSERT INTO accounts (account_id, customer_id, account_number, account_type, balance, available_balance, status, opening_date)
VALUES
    (1, 1, 'ACC-8849-1001', 'SAVINGS', 452100.00, 452100.00, 'ACTIVE', CURRENT_DATE - 240),
    (2, 2, 'ACC-8849-1002', 'CHECKING', 128505.00, 128505.00, 'ACTIVE', CURRENT_DATE - 180),
    (3, 3, 'ACC-8849-1003', 'COMMERCIAL', 12500000.00, 12500000.00, 'ACTIVE', CURRENT_DATE - 365),
    (4, 4, 'ACC-8849-1004', 'SAVINGS', 340000.00, 340000.00, 'ACTIVE', CURRENT_DATE - 90)
ON CONFLICT (account_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('accounts', 'account_id'), (SELECT COALESCE(MAX(account_id), 1) FROM accounts), TRUE);

-- Loans
INSERT INTO loans (loan_id, customer_id, account_id, loan_number, loan_type, principal_amount, annual_interest_rate, tenure_months, monthly_emi, total_interest, total_payable, disbursed_amount, outstanding_principal, loan_status)
VALUES
    (1, 1, 1, 'HL-2024-1247', 'HOME_LOAN', 2400000.00, 8.50, 240, 20830.00, 2599200.00, 4999200.00, 2400000.00, 2381530.00, 'ACTIVE'),
    (2, 4, 4, 'CL-2025-8831', 'CAR_LOAN', 850000.00, 9.20, 60, 17730.00, 213800.00, 1063800.00, 850000.00, 712000.00, 'ACTIVE'),
    (3, 3, 3, 'BL-2026-9042', 'BUSINESS_LOAN', 5000000.00, 10.50, 72, 93900.00, 1760800.00, 6760800.00, 5000000.00, 4850000.00, 'ACTIVE')
ON CONFLICT (loan_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('loans', 'loan_id'), (SELECT COALESCE(MAX(loan_id), 1) FROM loans), TRUE);

-- Core Transactions
INSERT INTO transaction_details (transaction_id, account_id, transaction_reference, transaction_type, amount, description, transaction_status)
VALUES
    (1, 1, 'TXN-2026-0001', 'CREDIT', 50000.00, 'Monthly Corporate Salary', 'SUCCESS'),
    (2, 1, 'TXN-2026-0002', 'DEBIT', 20830.00, 'Home Loan Auto-Debit (HL-2024-1247)', 'SUCCESS'),
    (3, 2, 'TXN-2026-0003', 'CREDIT', 15000.00, 'Direct Vendor Transfer', 'SUCCESS'),
    (4, 3, 'TXN-2026-0004', 'DEBIT', 250000.00, 'Quarterly Vendor Payroll Disbursal', 'SUCCESS')
ON CONFLICT (transaction_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('transaction_details', 'transaction_id'), (SELECT COALESCE(MAX(transaction_id), 1) FROM transaction_details), TRUE);

-- Security Passcodes (BCrypt for "123456")
INSERT INTO customer_security_credentials (customer_id, passcode_hash, failed_attempts, is_locked)
VALUES
    (1, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 0, FALSE),
    (2, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 0, FALSE),
    (3, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 0, FALSE),
    (4, '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 0, FALSE)
ON CONFLICT (customer_id) DO NOTHING;

-- Audit Logs
INSERT INTO audit_log (user_id, username, action, module, entity, entity_id, details, status, ip)
VALUES
    (1, 'sruth_admin', 'SYSTEM_INIT', 'DATABASE', 'DATABASE_SCHEMA', 'ALL', 'FinCore Unified Master Schema Initialized', 'SUCCESS', '127.0.0.1'),
    (1, 'sruth_admin', 'LOAN_APPROVAL', 'LOANS', 'LOAN_RECORD', 'HL-2024-1247', 'Sanctioned Home Loan for John Smith', 'SUCCESS', '127.0.0.1'),
    (1, 'sruth_admin', 'LIVENESS_VERIFIED', 'SECURITY', 'CUSTOMER', '1', 'MediaPipe face verification challenge passed', 'SUCCESS', '127.0.0.1');

-- Completed.
