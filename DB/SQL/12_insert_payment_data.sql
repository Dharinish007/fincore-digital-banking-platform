USE digital_banking;

-- =========================================================
-- PAYMENT SAMPLE DATA
-- =========================================================

INSERT INTO payment
(
    from_account_no,
    to_account_no,
    beneficiary_id,
    amount,
    payment_type,
    payment_mode,
    payment_status,
    transaction_ref,
    description
)
VALUES
(
    'SB10000001',
    'SB10000002',
    1,
    3000.00,
    'Transfer',
    'IMPS',
    'Pending',
    'TXN-M3-000001',
    'Fund transfer initiated'
),
(
    'SB10000002',
    'SB10000001',
    2,
    5000.00,
    'Transfer',
    'NEFT',
    'Pending',
    'TXN-M3-000002',
    'Fund transfer initiated'
);

-- =========================================================
-- VERIFY PAYMENT DATA
-- =========================================================

SELECT * FROM payment;