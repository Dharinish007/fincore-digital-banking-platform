-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - MILESTONE 3 SCHEMA
-- Focus: Transactions, Saga Orchestration, Settlements, Notifications
-- Database: fincore_db
-- =========================================================
USE fincore_db;

-- 1. Transactions Table
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

-- 2. Saga Instances Table
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
    INDEX idx_saga_type (saga_type),
    INDEX idx_saga_idemp (idempotency_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Saga Steps Table
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

-- 4. Settlements Table
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

-- 5. Notifications Table
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
