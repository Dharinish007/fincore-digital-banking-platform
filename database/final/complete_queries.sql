-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - COMPLETE FINAL QUERIES
-- =========================================================
USE fincore_db;

-- 1. Complete End-to-End Customer 360 View
SELECT 
    c.id as customer_id,
    c.customer_code,
    c.full_name,
    c.kyc_status,
    c.risk_level,
    COUNT(DISTINCT a.id) as total_accounts,
    COALESCE(SUM(a.balance), 0) as total_deposit_balance,
    COUNT(DISTINCT l.id) as total_loans,
    COALESCE(SUM(l.outstanding_principal), 0) as total_loan_exposure,
    COALESCE(n.npa_status, 'STANDARD') as asset_quality
FROM customers c
LEFT JOIN accounts a ON c.id = a.customer_id
LEFT JOIN loans l ON c.id = l.customer_id
LEFT JOIN npa_records n ON l.id = n.loan_id
GROUP BY c.id, c.customer_code, c.full_name, c.kyc_status, c.risk_level, n.npa_status;

-- 2. Audit Trail of Transactions with Saga & Settlement Correlation
SELECT 
    t.id as transaction_id,
    t.transaction_reference,
    t.customer_name,
    t.amount,
    t.type,
    t.status as txn_status,
    s.id as saga_id,
    s.status as saga_status,
    st.id as settlement_id,
    st.bank_reference,
    st.status as settlement_status,
    t.created_at
FROM transactions t
LEFT JOIN saga_instances s ON t.saga_id = s.id
LEFT JOIN settlements st ON t.settlement_id = st.id
ORDER BY t.created_at DESC;

-- 3. Executive Banking Operations Dashboard KPI Aggregator
SELECT 
    (SELECT COUNT(*) FROM customers) as total_customers,
    (SELECT COUNT(*) FROM accounts) as total_accounts,
    (SELECT SUM(balance) FROM accounts) as total_deposits_inr,
    (SELECT COUNT(*) FROM loans WHERE status = 'DISBURSED') as active_loans_count,
    (SELECT SUM(outstanding_principal) FROM loans WHERE status = 'DISBURSED') as total_credit_book_inr,
    (SELECT COUNT(*) FROM kyc_records WHERE verification_status = 'UNDER_REVIEW') as pending_kyc_reviews,
    (SELECT COUNT(*) FROM saga_instances WHERE status = 'COMPENSATED') as compensated_sagas,
    (SELECT COUNT(*) FROM npa_records WHERE npa_status = 'NPA') as npa_accounts_count;
