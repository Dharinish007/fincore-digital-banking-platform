-- FinCore Digital Banking Platform - Database Query Reference
-- Run these queries against the PostgreSQL database.
-- These queries are read-only unless explicitly marked otherwise.

-- =========================================================
-- 1. DATABASE AND TABLE INSPECTION
-- =========================================================

-- Show the current database, user, and server version.
SELECT current_database() AS database_name,
       current_user AS database_user,
       version() AS postgres_version;

-- List application tables.
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('loan', 'transaction', 'settlement', 'fraud_event', 'notifications')
ORDER BY table_name;

-- Count rows in each application table.
SELECT 'loan' AS table_name, COUNT(*) AS record_count FROM loan
UNION ALL
SELECT 'transaction', COUNT(*) FROM "transaction"
UNION ALL
SELECT 'settlement', COUNT(*) FROM settlement
UNION ALL
SELECT 'fraud_event', COUNT(*) FROM fraud_event
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;

-- =========================================================
-- 2. LOANS
-- =========================================================

-- View all loans and outstanding balances.
SELECT id,
       customer_id,
       principal_outstanding,
       interest_outstanding,
       penalty_outstanding,
       total_outstanding,
       status
FROM loan
ORDER BY id;

-- Summarize loans by status.
SELECT status,
       COUNT(*) AS loan_count,
       SUM(total_outstanding) AS total_outstanding
FROM loan
GROUP BY status
ORDER BY status;

-- Find loans with a balance mismatch.
SELECT id,
       principal_outstanding,
       interest_outstanding,
       penalty_outstanding,
       total_outstanding,
       principal_outstanding + interest_outstanding + penalty_outstanding AS calculated_total
FROM loan
WHERE total_outstanding <> principal_outstanding
                         + interest_outstanding
                         + penalty_outstanding;

-- Find loans with no outstanding balance.
SELECT id, customer_id, total_outstanding, status
FROM loan
WHERE total_outstanding = 0
ORDER BY id;

-- =========================================================
-- 3. TRANSACTIONS
-- =========================================================

-- View all transactions with their related loan.
SELECT t.id,
       t.transaction_reference,
       t.loan_id,
       l.customer_id,
       t.amount,
       t.type,
       t.status,
       t.created_at
FROM "transaction" AS t
JOIN loan AS l ON l.id = t.loan_id
ORDER BY t.created_at DESC;

-- Summarize transaction counts and amounts by status and type.
SELECT status,
       type,
       COUNT(*) AS transaction_count,
       COALESCE(SUM(amount), 0) AS total_amount
FROM "transaction"
GROUP BY status, type
ORDER BY status, type;

-- Find pending or failed transactions.
SELECT id,
       transaction_reference,
       loan_id,
       amount,
       type,
       status,
       created_at
FROM "transaction"
WHERE status IN ('PENDING', 'FAILED')
ORDER BY created_at DESC;

-- Find high-value transactions above a chosen amount.
SELECT id,
       transaction_reference,
       loan_id,
       amount,
       type,
       status,
       created_at
FROM "transaction"
WHERE amount >= 100000
ORDER BY amount DESC;

-- Show transaction totals by loan.
SELECT l.id AS loan_id,
       l.customer_id,
       COUNT(t.id) AS transaction_count,
       COALESCE(SUM(t.amount), 0) AS transaction_total
FROM loan AS l
LEFT JOIN "transaction" AS t ON t.loan_id = l.id
GROUP BY l.id, l.customer_id
ORDER BY l.id;

-- =========================================================
-- 4. SETTLEMENTS AND RECONCILIATION
-- =========================================================

-- View settlements with their related transactions and loans.
SELECT s.id AS settlement_id,
       s.transaction_id,
       s.loan_id,
       t.amount AS transaction_amount,
       s.settled_amount,
       t.status AS transaction_status,
       s.status AS settlement_status,
       s.settled_at
FROM settlement AS s
JOIN "transaction" AS t ON t.id = s.transaction_id
ORDER BY s.settled_at DESC;

-- Find successful transactions that have not been settled.
SELECT t.id,
       t.transaction_reference,
       t.loan_id,
       t.amount,
       t.created_at
FROM "transaction" AS t
LEFT JOIN settlement AS s ON s.transaction_id = t.id
WHERE t.status = 'SUCCESS'
  AND s.id IS NULL
ORDER BY t.created_at;

-- Find settlements whose amount differs from the transaction amount.
SELECT s.id AS settlement_id,
       s.transaction_id,
       t.amount AS transaction_amount,
       s.settled_amount,
       s.settled_amount - t.amount AS amount_difference,
       s.status
FROM settlement AS s
JOIN "transaction" AS t ON t.id = s.transaction_id
WHERE s.settled_amount <> t.amount
ORDER BY s.id;

-- Summarize settlement counts and amounts by status.
SELECT status,
       COUNT(*) AS settlement_count,
       COALESCE(SUM(settled_amount), 0) AS total_settled_amount
FROM settlement
GROUP BY status
ORDER BY status;

-- Find duplicate settlements for the same transaction.
SELECT transaction_id,
       COUNT(*) AS settlement_count
FROM settlement
GROUP BY transaction_id
HAVING COUNT(*) > 1
ORDER BY transaction_id;

-- =========================================================
-- 5. FRAUD DETECTION
-- =========================================================

-- Review fraud events from highest score to lowest.
SELECT id,
       user_id,
       transaction_id,
       fraud_score,
       status,
       reason,
       created_at
FROM fraud_event
ORDER BY fraud_score DESC NULLS LAST, created_at DESC;

-- Find high-risk fraud events.
SELECT id,
       user_id,
       transaction_id,
       fraud_score,
       status,
       reason,
       created_at
FROM fraud_event
WHERE fraud_score >= 70
ORDER BY fraud_score DESC, created_at DESC;

-- Show fraud events with transaction details.
SELECT f.id AS fraud_event_id,
       f.fraud_score,
       f.status AS fraud_status,
       f.reason,
       t.id AS transaction_id,
       t.amount,
       t.type,
       t.status AS transaction_status,
       t.created_at
FROM fraud_event AS f
LEFT JOIN "transaction" AS t ON t.id = f.transaction_id
ORDER BY f.created_at DESC;

-- Count fraud events by status.
SELECT status,
       COUNT(*) AS fraud_event_count,
       AVG(fraud_score) AS average_fraud_score
FROM fraud_event
GROUP BY status
ORDER BY status;

-- Find transactions that have more than one fraud event.
SELECT transaction_id,
       COUNT(*) AS fraud_event_count
FROM fraud_event
WHERE transaction_id IS NOT NULL
GROUP BY transaction_id
HAVING COUNT(*) > 1
ORDER BY transaction_id;

-- =========================================================
-- 6. NOTIFICATIONS
-- =========================================================

-- View the latest notification history.
SELECT id,
       recipient,
       type,
       message,
       status,
       created_at
FROM notifications
ORDER BY created_at DESC;

-- View notification history for one recipient.
SELECT id,
       recipient,
       type,
       message,
       status,
       created_at
FROM notifications
WHERE recipient = 'user1@example.com'
ORDER BY created_at DESC;

-- Count notifications by status and type.
SELECT status,
       type,
       COUNT(*) AS notification_count
FROM notifications
GROUP BY status, type
ORDER BY status, type;

-- Find failed or pending notifications.
SELECT id,
       recipient,
       type,
       message,
       status,
       created_at
FROM notifications
WHERE status IN ('FAILED', 'PENDING')
ORDER BY created_at DESC;

-- Find recipients with the most notifications.
SELECT recipient,
       COUNT(*) AS notification_count,
       MAX(created_at) AS latest_notification
FROM notifications
GROUP BY recipient
ORDER BY notification_count DESC;

-- =========================================================
-- 7. DATA QUALITY CHECKS
-- =========================================================

-- Find transactions referencing a missing loan.
SELECT t.*
FROM "transaction" AS t
LEFT JOIN loan AS l ON l.id = t.loan_id
WHERE l.id IS NULL;

-- Find settlements referencing a missing transaction or loan.
SELECT s.*
FROM settlement AS s
LEFT JOIN "transaction" AS t ON t.id = s.transaction_id
LEFT JOIN loan AS l ON l.id = s.loan_id
WHERE t.id IS NULL
   OR l.id IS NULL;

-- Find fraud events referencing a missing transaction.
SELECT f.*
FROM fraud_event AS f
LEFT JOIN "transaction" AS t ON t.id = f.transaction_id
WHERE f.transaction_id IS NOT NULL
  AND t.id IS NULL;

-- Find records created during the last 24 hours.
SELECT 'transaction' AS record_type, id, created_at
FROM "transaction"
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
UNION ALL
SELECT 'fraud_event', id, created_at
FROM fraud_event
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
UNION ALL
SELECT 'notification', id, created_at
FROM notifications
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- =========================================================
-- 8. OPTIONAL MAINTENANCE COMMANDS
-- =========================================================

-- Refresh query planner statistics after a large data load.
-- ANALYZE loan;
-- ANALYZE "transaction";
-- ANALYZE settlement;
-- ANALYZE fraud_event;
-- ANALYZE notifications;

-- View indexes used by the application tables.
SELECT tablename,
       indexname,
       indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('loan', 'transaction', 'settlement', 'fraud_event', 'notifications')
ORDER BY tablename, indexname;
