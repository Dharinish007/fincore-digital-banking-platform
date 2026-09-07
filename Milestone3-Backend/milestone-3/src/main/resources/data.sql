-- Keep existing databases compatible with the current RiskAssessment entity.
ALTER TABLE IF EXISTS risk_assessment ALTER COLUMN risk_score DROP NOT NULL;
ALTER TABLE IF EXISTS customer ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE IF EXISTS liveness_verification ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(5,2);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS amount NUMERIC(15,2);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS transaction_type VARCHAR(50);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS location VARCHAR(150);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS device_type VARCHAR(80);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS international_transaction BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS new_device BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS previous_transaction_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS failed_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS unusual_behavior BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS assessment_status VARCHAR(30);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS customer_name VARCHAR(150);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS annual_income NUMERIC(15,2);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS account_balance NUMERIC(15,2);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS account_type VARCHAR(50);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS account_number VARCHAR(30);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS employment_status VARCHAR(50);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS loan_outstanding NUMERIC(15,2);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS loan_count INTEGER;
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS transaction_pattern VARCHAR(50);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS deposit_frequency VARCHAR(30);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS ai_analysis TEXT;
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS ai_model VARCHAR(100);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS analysis_source VARCHAR(30);
ALTER TABLE IF EXISTS risk_assessment ADD COLUMN IF NOT EXISTS transaction_history TEXT;

-- ================================
-- DUMMY LOAN DATA
-- ================================

INSERT INTO loan (
    id,
    customer_id,
    principal_outstanding,
    interest_outstanding,
    penalty_outstanding,
    total_outstanding,
    status
)
VALUES (
           1,
           1,
           50000.00,
           2000.00,
           500.00,
           52500.00,
           'ACTIVE'
       )
ON CONFLICT (id) DO NOTHING;


-- ================================
-- DUMMY TRANSACTION DATA
-- ================================

INSERT INTO transaction (
    id,
    customer_id,
    loan_id,
    transaction_reference,
    amount,
    type,
    status,
    created_at
)
VALUES (
           1,
           1,
           1,
           'TXN-2026-0001',
           150000.00,
           'INTERNATIONAL_WIRE',
           'SUCCESS',
           CURRENT_TIMESTAMP
       )
ON CONFLICT (id) DO NOTHING;


-- ================================
-- MORE TRANSACTIONS FOR
-- FRAUD VELOCITY TESTING
-- ================================

INSERT INTO transaction (
    id,
    customer_id,
    loan_id,
    transaction_reference,
    amount,
    type,
    status,
    created_at
)
VALUES
    (2, 1, 1, 'TXN-2026-0002', 10000.00, 'TRANSFER', 'SUCCESS', CURRENT_TIMESTAMP),
    (3, 1, 1, 'TXN-2026-0003', 15000.00, 'BILL_PAYMENT', 'SUCCESS', CURRENT_TIMESTAMP),
    (4, 1, 1, 'TXN-2026-0004', 20000.00, 'CASH_WITHDRAWAL', 'SUCCESS', CURRENT_TIMESTAMP),
    (5, 1, 1, 'TXN-2026-0005', 12000.00, 'TRANSFER', 'FAILED', CURRENT_TIMESTAMP),
    (6, 1, 1, 'TXN-2026-0006', 18000.00, 'CRYPTO_EXCHANGE', 'SUCCESS', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

UPDATE transaction SET transaction_reference = 'TXN-2026-0001', type = 'INTERNATIONAL_WIRE', status = 'SUCCESS' WHERE id = 1;
UPDATE transaction SET transaction_reference = 'TXN-2026-0002', type = 'TRANSFER', status = 'SUCCESS' WHERE id = 2;
UPDATE transaction SET transaction_reference = 'TXN-2026-0003', type = 'BILL_PAYMENT', status = 'SUCCESS' WHERE id = 3;
UPDATE transaction SET transaction_reference = 'TXN-2026-0004', type = 'CASH_WITHDRAWAL', status = 'SUCCESS' WHERE id = 4;
UPDATE transaction SET transaction_reference = 'TXN-2026-0005', type = 'TRANSFER', status = 'FAILED' WHERE id = 5;
UPDATE transaction SET transaction_reference = 'TXN-2026-0006', type = 'CRYPTO_EXCHANGE', status = 'SUCCESS' WHERE id = 6;

-- ================================
-- DEMO CUSTOMER AND ACCOUNT DATA
-- ================================

INSERT INTO customer (id, full_name, email, phone_number, account_number, date_of_birth, created_at)
VALUES
    (1, 'John Smith', 'john.smith@example.com', '+91 98765 43210', 'ACC-8849-1001', DATE '1990-08-15', CURRENT_TIMESTAMP),
    (2, 'Sarah Jenkins', 'sarah.jenkins@example.com', '+91 98765 43211', 'ACC-8849-1002', DATE '1988-03-22', CURRENT_TIMESTAMP),
    (3, 'TechCorp Industries', 'finance@techcorp.example.com', '+91 98765 43212', 'ACC-8849-1003', DATE '1985-11-05', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

UPDATE customer SET date_of_birth = DATE '1990-08-15' WHERE id = 1;
UPDATE customer SET date_of_birth = DATE '1988-03-22' WHERE id = 2;
UPDATE customer SET date_of_birth = DATE '1985-11-05' WHERE id = 3;

INSERT INTO account (id, account_number, customer_id, account_type, balance, status, opened_at)
VALUES
    (1, 'ACC-8849-1001', 1, 'SAVINGS', 452100.00, 'ACTIVE', CURRENT_DATE - 240),
    (2, 'ACC-8849-1002', 2, 'CURRENT', 128505.00, 'ACTIVE', CURRENT_DATE - 180),
    (3, 'ACC-8849-1003', 3, 'COMMERCIAL', 12500000.00, 'ACTIVE', CURRENT_DATE - 420)
ON CONFLICT (id) DO NOTHING;

INSERT INTO account_statement (account_id, reference, entry_type, amount, balance_after, description, created_at)
SELECT 1, 'STMT-10001', 'CREDIT', 500000.00, 452100.00, 'Opening balance', CURRENT_TIMESTAMP - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM account_statement WHERE reference = 'STMT-10001');

INSERT INTO account_statement (account_id, reference, entry_type, amount, balance_after, description, created_at)
SELECT 1, 'STMT-10002', 'DEBIT', 18470.00, 452100.00, 'Home loan EMI auto-debit', CURRENT_TIMESTAMP - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM account_statement WHERE reference = 'STMT-10002');

INSERT INTO account_statement (account_id, reference, entry_type, amount, balance_after, description, created_at)
SELECT 2, 'STMT-10003', 'CREDIT', 128505.00, 128505.00, 'Salary credit', CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM account_statement WHERE reference = 'STMT-10003');

INSERT INTO account_statement (account_id, reference, entry_type, amount, balance_after, description, created_at)
SELECT 3, 'STMT-10004', 'CREDIT', 12500000.00, 12500000.00, 'Corporate settlement credit', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM account_statement WHERE reference = 'STMT-10004');

INSERT INTO loan_schedule (id, loan_id, installment_number, due_date, principal_due, interest_due, total_due, status)
VALUES
    (1, 1, 1, CURRENT_DATE + INTERVAL '9 days', 16470.00, 2000.00, 18470.00, 'PENDING'),
    (2, 1, 2, CURRENT_DATE + INTERVAL '39 days', 16605.00, 1865.00, 18470.00, 'PENDING'),
    (3, 1, 3, CURRENT_DATE + INTERVAL '69 days', 16741.00, 1729.00, 18470.00, 'PENDING')
ON CONFLICT (id) DO NOTHING;

INSERT INTO loan_disbursement (id, loan_id, amount, channel, reference, status, disbursed_at)
VALUES (1, 1, 600000.00, 'NEFT', 'DISB-DEMO-1001', 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '60 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO loan_collection (id, loan_id, schedule_id, amount, channel, reference, status, collected_at)
VALUES (1, 1, 1, 18470.00, 'AUTO_DEBIT', 'COL-DEMO-1001', 'RECEIVED', CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ================================
-- CUSTOMER SECURITY AUDIT DATA
-- ================================

INSERT INTO audit_log ("user", action, entity, entity_id, details, ip, "timestamp")
SELECT 'CUSTOMER', 'LIVENESS_STARTED', 'LIVENESS', '1', 'Camera verification started', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '4 hours'
WHERE NOT EXISTS (SELECT 1 FROM audit_log WHERE action = 'LIVENESS_STARTED' AND entity_id = '1');

INSERT INTO audit_log ("user", action, entity, entity_id, details, ip, "timestamp")
SELECT 'CUSTOMER', 'FACE_VERIFICATION_COMPLETED', 'LIVENESS', '1', 'Single face detected through camera', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '3 hours'
WHERE NOT EXISTS (SELECT 1 FROM audit_log WHERE action = 'FACE_VERIFICATION_COMPLETED' AND entity_id = '1');

INSERT INTO audit_log ("user", action, entity, entity_id, details, ip, "timestamp")
SELECT 'CUSTOMER', 'PASSCODE_VERIFICATION_SUCCESS', 'SECURITY', '1', 'Passcode accepted without storing sensitive value', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '2 hours'
WHERE NOT EXISTS (SELECT 1 FROM audit_log WHERE action = 'PASSCODE_VERIFICATION_SUCCESS' AND entity_id = '1');

INSERT INTO audit_log ("user", action, entity, entity_id, details, ip, "timestamp")
SELECT 'RISK_ENGINE', 'RISK_ASSESSMENT_CREATED', 'TRANSACTION', '1', 'Risk assessment completed with backend rules', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '1 hour'
WHERE NOT EXISTS (SELECT 1 FROM audit_log WHERE action = 'RISK_ASSESSMENT_CREATED' AND entity_id = '1');

INSERT INTO audit_log ("user", action, entity, entity_id, details, ip, "timestamp")
SELECT 'CUSTOMER', 'TRANSACTION_REVIEWED', 'TRANSACTION', '1', 'Customer opened transaction risk review', '127.0.0.1', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM audit_log WHERE action = 'TRANSACTION_REVIEWED' AND entity_id = '1');