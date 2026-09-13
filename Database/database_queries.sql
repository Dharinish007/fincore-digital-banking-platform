-- ============================================================================
-- FINCORE DIGITAL BANKING PLATFORM - OPERATIONAL & ANALYTICAL SQL QUERIES
-- Database: PostgreSQL 14+
-- Consolidates business queries across all 4 FinCore Platform Milestones:
--   1. Core Banking & Statement Generation (Milestone 1)
--   2. Loan Management, EMI & Collections (Milestone 2)
--   3. Interbank Settlement & Notifications (Milestone 3)
--   4. AI Risk Assessment, Biometric Liveness & Audit Trail (Milestone 4)
-- ============================================================================

-- ============================================================================
-- MODULE 1: CORE BANKING & ACCOUNT OPERATIONS (MILESTONE 1)
-- ============================================================================

-- 1.1 Customer Account Overview (Customer info + Active balance)
SELECT 
    c.customer_id,
    c.full_name,
    c.email,
    c.phone,
    c.kyc_status,
    a.account_number,
    a.account_type,
    a.balance,
    a.available_balance,
    a.status AS account_status
FROM customers c
JOIN accounts a ON c.customer_id = a.customer_id
ORDER BY a.balance DESC;

-- 1.2 Account Statement Query for a Specific Date Range (e.g. Last 30 Days)
SELECT 
    td.transaction_date,
    td.transaction_reference,
    td.transaction_type,
    td.amount,
    td.description,
    td.transaction_status,
    a.account_number
FROM transaction_details td
JOIN accounts a ON td.account_id = a.account_id
WHERE a.account_number = 'ACC-8849-1001'
  AND td.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY td.transaction_date DESC;

-- 1.3 Daily Cash Inflow vs Outflow Reconciliation
SELECT 
    DATE(transaction_date) AS txn_date,
    COUNT(*) AS total_transactions,
    SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END) AS total_credited,
    SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END) AS total_debited,
    SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE -amount END) AS net_flow
FROM transaction_details
WHERE transaction_status = 'SUCCESS'
GROUP BY DATE(transaction_date)
ORDER BY txn_date DESC;

-- 1.4 Identify Accounts Below Minimum Balance Threshold
SELECT 
    a.account_number,
    c.full_name,
    c.phone,
    a.balance,
    a.min_balance_threshold,
    (a.min_balance_threshold - a.balance) AS deficit_amount
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id
WHERE a.balance < a.min_balance_threshold
  AND a.status = 'ACTIVE';

-- 1.5 Update Account Lifecycle Status (e.g. Freeze Dormant Account)
-- Step A: Log status history
INSERT INTO account_status_history (account_id, old_status, new_status, changed_by, reason)
SELECT account_id, status, 'FROZEN', 'admin_sruth', 'Suspicious activity alert triggered'
FROM accounts
WHERE account_number = 'ACC-8849-1004';

-- Step B: Update account table
UPDATE accounts
SET status = 'FROZEN'
WHERE account_number = 'ACC-8849-1004';

-- ============================================================================
-- MODULE 2: LOAN MANAGEMENT, EMI & COLLECTIONS (MILESTONE 2)
-- ============================================================================

-- 2.1 Loan Portfolio Summary (Total Sanctioned vs Disbursed vs Outstanding)
SELECT 
    loan_type,
    COUNT(*) AS total_loans,
    SUM(principal_amount) AS total_sanctioned,
    SUM(disbursed_amount) AS total_disbursed,
    SUM(outstanding_principal) AS total_outstanding,
    ROUND(AVG(annual_interest_rate), 2) AS avg_interest_rate
FROM loans
GROUP BY loan_type
ORDER BY total_outstanding DESC;

-- 2.2 Active Loans with Customer Contact and Monthly EMI Obligations
SELECT 
    l.loan_number,
    c.full_name,
    c.phone,
    l.loan_type,
    l.principal_amount,
    l.annual_interest_rate,
    l.tenure_months,
    l.monthly_emi,
    l.outstanding_principal,
    l.auto_debit_enabled,
    l.loan_status
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id
WHERE l.loan_status = 'ACTIVE'
ORDER BY l.monthly_emi DESC;

-- 2.3 Amortization Repayment Schedule for a Specific Loan
SELECT 
    es.emi_number,
    es.due_date,
    es.opening_principal,
    es.emi_amount,
    es.principal_component,
    es.interest_component,
    es.closing_principal,
    es.paid_amount,
    es.remaining_amount,
    es.emi_status,
    es.payment_date
FROM emi_schedule es
JOIN loans l ON es.loan_id = l.loan_id
WHERE l.loan_number = 'HL-2024-1247'
ORDER BY es.emi_number ASC;

-- 2.4 Delinquent & Overdue Loan Accounts (Immediate Collections Follow-Up)
SELECT 
    l.loan_number,
    c.full_name AS borrower_name,
    c.phone AS borrower_phone,
    es.emi_number,
    es.due_date,
    es.emi_amount,
    CURRENT_DATE - es.due_date AS days_past_due,
    es.emi_status
FROM emi_schedule es
JOIN loans l ON es.loan_id = l.loan_id
JOIN customers c ON l.customer_id = c.customer_id
WHERE es.emi_status = 'OVERDUE'
   OR (es.emi_status = 'PENDING' AND es.due_date < CURRENT_DATE)
ORDER BY days_past_due DESC;

-- 2.5 Loan Collections Breakdown by Payment Method
SELECT 
    ec.payment_method,
    COUNT(*) AS collection_count,
    SUM(ec.payment_amount) AS total_collected,
    ROUND(AVG(ec.payment_amount), 2) AS avg_collection_amount
FROM emi_collections ec
WHERE ec.collection_status = 'SUCCESS'
GROUP BY ec.payment_method
ORDER BY total_collected DESC;

-- 2.6 Record a Loan Disbursement
INSERT INTO loan_disbursement (
    loan_id, account_id, disbursement_amount, disbursement_channel, 
    disbursement_status, reference_number, remarks
)
VALUES (
    1, 1, 500000.00, 'RTGS', 
    'SUCCESS', 'DISB-RTGS-2026-9901', 'Tranche 2 construction release'
);

-- ============================================================================
-- MODULE 3: INTERBANK SETTLEMENT & CLEARING (MILESTONE 3)
-- ============================================================================

-- 3.1 Settlement Batches Status and Netting Exposure
SELECT 
    batch_id,
    clearing_window,
    clearing_method,
    gross_volume,
    net_obligation,
    transaction_count,
    saga_status,
    status AS batch_status,
    settled_at
FROM settlement_batches
ORDER BY settled_at DESC;

-- 3.2 Individual Interbank Transactions in Pending Settlement
SELECT 
    s.settlement_id,
    s.batch_id,
    s.transaction_reference,
    s.settled_amount,
    s.status AS settlement_status,
    s.settled_at
FROM settlement s
WHERE s.status = 'PENDING'
ORDER BY s.settled_at ASC;

-- 3.3 Customer Notification Delivery Audit (Delivery Success Rate)
SELECT 
    channel,
    event_type,
    status,
    COUNT(*) AS notification_count
FROM notifications
GROUP BY channel, event_type, status
ORDER BY notification_count DESC;

-- 3.4 Unresolved Fraud Alerts
SELECT 
    fe.event_id,
    fe.transaction_reference,
    c.full_name AS customer_name,
    fe.fraud_score,
    fe.threat_level,
    fe.reason,
    fe.status,
    fe.created_at
FROM fraud_events fe
LEFT JOIN customers c ON fe.customer_id = c.customer_id
WHERE fe.status IN ('PENDING', 'INVESTIGATING')
ORDER BY fe.fraud_score DESC, fe.created_at DESC;

-- ============================================================================
-- MODULE 4: AI RISK, BIOMETRIC LIVENESS & SECURITY AUDIT (MILESTONE 4)
-- ============================================================================

-- 4.1 High-Risk Transactions Flagged by AI Risk Model (Risk Score >= 70)
SELECT 
    ra.assessment_id,
    ra.transaction_reference,
    c.full_name AS customer_name,
    ra.amount,
    ra.transaction_type,
    ra.location,
    ra.device_type,
    ra.international_transaction,
    ra.new_device,
    ra.risk_score,
    ra.risk_level,
    ra.decision,
    ra.reasons,
    ra.assessed_at
FROM risk_assessment ra
LEFT JOIN customers c ON ra.customer_id = c.customer_id
WHERE ra.risk_score >= 70
   OR ra.decision IN ('FLAG', 'REJECT', 'CHALLENGE')
ORDER BY ra.risk_score DESC, ra.assessed_at DESC;

-- 4.2 Biometric Liveness Verification Pass Rate and Latency
SELECT 
    status,
    verification_method,
    COUNT(*) AS total_verifications,
    ROUND(AVG(confidence_score), 2) AS avg_confidence_score,
    COUNT(CASE WHEN status = 'VERIFIED' THEN 1 END) AS verified_count,
    COUNT(CASE WHEN status = 'FAILED' THEN 1 END) AS failed_count
FROM liveness_verification
GROUP BY status, verification_method;

-- 4.3 Locked Customer Accounts due to Exceeded Passcode Attempts
SELECT 
    c.customer_id,
    c.full_name,
    c.email,
    c.phone,
    csc.failed_attempts,
    csc.is_locked,
    csc.last_verified_at,
    csc.updated_at
FROM customer_security_credentials csc
JOIN customers c ON csc.customer_id = c.customer_id
WHERE csc.is_locked = TRUE
   OR csc.failed_attempts >= 3;

-- 4.4 Centralized Security Audit Trail (Recent Admin / System Actions)
SELECT 
    audit_id,
    timestamp,
    username,
    action,
    module,
    entity,
    entity_id,
    status,
    ip,
    details
FROM audit_log
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY timestamp DESC;

-- 4.5 Geo-Velocity Anomaly Check (Multiple Transactions from Different Countries)
SELECT 
    ra.customer_id,
    c.full_name,
    COUNT(DISTINCT ra.location) AS distinct_locations_visited,
    COUNT(*) AS transaction_count,
    MAX(ra.assessed_at) - MIN(ra.assessed_at) AS time_span
FROM risk_assessment ra
JOIN customers c ON ra.customer_id = c.customer_id
WHERE ra.assessed_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY ra.customer_id, c.full_name
HAVING COUNT(DISTINCT ra.location) > 1
ORDER BY distinct_locations_visited DESC;

-- ============================================================================
-- SYSTEM HEALTH & CAPACITY REPORT
-- ============================================================================

-- Database Table Row Counts and Storage Sizing
SELECT 
    relname AS table_name,
    n_live_tup AS estimated_row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
