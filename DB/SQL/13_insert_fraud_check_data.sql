USE digital_banking;

-- ===========================================
-- 13_insert_fraud_check_data.sql
-- ===========================================

INSERT INTO fraud_check
(
    payment_id,
    risk_score,
    fraud_status,
    rule_triggered,
    remarks
)
VALUES
(
    1,
    15,
    'Safe',
    'NORMAL_TRANSACTION',
    'Transaction pattern appears normal and no suspicious activity was detected.'
),
(
    2,
    72,
    'Suspicious',
    'UNUSUAL_TRANSACTION_AMOUNT',
    'Transaction amount appears unusual and requires further review.'
);

-- ===========================================
-- VERIFY DATA
-- ===========================================

SELECT * FROM fraud_check;