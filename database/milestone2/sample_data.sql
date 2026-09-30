-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - MILESTONE 2 SAMPLE DATA
-- =========================================================
USE fincore_db;

INSERT INTO accounts (id, account_number, customer_id, customer_name, account_type, balance, currency, status) VALUES
('ACC-8001', '109844200192', 'CUST-1001', 'Rohan Sharma', 'SAVINGS', 485000.00, 'INR', 'ACTIVE'),
('ACC-8002', '109844200588', 'CUST-1001', 'Rohan Sharma', 'CURRENT', 1250000.00, 'INR', 'ACTIVE'),
('ACC-8003', '109844200841', 'CUST-1002', 'Priya Patel', 'SAVINGS', 185000.00, 'INR', 'ACTIVE'),
('ACC-8005', '109844201994', 'CUST-1004', 'Vikram Singh', 'CURRENT', 34000.00, 'INR', 'ACTIVE');

INSERT INTO loans (id, loan_number, customer_id, customer_name, account_id, loan_type, principal_amount, interest_rate, tenure_months, emi_amount, total_payable, paid_amount, outstanding_principal, status, applied_date, approved_date, disbursed_date, approved_by) VALUES
('LN-3001', 'LN-MUM-2025-081', 'CUST-1001', 'Rohan Sharma', 'ACC-8001', 'PERSONAL_LOAN', 500000.00, 10.50, 24, 23190.00, 556560.00, 139140.00, 382400.00, 'DISBURSED', '2025-03-02 10:00:00', '2025-03-03 11:30:00', '2025-03-03 12:00:00', 'supervisor'),
('LN-3002', 'LN-BLR-2025-104', 'CUST-1002', 'Priya Patel', 'ACC-8003', 'HOME_LOAN', 3500000.00, 8.40, 120, 43220.00, 5186400.00, 0.00, 3500000.00, 'APPROVED', '2025-03-12 14:00:00', '2025-03-14 16:00:00', NULL, 'supervisor'),
('LN-3003', 'LN-JPR-2024-402', 'CUST-1004', 'Vikram Singh', 'ACC-8005', 'BUSINESS_LOAN', 1200000.00, 12.00, 36, 39860.00, 1434960.00, 119580.00, 1110000.00, 'DISBURSED', '2024-11-15 11:00:00', '2024-11-16 14:00:00', '2024-11-16 15:30:00', 'supervisor');

INSERT INTO repayment_schedules (id, loan_id, customer_id, customer_name, installment_number, due_date, emi_amount, principal_component, interest_component, paid_amount, paid_date, overdue_amount, days_past_due, status) VALUES
('REP-7001', 'LN-3001', 'CUST-1001', 'Rohan Sharma', 1, '2025-04-03', 23190.00, 18815.00, 4375.00, 23190.00, '2025-04-02 11:00:00', 0.00, 0, 'PAID'),
('REP-7002', 'LN-3001', 'CUST-1001', 'Rohan Sharma', 2, '2025-05-03', 23190.00, 18980.00, 4210.00, 23190.00, '2025-05-03 14:20:00', 0.00, 0, 'PAID'),
('REP-7104', 'LN-3003', 'CUST-1004', 'Vikram Singh', 4, '2025-03-16', 39860.00, 28704.00, 11156.00, 0.00, NULL, 39860.00, 161, 'OVERDUE');

INSERT INTO npa_records (id, loan_id, loan_number, customer_id, customer_name, outstanding_principal, overdue_amount, days_past_due, last_payment_date, npa_status, sma_category, classification_date, provision_percentage, provision_amount, remarks) VALUES
('NPA-9001', 'LN-3003', 'LN-JPR-2024-402', 'CUST-1004', 'Vikram Singh', 1110000.00, 119580.00, 161, '2025-02-20 10:00:00', 'NPA', 'NONE', '2025-06-15 00:00:00', 15.00, 166500.00, 'Defaulted on 3 consecutive installments (>90 days DPD). Recovery notice dispatched.'),
('NPA-9002', 'LN-3001', 'LN-MUM-2025-081', 'CUST-1001', 'Rohan Sharma', 382400.00, 0.00, 0, '2025-09-03 15:00:00', 'STANDARD', 'NONE', '2025-09-03 15:00:00', 0.40, 1529.60, 'Standard performing asset with regular EMI history.');
