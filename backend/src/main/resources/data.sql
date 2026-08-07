-- ═══════════════════════════════════════════════════════════
-- FinCore Nexus - Initial Seed Data
-- ═══════════════════════════════════════════════════════════

INSERT INTO customer (customer_id, full_name, email, phone, address, occupation, annual_income, pan_number, aadhaar_number, created_at) VALUES
(1, 'Aditi Verma', 'aditi.verma@example.com', '9876543210', '204, Silver Oak Residency, Baner, Pune', 'Software Engineer', 1200000.00, 'ABCDE1234F', '123456789012', NOW()),
(2, 'Rahul Sharma', 'rahul.sharma@example.com', '9812345678', '45 Park Street, Kolkata', 'Manager', 1500000.00, 'BCDEF2345G', '234567890123', NOW()),
(3, 'Priya Nair', 'priya.nair@example.com', '9700012345', '7 Anna Nagar, Chennai', 'Consultant', 1800000.00, 'CDEFG3456H', '345678901234', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO accounts (account_no, customer_id, account_type, balance, available_balance, system_calculated_balance, difference, status, branch_name, ifsc_code, last_verified, created_at) VALUES
('100084920192', 1, 'Savings', 128475.00, 128475.00, 128475.00, 0.00, 'Verified', 'Main Branch - Downtown', 'FINC0001001', NOW(), NOW()),
('400092817261', 2, 'Corporate', 450000.00, 450000.00, 448800.00, 1200.00, 'Mismatch', 'Westside Metro', 'FINC0001002', NOW(), NOW()),
('200039102938', 3, 'Checking', 86000.00, 86000.00, 86000.00, 0.00, 'Verified', 'East Commerce', 'FINC0001003', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO transactions (transaction_id, transaction_code, sender_account_no, sender_name, receiver_account_no, receiver_name, transaction_type, amount, charges, reference, status, failure_reason, description, transaction_date) VALUES
(1, 'TX100981', '100084920192', 'Aditi Verma', '400092817261', 'Apex Logistics Ltd', 'Transfer', 24500.00, 15.00, 'REF892019', 'Success', NULL, 'Vendor payment for Q3 software license renewal', NOW()),
(2, 'TX100982', '200039102938', 'Rahul Sharma', '100084920192', 'Aditi Verma', 'Deposit', 150000.00, 0.00, 'REF892020', 'Success', NULL, 'Salary credit for July 2026', NOW()),
(3, 'TX100984', '300091827364', 'Global Tech Corp', '100084920192', 'Aditi Verma', 'Transfer', 8750.50, 0.00, 'REF892022', 'Failed', 'INSUFFICIENT_FUNDS_ATOMIC_ROLLBACK: Debit account locked due to concurrent transaction lock', 'Quarterly dividend payout', NOW())
ON CONFLICT DO NOTHING;
