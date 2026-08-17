-- Common queries for Bank Loan Management System
USE bank_loan_management;

-- 1. View all customers
SELECT * FROM customers;

-- 2. View customers with their loans
SELECT
    c.customer_id,
    c.name,
    l.loan_id,
    l.loan_type,
    l.principal_amount,
    l.interest_rate,
    l.loan_status
FROM customers c
JOIN loans l ON c.customer_id = l.customer_id
ORDER BY c.customer_id, l.loan_id;

-- 3. View loans with customer details
SELECT
    l.loan_id,
    c.name AS customer_name,
    l.loan_type,
    l.principal_amount,
    l.interest_rate,
    l.tenure_months,
    l.loan_status,
    l.loan_start_date,
    l.maturity_date
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id;

-- 4. View repayment schedule for a loan
SELECT
    repayment_id,
    loan_id,
    installment_number,
    due_date,
    amount_due,
    amount_paid,
    payment_date,
    payment_status,
    remaining_amount
FROM repayments
WHERE loan_id = 1
ORDER BY installment_number;

-- 5. Find pending/overdue repayments
SELECT
    r.repayment_id,
    r.loan_id,
    c.name AS customer_name,
    r.installment_number,
    r.due_date,
    r.amount_due,
    r.amount_paid,
    r.remaining_amount,
    r.payment_status
FROM repayments r
JOIN loans l ON r.loan_id = l.loan_id
JOIN customers c ON l.customer_id = c.customer_id
WHERE r.payment_status <> 'PAID';

-- 6. View loan disbursements
SELECT
    d.disbursement_id,
    d.loan_id,
    c.name AS customer_name,
    d.amount,
    d.disbursement_date,
    d.status,
    d.transaction_reference,
    d.current_step,
    d.failure_reason
FROM disbursements d
JOIN loans l ON d.loan_id = l.loan_id
JOIN customers c ON l.customer_id = c.customer_id;

-- 7. View disbursement steps
SELECT
    ds.step_id,
    ds.disbursement_id,
    ds.step_name,
    ds.step_status,
    ds.started_at,
    ds.completed_at,
    ds.error_message
FROM disbursement_steps ds
WHERE ds.disbursement_id = 1
ORDER BY ds.step_id;

-- 8. View NPA classification for loans
SELECT
    n.npa_id,
    n.loan_id,
    c.name AS customer_name,
    n.overdue_days,
    n.outstanding_amount,
    n.classification,
    n.classification_date,
    n.reason,
    n.status
FROM npa_classifications n
JOIN loans l ON n.loan_id = l.loan_id
JOIN customers c ON l.customer_id = c.customer_id;

-- 9. View customer accounts
SELECT
    a.account_id,
    a.account_number,
    c.name AS customer_name,
    a.account_type,
    a.balance,
    a.account_status
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id;

-- 10. View transactions with account and customer
SELECT
    t.transaction_id,
    t.reference_number,
    c.name AS customer_name,
    a.account_number,
    t.loan_id,
    t.transaction_type,
    t.amount,
    t.transaction_date,
    t.status
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN customers c ON a.customer_id = c.customer_id
ORDER BY t.transaction_date DESC;

-- 11. View transactions related to a particular loan
SELECT *
FROM transactions
WHERE loan_id = 1
ORDER BY transaction_date;

-- 12. Count loans by status
SELECT loan_status, COUNT(*) AS total_loans
FROM loans
GROUP BY loan_status;

-- 13. Total principal amount by loan type
SELECT
    loan_type,
    COUNT(*) AS number_of_loans,
    SUM(principal_amount) AS total_principal
FROM loans
GROUP BY loan_type;

-- 14. Customers having more than one account
SELECT
    c.customer_id,
    c.name,
    COUNT(a.account_id) AS account_count
FROM customers c
JOIN accounts a ON c.customer_id = a.customer_id
GROUP BY c.customer_id, c.name
HAVING COUNT(a.account_id) > 1;

-- 15. Loans currently classified as NPA/SMA
SELECT
    l.loan_id,
    c.name AS customer_name,
    n.classification,
    n.overdue_days,
    n.outstanding_amount,
    n.classification_date
FROM npa_classifications n
JOIN loans l ON n.loan_id = l.loan_id
JOIN customers c ON l.customer_id = c.customer_id
WHERE n.classification <> 'STANDARD';

-- 16. Total amount repaid for each loan
SELECT
    loan_id,
    SUM(amount_paid) AS total_paid
FROM repayments
GROUP BY loan_id;

-- 17. Outstanding repayment amount for each loan
SELECT
    loan_id,
    SUM(remaining_amount) AS total_remaining
FROM repayments
GROUP BY loan_id;
