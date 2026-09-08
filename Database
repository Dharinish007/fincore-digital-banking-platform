--  security feature schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS customer (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL,
    account_number VARCHAR(30),
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaction (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    loan_id BIGINT,
    amount NUMERIC(15,2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    location VARCHAR(150),
    device_type VARCHAR(80),
    international_transaction BOOLEAN NOT NULL DEFAULT FALSE,
    new_device BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_assessment (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT,
    transaction_id BIGINT REFERENCES transaction(id),
    risk_score INTEGER,
    decision VARCHAR(30) NOT NULL,
    reasons TEXT,
    assessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount NUMERIC(15,2),
    transaction_type VARCHAR(50),
    location VARCHAR(150),
    device_type VARCHAR(80),
    international_transaction BOOLEAN NOT NULL DEFAULT FALSE,
    new_device BOOLEAN NOT NULL DEFAULT FALSE,
    previous_transaction_count INTEGER NOT NULL DEFAULT 0,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    unusual_behavior BOOLEAN NOT NULL DEFAULT FALSE,
    risk_level VARCHAR(20),
    assessment_status VARCHAR(30),
    customer_name VARCHAR(150),
    annual_income NUMERIC(15,2),
    account_balance NUMERIC(15,2),
    account_type VARCHAR(50),
    account_number VARCHAR(30),
    employment_status VARCHAR(50),
    loan_outstanding NUMERIC(15,2),
    loan_count INTEGER,
    transaction_pattern VARCHAR(50),
    deposit_frequency VARCHAR(30),
    ai_analysis TEXT,
    ai_model VARCHAR(100),
    analysis_source VARCHAR(30),
    transaction_history TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(100),
    "user" VARCHAR(150),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50),
    status VARCHAR(30),
    entity VARCHAR(80),
    entity_id VARCHAR(100),
    details TEXT,
    metadata TEXT,
    ip VARCHAR(45),
    "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS liveness_verification (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    session_id VARCHAR(50) UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    confidence_score NUMERIC(5,2),
    verification_method VARCHAR(50) NOT NULL DEFAULT 'SELFIE',
    ip_address VARCHAR(45),
    failure_reason TEXT,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO transaction (
    id,
    transaction_reference,
    customer_id,
    loan_id,
    amount,
    type,
    status,
    location,
    device_type,
    international_transaction,
    new_device
)
VALUES
    (1, 'TXN-2026-0001', 101, NULL, 125000.00, 'INTERNATIONAL_WIRE', 'PENDING', 'London, UK', 'Web Browser', TRUE, TRUE),
    (2, 'TXN-2026-0002', 101, NULL, 8500.00, 'TRANSFER', 'SUCCESS', 'Mumbai, IN', 'Mobile App', FALSE, FALSE),
    (3, 'TXN-2026-0003', 102, NULL, 45000.00, 'CRYPTO_EXCHANGE', 'PENDING', 'Singapore, SG', 'Web Browser', TRUE, TRUE),
    (4, 'TXN-2026-0004', 103, NULL, 1200.00, 'BILL_PAYMENT', 'SUCCESS', 'Bengaluru, IN', 'Mobile App', FALSE, FALSE),
    (5, 'TXN-2026-0005', 101, NULL, 27500.00, 'CASH_WITHDRAWAL', 'FAILED', 'New York, US', 'ATM', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('transaction', 'id'),
    GREATEST((SELECT COALESCE(MAX(id), 1) FROM transaction), 1),
    TRUE
);

INSERT INTO customer (
    id,
    full_name,
    email,
    phone_number,
    account_number,
    date_of_birth
)
VALUES
    (101, 'Aarav Sharma', 'aarav.sharma@example.com', '+91 98765 10001', 'ACC-101-2026', DATE '1990-08-15'),
    (102, 'Maya Patel', 'maya.patel@example.com', '+91 98765 10002', 'ACC-102-2026', DATE '1988-03-22'),
    (103, 'Rohan Mehta', 'rohan.mehta@example.com', '+91 98765 10003', 'ACC-103-2026', DATE '1985-11-05')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_risk_assessment_customer_id
    ON risk_assessment (customer_id);

CREATE INDEX IF NOT EXISTS idx_risk_assessment_transaction_id
    ON risk_assessment (transaction_id);

CREATE INDEX IF NOT EXISTS idx_transaction_customer_id
    ON transaction (customer_id);

CREATE INDEX IF NOT EXISTS idx_transaction_status
    ON transaction (status);

CREATE INDEX IF NOT EXISTS idx_transaction_created_at
    ON transaction (created_at);

CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp
    ON audit_log ("timestamp");

CREATE INDEX IF NOT EXISTS idx_audit_log_action
    ON audit_log (action);

CREATE INDEX IF NOT EXISTS idx_audit_log_module_status
    ON audit_log (module, status);

CREATE INDEX IF NOT EXISTS idx_liveness_verification_customer_id
    ON liveness_verification (customer_id);

CREATE INDEX IF NOT EXISTS idx_liveness_verification_status
    ON liveness_verification (status);
