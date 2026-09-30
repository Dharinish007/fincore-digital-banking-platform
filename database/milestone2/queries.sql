-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - MILESTONE 2 QUERIES
-- =========================================================
USE fincore_db;

-- 1. Fetch upcoming and overdue repayments for a loan
SELECT r.installment_number, r.due_date, r.emi_amount, r.principal_component, r.interest_component, r.paid_amount, r.status, r.days_past_due
FROM repayment_schedules r
WHERE r.loan_id = 'LN-3001'
ORDER BY r.installment_number ASC;

-- 2. Aggregate Portfolio NPA Risk Report
SELECT 
    npa_status,
    sma_category,
    COUNT(*) as total_loans,
    SUM(outstanding_principal) as total_exposure,
    SUM(overdue_amount) as total_overdue,
    SUM(provision_amount) as total_provisions
FROM npa_records
GROUP BY npa_status, sma_category;

-- 3. Loans approved and ready for Disbursement Saga execution
SELECT l.id, l.loan_number, l.customer_id, c.full_name, c.kyc_status, l.account_id, a.account_number, a.balance, l.principal_amount, l.interest_rate, l.tenure_months
FROM loans l
JOIN customers c ON l.customer_id = c.id
JOIN accounts a ON l.account_id = a.id
WHERE l.status = 'APPROVED' AND c.kyc_status = 'VERIFIED';
