-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - MILESTONE 1 SAMPLE DATA
-- =========================================================
USE fincore_db;

INSERT INTO roles (id, name, description) VALUES
('ROLE-01', 'ADMIN', 'Super administrative privileges across all modules and audit tracking'),
('ROLE-02', 'SUPERVISOR', 'KYC review, loan sanctions, settlement verification and retry authorization'),
('ROLE-03', 'TELLER', 'Customer onboarding, KYC document submission, payment initiation'),
('ROLE-04', 'CUSTOMER', 'Personal banking, account statements, loan repayment viewing');

INSERT INTO users (id, username, password_hash, full_name, email, role, status, last_login) VALUES
('USR-001', 'admin', '$2a$12$e8Y7iWz1lA1G/hK8bQ...', 'Rajesh Nair', 'admin.rajesh@fincore.bank', 'ADMIN', 'ACTIVE', '2026-08-24 18:30:00'),
('USR-002', 'supervisor', '$2a$12$m7K2vU8aF9H/xL3nO...', 'Sunita Mehra', 'supervisor.sunita@fincore.bank', 'SUPERVISOR', 'ACTIVE', '2026-08-24 19:15:00'),
('USR-003', 'teller', '$2a$12$q9X4wZ5bJ2N/yP6rS...', 'Karan Deshmukh', 'teller.karan@fincore.bank', 'TELLER', 'ACTIVE', '2026-08-24 20:45:00'),
('USR-004', 'rohan.customer', '$2a$12$p1M3vB7cR8L/kQ9wE...', 'Rohan Sharma', 'rohan.sharma@gmail.com', 'CUSTOMER', 'ACTIVE', '2026-08-24 21:10:00');

INSERT INTO customers (id, customer_code, full_name, email, phone, address, kyc_status, risk_level) VALUES
('CUST-1001', 'FC-CUST-1001', 'Rohan Sharma', 'rohan.sharma@gmail.com', '+91 98201 44521', 'Flat 402, Lotus Heights, Powai, Mumbai - 400076', 'VERIFIED', 'LOW'),
('CUST-1002', 'FC-CUST-1002', 'Priya Patel', 'priya.patel@outlook.com', '+91 98765 12340', 'B-12, Green Glen Layout, Bellandur, Bengaluru - 560103', 'UNDER_REVIEW', 'MEDIUM'),
('CUST-1003', 'FC-CUST-1003', 'Amit Verma', 'amit.verma@techcorp.in', '+91 97110 88990', '74, Cyber City Phase 2, Gurugram, Haryana - 122002', 'PENDING', 'HIGH');

INSERT INTO kyc_records (id, customer_id, full_name, date_of_birth, phone, email, address, document_type, document_number, verification_status, risk_level, submitted_by, verified_by, remarks) VALUES
('KYC-5001', 'CUST-1001', 'Rohan Sharma', '1990-06-15', '+91 98201 44521', 'rohan.sharma@gmail.com', 'Flat 402, Lotus Heights, Powai, Mumbai - 400076', 'PAN', 'ABCPS1234F', 'VERIFIED', 'LOW', 'teller', 'supervisor', 'All Aadhaar & PAN details verified successfully against NSDL database.'),
('KYC-5002', 'CUST-1002', 'Priya Patel', '1994-09-22', '+91 98765 12340', 'priya.patel@outlook.com', 'B-12, Green Glen Layout, Bellandur, Bengaluru - 560103', 'PASSPORT', 'Z8942104', 'UNDER_REVIEW', 'MEDIUM', 'teller', NULL, 'Pending signature verification and utility bill address matching.'),
('KYC-5003', 'CUST-1003', 'Amit Verma', '1988-12-04', '+91 97110 88990', 'amit.verma@techcorp.in', '74, Cyber City Phase 2, Gurugram, Haryana - 122002', 'AADHAAR', '5482 9104 2234', 'PENDING', 'HIGH', 'teller', NULL, 'Newly uploaded document, needs OTP verification.');

INSERT INTO audit_logs (id, user, role, action, module, entity, entity_id, old_value, new_value, ip_address, status, details) VALUES
('AUD-001', 'teller', 'TELLER', 'LOGIN', 'CORE', 'USER', 'USR-003', NULL, NULL, '192.168.10.45', 'SUCCESS', 'Teller Karan Deshmukh signed in successfully.'),
('AUD-002', 'supervisor', 'SUPERVISOR', 'KYC_APPROVED', 'MILESTONE_1_KYC_RBAC', 'KYC_RECORD', 'KYC-5001', 'UNDER_REVIEW', 'VERIFIED', '192.168.10.12', 'SUCCESS', 'KYC approved for customer Rohan Sharma with Low Risk rating.');
