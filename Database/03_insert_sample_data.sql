USE digital_banking;

-- ===========================================
-- INSERT CUSTOMERS
-- ===========================================

INSERT INTO customer
(full_name, email, phone)
VALUES
('Rahul Sharma', 'rahul.sharma@gmail.com', '9876543210'),
('Amit Verma', 'amit.verma@gmail.com', '9876543211');

-- ===========================================
-- INSERT ACCOUNTS
-- ===========================================

INSERT INTO account
(account_no, customer_id, account_type, balance, status, branch_name, ifsc_code)
VALUES
('SB10000001', 1, 'Savings', 10000.00, 'Active', 'Indore Branch', 'SBIN0001234'),
('SB10000002', 2, 'Savings', 15000.00, 'Active', 'Bhopal Branch', 'SBIN0005678');

-- ===========================================
-- INSERT TRANSACTIONS
-- ===========================================

INSERT INTO transactions
(account_no, transaction_type, amount)
VALUES
('SB10000001', 'Deposit', 5000.00),
('SB10000002', 'Deposit', 10000.00);