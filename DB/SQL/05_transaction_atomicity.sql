USE digital_banking;

-- ===========================================
-- MONEY TRANSFER USING TRANSACTION
-- ===========================================

START TRANSACTION;

-- Check Sender Balance

SELECT balance
FROM account
WHERE account_no = 'SB10000001';

-- Debit Sender

UPDATE account
SET balance = balance - 3000.00
WHERE account_no = 'SB10000001';

-- Credit Receiver

UPDATE account
SET balance = balance + 3000.00
WHERE account_no = 'SB10000002';

-- Record Transfer Transaction

INSERT INTO transactions
(account_no, transaction_type, amount)

VALUES
('SB10000001', 'Transfer', 3000.00);

-- If everything is successful

COMMIT;

-- ===========================================
-- VERIFY UPDATED BALANCES
-- ===========================================

SELECT account_no, balance
FROM account
WHERE account_no IN ('SB10000001', 'SB10000002');

-- ===========================================
-- VIEW TRANSACTION HISTORY
-- ===========================================

SELECT *
FROM transactions
WHERE account_no = 'SB10000001'
ORDER BY transaction_date DESC;