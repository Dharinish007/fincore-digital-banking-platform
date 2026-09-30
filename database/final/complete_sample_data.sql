-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - COMPLETE SAMPLE DATA
-- =========================================================
USE fincore_db;

INSERT INTO roles (id, name, description) VALUES
('ROLE-01', 'ADMIN', 'Super administrative privileges across all modules and audit tracking'),
('ROLE-02', 'SUPERVISOR', 'KYC review, loan sanctions, settlement verification and retry authorization'),
('ROLE-03', 'TELLER', 'Customer onboarding, KYC document submission, payment initiation'),
('ROLE-04', 'CUSTOMER', 'Personal banking, account statements, loan repayment viewing'),
('ROLE-05', 'AUDITOR', 'Regulatory compliance, audit trail inspection, tamper-evident verification');

INSERT INTO users (id, username, password_hash, full_name, email, role, status, last_login) VALUES
('USR-001', 'admin', '$2a$12$e8Y7iWz1lA1G/hK8bQ3.Je7jX41yUv89zP2k5Wq7N3Lm', 'Rajesh Nair', 'admin.rajesh@fincore.bank', 'ADMIN', 'ACTIVE', '2026-08-24 18:30:00'),
('USR-002', 'supervisor', '$2a$12$m7K2vU8aF9H/xL3nO5.Te9kY52zVw90aQ3l6Xr8O4Mn', 'Sunita Mehra', 'supervisor.sunita@fincore.bank', 'SUPERVISOR', 'ACTIVE', '2026-08-24 19:15:00'),
('USR-003', 'teller', '$2a$12$q9X4wZ5bJ2N/yP6rS7.Uf0lZ63aWx01bR4m7Ys9P5No', 'Karan Deshmukh', 'teller.karan@fincore.bank', 'TELLER', 'ACTIVE', '2026-08-24 20:45:00'),
('USR-004', 'rohan.customer', '$2a$12$p1M3vB7cR8L/kQ9wE2.Vh2mA74bXy12cT5n8Zt0Q6Op', 'Rohan Sharma', 'rohan.sharma@gmail.com', 'CUSTOMER', 'ACTIVE', '2026-08-24 21:10:00'),
('USR-006', 'auditor', '$2a$12$v9X2wB1cR4L/kQ8wE3.Vh7mA84bXy23cT6n9Zt1Q7Op', 'Dr. Vikram Chandra', 'auditor.vikram@fincore.bank', 'AUDITOR', 'ACTIVE', '2026-08-24 17:00:00');

INSERT INTO customers (id, customer_code, full_name, email, phone, address, kyc_status, risk_level) VALUES
('CUST-1001', 'FC-CUST-1001', 'Rohan Sharma', 'rohan.sharma@gmail.com', '+91 98201 44521', 'Flat 402, Lotus Heights, Powai, Mumbai - 400076', 'VERIFIED', 'LOW'),
('CUST-1002', 'FC-CUST-1002', 'Priya Patel', 'priya.patel@outlook.com', '+91 98765 12340', 'B-12, Green Glen Layout, Bellandur, Bengaluru - 560103', 'UNDER_REVIEW', 'MEDIUM'),
('CUST-1003', 'FC-CUST-1003', 'Amit Verma', 'amit.verma@techcorp.in', '+91 97110 88990', '74, Cyber City Phase 2, Gurugram, Haryana - 122002', 'PENDING', 'HIGH'),
('CUST-1004', 'FC-CUST-1004', 'Vikram Singh', 'vikram.singh@automotors.com', '+91 94140 33211', 'Plot 18, MI Road, Jaipur, Rajasthan - 302001', 'VERIFIED', 'HIGH');

INSERT INTO kyc_records (id, customer_id, full_name, date_of_birth, phone, email, address, document_type, document_number, verification_status, risk_level, submitted_by, verified_by, remarks) VALUES
('KYC-5001', 'CUST-1001', 'Rohan Sharma', '1990-06-15', '+91 98201 44521', 'rohan.sharma@gmail.com', 'Flat 402, Lotus Heights, Powai, Mumbai - 400076', 'PAN', 'ABCPS1234F', 'VERIFIED', 'LOW', 'teller', 'supervisor', 'All Aadhaar & PAN details verified successfully against NSDL database.'),
('KYC-5002', 'CUST-1002', 'Priya Patel', '1994-09-22', '+91 98765 12340', 'priya.patel@outlook.com', 'B-12, Green Glen Layout, Bellandur, Bengaluru - 560103', 'PASSPORT', 'Z8942104', 'UNDER_REVIEW', 'MEDIUM', 'teller', NULL, 'Pending signature verification and utility bill address matching.'),
('KYC-5003', 'CUST-1003', 'Amit Verma', '1988-12-04', '+91 97110 88990', 'amit.verma@techcorp.in', '74, Cyber City Phase 2, Gurugram, Haryana - 122002', 'AADHAAR', '5482 9104 2234', 'PENDING', 'HIGH', 'teller', NULL, 'Newly uploaded document, needs OTP verification.');

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

INSERT INTO transactions (id, transaction_reference, source_account_id, destination_account_id, customer_id, customer_name, amount, currency, type, status, description, saga_id, settlement_id) VALUES
('TXN-10001', 'TXN-FC-20250303-0982', 'ACC-SYSTEM-POOL', 'ACC-8001', 'CUST-1001', 'Rohan Sharma', 500000.00, 'INR', 'LOAN_DISBURSEMENT', 'SUCCESS', 'Loan Disbursement for LN-MUM-2025-081', 'SAGA-DISB-001', 'SETTL-8801'),
('TXN-10002', 'TXN-FC-20250903-4412', 'ACC-8001', 'ACC-SYSTEM-LOAN', 'CUST-1001', 'Rohan Sharma', 23190.00, 'INR', 'LOAN_REPAYMENT', 'SUCCESS', 'EMI Repayment Installment #6 for LN-MUM-2025-081', 'SAGA-REP-006', 'SETTL-8802');

INSERT INTO saga_instances (id, saga_type, transaction_id, customer_id, customer_name, loan_id, account_id, amount, currency, current_step, total_steps, status, retry_count, max_retries, idempotency_key) VALUES
('SAGA-DISB-001', 'DISBURSEMENT', 'TXN-10001', 'CUST-1001', 'Rohan Sharma', 'LN-3001', 'ACC-8001', 500000.00, 'INR', 6, 6, 'COMPLETED', 0, 3, 'IDEMP-DISB-LN3001-20250303');

INSERT INTO settlements (id, settlement_reference, transaction_id, saga_id, customer_id, customer_name, amount, currency, settlement_type, bank_reference, clearing_house, status) VALUES
('SETTL-8801', 'STL-FC-20250303-0192', 'TXN-10001', 'SAGA-DISB-001', 'CUST-1001', 'Rohan Sharma', 500000.00, 'INR', 'INTERNAL_CLEARING', 'FC-INT-DISB-880199', 'FinCore Core Ledger Settlement', 'SUCCESS');

INSERT INTO notifications (id, customer_id, type, title, message, channel, status, is_read) VALUES
('NOTIF-001', 'CUST-1001', 'KYC_APPROVED', 'KYC Document Verification Approved', 'Your KYC records have been verified by Supervisor Sunita Mehra.', 'IN_APP', 'DELIVERED', TRUE),
('NOTIF-002', 'CUST-1001', 'LOAN_DISBURSED', 'Loan Disbursed: ₹5,00,000 Credited', 'Personal Loan LN-MUM-2025-081 has been disbursed via Saga Orchestrator.', 'SMS', 'SENT', TRUE);

INSERT INTO audit_logs (id, user, role, action, module, entity, entity_id, old_value, new_value, ip_address, status, details) VALUES
('AUD-001', 'teller', 'TELLER', 'LOGIN', 'CORE', 'USER', 'USR-003', NULL, NULL, '192.168.10.45', 'SUCCESS', 'Teller Karan Deshmukh signed in successfully.'),
('AUD-002', 'supervisor', 'SUPERVISOR', 'KYC_APPROVED', 'MILESTONE_1_KYC_RBAC', 'KYC_RECORD', 'KYC-5001', 'UNDER_REVIEW', 'VERIFIED', '192.168.10.12', 'SUCCESS', 'KYC approved for customer Rohan Sharma with Low Risk rating.');
