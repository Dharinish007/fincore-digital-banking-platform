-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - MILESTONE 2 SCHEMA
-- Focus: Accounts, Loans, Repayment Tracking, Disbursement Saga, NPA Classification
-- Database: fincore_db
-- =========================================================
USE fincore_db;

-- 1. Accounts Table
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

-- 2. Loans Table
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

-- 3. Repayment Schedules Table
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
    INDEX idx_rep_status (status),
    INDEX idx_rep_duedate (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. NPA Records Table
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
