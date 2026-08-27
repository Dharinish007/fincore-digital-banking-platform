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
    loan_id,
    amount,
    status,
    created_at
)
VALUES (
           1,
           1,
           150000.00,
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
    loan_id,
    amount,
    status,
    created_at
)
VALUES
    (2, 1, 10000.00, 'SUCCESS', CURRENT_TIMESTAMP),
    (3, 1, 15000.00, 'SUCCESS', CURRENT_TIMESTAMP),
    (4, 1, 20000.00, 'SUCCESS', CURRENT_TIMESTAMP),
    (5, 1, 12000.00, 'SUCCESS', CURRENT_TIMESTAMP),
    (6, 1, 18000.00, 'SUCCESS', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ================================
-- DEMO CUSTOMER AND ACCOUNT DATA
-- ================================

INSERT INTO customer (id, full_name, email, phone_number, account_number, created_at)
VALUES
    (1, 'John Smith', 'john.smith@example.com', '+91 98765 43210', 'ACC-8849-1001', CURRENT_TIMESTAMP),
    (2, 'Sarah Jenkins', 'sarah.jenkins@example.com', '+91 98765 43211', 'ACC-8849-1002', CURRENT_TIMESTAMP),
    (3, 'TechCorp Industries', 'finance@techcorp.example.com', '+91 98765 43212', 'ACC-8849-1003', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

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