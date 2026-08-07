-- ═══════════════════════════════════════════════════════════
-- FinCore Nexus - Relational Schema
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS customer (
    customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE,
    address VARCHAR(255),
    occupation VARCHAR(100),
    annual_income DECIMAL(15,2),
    pan_number VARCHAR(20),
    aadhaar_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    account_no VARCHAR(30) PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2) DEFAULT 0.00,
    system_calculated_balance DECIMAL(15,2) DEFAULT 0.00,
    difference DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'Active',
    branch_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    last_verified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_code VARCHAR(30) UNIQUE,
    sender_account_no VARCHAR(30),
    sender_name VARCHAR(100),
    receiver_account_no VARCHAR(30),
    receiver_name VARCHAR(100),
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    charges DECIMAL(15,2) DEFAULT 0.00,
    reference VARCHAR(50),
    status VARCHAR(30),
    failure_reason VARCHAR(500),
    description VARCHAR(500),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_no VARCHAR(30),
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    log_level VARCHAR(20),
    event_action VARCHAR(100),
    performed_by VARCHAR(100),
    remarks VARCHAR(500),
    ip_address VARCHAR(45)
);
