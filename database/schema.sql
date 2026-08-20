-- ============================================================
-- BANKING TRANSACTION WORKFLOW DATABASE
-- TEAM D
--
-- MODULES:
-- 1. Saga Execution
-- 2. Settlement Confirmation
-- 3. Notification Delivery
--
-- Database: MySQL 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS banking_transaction_workflow;

USE banking_transaction_workflow;


-- ============================================================
-- MODULE 1: SAGA EXECUTION
-- ============================================================

-- Main Saga transaction
CREATE TABLE saga_transaction (
    saga_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    saga_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    current_step INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (saga_id),

    INDEX idx_saga_customer (customer_id),
    INDEX idx_saga_status (status),
    INDEX idx_saga_type (saga_type)
) ENGINE=InnoDB;


-- Individual Saga execution steps
CREATE TABLE saga_step (
    step_id VARCHAR(36) NOT NULL,
    saga_id VARCHAR(36) NOT NULL,
    step_order INT NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    start_time DATETIME NULL,
    end_time DATETIME NULL,
    error_message TEXT NULL,

    PRIMARY KEY (step_id),

    CONSTRAINT fk_saga_step_saga
        FOREIGN KEY (saga_id)
        REFERENCES saga_transaction(saga_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY uk_saga_step_order (saga_id, step_order),
    INDEX idx_saga_step_status (status)
) ENGINE=InnoDB;


-- Compensating transactions when Saga fails
CREATE TABLE saga_compensation (
    compensation_id VARCHAR(36) NOT NULL,
    saga_step_id VARCHAR(36) NOT NULL,
    compensation_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    executed_at DATETIME NULL,
    error_message TEXT NULL,

    PRIMARY KEY (compensation_id),

    CONSTRAINT fk_compensation_saga_step
        FOREIGN KEY (saga_step_id)
        REFERENCES saga_step(step_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_compensation_status (status)
) ENGINE=InnoDB;


-- Saga audit/history
CREATE TABLE saga_audit_log (
    audit_id VARCHAR(36) NOT NULL,
    saga_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (audit_id),

    CONSTRAINT fk_saga_audit
        FOREIGN KEY (saga_id)
        REFERENCES saga_transaction(saga_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_saga_audit_created (created_at)
) ENGINE=InnoDB;


-- ============================================================
-- MODULE 2: SETTLEMENT CONFIRMATION
-- ============================================================

-- Main settlement record
CREATE TABLE settlement (
    settlement_id VARCHAR(36) NOT NULL,
    saga_id VARCHAR(36) NOT NULL,
    transaction_ref_no VARCHAR(50) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    settlement_time DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (settlement_id),

    CONSTRAINT fk_settlement_saga
        FOREIGN KEY (saga_id)
        REFERENCES saga_transaction(saga_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    UNIQUE KEY uk_settlement_transaction_ref (transaction_ref_no),
    INDEX idx_settlement_status (status),
    INDEX idx_settlement_saga (saga_id)
) ENGINE=InnoDB;


-- Debit and credit entries
CREATE TABLE settlement_item (
    item_id VARCHAR(36) NOT NULL,
    settlement_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    debit_credit VARCHAR(10) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    processed_time DATETIME NULL,
    remarks TEXT NULL,

    PRIMARY KEY (item_id),

    CONSTRAINT fk_settlement_item_settlement
        FOREIGN KEY (settlement_id)
        REFERENCES settlement(settlement_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_settlement_item_account (account_id),
    INDEX idx_settlement_item_status (status)
) ENGINE=InnoDB;


-- Settlement status history
CREATE TABLE settlement_status_history (
    history_id VARCHAR(36) NOT NULL,
    settlement_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(50) NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT NULL,

    PRIMARY KEY (history_id),

    CONSTRAINT fk_settlement_history_settlement
        FOREIGN KEY (settlement_id)
        REFERENCES settlement(settlement_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_settlement_history_status (status),
    INDEX idx_settlement_history_changed (changed_at)
) ENGINE=InnoDB;


-- ============================================================
-- MODULE 3: NOTIFICATION DELIVERY
-- ============================================================

-- Customer notifications
CREATE TABLE notification (
    notification_id VARCHAR(36) NOT NULL,
    settlement_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_at DATETIME NULL,
    sent_at DATETIME NULL,
    error_message TEXT NULL,

    PRIMARY KEY (notification_id),

    CONSTRAINT fk_notification_settlement
        FOREIGN KEY (settlement_id)
        REFERENCES settlement(settlement_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_notification_customer (customer_id),
    INDEX idx_notification_status (status),
    INDEX idx_notification_channel (channel),
    INDEX idx_notification_scheduled (scheduled_at)
) ENGINE=InnoDB;


-- Notification delivery attempts/logs
CREATE TABLE notification_log (
    log_id VARCHAR(36) NOT NULL,
    notification_id VARCHAR(36) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    response TEXT NULL,
    attempt_count INT NOT NULL DEFAULT 1,
    last_attempt_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (log_id),

    CONSTRAINT fk_notification_log_notification
        FOREIGN KEY (notification_id)
        REFERENCES notification(notification_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_notification_log_status (status),
    INDEX idx_notification_log_attempt (last_attempt_at)
) ENGINE=InnoDB;


-- ============================================================
-- END OF SCHEMA
-- ============================================================
