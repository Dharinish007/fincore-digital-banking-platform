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