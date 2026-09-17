-- ==========================================================
-- FINCORE NEXUS - SAMPLE SEED DATA
-- ==========================================================

INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Super administrative authority over entire platform'),
(2, 'ROLE_SUPERVISOR', 'Credit committee, compliance review, and risk management authority'),
(3, 'ROLE_TELLER', 'Branch teller operations, customer access, kyc submission, repayments'),
(4, 'ROLE_AUDITOR', 'Independent audit inspection, SHA-256 chain verification, tamper alert resolution'),
(5, 'ROLE_CUSTOMER', 'Individual retail banking client access');

-- Passwords are encrypted with BCrypt (password123 -> $2a$10$wV3q...)
INSERT INTO users (id, username, password_hash, full_name, email, department, is_active) VALUES
('USR-001', 'admin', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'Alexander Vance', 'admin@fincore-nexus.bank', 'Executive Management', TRUE),
('USR-002', 'supervisor', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'Elena Rostova', 'elena.r@fincore-nexus.bank', 'Credit & Risk Operations', TRUE),
('USR-003', 'teller', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'Marcus Brody', 'marcus.b@fincore-nexus.bank', 'Retail Branch Operations', TRUE),
('USR-004', 'auditor', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'David Chen', 'david.c@fincore-nexus.bank', 'Internal Governance & Compliance', TRUE),
('USR-005', 'customer', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.qFxGQhpUCZXxW', 'Sarah Jenkins', 'sarah.jenkins@email.com', 'Retail Banking Client', TRUE);

INSERT INTO user_roles (user_id, role_id) VALUES
('USR-001', 1),
('USR-002', 2),
('USR-003', 3),
('USR-004', 4),
('USR-005', 5);

INSERT INTO customers (id, first_name, last_name, email, phone_number, account_number, account_type, account_balance, status, kyc_status, risk_score, risk_level, pep_status, sanctions_status, joined_date) VALUES
('CUST-1001', 'Sarah', 'Jenkins', 'sarah.jenkins@email.com', '+1 (555) 234-5678', 'FC-8820-9104-3312', 'Premium Savings', 48520.50, 'ACTIVE', 'VERIFIED', 24, 'LOW', 'NO', 'CLEAR', '2023-04-12'),
('CUST-1002', 'Robert', 'Vance', 'robert.vance@techcorp.io', '+1 (555) 876-5432', 'FC-4491-0021-8874', 'Corporate Checking', 312890.00, 'ACTIVE', 'VERIFIED', 42, 'MEDIUM', 'NO', 'CLEAR', '2022-11-05'),
('CUST-1003', 'Vikram', 'Patel', 'v.patel@globalexport.biz', '+1 (555) 901-2345', 'FC-6632-1145-9920', 'Commercial Trade Account', 125400.75, 'UNDER_REVIEW', 'PENDING', 82, 'HIGH', 'YES', 'FLAGGED', '2024-01-18'),
('CUST-1004', 'Helena', 'Thorne', 'h.thorne@apexholdings.org', '+1 (555) 432-1098', 'FC-1188-7729-4401', 'Wealth Management Trust', 950000.00, 'ACTIVE', 'VERIFIED', 68, 'MEDIUM', 'NO', 'CLEAR', '2021-08-30'),
('CUST-1005', 'Liam', 'O''Connor', 'liam.oc@construction.ie', '+1 (555) 654-7890', 'FC-9930-4412-5567', 'Standard Business', 18450.20, 'RESTRICTED', 'REJECTED', 88, 'HIGH', 'NO', 'CLEAR', '2024-05-10');

INSERT INTO kyc_records (id, customer_id, document_type, document_number, issuing_authority, issue_date, expiry_date, status, reviewed_by, reviewed_at, notes) VALUES
('KYC-501', 'CUST-1001', 'Passport', 'USA-99824102', 'Department of State', '2022-01-15', '2032-01-15', 'VERIFIED', 'Elena Rostova', '2026-08-11 09:15:00', 'Identity verified with biometrics and proof of address.'),
('KYC-502', 'CUST-1002', 'National ID Card', 'NID-77209144', 'National Identity Registry', '2020-06-10', '2030-06-10', 'VERIFIED', 'Marcus Brody', '2026-08-16 10:00:00', 'Corporate authorization documents and National ID certified.'),
('KYC-503', 'CUST-1003', 'International Passport', 'IND-Z8819203', 'Consular Affairs', '2021-03-20', '2031-03-20', 'PENDING', NULL, NULL, 'Awaiting PEP clearance declaration and source-of-wealth documentation.'),
('KYC-504', 'CUST-1005', 'Driving License', 'DL-88391203', 'Motor Transport Bureau', '2019-09-01', '2024-09-01', 'REJECTED', 'Elena Rostova', '2026-08-26 14:30:00', 'Document expired prior to application. Resubmission required.');

INSERT INTO loans (id, customer_id, loan_type, principal_amount, outstanding_amount, interest_rate, tenor_months, emi_amount, total_installments, paid_installments, pending_installments, overdue_installments, overdue_amount, dpd, payment_status, npa_classification, disbursement_date, next_due_date) VALUES
('LN-8001', 'CUST-1001', 'Home Mortgage', 250000.00, 218450.00, 6.25, 180, 2145.00, 180, 24, 156, 0, 0.00, 0, 'CURRENT', 'STANDARD', '2024-08-01', '2026-09-15'),
('LN-8002', 'CUST-1002', 'Commercial Term Loan', 500000.00, 412000.00, 7.50, 60, 10018.00, 60, 12, 47, 1, 10018.00, 14, 'PARTIAL_PENDING', 'SMA-0', '2025-08-15', '2026-09-10'),
('LN-8003', 'CUST-1003', 'Trade Working Capital', 150000.00, 145000.00, 9.20, 36, 4785.00, 36, 3, 31, 2, 9570.00, 48, 'OVERDUE', 'SMA-1', '2026-02-01', '2026-09-01'),
('LN-8004', 'CUST-1004', 'Secured Asset Backed', 380000.00, 330000.00, 5.80, 84, 5512.00, 84, 18, 63, 3, 16536.00, 76, 'CRITICAL_OVERDUE', 'SMA-2', '2025-01-10', '2026-08-20'),
('LN-8005', 'CUST-1005', 'Equipment Finance', 85000.00, 79200.00, 10.50, 48, 2174.00, 48, 4, 40, 4, 8696.00, 112, 'DEFAULTED', 'NPA', '2025-09-15', '2026-08-01');
