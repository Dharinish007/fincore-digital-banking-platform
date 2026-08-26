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
