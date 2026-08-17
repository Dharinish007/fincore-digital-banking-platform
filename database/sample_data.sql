-- Sample data for Bank Loan Management System
USE bank_loan_management;

INSERT INTO customers
(name, email, phone, address, date_of_birth, customer_status)
VALUES
('Amit Patil', 'amit.patil@example.com', '9876543210',
 'Kopargaon, Maharashtra', '1998-05-12', 'ACTIVE'),
('Sneha Joshi', 'sneha.joshi@example.com', '9876543211',
 'Nashik, Maharashtra', '1997-09-21', 'ACTIVE'),
('Rahul Shinde', 'rahul.shinde@example.com', '9876543212',
 'Pune, Maharashtra', '1995-02-15', 'ACTIVE');

INSERT INTO accounts
(customer_id, account_number, account_type, balance, account_status)
VALUES
(1, 'ACC100001', 'SAVINGS', 125000.00, 'ACTIVE'),
(1, 'ACC100002', 'CURRENT', 75000.00, 'ACTIVE'),
(2, 'ACC100003', 'SAVINGS', 210000.00, 'ACTIVE'),
(3, 'ACC100004', 'SAVINGS', 90000.00, 'ACTIVE');

INSERT INTO loans
(customer_id, loan_type, principal_amount, interest_rate, tenure_months,
 loan_status, loan_start_date, maturity_date)
VALUES
(1, 'HOME LOAN', 1500000.00, 8.50, 120,
 'ACTIVE', '2026-01-10', '2036-01-10'),
(2, 'PERSONAL LOAN', 300000.00, 11.50, 36,
 'ACTIVE', '2026-02-15', '2029-02-15'),
(3, 'VEHICLE LOAN', 600000.00, 9.25, 60,
 'PENDING', NULL, NULL);

INSERT INTO repayments
(loan_id, installment_number, due_date, amount_due, amount_paid,
 payment_date, payment_status, remaining_amount)
VALUES
(1, 1, '2026-02-10', 18500.00, 18500.00,
 '2026-02-09', 'PAID', 0.00),
(1, 2, '2026-03-10', 18500.00, 18500.00,
 '2026-03-10', 'PAID', 0.00),
(1, 3, '2026-04-10', 18500.00, 10000.00,
 '2026-04-10', 'PARTIAL', 8500.00),
(2, 1, '2026-03-15', 9900.00, 9900.00,
 '2026-03-14', 'PAID', 0.00),
(2, 2, '2026-04-15', 9900.00, 0.00,
 NULL, 'PENDING', 9900.00);

INSERT INTO disbursements
(loan_id, amount, disbursement_date, status, transaction_reference,
 current_step, failure_reason)
VALUES
(1, 750000.00, '2026-01-12', 'COMPLETED',
 'DISB-2026-0001', 'ACCOUNT_CREDITED', NULL),
(2, 300000.00, '2026-02-17', 'COMPLETED',
 'DISB-2026-0002', 'ACCOUNT_CREDITED', NULL);

INSERT INTO disbursement_steps
(disbursement_id, step_name, step_status, started_at, completed_at, error_message)
VALUES
(1, 'DOCUMENT_VERIFICATION', 'COMPLETED',
 '2026-01-11 09:00:00', '2026-01-11 10:00:00', NULL),
(1, 'LOAN_APPROVAL', 'COMPLETED',
 '2026-01-11 10:30:00', '2026-01-11 12:00:00', NULL),
(1, 'ACCOUNT_CREDITED', 'COMPLETED',
 '2026-01-12 09:00:00', '2026-01-12 09:30:00', NULL),
(2, 'DOCUMENT_VERIFICATION', 'COMPLETED',
 '2026-02-16 09:00:00', '2026-02-16 10:00:00', NULL),
(2, 'LOAN_APPROVAL', 'COMPLETED',
 '2026-02-16 11:00:00', '2026-02-16 12:00:00', NULL),
(2, 'ACCOUNT_CREDITED', 'COMPLETED',
 '2026-02-17 09:00:00', '2026-02-17 09:30:00', NULL);

INSERT INTO npa_classifications
(loan_id, overdue_days, outstanding_amount, classification,
 classification_date, reason, status)
VALUES
(1, 0, 1490000.00, 'STANDARD',
 '2026-04-10', 'Regular repayment', 'ACTIVE'),
(2, 15, 285000.00, 'SMA-1',
 '2026-04-15', 'Installment overdue', 'ACTIVE');

INSERT INTO transactions
(account_id, loan_id, transaction_type, amount, transaction_date,
 reference_number, status)
VALUES
(1, 1, 'LOAN_DISBURSEMENT', 750000.00,
 '2026-01-12 09:30:00', 'TXN100001', 'SUCCESS'),
(3, 2, 'LOAN_DISBURSEMENT', 300000.00,
 '2026-02-17 09:30:00', 'TXN100002', 'SUCCESS'),
(1, 1, 'LOAN_REPAYMENT', 18500.00,
 '2026-02-09 14:20:00', 'TXN100003', 'SUCCESS'),
(1, 1, 'LOAN_REPAYMENT', 18500.00,
 '2026-03-10 11:15:00', 'TXN100004', 'SUCCESS'),
(3, 2, 'LOAN_REPAYMENT', 9900.00,
 '2026-03-14 15:00:00', 'TXN100005', 'SUCCESS');
