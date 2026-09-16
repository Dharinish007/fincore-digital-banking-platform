USE digital_banking;

-- ===========================================
-- 1. CHECK PREVIOUS LOANS
-- ===========================================

SELECT
    lh.history_id,
    lh.customer_id,
    lh.loan_type,
    lh.loan_amount,
    lh.outstanding_amount,
    lh.loan_status,
    lh.start_date,
    lh.end_date
FROM loan_history lh
WHERE lh.customer_id = 1;


-- ===========================================
-- 2. CHECK ACTIVE / EXISTING LOANS
-- ===========================================

SELECT
    customer_id,
    COUNT(*) AS active_loan_count
FROM loan_history
WHERE customer_id = 1
AND loan_status = 'Active'
GROUP BY customer_id;


-- ===========================================
-- 3. CHECK CREDIT DETAILS
-- ===========================================

SELECT
    cc.credit_check_id,
    cc.loan_id,
    cc.credit_score,
    cc.monthly_income,
    cc.existing_loan_count,
    cc.previous_loan_status,
    cc.credit_status,
    cc.remarks
FROM credit_check cc
WHERE cc.loan_id = 1;


-- ===========================================
-- 4. CUSTOMER CREDIT VALIDATION
-- ===========================================

SELECT
    c.customer_id,
    c.full_name,
    cc.loan_id,
    cc.credit_score,
    cc.monthly_income,
    cc.existing_loan_count,
    cc.previous_loan_status,
    cc.credit_status,
    cc.remarks
FROM customer c
JOIN loan_application la
    ON c.customer_id = la.customer_id
JOIN credit_check cc
    ON la.loan_id = cc.loan_id
WHERE la.loan_id = 1;


-- ===========================================
-- 5. CHECK WHETHER CUSTOMER HAS PREVIOUS LOAN
-- ===========================================

SELECT
    c.customer_id,
    c.full_name,
    CASE
        WHEN COUNT(lh.history_id) > 0
        THEN 'Yes'
        ELSE 'No'
    END AS has_previous_loan
FROM customer c
LEFT JOIN loan_history lh
    ON c.customer_id = lh.customer_id
WHERE c.customer_id = 1
GROUP BY c.customer_id, c.full_name;