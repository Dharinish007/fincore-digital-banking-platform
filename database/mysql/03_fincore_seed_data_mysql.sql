-- ============================================================================
-- FINCORE DIGITAL BANKING PLATFORM - UNIFIED SAMPLE SEED DATA (MySQL)
-- ============================================================================

USE digital_banking;

-- Seed Customers
INSERT INTO customer (customer_id, full_name, email, phone, date_of_birth, address, tier, kyc_status, status, credit_score)
VALUES 
(1, 'Alex Mercer', 'alex.mercer@fincore.com', '+1-555-0199', '1990-05-14', '742 Evergreen Terrace, Springfield', 'PLATINUM', 'VERIFIED', 'ACTIVE', 780),
(2, 'Sarah Jenkins', 'sarah.j@fincore.com', '+1-555-0245', '1985-11-23', '100 King St, Toronto', 'GOLD', 'VERIFIED', 'ACTIVE', 745),
(3, 'David Chen', 'david.chen@fincore.com', '+1-555-0812', '1993-02-18', '50 Market St, San Francisco', 'SILVER', 'VERIFIED', 'ACTIVE', 710)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Seed Accounts (Team C format)
INSERT INTO account (account_no, customer_id, account_type, balance, status, branch_name, ifsc_code)
VALUES
('ACC-1001', 1, 'Savings', 45250.00, 'Active', 'Downtown HQ', 'FINC0001001'),
('ACC-1002', 1, 'Current', 128900.50, 'Active', 'Downtown HQ', 'FINC0001001'),
('ACC-2001', 2, 'Savings', 18450.75, 'Active', 'Metro Branch', 'FINC0002001'),
('ACC-3001', 3, 'Savings', 8700.00, 'Active', 'Westside Hub', 'FINC0003001')
ON DUPLICATE KEY UPDATE balance=VALUES(balance);

-- Seed Accounts (Team B format)
INSERT INTO accounts (id, account_number, customer_id, account_type, balance, status, opened_at)
VALUES
(1, 'ACC-1001', 1, 'SAVINGS', 45250.00, 'ACTIVE', '2023-01-15'),
(2, 'ACC-1002', 1, 'CURRENT', 128900.50, 'ACTIVE', '2023-04-10'),
(3, 'ACC-2001', 2, 'SAVINGS', 18450.75, 'ACTIVE', '2023-06-20'),
(4, 'ACC-3001', 3, 'SAVINGS', 8700.00, 'ACTIVE', '2023-09-01')
ON DUPLICATE KEY UPDATE balance=VALUES(balance);

-- Seed Transactions
INSERT INTO transactions (account_no, transaction_reference, customer_id, transaction_type, amount, status, transaction_date)
VALUES
('ACC-1001', 'TXN-20260901-001', 1, 'CREDIT', 5000.00, 'SUCCESS', '2026-09-01'),
('ACC-1001', 'TXN-20260905-002', 1, 'DEBIT', 1250.00, 'SUCCESS', '2026-09-05'),
('ACC-2001', 'TXN-20260910-003', 2, 'CREDIT', 15000.00, 'SUCCESS', '2026-09-10')
ON DUPLICATE KEY UPDATE amount=VALUES(amount);

-- Seed Beneficiaries
INSERT INTO beneficiary (customer_id, beneficiary_name, beneficiary_account_no, ifsc_code, bank_name, beneficiary_type, status)
VALUES
(1, 'Elena Rostova', 'ACC-552199', 'HDFC0002410', 'HDFC Bank', 'EXTERNAL', 'ACTIVE'),
(1, 'Michael Scott', 'ACC-2001', 'FINC0002001', 'FinCore Bank', 'INTERNAL', 'ACTIVE')
ON DUPLICATE KEY UPDATE beneficiary_name=VALUES(beneficiary_name);

-- Seed Loans
INSERT INTO loans (loan_number, customer_id, account_number, principal, annual_interest_rate, tenure_months, monthly_emi, outstanding_balance, status)
VALUES
('LN-7701', 1, 'ACC-1001', 250000.00, 8.50, 36, 7892.45, 185000.00, 'ACTIVE')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Seed Loan Application
INSERT INTO loan_application (customer_id, loan_type, amount_requested, annual_income, tenure_months, interest_rate, status)
VALUES
(1, 'Personal Loan', 150000.00, 1200000.00, 24, 9.50, 'APPROVED')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Seed Passcode
INSERT INTO customer_security_credentials (customer_id, passcode_hash, failed_attempts, is_locked)
VALUES
(1, '$2a$10$e7V7x6U5mK9.z7dF3vF5Reb.0bN6V1w2E9o0mO.i6nQ6gR.yX6c6W', 0, FALSE)
ON DUPLICATE KEY UPDATE failed_attempts=0;
