USE digital_banking;

-- =========================================================
-- BENEFICIARY SAMPLE DATA
-- =========================================================

INSERT INTO beneficiary
(
    customer_id,
    beneficiary_name,
    account_no,
    ifsc_code,
    bank_name,
    beneficiary_type,
    status
)
VALUES
(
    1,
    'Amit Verma',
    'SB10000002',
    'SBIN0005678',
    'State Bank of India',
    'Internal',
    'Verified'
),
(
    2,
    'Rahul Sharma',
    'SB10000001',
    'SBIN0001234',
    'State Bank of India',
    'Internal',
    'Verified'
);

-- Verify
SELECT * FROM beneficiary;