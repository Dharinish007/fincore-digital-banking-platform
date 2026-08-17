-- Bank Loan Management System
-- Database schema based strictly on the approved ER diagram.

CREATE DATABASE IF NOT EXISTS bank_loan_management;
USE bank_loan_management;

-- 1. CUSTOMERS
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    date_of_birth DATE,
    customer_status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. LOANS
CREATE TABLE loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    tenure_months INT NOT NULL,
    loan_status VARCHAR(30) DEFAULT 'PENDING',
    loan_start_date DATE,
    maturity_date DATE,
    CONSTRAINT fk_loans_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 3. ACCOUNTS
CREATE TABLE accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    account_number VARCHAR(30) NOT NULL UNIQUE,
    account_type VARCHAR(30) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    account_status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 4. REPAYMENTS
CREATE TABLE repayments (
    repayment_id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    amount_due DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 0.00,
    payment_date DATE,
    payment_status VARCHAR(30) DEFAULT 'PENDING',
    remaining_amount DECIMAL(15,2) NOT NULL,
    CONSTRAINT fk_repayments_loan
        FOREIGN KEY (loan_id) REFERENCES loans(loan_id),
    CONSTRAINT uq_repayment_installment
        UNIQUE (loan_id, installment_number)
);

-- 5. DISBURSEMENTS
CREATE TABLE disbursements (
    disbursement_id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    disbursement_date DATE,
    status VARCHAR(30) DEFAULT 'PENDING',
    transaction_reference VARCHAR(100) UNIQUE,
    current_step VARCHAR(100),
    failure_reason VARCHAR(255),
    CONSTRAINT fk_disbursements_loan
        FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);

-- 6. DISBURSEMENT_STEPS
CREATE TABLE disbursement_steps (
    step_id INT AUTO_INCREMENT PRIMARY KEY,
    disbursement_id INT NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    step_status VARCHAR(30) DEFAULT 'PENDING',
    started_at DATETIME,
    completed_at DATETIME,
    error_message VARCHAR(255),
    CONSTRAINT fk_disbursement_steps_disbursement
        FOREIGN KEY (disbursement_id) REFERENCES disbursements(disbursement_id)
);

-- 7. NPA_CLASSIFICATIONS
CREATE TABLE npa_classifications (
    npa_id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL UNIQUE,
    overdue_days INT DEFAULT 0,
    outstanding_amount DECIMAL(15,2) DEFAULT 0.00,
    classification VARCHAR(50),
    classification_date DATE,
    reason VARCHAR(255),
    status VARCHAR(30) DEFAULT 'ACTIVE',
    CONSTRAINT fk_npa_loan
        FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);

-- 8. TRANSACTIONS
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    loan_id INT,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference_number VARCHAR(100) UNIQUE,
    status VARCHAR(30) DEFAULT 'SUCCESS',
    CONSTRAINT fk_transactions_account
        FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    CONSTRAINT fk_transactions_loan
        FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);

-- Helpful indexes for foreign-key lookups
CREATE INDEX idx_loans_customer_id ON loans(customer_id);
CREATE INDEX idx_accounts_customer_id ON accounts(customer_id);
CREATE INDEX idx_repayments_loan_id ON repayments(loan_id);
CREATE INDEX idx_disbursements_loan_id ON disbursements(loan_id);
CREATE INDEX idx_disbursement_steps_disbursement_id
    ON disbursement_steps(disbursement_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_loan_id ON transactions(loan_id);
