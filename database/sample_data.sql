-- FinCore sample / seed data
-- Passwords (BCrypt):
--   admin / Admin@123
--   teller / Teller@123
--   supervisor / Super@123
--   jsmith / Customer@123

USE kyc_db;

-- Clear in FK-safe order (for re-runs during testing)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE transactions;
TRUNCATE TABLE accounts;
TRUNCATE TABLE kyc;
TRUNCATE TABLE customers;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (id, username, password, full_name, email, role, status) VALUES
(1, 'admin',      '$2b$10$.oxIHunrhbpRJWAxZFQXEOW2pM1OGj4OEC1fj882ORiUAnk4NyUay', 'System Admin',       'admin@fincore.com',      'ADMIN',      'ACTIVE'),
(2, 'teller',     '$2b$10$F4sxOqEO2AWnXh7vD.eNMuIWuMGp71hd0Bsd5Po0gJVyfWw5aHnM2', 'Priya Raman',        'teller@fincore.com',     'TELLER',     'ACTIVE'),
(3, 'supervisor', '$2b$10$HulVOKQQKRQoTOMjYOw5s.y5PeDw7PkATh40Y5n5lgimX3v0qT1PS', 'S. R. Puthal',       'supervisor@fincore.com', 'SUPERVISOR', 'ACTIVE'),
(4, 'jsmith',     '$2b$10$WPaD/Sypnn2ZZMsw6k7fwOd5kLZccZMV5qugFVkbI4wWqeSuBzeG6', 'John Smith',         'john.smith@email.com',   'CUSTOMER',   'ACTIVE');

INSERT INTO customers (id, customer_number, first_name, last_name, email, phone, kyc_status, risk_level) VALUES
(1, 'CUST-1001', 'John',      'Smith',   'john.smith@email.com',   '9876543210', 'VERIFIED', 'LOW'),
(2, 'CUST-1002', 'Vaishnavi', 'Warkar',  'vaishnavi.w@email.com',  '9876543211', 'PENDING',  'MEDIUM'),
(3, 'CUST-1003', 'Thejashree','K',       'thejashree@email.com',   '9876543212', 'PENDING',  'HIGH'),
(4, 'CUST-1004', 'Sharvari',  'Shalgar', 'sharvari.s@email.com',   '9876543213', 'PENDING',  'LOW'),
(5, 'CUST-1005', 'Vaishnavi', 'Mahadik', 'vaishnavi.m@email.com',  '9876543214', 'VERIFIED', 'LOW');

INSERT INTO accounts (id, account_number, account_type, balance, status, customer_id, created_at, updated_at) VALUES
(1, '1234-5678-9012', 'SAVINGS', 12847.50, 'ACTIVE', 1, NOW(), NOW()),
(2, '2231-9087-4410', 'CURRENT',  4210.00, 'ACTIVE', 2, NOW(), NOW()),
(3, '3390-1122-7784', 'SAVINGS',   980.25, 'ACTIVE', 3, NOW(), NOW()),
(4, '4471-3302-1128', 'SAVINGS', 22004.10, 'ACTIVE', 4, NOW(), NOW()),
(5, '5518-6674-4402', 'CURRENT',  7650.75, 'ACTIVE', 5, NOW(), NOW()),
(6, '7788-2201-3345', 'CURRENT',   980.25, 'FROZEN', 3, NOW(), NOW());

INSERT INTO kyc (kyc_id, first_name, last_name, date_of_birth, gender, government_id_type, government_id_number,
                 address_line1, city, state, postal_code, country, occupation_status, annual_income_range,
                 pep_declaration, email, status) VALUES
(1, 'John',      'Smith',   '1990-05-12', 'Male',   'AADHAAR', '1234-5678-9012', '12 MG Road',     'Bengaluru', 'Karnataka', '560001', 'India', 'Employed',   '5-10 LPA',  FALSE, 'john.smith@email.com',  'APPROVED'),
(2, 'Vaishnavi', 'Warkar',  '1995-08-20', 'Female', 'PAN',     'ABCDE1234F',      '45 FC Road',     'Pune',      'Maharashtra','411004', 'India', 'Employed',   '3-5 LPA',   FALSE, 'vaishnavi.w@email.com', 'PENDING'),
(3, 'Thejashree','K',       '1992-01-03', 'Female', 'AADHAAR', '9988-7766-5544',  '78 Residency Rd','Mysuru',    'Karnataka', '570001', 'India', 'Self-Employed','1-3 LPA', FALSE, 'thejashree@email.com',  'PENDING'),
(4, 'Sharvari',  'Shalgar', '1998-11-15', 'Female', 'AADHAAR', '1122-3344-5566',  '22 JM Road',     'Pune',      'Maharashtra','411005', 'India', 'Student',    '0-1 LPA',   FALSE, 'sharvari.s@email.com',  'PENDING'),
(5, 'Vaishnavi', 'Mahadik', '1994-03-22', 'Female', 'PAN',     'XYZAB9876C',      '9 Link Road',    'Mumbai',    'Maharashtra','400001', 'India', 'Employed',   '5-10 LPA',  FALSE, 'vaishnavi.m@email.com', 'APPROVED');

INSERT INTO transactions (transaction_reference, source_account_id, target_account_id, transaction_type, amount, status, description, performed_by, timestamp) VALUES
('TXN-SEED-001', 1, NULL, 'DEPOSIT',  2400.00, 'SUCCESS', 'Initial deposit', 'teller', NOW() - INTERVAL 5 DAY),
('TXN-SEED-002', 4, NULL, 'DEPOSIT',   600.00, 'SUCCESS', 'Cash deposit',    'teller', NOW() - INTERVAL 2 DAY);

USE fincore_audit;

TRUNCATE TABLE audit_logs;

INSERT INTO audit_logs (entity_name, entity_id, action, performed_by, status, description, timestamp) VALUES
('SYSTEM', '0', 'SEED', 'SYSTEM', 'SUCCESS', 'Sample audit seed loaded', NOW());
