-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - MILESTONE 3 QUERIES
-- =========================================================
USE fincore_db;

-- 1. Monitor running, failed and compensated Sagas
SELECT s.id, s.saga_type, s.customer_name, s.amount, s.current_step, s.total_steps, s.status, s.retry_count, s.started_at, s.failure_reason
FROM saga_instances s
ORDER BY s.started_at DESC;

-- 2. Inspect step timeline for a specific Saga
SELECT step_number, name, action, compensation_action, status, executed_at, error_message
FROM saga_steps
WHERE saga_id = 'SAGA-DISB-001'
ORDER BY step_number ASC;

-- 3. Pending Clearing Settlements requiring confirmation or retry
SELECT id, settlement_reference, transaction_id, customer_name, amount, settlement_type, clearing_house, bank_reference, status, retry_count
FROM settlements
WHERE status IN ('PENDING', 'FAILED')
ORDER BY initiated_at DESC;

-- 4. Customer Unread In-App Notifications
SELECT id, type, title, message, channel, created_at
FROM notifications
WHERE customer_id = 'CUST-1001' AND is_read = FALSE
ORDER BY created_at DESC;
