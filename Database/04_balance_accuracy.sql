USE digital_banking;

-- ===========================================
-- CHECK INITIAL BALANCE
-- ===========================================

SELECT account_no, balance
FROM account
WHERE account_no = 'SB10000001';

-- ===========================================
-- DEPOSIT MONEY
-- ===========================================

UPDATE account
SET balance = balance + 5000.00
WHERE account_no = 'SB10000001';

-- VERIFY UPDATED BALANCE

SELECT account_no, balance
FROM account
WHERE account_no = 'SB10000001';

-- ===========================================
-- RECORD DEPOSIT TRANSACTION
-- ===========================================

INSERT INTO transactions
(account_no, transaction_type, amount)

VALUES
('SB10000001', 'Deposit', 5000.00);

-- ===========================================
-- WITHDRAW MONEY
-- ===========================================

UPDATE account
SET balance = balance - 2000.00
WHERE account_no = 'SB10000001';

-- VERIFY UPDATED BALANCE

SELECT account_no, balance
FROM account
WHERE account_no = 'SB10000001';

-- ===========================================
-- RECORD WITHDRAW TRANSACTION
-- ===========================================

INSERT INTO transactions
(account_no, transaction_type, amount)

VALUES
('SB10000001', 'Withdraw', 2000.00);

-- ===========================================
-- VIEW TRANSACTION HISTORY
-- ===========================================

SELECT *
FROM transactions
WHERE account_no = 'SB10000001'
ORDER BY transaction_date DESC;