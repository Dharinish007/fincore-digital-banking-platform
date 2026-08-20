-- ============================================================
-- TEAM D - BANKING TRANSACTION WORKFLOW
-- SQL QUERIES
--
-- MODULE 1: Saga Execution
-- MODULE 2: Settlement Confirmation
-- MODULE 3: Notification Delivery
-- ============================================================

USE banking_transaction_workflow;


-- ============================================================
-- MODULE 1: SAGA EXECUTION
-- ============================================================


-- Q1. Create a new Saga transaction
INSERT INTO saga_transaction
(saga_id, customer_id, saga_type, status, current_step)
VALUES
('SAGA-10005', 'CUST-10005', 'FUND_TRANSFER', 'PENDING', 0);


-- Q2. Add Saga execution steps
INSERT INTO saga_step
(step_id, saga_id, step_order, step_name, service_name, status)
VALUES
('STEP-10014', 'SAGA-10005', 1,
 'Validate Sender', 'Account Service', 'PENDING'),

('STEP-10015', 'SAGA-10005', 2,
 'Check Balance', 'Account Service', 'PENDING'),

('STEP-10016', 'SAGA-10005', 3,
 'Debit Sender', 'Debit Service', 'PENDING'),

('STEP-10017', 'SAGA-10005', 4,
 'Credit Receiver', 'Credit Service', 'PENDING');


-- Q3. Start a Saga step
UPDATE saga_step
SET status = 'PROCESSING',
    start_time = CURRENT_TIMESTAMP
WHERE step_id = 'STEP-10014';


-- Q4. Mark a Saga step successful
UPDATE saga_step
SET status = 'SUCCESS',
    end_time = CURRENT_TIMESTAMP
WHERE step_id = 'STEP-10014';


-- Q5. Move Saga to next step
UPDATE saga_transaction
SET current_step = 2,
    status = 'PROCESSING'
WHERE saga_id = 'SAGA-10005';


-- Q6. Complete Saga successfully
UPDATE saga_transaction
SET status = 'COMPLETED',
    current_step = 4
WHERE saga_id = 'SAGA-10005';


-- Q7. Record Saga failure
UPDATE saga_step
SET status = 'FAILED',
    end_time = CURRENT_TIMESTAMP,
    error_message = 'Insufficient account balance'
WHERE step_id = 'STEP-10016';


-- Q8. Mark Saga as failed
UPDATE saga_transaction
SET status = 'FAILED'
WHERE saga_id = 'SAGA-10005';


-- Q9. Create compensation transaction
INSERT INTO saga_compensation
(compensation_id, saga_step_id, compensation_type, status)
VALUES
('COMP-10002', 'STEP-10016', 'REFUND_DEBIT', 'PENDING');


-- Q10. Execute compensation
UPDATE saga_compensation
SET status = 'SUCCESS',
    executed_at = CURRENT_TIMESTAMP
WHERE compensation_id = 'COMP-10002';


-- Q11. Record Saga audit event
INSERT INTO saga_audit_log
(audit_id, saga_id, action, details)
VALUES
('AUDIT-10008', 'SAGA-10005',
 'STEP_COMPLETED',
 'Sender validation completed successfully');


-- Q12. View all Saga transactions
SELECT *
FROM saga_transaction
ORDER BY created_at DESC;


-- Q13. View complete Saga execution with steps
SELECT
    s.saga_id,
    s.customer_id,
    s.saga_type,
    s.status AS saga_status,
    s.current_step,
    ss.step_order,
    ss.step_name,
    ss.service_name,
    ss.status AS step_status,
    ss.start_time,
    ss.end_time,
    ss.error_message
FROM saga_transaction s
LEFT JOIN saga_step ss
    ON s.saga_id = ss.saga_id
ORDER BY s.created_at DESC, ss.step_order;


-- Q14. Find failed Sagas
SELECT
    saga_id,
    customer_id,
    saga_type,
    status,
    current_step,
    created_at,
    updated_at
FROM saga_transaction
WHERE status = 'FAILED';


-- Q15. Find failed Saga steps
SELECT
    step_id,
    saga_id,
    step_name,
    service_name,
    error_message,
    start_time,
    end_time
FROM saga_step
WHERE status = 'FAILED';


-- Q16. View compensation history
SELECT
    c.compensation_id,
    c.saga_step_id,
    s.saga_id,
    s.step_name,
    c.compensation_type,
    c.status,
    c.executed_at,
    c.error_message
FROM saga_compensation c
JOIN saga_step s
    ON c.saga_step_id = s.step_id
ORDER BY c.executed_at DESC;


-- Q17. View Saga audit trail
SELECT
    audit_id,
    saga_id,
    action,
    details,
    created_at
FROM saga_audit_log
WHERE saga_id = 'SAGA-10005'
ORDER BY created_at;


-- ============================================================
-- MODULE 2: SETTLEMENT CONFIRMATION
-- ============================================================


-- Q18. Create settlement record
INSERT INTO settlement
(settlement_id, saga_id, transaction_ref_no,
 amount, currency, status)
VALUES
('SETTLE-10005', 'SAGA-10005',
 'TXN10005', 5000.00, 'INR', 'PENDING');


-- Q19. Add debit settlement item
INSERT INTO settlement_item
(item_id, settlement_id, account_id,
 item_type, debit_credit, amount,
 status, remarks)
VALUES
('ITEM-10008', 'SETTLE-10005',
 'ACC-10008', 'DEBIT', 'DEBIT',
 5000.00, 'PENDING',
 'Sender account debit');


-- Q20. Add credit settlement item
INSERT INTO settlement_item
(item_id, settlement_id, account_id,
 item_type, debit_credit, amount,
 status, remarks)
VALUES
('ITEM-10009', 'SETTLE-10005',
 'ACC-10009', 'CREDIT', 'CREDIT',
 5000.00, 'PENDING',
 'Receiver account credit');


-- Q21. Change settlement to PROCESSING
UPDATE settlement
SET status = 'PROCESSING'
WHERE settlement_id = 'SETTLE-10005';


-- Q22. Record settlement processing history
INSERT INTO settlement_status_history
(history_id, settlement_id, status,
 changed_by, remarks)
VALUES
('HIST-10012', 'SETTLE-10005',
 'PROCESSING', 'SYSTEM',
 'Settlement processing started');


-- Q23. Mark debit item successful
UPDATE settlement_item
SET status = 'SUCCESS',
    processed_time = CURRENT_TIMESTAMP
WHERE item_id = 'ITEM-10008';


-- Q24. Mark credit item successful
UPDATE settlement_item
SET status = 'SUCCESS',
    processed_time = CURRENT_TIMESTAMP
WHERE item_id = 'ITEM-10009';


-- Q25. Confirm settlement as SETTLED
UPDATE settlement
SET status = 'SETTLED',
    settlement_time = CURRENT_TIMESTAMP
WHERE settlement_id = 'SETTLE-10005';


-- Q26. Record SETTLED status history
INSERT INTO settlement_status_history
(history_id, settlement_id, status,
 changed_by, remarks)
VALUES
('HIST-10013', 'SETTLE-10005',
 'SETTLED', 'SYSTEM',
 'Debit and credit successfully confirmed');


-- Q27. Find pending settlements
SELECT
    settlement_id,
    saga_id,
    transaction_ref_no,
    amount,
    currency,
    status,
    created_at
FROM settlement
WHERE status = 'PENDING';


-- Q28. Find processing settlements
SELECT
    settlement_id,
    transaction_ref_no,
    amount,
    status
FROM settlement
WHERE status = 'PROCESSING';


-- Q29. Find successfully settled transactions
SELECT
    settlement_id,
    saga_id,
    transaction_ref_no,
    amount,
    currency,
    status,
    settlement_time
FROM settlement
WHERE status = 'SETTLED'
ORDER BY settlement_time DESC;


-- Q30. Find failed settlements
SELECT
    settlement_id,
    saga_id,
    transaction_ref_no,
    amount,
    status
FROM settlement
WHERE status = 'FAILED';


-- Q31. Verify debit and credit amounts
SELECT
    settlement_id,
    SUM(
        CASE
            WHEN debit_credit = 'DEBIT'
            THEN amount
            ELSE 0
        END
    ) AS total_debit,
    SUM(
        CASE
            WHEN debit_credit = 'CREDIT'
            THEN amount
            ELSE 0
        END
    ) AS total_credit
FROM settlement_item
GROUP BY settlement_id;


-- Q32. Check whether settlement is balanced
SELECT
    settlement_id,
    CASE
        WHEN
            SUM(
                CASE
                    WHEN debit_credit = 'DEBIT'
                    THEN amount
                    ELSE 0
                END
            )
            =
            SUM(
                CASE
                    WHEN debit_credit = 'CREDIT'
                    THEN amount
                    ELSE 0
                END
            )
        THEN 'BALANCED'
        ELSE 'MISMATCH'
    END AS settlement_check
FROM settlement_item
GROUP BY settlement_id;


-- Q33. View settlement with debit/credit items
SELECT
    s.settlement_id,
    s.transaction_ref_no,
    s.amount AS settlement_amount,
    s.status AS settlement_status,
    si.item_id,
    si.account_id,
    si.debit_credit,
    si.amount AS item_amount,
    si.status AS item_status
FROM settlement s
JOIN settlement_item si
    ON s.settlement_id = si.settlement_id
WHERE s.settlement_id = 'SETTLE-10005';


-- Q34. View settlement status history
SELECT
    h.history_id,
    h.settlement_id,
    h.status,
    h.changed_by,
    h.changed_at,
    h.remarks
FROM settlement_status_history h
WHERE h.settlement_id = 'SETTLE-10005'
ORDER BY h.changed_at;


-- ============================================================
-- MODULE 3: NOTIFICATION DELIVERY
-- ============================================================


-- Q35. Create transaction-success notification
INSERT INTO notification
(notification_id, settlement_id, customer_id,
 notification_type, channel, status, message)
VALUES
('NOTIF-10006', 'SETTLE-10005',
 'CUST-10005', 'TRANSACTION_SUCCESS',
 'EMAIL', 'PENDING',
 'Your transaction of INR 5,000 was successfully completed. Transaction ID: TXN10005.');


-- Q36. Create SMS notification
INSERT INTO notification
(notification_id, settlement_id, customer_id,
 notification_type, channel, status, message)
VALUES
('NOTIF-10007', 'SETTLE-10005',
 'CUST-10005', 'TRANSACTION_SUCCESS',
 'SMS', 'PENDING',
 'INR 5,000 transferred successfully. Transaction ID: TXN10005.');


-- Q37. Create push notification
INSERT INTO notification
(notification_id, settlement_id, customer_id,
 notification_type, channel, status, message)
VALUES
('NOTIF-10008', 'SETTLE-10005',
 'CUST-10005', 'TRANSACTION_SUCCESS',
 'PUSH', 'PENDING',
 'Your INR 5,000 transaction was successfully completed.');


-- Q38. Mark notification as PROCESSING
UPDATE notification
SET status = 'PROCESSING'
WHERE notification_id = 'NOTIF-10006';


-- Q39. Mark notification as SENT
UPDATE notification
SET status = 'SENT',
    sent_at = CURRENT_TIMESTAMP
WHERE notification_id = 'NOTIF-10006';


-- Q40. Record notification delivery failure
UPDATE notification
SET status = 'FAILED',
    error_message = 'Email delivery failed'
WHERE notification_id = 'NOTIF-10007';


-- Q41. Record successful notification attempt
INSERT INTO notification_log
(log_id, notification_id, channel,
 status, response, attempt_count)
VALUES
('NLOG-10006', 'NOTIF-10006',
 'EMAIL', 'SUCCESS',
 'Email delivered successfully', 1);


-- Q42. Record failed notification attempt
INSERT INTO notification_log
(log_id, notification_id, channel,
 status, response, attempt_count)
VALUES
('NLOG-10007', 'NOTIF-10007',
 'SMS', 'FAILED',
 'SMS gateway unavailable', 1);


-- Q43. Find pending notifications
SELECT
    notification_id,
    customer_id,
    settlement_id,
    notification_type,
    channel,
    status,
    scheduled_at
FROM notification
WHERE status = 'PENDING'
ORDER BY created_at;


-- Q44. Find failed notifications
SELECT
    notification_id,
    customer_id,
    notification_type,
    channel,
    status,
    error_message
FROM notification
WHERE status = 'FAILED';


-- Q45. View successfully delivered notifications
SELECT
    notification_id,
    customer_id,
    notification_type,
    channel,
    status,
    sent_at
FROM notification
WHERE status = 'SENT'
ORDER BY sent_at DESC;


-- Q46. View notification delivery attempts
SELECT
    n.notification_id,
    n.customer_id,
    n.notification_type,
    n.channel,
    n.status AS notification_status,
    nl.status AS delivery_status,
    nl.attempt_count,
    nl.response,
    nl.last_attempt_at
FROM notification n
LEFT JOIN notification_log nl
    ON n.notification_id = nl.notification_id
ORDER BY nl.last_attempt_at DESC;


-- Q47. Find notifications for a customer
SELECT
    notification_id,
    settlement_id,
    notification_type,
    channel,
    status,
    message,
    created_at,
    sent_at
FROM notification
WHERE customer_id = 'CUST-10005'
ORDER BY created_at DESC;


-- Q48. Find failed notifications that need retry
SELECT
    n.notification_id,
    n.customer_id,
    n.channel,
    n.status,
    nl.attempt_count,
    nl.last_attempt_at,
    nl.response
FROM notification n
JOIN notification_log nl
    ON n.notification_id = nl.notification_id
WHERE n.status = 'FAILED'
  AND nl.attempt_count < 3;


-- ============================================================
-- INTEGRATED WORKFLOW QUERIES
-- ============================================================


-- Q49. Complete transaction lifecycle
-- Saga -> Settlement -> Notification

SELECT
    s.saga_id,
    s.customer_id,
    s.saga_type,
    s.status AS saga_status,
    st.settlement_id,
    st.transaction_ref_no,
    st.amount,
    st.currency,
    st.status AS settlement_status,
    n.notification_id,
    n.notification_type,
    n.channel,
    n.status AS notification_status,
    n.sent_at
FROM saga_transaction s
LEFT JOIN settlement st
    ON s.saga_id = st.saga_id
LEFT JOIN notification n
    ON st.settlement_id = n.settlement_id
ORDER BY s.created_at DESC;


-- Q50. Complete transaction details by transaction ID

SELECT
    s.saga_id,
    s.customer_id,
    s.status AS saga_status,
    st.transaction_ref_no,
    st.amount,
    st.currency,
    st.status AS settlement_status,
    st.settlement_time,
    n.notification_id,
    n.channel,
    n.status AS notification_status,
    n.sent_at
FROM saga_transaction s
JOIN settlement st
    ON s.saga_id = st.saga_id
LEFT JOIN notification n
    ON st.settlement_id = n.settlement_id
WHERE st.transaction_ref_no = 'TXN10005';


-- Q51. Completed Saga but not settled

SELECT
    s.saga_id,
    s.customer_id,
    st.transaction_ref_no,
    s.status AS saga_status,
    st.status AS settlement_status
FROM saga_transaction s
JOIN settlement st
    ON s.saga_id = st.saga_id
WHERE s.status = 'COMPLETED'
  AND st.status <> 'SETTLED';


-- Q52. Settled transactions without notification

SELECT
    st.settlement_id,
    st.transaction_ref_no,
    st.amount,
    st.status
FROM settlement st
LEFT JOIN notification n
    ON st.settlement_id = n.settlement_id
WHERE st.status = 'SETTLED'
  AND n.notification_id IS NULL;


-- Q53. Failed Saga and compensation status

SELECT
    s.saga_id,
    s.customer_id,
    s.status AS saga_status,
    ss.step_name,
    ss.status AS step_status,
    c.compensation_type,
    c.status AS compensation_status
FROM saga_transaction s
JOIN saga_step ss
    ON s.saga_id = ss.saga_id
LEFT JOIN saga_compensation c
    ON ss.step_id = c.saga_step_id
WHERE s.status = 'FAILED';


-- Q54. Transaction dashboard summary

SELECT
    (SELECT COUNT(*)
     FROM saga_transaction) AS total_sagas,

    (SELECT COUNT(*)
     FROM saga_transaction
     WHERE status = 'COMPLETED') AS completed_sagas,

    (SELECT COUNT(*)
     FROM saga_transaction
     WHERE status = 'FAILED') AS failed_sagas,

    (SELECT COUNT(*)
     FROM settlement
     WHERE status = 'SETTLED') AS settled_transactions,

    (SELECT COUNT(*)
     FROM settlement
     WHERE status = 'FAILED') AS failed_settlements,

    (SELECT COUNT(*)
     FROM notification
     WHERE status = 'SENT') AS notifications_sent,

    (SELECT COUNT(*)
     FROM notification
     WHERE status = 'FAILED') AS notifications_failed;


-- Q55. Settlement amount vs debit/credit verification

SELECT
    s.transaction_ref_no,
    s.amount AS settlement_amount,

    COALESCE(
        SUM(
            CASE
                WHEN si.debit_credit = 'DEBIT'
                THEN si.amount
                ELSE 0
            END
        ), 0
    ) AS total_debit,

    COALESCE(
        SUM(
            CASE
                WHEN si.debit_credit = 'CREDIT'
                THEN si.amount
                ELSE 0
            END
        ), 0
    ) AS total_credit,

    CASE
        WHEN
            s.amount =
            COALESCE(
                SUM(
                    CASE
                        WHEN si.debit_credit = 'DEBIT'
                        THEN si.amount
                        ELSE 0
                    END
                ), 0
            )
        AND
            s.amount =
            COALESCE(
                SUM(
                    CASE
                        WHEN si.debit_credit = 'CREDIT'
                        THEN si.amount
                        ELSE 0
                    END
                ), 0
            )
        THEN 'VALID'
        ELSE 'AMOUNT_MISMATCH'
    END AS verification_result

FROM settlement s
LEFT JOIN settlement_item si
    ON s.settlement_id = si.settlement_id

GROUP BY
    s.settlement_id,
    s.transaction_ref_no,
    s.amount;


-- ============================================================
-- REPORTING QUERIES
-- ============================================================


-- Q56. Saga status count

SELECT
    status,
    COUNT(*) AS total
FROM saga_transaction
GROUP BY status;


-- Q57. Settlement status count

SELECT
    status,
    COUNT(*) AS total
FROM settlement
GROUP BY status;


-- Q58. Notification status count by channel

SELECT
    channel,
    status,
    COUNT(*) AS total
FROM notification
GROUP BY channel, status
ORDER BY channel, status;


-- Q59. Daily settlement report

SELECT
    DATE(settlement_time) AS settlement_date,
    COUNT(*) AS total_transactions,
    SUM(amount) AS total_amount
FROM settlement
WHERE status = 'SETTLED'
GROUP BY DATE(settlement_time)
ORDER BY settlement_date DESC;


-- Q60. Customer transaction history

SELECT
    s.customer_id,
    st.transaction_ref_no,
    st.amount,
    st.currency,
    st.status AS settlement_status,
    st.settlement_time
FROM saga_transaction s
JOIN settlement st
    ON s.saga_id = st.saga_id
WHERE s.customer_id = 'CUST-10005'
ORDER BY st.settlement_time DESC;


-- ============================================================
-- END OF QUERIES
-- ============================================================
