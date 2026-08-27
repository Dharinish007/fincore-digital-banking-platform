-- =========================================================
-- FinCore Digital Banking PostgreSQL Schema
-- Compatible with the Spring Boot backend entities
-- =========================================================

CREATE TABLE IF NOT EXISTS loan (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    principal_outstanding NUMERIC(18,2) NOT NULL DEFAULT 0,
    interest_outstanding NUMERIC(18,2) NOT NULL DEFAULT 0,
    penalty_outstanding NUMERIC(18,2) NOT NULL DEFAULT 0,
    total_outstanding NUMERIC(18,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS transaction (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(100),
    loan_id BIGINT NOT NULL,
    amount NUMERIC(18,2) NOT NULL DEFAULT 0,
    type VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_loan
        FOREIGN KEY (loan_id) REFERENCES loan(id)
);

CREATE TABLE IF NOT EXISTS settlement (
    id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL,
    loan_id BIGINT NOT NULL,
    settled_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'SETTLED',
    settled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_settlement_transaction
        FOREIGN KEY (transaction_id) REFERENCES transaction(id),
    CONSTRAINT fk_settlement_loan
        FOREIGN KEY (loan_id) REFERENCES loan(id)
);

CREATE TABLE IF NOT EXISTS fraud_event (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    transaction_id BIGINT,
    fraud_score INTEGER,
    status VARCHAR(50),
    reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    message TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL,
    account_number VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS account (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    account_type VARCHAR(40) NOT NULL,
    balance NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    opened_at DATE NOT NULL DEFAULT CURRENT_DATE,
    closed_at DATE
);

CREATE TABLE IF NOT EXISTS account_statement (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES account(id),
    reference VARCHAR(100) NOT NULL UNIQUE,
    entry_type VARCHAR(30) NOT NULL,
    amount NUMERIC(18,2) NOT NULL,
    balance_after NUMERIC(18,2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loan_schedule (
    id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL REFERENCES loan(id),
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    principal_due NUMERIC(18,2) NOT NULL,
    interest_due NUMERIC(18,2) NOT NULL,
    total_due NUMERIC(18,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loan_disbursement (
    id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL REFERENCES loan(id),
    amount NUMERIC(18,2) NOT NULL,
    channel VARCHAR(30) NOT NULL,
    reference VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    disbursed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loan_collection (
    id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL REFERENCES loan(id),
    schedule_id BIGINT REFERENCES loan_schedule(id),
    amount NUMERIC(18,2) NOT NULL,
    channel VARCHAR(30) NOT NULL,
    reference VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'RECEIVED',
    collected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_transaction_loan_id
    ON transaction (loan_id);

CREATE INDEX IF NOT EXISTS idx_transaction_created_at
    ON transaction (created_at);

CREATE INDEX IF NOT EXISTS idx_settlement_transaction_id
    ON settlement (transaction_id);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient
    ON notifications (recipient);

CREATE INDEX IF NOT EXISTS idx_fraud_event_transaction_id
    ON fraud_event (transaction_id);

CREATE INDEX IF NOT EXISTS idx_account_statement_account_id ON account_statement (account_id);
CREATE INDEX IF NOT EXISTS idx_loan_schedule_loan_id ON loan_schedule (loan_id);
CREATE INDEX IF NOT EXISTS idx_loan_collection_loan_id ON loan_collection (loan_id);

-- =========================================================
-- SEED DATA
-- =========================================================

INSERT INTO loan (id, customer_id, principal_outstanding, interest_outstanding, penalty_outstanding, total_outstanding, status)
VALUES
    (1, 1, 50000.00, 2000.00, 500.00, 52500.00, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO transaction (id, loan_id, amount, type, status, created_at)
VALUES
    (1, 1, 150000.00, 'TRANSFER', 'SUCCESS', CURRENT_TIMESTAMP),
    (2, 1, 10000.00, 'TRANSFER', 'SUCCESS', CURRENT_TIMESTAMP),
    (3, 1, 15000.00, 'TRANSFER', 'SUCCESS', CURRENT_TIMESTAMP),
    (4, 1, 20000.00, 'TRANSFER', 'SUCCESS', CURRENT_TIMESTAMP),
    (5, 1, 12000.00, 'TRANSFER', 'SUCCESS', CURRENT_TIMESTAMP),
    (6, 1, 18000.00, 'TRANSFER', 'SUCCESS', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO fraud_event (user_id, transaction_id, fraud_score, status, reason, created_at)
VALUES
    (1, 1, 72, 'UNDER_REVIEW', 'Large transaction amount', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO notifications (recipient, type, message, status, created_at)
VALUES
    ('user1@example.com', 'EMAIL', 'Loan disbursed successfully', 'SENT', CURRENT_TIMESTAMP),
    ('ops@fincore.com', 'EMAIL', 'Fraud alert reviewed', 'SENT', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO account (id, account_number, customer_id, account_type, balance, status)
VALUES (1, 'ACC-8849-1001', 1, 'SAVINGS', 452100.00, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO account_statement (account_id, reference, entry_type, amount, balance_after, description)
VALUES (1, 'STMT-10001', 'CREDIT', 500000.00, 452100.00, 'Opening balance')
ON CONFLICT (reference) DO NOTHING;

INSERT INTO loan_schedule (loan_id, installment_number, due_date, principal_due, interest_due, total_due, status)
VALUES (1, 1, CURRENT_DATE + INTERVAL '30 days', 16000.00, 2000.00, 18000.00, 'PENDING')
ON CONFLICT DO NOTHING;
