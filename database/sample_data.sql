-- ============================================================
-- SAMPLE DATA
-- BANKING TRANSACTION WORKFLOW
-- TEAM D
--
-- MODULES:
-- 1. Saga Execution
-- 2. Settlement Confirmation
-- 3. Notification Delivery
-- ============================================================

USE banking_transaction_workflow;


-- ============================================================
-- MODULE 1: SAGA EXECUTION
-- ============================================================


-- ------------------------------------------------------------
-- SAGA TRANSACTIONS
-- ------------------------------------------------------------

INSERT INTO saga_transaction
(saga_id, customer_id, saga_type, status, current_step)
VALUES
('SAGA-10001', 'CUST-10001', 'FUND_TRANSFER', 'COMPLETED', 4),

('SAGA-10002', 'CUST-10002', 'FUND_TRANSFER', 'COMPLETED', 4),

('SAGA-10003', 'CUST-10003', 'FUND_TRANSFER', 'FAILED', 3),

('SAGA-10004', 'CUST-10004', 'FUND_TRANSFER', 'PROCESSING', 2);


-- ------------------------------------------------------------
-- SAGA STEPS
-- ------------------------------------------------------------

INSERT INTO saga_step
(step_id, saga_id, step_order, step_name, service_name,
 status, start_time, end_time, error_message)
VALUES

-- Saga 10001
('STEP-10001', 'SAGA-10001', 1,
 'Validate Sender', 'Account Service',
 'SUCCESS', '2026-08-19 10:00:00',
 '2026-08-19 10:00:01', NULL),

('STEP-10002', 'SAGA-10001', 2,
 'Check Balance', 'Account Service',
 'SUCCESS', '2026-08-19 10:00:01',
 '2026-08-19 10:00:02', NULL),

('STEP-10003', 'SAGA-10001', 3,
 'Debit Sender', 'Debit Service',
 'SUCCESS', '2026-08-19 10:00:02',
 '2026-08-19 10:00:03', NULL),

('STEP-10004', 'SAGA-10001', 4,
 'Credit Receiver', 'Credit Service',
 'SUCCESS', '2026-08-19 10:00:03',
 '2026-08-19 10:00:04', NULL),


-- Saga 10002
('STEP-10005', 'SAGA-10002', 1,
 'Validate Sender', 'Account Service',
 'SUCCESS', '2026-08-19 11:00:00',
 '2026-08-19 11:00:01', NULL),

('STEP-10006', 'SAGA-10002', 2,
 'Check Balance', 'Account Service',
 'SUCCESS', '2026-08-19 11:00:01',
 '2026-08-19 11:00:02', NULL),

('STEP-10007', 'SAGA-10002', 3,
 'Debit Sender', 'Debit Service',
 'SUCCESS', '2026-08-19 11:00:02',
 '2026-08-19 11:00:03', NULL),

('STEP-10008', 'SAGA-10002', 4,
 'Credit Receiver', 'Credit Service',
 'SUCCESS', '2026-08-19 11:00:03',
 '2026-08-19 11:00:04', NULL),


-- Saga 10003 - Failed
('STEP-10009', 'SAGA-10003', 1,
 'Validate Sender', 'Account Service',
 'SUCCESS', '2026-08-19 12:00:00',
 '2026-08-19 12:00:01', NULL),

('STEP-10010', 'SAGA-10003', 2,
 'Check Balance', 'Account Service',
 'SUCCESS', '2026-08-19 12:00:01',
 '2026-08-19 12:00:02', NULL),

('STEP-10011', 'SAGA-10003', 3,
 'Debit Sender', 'Debit Service',
 'FAILED', '2026-08-19 12:00:02',
 '2026-08-19 12:00:03',
 'Insufficient account balance'),


-- Saga 10004 - Processing
('STEP-10012', 'SAGA-10004', 1,
 'Validate Sender', 'Account Service',
 'SUCCESS', '2026-08-19 13:00:00',
 '2026-08-19 13:00:01', NULL),

('STEP-10013', 'SAGA-10004', 2,
 'Check Balance', 'Account Service',
 'PROCESSING', '2026-08-19 13:00:01',
 NULL, NULL);


-- ------------------------------------------------------------
-- SAGA COMPENSATION
-- ------------------------------------------------------------

INSERT INTO saga_compensation
(compensation_id, saga_step_id, compensation_type,
 status, executed_at, error_message)
VALUES
('COMP-10001', 'STEP-10011',
 'REFUND_DEBIT', 'SUCCESS',
 '2026-08-19 12:00:04', NULL);


-- ------------------------------------------------------------
-- SAGA AUDIT LOG
-- ------------------------------------------------------------

INSERT INTO saga_audit_log
(audit_id, saga_id, action, details)
VALUES

('AUDIT-10001', 'SAGA-10001',
 'SAGA_COMPLETED',
 'Fund transfer saga completed successfully'),

('AUDIT-10002', 'SAGA-10001',
 'DEBIT_COMPLETED',
 'Sender account debited successfully'),

('AUDIT-10003', 'SAGA-10001',
 'CREDIT_COMPLETED',
 'Receiver account credited successfully'),

('AUDIT-10004', 'SAGA-10002',
 'SAGA_COMPLETED',
 'Fund transfer saga completed successfully'),

('AUDIT-10005', 'SAGA-10003',
 'SAGA_FAILED',
 'Saga failed because sender balance was insufficient'),

('AUDIT-10006', 'SAGA-10003',
 'COMPENSATION_EXECUTED',
 'Debit compensation/refund completed'),

('AUDIT-10007', 'SAGA-10004',
 'SAGA_PROCESSING',
 'Saga is currently being processed');


-- ============================================================
-- MODULE 2: SETTLEMENT CONFIRMATION
-- ============================================================


-- ------------------------------------------------------------
-- SETTLEMENT
-- ------------------------------------------------------------

INSERT INTO settlement
(settlement_id, saga_id, transaction_ref_no,
 amount, currency, status, settlement_time)
VALUES

('SETTLE-10001', 'SAGA-10001',
 'TXN10001', 10000.00, 'INR',
 'SETTLED', '2026-08-19 10:00:05'),

('SETTLE-10002', 'SAGA-10002',
 'TXN10002', 5000.00, 'INR',
 'SETTLED', '2026-08-19 11:00:05'),

('SETTLE-10003', 'SAGA-10003',
 'TXN10003', 15000.00, 'INR',
 'FAILED', NULL),

('SETTLE-10004', 'SAGA-10004',
 'TXN10004', 2500.00, 'INR',
 'PROCESSING', NULL);


-- ------------------------------------------------------------
-- SETTLEMENT ITEMS
-- ------------------------------------------------------------

INSERT INTO settlement_item
(item_id, settlement_id, account_id,
 item_type, debit_credit, amount,
 status, processed_time, remarks)
VALUES

-- Transaction 10001
('ITEM-10001', 'SETTLE-10001',
 'ACC-10001', 'DEBIT', 'DEBIT',
 10000.00, 'SUCCESS',
 '2026-08-19 10:00:03',
 'Sender account debited'),

('ITEM-10002', 'SETTLE-10001',
 'ACC-10002', 'CREDIT', 'CREDIT',
 10000.00, 'SUCCESS',
 '2026-08-19 10:00:04',
 'Receiver account credited'),


-- Transaction 10002
('ITEM-10003', 'SETTLE-10002',
 'ACC-10003', 'DEBIT', 'DEBIT',
 5000.00, 'SUCCESS',
 '2026-08-19 11:00:03',
 'Sender account debited'),

('ITEM-10004', 'SETTLE-10002',
 'ACC-10004', 'CREDIT', 'CREDIT',
 5000.00, 'SUCCESS',
 '2026-08-19 11:00:04',
 'Receiver account credited'),


-- Transaction 10003 - Failed
('ITEM-10005', 'SETTLE-10003',
 'ACC-10005', 'DEBIT', 'DEBIT',
 15000.00, 'FAILED',
 NULL,
 'Debit failed due to insufficient balance'),


-- Transaction 10004 - Processing
('ITEM-10006', 'SETTLE-10004',
 'ACC-10006', 'DEBIT', 'DEBIT',
 2500.00, 'PROCESSING',
 NULL,
 'Debit is being processed'),

('ITEM-10007', 'SETTLE-10004',
 'ACC-10007', 'CREDIT', 'CREDIT',
 2500.00, 'PENDING',
 NULL,
 'Credit awaiting confirmation');


-- ------------------------------------------------------------
-- SETTLEMENT STATUS HISTORY
-- ------------------------------------------------------------

INSERT INTO settlement_status_history
(history_id, settlement_id, status,
 changed_by, changed_at, remarks)
VALUES

-- Settlement 10001
('HIST-10001', 'SETTLE-10001',
 'PENDING', 'SYSTEM',
 '2026-08-19 10:00:00',
 'Settlement created'),

('HIST-10002', 'SETTLE-10001',
 'PROCESSING', 'SYSTEM',
 '2026-08-19 10:00:02',
 'Settlement processing started'),

('HIST-10003', 'SETTLE-10001',
 'SETTLED', 'SYSTEM',
 '2026-08-19 10:00:05',
 'Debit and credit confirmed'),


-- Settlement 10002
('HIST-10004', 'SETTLE-10002',
 'PENDING', 'SYSTEM',
 '2026-08-19 11:00:00',
 'Settlement created'),

('HIST-10005', 'SETTLE-10002',
 'PROCESSING', 'SYSTEM',
 '2026-08-19 11:00:02',
 'Settlement processing started'),

('HIST-10006', 'SETTLE-10002',
 'SETTLED', 'SYSTEM',
 '2026-08-19 11:00:05',
 'Debit and credit confirmed'),


-- Settlement 10003
('HIST-10007', 'SETTLE-10003',
 'PENDING', 'SYSTEM',
 '2026-08-19 12:00:00',
 'Settlement created'),

('HIST-10008', 'SETTLE-10003',
 'PROCESSING', 'SYSTEM',
 '2026-08-19 12:00:02',
 'Settlement processing started'),

('HIST-10009', 'SETTLE-10003',
 'FAILED', 'SYSTEM',
 '2026-08-19 12:00:04',
 'Debit operation failed'),


-- Settlement 10004
('HIST-10010', 'SETTLE-10004',
 'PENDING', 'SYSTEM',
 '2026-08-19 13:00:00',
 'Settlement created'),

('HIST-10011', 'SETTLE-10004',
 'PROCESSING', 'SYSTEM',
 '2026-08-19 13:00:02',
 'Settlement is currently processing');


-- ============================================================
-- MODULE 3: NOTIFICATION DELIVERY
-- ============================================================


-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------

INSERT INTO notification
(notification_id, settlement_id, customer_id,
 notification_type, channel, status,
 message, scheduled_at, sent_at, error_message)
VALUES

-- Successful Email
('NOTIF-10001', 'SETTLE-10001',
 'CUST-10001', 'TRANSACTION_SUCCESS',
 'EMAIL', 'SENT',
 'Your transaction of INR 10,000 was successfully completed. Transaction ID: TXN10001.',
 '2026-08-19 10:00:06',
 '2026-08-19 10:00:07',
 NULL),

-- Successful SMS
('NOTIF-10002', 'SETTLE-10001',
 'CUST-10001', 'TRANSACTION_SUCCESS',
 'SMS', 'SENT',
 'INR 10,000 transferred successfully. Transaction ID: TXN10001.',
 '2026-08-19 10:00:06',
 '2026-08-19 10:00:07',
 NULL),

-- Successful Push
('NOTIF-10003', 'SETTLE-10002',
 'CUST-10002', 'TRANSACTION_SUCCESS',
 'PUSH', 'SENT',
 'Your INR 5,000 transaction was successfully completed.',
 '2026-08-19 11:00:06',
 '2026-08-19 11:00:07',
 NULL),

-- Failed Transaction Notification
('NOTIF-10004', 'SETTLE-10003',
 'CUST-10003', 'TRANSACTION_FAILED',
 'EMAIL', 'SENT',
 'Your transaction of INR 15,000 failed. Transaction ID: TXN10003.',
 '2026-08-19 12:00:05',
 '2026-08-19 12:00:06',
 NULL),

-- Processing Notification
('NOTIF-10005', 'SETTLE-10004',
 'CUST-10004', 'TRANSACTION_PROCESSING',
 'SMS', 'PENDING',
 'Your transaction of INR 2,500 is currently being processed.',
 '2026-08-19 13:00:05',
 NULL,
 NULL);


-- ------------------------------------------------------------
-- NOTIFICATION LOG
-- ------------------------------------------------------------

INSERT INTO notification_log
(log_id, notification_id, channel,
 status, response, attempt_count, last_attempt_at)
VALUES

('NLOG-10001', 'NOTIF-10001',
 'EMAIL', 'SUCCESS',
 'Email delivered successfully',
 1, '2026-08-19 10:00:07'),

('NLOG-10002', 'NOTIF-10002',
 'SMS', 'SUCCESS',
 'SMS delivered successfully',
 1, '2026-08-19 10:00:07'),

('NLOG-10003', 'NOTIF-10003',
 'PUSH', 'SUCCESS',
 'Push notification delivered successfully',
 1, '2026-08-19 11:00:07'),

('NLOG-10004', 'NOTIF-10004',
 'EMAIL', 'SUCCESS',
 'Failure notification delivered successfully',
 1, '2026-08-19 12:00:06'),

('NLOG-10005', 'NOTIF-10005',
 'SMS', 'PENDING',
 'Waiting for settlement completion',
 1, '2026-08-19 13:00:05');


-- ============================================================
-- SAMPLE DATA VERIFICATION
-- ============================================================

SELECT * FROM saga_transaction;

SELECT *
FROM saga_step
ORDER BY saga_id, step_order;

SELECT * FROM saga_compensation;

SELECT *
FROM saga_audit_log
ORDER BY created_at;

SELECT *
FROM settlement
ORDER BY created_at;

SELECT * FROM settlement_item;

SELECT *
FROM settlement_status_history
ORDER BY changed_at;

SELECT *
FROM notification
ORDER BY created_at;

SELECT *
FROM notification_log
ORDER BY last_attempt_at;


-- ============================================================
-- COMPLETE WORKFLOW
-- ============================================================

SELECT
    s.saga_id,
    s.customer_id,
    s.saga_type,
    s.status AS saga_status,
    st.transaction_ref_no,
    st.amount,
    st.currency,
    st.status AS settlement_status,
    n.notification_id,
    n.notification_type,
    n.channel,
    n.status AS notification_status
FROM saga_transaction s
LEFT JOIN settlement st
    ON s.saga_id = st.saga_id
LEFT JOIN notification n
    ON st.settlement_id = n.settlement_id
ORDER BY s.created_at;


-- ============================================================
-- END OF SAMPLE DATA
-- ============================================================
