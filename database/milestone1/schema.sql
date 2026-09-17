-- ============================================================================
-- FINCORE NEXUS ENTERPRISE BANKING PLATFORM
-- MILESTONE 1 SCHEMA: KYC VERIFICATION, AUDIT TRAIL & TELLER RBAC
-- Target Engine: MySQL 8.0+ / MariaDB / PostgreSQL compatible
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

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

-- 1. USERS & RBAC (TELLER, SUPERVISOR, AUDITOR, ADMIN)
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

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by VARCHAR(50),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. CUSTOMERS
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(25) NOT NULL,
    account_number VARCHAR(30) NOT NULL UNIQUE,
    account_type VARCHAR(50) NOT NULL,
    account_balance DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    kyc_status VARCHAR(30) DEFAULT 'PENDING',
    risk_score INT DEFAULT 50,
    risk_level VARCHAR(20) DEFAULT 'MEDIUM',
    pep_status VARCHAR(10) DEFAULT 'NO',
    sanctions_status VARCHAR(20) DEFAULT 'CLEAR',
    joined_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cust_acc (account_number),
    INDEX idx_cust_kyc (kyc_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. KYC VERIFICATION
CREATE TABLE kyc_records (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(100) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(30) DEFAULT 'PENDING',
    submitted_by_teller_id VARCHAR(36),
    submitted_by_teller_name VARCHAR(100),
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_kyc_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
    INDEX idx_kyc_status (status)
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

-- 4. CRYPTOGRAPHIC AUDIT TRAIL (SHA-256)
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
    severity VARCHAR(20) NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    block_index INT NULL,
    description TEXT NOT NULL,
    investigated_by VARCHAR(50),
    resolution_notes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
