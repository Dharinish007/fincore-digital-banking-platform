-- ============================================================
-- Milestone 4 - Database Schema
-- Based on the supplied ER diagram
-- Target DB: MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS milestone4_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE milestone4_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_alerts;
DROP TABLE IF EXISTS audit_integrity;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS compliance_documents;
DROP TABLE IF EXISTS compliance_details;
DROP TABLE IF EXISTS compliance_checks;
DROP TABLE IF EXISTS risk_factors;
DROP TABLE IF EXISTS risk_score_history;
DROP TABLE IF EXISTS risk_scores;
DROP TABLE IF EXISTS customers;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- 1. Customers
-- ------------------------------------------------------------
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    address VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_customers_mobile (mobile_number),
    UNIQUE KEY uq_customers_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. Risk Scores
-- One customer can have many risk-score records.
-- ------------------------------------------------------------
CREATE TABLE risk_scores (
    risk_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL,
    risk_level ENUM('LOW','MEDIUM','HIGH') NOT NULL,
    risk_factors TEXT,
    score_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_risk_score_value
        CHECK (risk_score >= 0 AND risk_score <= 100),

    CONSTRAINT fk_risk_scores_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_risk_scores_customer (customer_id),
    INDEX idx_risk_scores_level (risk_level),
    INDEX idx_risk_scores_date (score_date)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. Risk Factors
-- One risk score can have many individual risk factors.
-- ------------------------------------------------------------
CREATE TABLE risk_factors (
    factor_id INT AUTO_INCREMENT PRIMARY KEY,
    risk_id INT NOT NULL,
    factor_type VARCHAR(100) NOT NULL,
    factor_value VARCHAR(100),
    weightage DECIMAL(5,2),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_factor_weightage
        CHECK (weightage IS NULL OR (weightage >= 0 AND weightage <= 100)),

    CONSTRAINT fk_risk_factors_risk
        FOREIGN KEY (risk_id) REFERENCES risk_scores(risk_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_risk_factors_risk (risk_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. Risk Score History
-- Stores historical changes for each customer.
-- ------------------------------------------------------------
CREATE TABLE risk_score_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL,
    risk_level ENUM('LOW','MEDIUM','HIGH') NOT NULL,
    changed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by INT,
    remarks TEXT,

    CONSTRAINT chk_history_risk_score
        CHECK (risk_score >= 0 AND risk_score <= 100),

    CONSTRAINT fk_risk_history_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_risk_history_customer (customer_id),
    INDEX idx_risk_history_changed_on (changed_on)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. Compliance Checks
-- One customer can have many compliance checks.
-- ------------------------------------------------------------
CREATE TABLE compliance_checks (
    compliance_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    check_type ENUM('KYC','AML','TXN_LIMIT','DOC_VERIFY','PEP','SANCTION') NOT NULL,
    status ENUM('PENDING','PASS','FAIL') NOT NULL DEFAULT 'PENDING',
    performed_on TIMESTAMP NULL,
    performed_by INT,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_compliance_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_compliance_customer (customer_id),
    INDEX idx_compliance_status (status),
    INDEX idx_compliance_type (check_type)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. Compliance Details
-- One compliance check can have many rule-level details.
-- ------------------------------------------------------------
CREATE TABLE compliance_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    compliance_id INT NOT NULL,
    rule_code VARCHAR(100) NOT NULL,
    rule_description TEXT,
    expected_value VARCHAR(255),
    actual_value VARCHAR(255),
    result ENUM('PASS','FAIL') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_compliance_details_check
        FOREIGN KEY (compliance_id) REFERENCES compliance_checks(compliance_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_compliance_details_compliance (compliance_id),
    INDEX idx_compliance_details_result (result)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 7. Compliance Documents
-- One compliance check can have many documents.
-- ------------------------------------------------------------
CREATE TABLE compliance_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    compliance_id INT NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(255),
    verified_by INT,
    verified_on TIMESTAMP NULL,
    status ENUM('VERIFIED','PENDING','REJECTED') NOT NULL DEFAULT 'PENDING',

    CONSTRAINT fk_compliance_documents_check
        FOREIGN KEY (compliance_id) REFERENCES compliance_checks(compliance_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_compliance_documents_compliance (compliance_id),
    INDEX idx_compliance_documents_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 8. Audit Logs
-- Main audit event table.
-- user_id / entity_id are intentionally not foreign keys because
-- the supplied ER diagram does not include a users table.
-- ------------------------------------------------------------
CREATE TABLE audit_logs (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(150) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_logs_user (user_id),
    INDEX idx_audit_logs_entity (entity_type, entity_id),
    INDEX idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 9. Audit Integrity
-- One audit log can have many integrity records.
-- ------------------------------------------------------------
CREATE TABLE audit_integrity (
    integrity_id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    hash_value VARCHAR(255) NOT NULL,
    previous_hash VARCHAR(255),
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    verified_on TIMESTAMP NULL,
    verified_by INT,

    CONSTRAINT fk_audit_integrity_log
        FOREIGN KEY (audit_id) REFERENCES audit_logs(audit_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_audit_integrity_audit (audit_id),
    INDEX idx_audit_integrity_valid (is_valid)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 10. Audit Alerts
-- One audit-integrity record can have many alerts.
-- ------------------------------------------------------------
CREATE TABLE audit_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    integrity_id INT NOT NULL,
    alert_type ENUM('TAMPER_DETECTED','MISSING_HASH','INVALID_HASH') NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN','RESOLVED') NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_on TIMESTAMP NULL,
    resolved_by INT,

    CONSTRAINT fk_audit_alerts_integrity
        FOREIGN KEY (integrity_id) REFERENCES audit_integrity(integrity_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_audit_alerts_integrity (integrity_id),
    INDEX idx_audit_alerts_status (status),
    INDEX idx_audit_alerts_type (alert_type)
) ENGINE=InnoDB;

-- ============================================================
-- Relationship summary
-- customers 1 ---- * risk_scores
-- customers 1 ---- * risk_score_history
-- customers 1 ---- * compliance_checks
-- risk_scores 1 ---- * risk_factors
-- compliance_checks 1 ---- * compliance_details
-- compliance_checks 1 ---- * compliance_documents
-- audit_logs 1 ---- * audit_integrity
-- audit_integrity 1 ---- * audit_alerts
-- ============================================================
