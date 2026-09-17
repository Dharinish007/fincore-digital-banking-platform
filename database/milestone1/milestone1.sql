-- ============================================================================
-- FINCORE NEXUS ENTERPRISE BANKING PLATFORM
-- MILESTONE 1 DATABASE DEFINITION: KYC VERIFICATION, AUDIT TRAIL & TELLER RBAC
-- Target Engine: MySQL 8.0+ / MariaDB / PostgreSQL compatible
-- ============================================================================

CREATE DATABASE IF NOT EXISTS fincore_nexus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fincore_nexus;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables for Milestone 1
DROP TABLE IF EXISTS kyc_verification_audit;
DROP TABLE IF EXISTS kyc_documents;
DROP TABLE IF EXISTS kyc_records;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS audit_alerts;
DROP TABLE IF EXISTS audit_integrity;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. ROLE-BASED ACCESS CONTROL (RBAC) - TELLER & INSTITUTIONAL ROLES
-- ============================================================================

-- System Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Roles Definition Table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Granular Permissions Table
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mapping Table: Role Permissions (RBAC Enforcement)
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mapping Table: User Roles
CREATE TABLE user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by VARCHAR(50),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 2. CUSTOMERS & IDENTITY MANAGEMENT
-- ============================================================================

CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(25) NOT NULL,
    account_number VARCHAR(30) NOT NULL UNIQUE,
    account_type VARCHAR(50) NOT NULL, -- Premium Savings, Corporate Checking, Trade Account, etc.
    account_balance DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, UNDER_REVIEW, RESTRICTED, DORMANT
    kyc_status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    risk_score INT DEFAULT 50, -- 0 (Lowest Risk) to 100 (Highest Risk)
    risk_level VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
    pep_status VARCHAR(10) DEFAULT 'NO', -- Politically Exposed Person: YES, NO
    sanctions_status VARCHAR(20) DEFAULT 'CLEAR', -- CLEAR, FLAGGED
    joined_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cust_acc (account_number),
    INDEX idx_cust_kyc (kyc_status),
    INDEX idx_cust_risk (risk_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 3. KYC (KNOW YOUR CUSTOMER) VERIFICATION
-- ============================================================================

CREATE TABLE kyc_records (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- Passport, National ID, Driver License, Utility Bill
    document_number VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(100) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    submitted_by_teller_id VARCHAR(36),
    submitted_by_teller_name VARCHAR(100),
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_kyc_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
    INDEX idx_kyc_status (status),
    INDEX idx_kyc_docnum (document_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE kyc_documents (
    id VARCHAR(36) PRIMARY KEY,
    kyc_id VARCHAR(36) NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(255) NOT NULL,
    sha256_checksum VARCHAR(64) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_kyc FOREIGN KEY (kyc_id) REFERENCES kyc_records (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE kyc_verification_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kyc_id VARCHAR(36) NOT NULL,
    previous_status VARCHAR(30) NOT NULL,
    new_status VARCHAR(30) NOT NULL,
    action_by_user VARCHAR(100) NOT NULL,
    action_by_role VARCHAR(50) NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    justification_notes TEXT,
    CONSTRAINT fk_audit_kyc FOREIGN KEY (kyc_id) REFERENCES kyc_records (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 4. CRYPTOGRAPHIC AUDIT TRAIL & TAMPER DETECTION (SHA-256 HASH CHAIN)
-- ============================================================================

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_index INT NOT NULL UNIQUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50) NOT NULL,
    role VARCHAR(30) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    payload TEXT NOT NULL,
    INDEX idx_audit_log_index (log_index),
    INDEX idx_audit_prev_hash (previous_hash),
    INDEX idx_audit_curr_hash (current_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE audit_integrity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by VARCHAR(50) NOT NULL,
    total_blocks INT NOT NULL,
    is_valid BOOLEAN NOT NULL,
    tampered_index INT NULL,
    verification_details TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 5. MILESTONE 1 SEED DATA & INITIALIZATION
-- ============================================================================

-- A. Insert Base Roles
INSERT INTO roles (id, name, code, description) VALUES
(1, 'Super Administrator', 'ROLE_ADMIN', 'Platform superuser with unrestricted access to governance and system configuration'),
(2, 'Operations Supervisor', 'ROLE_SUPERVISOR', 'Branch management, credit committee review, and KYC approval authority'),
(3, 'Branch Teller', 'ROLE_TELLER', 'Teller operations: customer onboarding, KYC document submission, repayments, deposits'),
(4, 'Compliance Auditor', 'ROLE_AUDITOR', 'Independent audit inspection, cryptographic integrity verification, forensic review'),
(5, 'Retail Customer', 'ROLE_CUSTOMER', 'Individual retail banking client access');

-- B. Insert Granular Permissions (Highlighting Teller Capabilities)
INSERT INTO permissions (id, permission_name, module, description) VALUES
(1, 'CUSTOMER_CREATE', 'TELLER_OPS', 'Permission to register new bank customers'),
(2, 'CUSTOMER_VIEW', 'TELLER_OPS', 'Permission to look up and inspect customer profiles'),
(3, 'KYC_SUBMIT_DOCUMENT', 'KYC', 'Teller permission to upload and submit customer KYC documents'),
(4, 'KYC_VERIFY_APPROVE', 'KYC', 'Supervisor permission to verify and approve KYC documents'),
(5, 'KYC_REJECT', 'KYC', 'Supervisor permission to reject customer KYC filings'),
(6, 'CASH_DEPOSIT', 'TELLER_OPS', 'Teller permission to execute cash deposits at branch counter'),
(7, 'CASH_WITHDRAWAL', 'TELLER_OPS', 'Teller permission to process cash withdrawals'),
(8, 'REPAYMENT_PROCESS', 'TELLER_OPS', 'Teller permission to record loan repayment installments'),
(9, 'AUDIT_TRAIL_VIEW', 'AUDIT', 'Permission to inspect sequential cryptographic audit logs'),
(10, 'AUDIT_CHAIN_VERIFY', 'AUDIT', 'Auditor permission to trigger full SHA-256 hash validation'),
(11, 'AUDIT_ALERT_RESOLVE', 'AUDIT', 'Permission to formalize and sign off on forensic audit alerts');

-- C. Map Teller Permissions (RBAC Enforcement for Role 3: ROLE_TELLER)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 1), -- TELLER can create customers
(3, 2), -- TELLER can view customers
(3, 3), -- TELLER can submit KYC documents
(3, 6), -- TELLER can process cash deposits
(3, 7), -- TELLER can process withdrawals
(3, 8); -- TELLER can accept repayments

-- Map Supervisor Permissions (Role 2)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(2, 2), (2, 4), (2, 5), (2, 9), (2, 11);

-- Map Auditor Permissions (Role 4)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(4, 2), (4, 9), (4, 10), (4, 11);

-- Map Admin Permissions (Role 1 - All)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11);

-- D. Insert System Users (BCrypt Hashes for 'password123')
INSERT INTO users (id, username, password_hash, full_name, email, department, is_active) VALUES
('USR-001', 'admin', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'Alexander Vance', 'admin@fincore-nexus.bank', 'Executive Governance', TRUE),
('USR-002', 'supervisor', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'Elena Rostova', 'elena.r@fincore-nexus.bank', 'Branch Operations & Supervision', TRUE),
('USR-003', 'teller', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'Marcus Brody', 'marcus.b@fincore-nexus.bank', 'Frontline Retail Teller Unit', TRUE),
('USR-004', 'auditor', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'David Chen', 'david.c@fincore-nexus.bank', 'Internal Audit & Forensic Control', TRUE),
('USR-005', 'customer', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'Sarah Jenkins', 'sarah.jenkins@email.com', 'Retail Client Services', TRUE);

-- E. Assign Roles to Users
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
('USR-001', 1, 'SYSTEM_BOOTSTRAP'),
('USR-002', 2, 'USR-001'),
('USR-003', 3, 'USR-002'), -- Teller assigned by Supervisor
('USR-004', 4, 'USR-001'),
('USR-005', 5, 'USR-003'); -- Customer onboarded by Teller

-- F. Seed Customers
INSERT INTO customers (id, first_name, last_name, email, phone_number, account_number, account_type, account_balance, status, kyc_status, risk_score, risk_level, pep_status, sanctions_status, joined_date) VALUES
('CUST-1001', 'Sarah', 'Jenkins', 'sarah.jenkins@email.com', '+1 (555) 234-5678', 'FC-8820-9104-3312', 'Premium Savings', 48520.50, 'ACTIVE', 'VERIFIED', 24, 'LOW', 'NO', 'CLEAR', '2023-04-12'),
('CUST-1002', 'Robert', 'Vance', 'robert.vance@techcorp.io', '+1 (555) 876-5432', 'FC-4491-0021-8874', 'Corporate Checking', 312890.00, 'ACTIVE', 'VERIFIED', 42, 'MEDIUM', 'NO', 'CLEAR', '2022-11-05'),
('CUST-1003', 'Vikram', 'Patel', 'v.patel@globalexport.biz', '+1 (555) 901-2345', 'FC-6632-1145-9920', 'Commercial Trade Account', 125400.75, 'UNDER_REVIEW', 'PENDING', 82, 'HIGH', 'YES', 'FLAGGED', '2024-01-18'),
('CUST-1004', 'Helena', 'Thorne', 'h.thorne@apexholdings.org', '+1 (555) 432-1098', 'FC-1188-7729-4401', 'Wealth Management Trust', 950000.00, 'ACTIVE', 'VERIFIED', 68, 'MEDIUM', 'NO', 'CLEAR', '2021-08-30'),
('CUST-1005', 'Liam', 'O''Connor', 'liam.oc@construction.ie', '+1 (555) 654-7890', 'FC-9930-4412-5567', 'Standard Business', 18450.20, 'RESTRICTED', 'REJECTED', 88, 'HIGH', 'NO', 'CLEAR', '2024-05-10');

-- G. Seed KYC Verification Records (Processed by Teller Marcus Brody & Reviewed by Supervisor Elena Rostova)
INSERT INTO kyc_records (id, customer_id, document_type, document_number, issuing_authority, issue_date, expiry_date, status, submitted_by_teller_id, submitted_by_teller_name, reviewed_by, reviewed_at, notes) VALUES
('KYC-501', 'CUST-1001', 'Passport', 'USA-99824102', 'Department of State', '2022-01-15', '2032-01-15', 'VERIFIED', 'USR-003', 'Marcus Brody', 'Elena Rostova', '2026-08-11 09:15:00', 'Identity verified with biometrics and utility proof of address.'),
('KYC-502', 'CUST-1002', 'National ID Card', 'NID-77209144', 'National Identity Registry', '2020-06-10', '2030-06-10', 'VERIFIED', 'USR-003', 'Marcus Brody', 'Marcus Brody', '2026-08-16 10:00:00', 'Corporate authorization documents and National ID certified by teller.'),
('KYC-503', 'CUST-1003', 'International Passport', 'IND-Z8819203', 'Consular Affairs', '2021-03-20', '2031-03-20', 'PENDING', 'USR-003', 'Marcus Brody', NULL, NULL, 'Submitted by Teller Brody; awaiting supervisor clearance on PEP declaration.'),
('KYC-504', 'CUST-1005', 'Driving License', 'DL-88391203', 'Motor Transport Bureau', '2019-09-01', '2024-09-01', 'REJECTED', 'USR-003', 'Marcus Brody', 'Elena Rostova', '2026-08-26 14:30:00', 'Document expired prior to application. Teller flagged resubmission notice to applicant.');

-- H. Seed Cryptographic Audit Trail (SHA-256 Linked Chain)
INSERT INTO audit_logs (log_index, timestamp, username, role, action, details, ip_address, previous_hash, current_hash, payload) VALUES
(0, '2026-09-01 08:00:00', 'SYSTEM', 'SYSTEM', 'GENESIS_BLOCK', 'Core banking ledger initial root bootstrap', '127.0.0.1', '0000000000000000000000000000000000000000000000000000000000000000', 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a', 'GENESIS_BOOTSTRAP_PAYLOAD'),
(1, '2026-09-01 08:30:00', 'teller', 'ROLE_TELLER', 'KYC_SUBMISSION', 'Teller Marcus Brody submitted KYC package for customer Sarah Jenkins', '192.168.1.104', 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', '{"customerId":"CUST-1001","docType":"Passport","teller":"USR-003"}'),
(2, '2026-09-01 09:15:00', 'supervisor', 'ROLE_SUPERVISOR', 'KYC_APPROVAL', 'Supervisor Elena Rostova validated identity credentials for customer Sarah Jenkins', '192.168.1.102', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', '{"kycId":"KYC-501","status":"VERIFIED","reviewedBy":"Elena Rostova"}'),
(3, '2026-09-01 10:00:00', 'teller', 'ROLE_TELLER', 'COUNTER_DEPOSIT', 'Cash deposit of $5,000.00 to account FC-8820-9104-3312 by Teller Marcus Brody', '192.168.1.104', 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', '{"account":"FC-8820-9104-3312","amount":5000.00,"type":"CASH_DEPOSIT"}'),
(4, '2026-09-01 11:30:00', 'auditor', 'ROLE_AUDITOR', 'INTEGRITY_CHECK', 'Cryptographic verification run across 4 sequential ledger blocks by Auditor David Chen', '192.168.1.110', '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', '{"blocksVerified":4,"isValid":true,"digest":"SHA-256"}');

-- I. Seed Audit Alerts
INSERT INTO audit_alerts (id, severity, alert_type, status, created_at, block_index, description, investigated_by, resolution_notes) VALUES
('ALT-901', 'HIGH', 'UNAUTHORIZED_AFTER_HOURS_ACCESS', 'RESOLVED', '2026-08-28 22:45:10', 2, 'Supervisory ledger modification detected outside standard banking hours (22:45 UTC).', 'David Chen', 'Investigated and cleared: scheduled emergency maintenance authorized by VP Operations.'),
('ALT-902', 'CRITICAL', 'RAPID_FAILED_LOGINS', 'RESOLVED', '2026-08-30 03:12:00', 3, 'Multiple failed authentication attempts on teller terminal TT-04.', 'Elena Rostova', 'Teller password reset requested and biometric two-factor credential reissued.');

-- Verify Milestone 1 Setup
SELECT 'Milestone 1 Database Schema & Data Successfully Installed' AS status;
