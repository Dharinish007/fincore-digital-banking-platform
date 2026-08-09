-- Useful verification queries for FinCore

USE kyc_db;

-- All users and roles
SELECT id, username, email, role, status FROM users ORDER BY id;

-- Accounts with customer and KYC status
SELECT a.account_number, a.account_type, a.balance, a.status,
       c.first_name, c.last_name, c.kyc_status, c.risk_level
FROM accounts a
JOIN customers c ON c.id = a.customer_id
ORDER BY a.id;

-- Find account by number (transfer validation)
SELECT * FROM accounts WHERE account_number = '1234-5678-9012';

-- Recent transactions
SELECT t.transaction_reference, t.transaction_type, t.amount, t.status, t.performed_by, t.timestamp,
       sa.account_number AS source_account,
       ta.account_number AS target_account
FROM transactions t
JOIN accounts sa ON sa.id = t.source_account_id
LEFT JOIN accounts ta ON ta.id = t.target_account_id
ORDER BY t.timestamp DESC
LIMIT 50;

-- KYC queue
SELECT kyc_id, first_name, last_name, email, status FROM kyc ORDER BY kyc_id;

-- Frozen accounts (should block transfer/withdraw)
SELECT account_number, status, balance FROM accounts WHERE status = 'FROZEN';

-- Balance check before/after transfer example
SELECT account_number, balance, status FROM accounts
WHERE account_number IN ('1234-5678-9012', '2231-9087-4410');

USE fincore_audit;

-- Latest audit events
SELECT id, entity_name, entity_id, action, performed_by, status, description, timestamp
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 100;

-- Audit by action
SELECT action, COUNT(*) AS cnt
FROM audit_logs
GROUP BY action
ORDER BY cnt DESC;
