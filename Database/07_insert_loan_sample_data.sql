USE digital_banking;

-- ===========================================
-- LOAN APPLICATION SAMPLE DATA
-- ===========================================

INSERT INTO loan_application
(customer_id, loan_type, loan_amount, tenure_months,
 interest_rate, purpose, application_status)
VALUES
(1, 'Personal', 200000.00, 24, 10.50,
 'Personal Expenses', 'Pending'),

(2, 'Home', 1500000.00, 120, 8.50,
 'Home Purchase', 'Approved');


-- ===========================================
-- PREVIOUS LOAN HISTORY
-- ===========================================

INSERT INTO loan_history
(customer_id, loan_id, loan_type, loan_amount,
 outstanding_amount, loan_status, start_date, end_date)
VALUES
(1, NULL, 'Vehicle', 500000.00,
 0.00, 'Closed', '2021-01-15', '2024-01-15'),

(2, NULL, 'Personal', 250000.00,
 50000.00, 'Active', '2024-06-10', NULL);


-- ===========================================
-- CREDIT CHECK SAMPLE DATA
-- ===========================================

INSERT INTO credit_check
(loan_id, credit_score, monthly_income,
 existing_loan_count, previous_loan_status,
 credit_status, remarks)
VALUES
(1, 750, 50000.00, 0, 'Yes',
 'Pass', 'Good credit history'),

(2, 780, 85000.00, 1, 'Yes',
 'Pass', 'Strong credit profile');