-- ============================================================================
-- FINCORE NEXUS ENTERPRISE BANKING PLATFORM
-- MILESTONE 2: REPAYMENT TRACKING, DISBURSEMENT SAGA & NPA CLASSIFICATION
-- Target Engine: MySQL 8.0+ / MariaDB / PostgreSQL compatible
-- ============================================================================

USE fincore_nexus;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS saga_steps;
DROP TABLE IF EXISTS disbursement_sagas;
DROP TABLE IF EXISTS repayment_schedules;
DROP TABLE IF EXISTS loans;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. LOAN PORTFOLIO & NPA DELINQUENCY ENGINE
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
    payment_status VARCHAR(30) DEFAULT 'CURRENT', -- CURRENT, OVERDUE, PARTIAL_PENDING, CRITICAL_OVERDUE, DEFAULTED
    npa_classification VARCHAR(30) DEFAULT 'STANDARD', -- STANDARD (0 DPD), SMA-0 (1-30 DPD), SMA-1 (31-60 DPD), SMA-2 (61-90 DPD), NPA (>90 DPD)
    disbursement_date DATE,
    next_due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_loan_npa (npa_classification),
    INDEX idx_loan_dpd (dpd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. REPAYMENT SCHEDULES & INSTALLMENT TRACKING
CREATE TABLE repayment_schedules (
    id VARCHAR(36) PRIMARY KEY,
    loan_id VARCHAR(36) NOT NULL,
    installment_number INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    amount_paid DECIMAL(15, 2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    payment_mode VARCHAR(50), -- CASH_COUNTER, DIRECT_DEBIT, ACH, RTGS
    transaction_ref VARCHAR(100),
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE, PARTIAL
    recorded_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_repayment_loan FOREIGN KEY (loan_id) REFERENCES loans (id) ON DELETE CASCADE,
    INDEX idx_repay_status (status),
    INDEX idx_repay_duedate (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. DISTRIBUTED DISBURSEMENT SAGAS (ORCHESTRATION)
CREATE TABLE disbursement_sagas (
    id VARCHAR(36) PRIMARY KEY,
    loan_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    disbursement_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED, FAILED, COMPENSATING
    current_step INT DEFAULT 1,
    total_steps INT DEFAULT 4,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    failure_reason TEXT,
    CONSTRAINT fk_saga_loan FOREIGN KEY (loan_id) REFERENCES loans (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE saga_steps (
    id VARCHAR(36) PRIMARY KEY,
    saga_id VARCHAR(36) NOT NULL,
    step_order INT NOT NULL,
    step_name VARCHAR(100) NOT NULL, -- Credit Approval, Collateral Verification, Ledger Disbursement, Account Credited
    service_target VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, FAILED, COMPENSATED
    executed_at TIMESTAMP NULL,
    compensation_action VARCHAR(100),
    error_message TEXT,
    step_payload TEXT,
    CONSTRAINT fk_step_saga FOREIGN KEY (saga_id) REFERENCES disbursement_sagas (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA FOR MILESTONE 2
INSERT INTO loans (id, customer_id, loan_type, principal_amount, outstanding_amount, interest_rate, tenor_months, emi_amount, total_installments, paid_installments, pending_installments, overdue_installments, overdue_amount, dpd, payment_status, npa_classification, disbursement_date, next_due_date) VALUES
('LN-8001', 'CUST-1001', 'Home Mortgage', 250000.00, 218450.00, 6.25, 180, 2145.00, 180, 24, 156, 0, 0.00, 0, 'CURRENT', 'STANDARD', '2024-08-01', '2026-09-15'),
('LN-8002', 'CUST-1002', 'Commercial Term Loan', 500000.00, 412000.00, 7.50, 60, 10018.00, 60, 12, 47, 1, 10018.00, 14, 'PARTIAL_PENDING', 'SMA-0', '2025-08-15', '2026-09-10'),
('LN-8003', 'CUST-1003', 'Trade Working Capital', 150000.00, 145000.00, 9.20, 36, 4785.00, 36, 3, 31, 2, 9570.00, 48, 'OVERDUE', 'SMA-1', '2026-02-01', '2026-09-01'),
('LN-8004', 'CUST-1004', 'Secured Asset Backed', 380000.00, 330000.00, 5.80, 84, 5512.00, 84, 18, 63, 3, 16536.00, 76, 'CRITICAL_OVERDUE', 'SMA-2', '2025-01-10', '2026-08-20'),
('LN-8005', 'CUST-1005', 'Equipment Finance', 85000.00, 79200.00, 10.50, 48, 2174.00, 48, 4, 40, 4, 8696.00, 112, 'DEFAULTED', 'NPA', '2025-09-15', '2026-08-01');

INSERT INTO repayment_schedules (id, loan_id, installment_number, amount, amount_paid, due_date, paid_date, payment_mode, transaction_ref, status, recorded_by) VALUES
('REP-901', 'LN-8001', 24, 2145.00, 2145.00, '2026-08-15', '2026-08-14', 'DIRECT_DEBIT', 'TXN-DD-8812', 'PAID', 'SYSTEM_ACH'),
('REP-902', 'LN-8002', 12, 10018.00, 5000.00, '2026-08-10', '2026-08-12', 'CASH_COUNTER', 'TXN-TELLER-104', 'PARTIAL', 'Marcus Brody'),
('REP-903', 'LN-8003', 4, 4785.00, 0.00, '2026-07-01', NULL, NULL, NULL, 'OVERDUE', NULL);

INSERT INTO disbursement_sagas (id, loan_id, customer_name, disbursement_amount, status, current_step, total_steps, started_at, completed_at) VALUES
('SAGA-201', 'LN-8001', 'Sarah Jenkins', 250000.00, 'COMPLETED', 4, 4, '2024-08-01 09:00:00', '2024-08-01 09:02:15'),
('SAGA-202', 'LN-8002', 'Robert Vance', 500000.00, 'COMPLETED', 4, 4, '2025-08-15 11:30:00', '2025-08-15 11:33:40');

INSERT INTO saga_steps (id, saga_id, step_order, step_name, service_target, status, executed_at) VALUES
('STP-01', 'SAGA-201', 1, 'Credit Facility Approval', 'CREDIT_ENGINE', 'COMPLETED', '2024-08-01 09:00:30'),
('STP-02', 'SAGA-201', 2, 'Collateral Title Perfection', 'COLLATERAL_SERVICE', 'COMPLETED', '2024-08-01 09:01:10'),
('STP-03', 'SAGA-201', 3, 'Core Ledger Debit', 'ACCOUNTING_LEDGER', 'COMPLETED', '2024-08-01 09:01:45'),
('STP-04', 'SAGA-201', 4, 'Beneficiary Account Credited', 'DISBURSEMENT_GATEWAY', 'COMPLETED', '2024-08-01 09:02:15');
