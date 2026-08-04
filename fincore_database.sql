

-- ───────────────────────────── SCHEMA ─────────────────────────────

CREATE TABLE customers (
    customer_id     BIGINT AUTO_INCREMENT PRIMARY KEY,   -- MySQL. For Postgres use: BIGSERIAL PRIMARY KEY (drop AUTO_INCREMENT)
    first_name      VARCHAR(100)   NOT NULL,
    last_name       VARCHAR(100)   NOT NULL,
    email           VARCHAR(150)   NOT NULL UNIQUE,
    phone_number    VARCHAR(20)    NOT NULL,
    address         VARCHAR(255),
    date_of_birth   DATE,
    kyc_status      VARCHAR(20)    NOT NULL DEFAULT 'PENDING',   -- PENDING, VERIFIED, REJECTED
    risk_level      VARCHAR(20)    NOT NULL DEFAULT 'LOW',       -- LOW, MEDIUM, HIGH
    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_kyc_status  CHECK (kyc_status IN ('PENDING','VERIFIED','REJECTED')),
    CONSTRAINT chk_risk_level  CHECK (risk_level IN ('LOW','MEDIUM','HIGH'))
);

-- ─────────────────────────────
-- ACCOUNTS  (Accounts section of the UI)
-- ─────────────────────────────
CREATE TABLE accounts (
    account_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number  VARCHAR(20)    NOT NULL UNIQUE,   -- e.g. FINCO-1001
    customer_id     BIGINT         NOT NULL,
    account_type    VARCHAR(20)    NOT NULL,          -- SAVINGS, CURRENT, FIXED_DEPOSIT
    balance         DECIMAL(15,2)  NOT NULL DEFAULT 0.00,
    status          VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, INACTIVE, CLOSED, SUSPENDED
    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT chk_account_type   CHECK (account_type IN ('SAVINGS','CURRENT','FIXED_DEPOSIT')),
    CONSTRAINT chk_account_status CHECK (status IN ('ACTIVE','INACTIVE','CLOSED','SUSPENDED')),
    CONSTRAINT chk_balance_nonneg CHECK (balance >= 0)
);

CREATE INDEX idx_accounts_customer_id ON accounts(customer_id);

-- ─────────────────────────────
-- TRANSACTIONS  (Payments / Transfer modal in the UI)
-- ─────────────────────────────
CREATE TABLE transactions (
    transaction_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_number    VARCHAR(30)    NOT NULL UNIQUE,   -- e.g. TXN-A1B2C3D4E5F6
    transaction_type    VARCHAR(20)    NOT NULL,          -- TRANSFER, DEPOSIT, WITHDRAWAL
    from_account_id     BIGINT,                           -- NULL for DEPOSIT
    to_account_id       BIGINT,                           -- NULL for WITHDRAWAL
    amount              DECIMAL(15,2)  NOT NULL,
    transaction_status  VARCHAR(20)    NOT NULL DEFAULT 'PENDING', -- SUCCESS, PENDING, FAILED, REVERSED
    transaction_date    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_txn_from_account FOREIGN KEY (from_account_id) REFERENCES accounts(account_id),
    CONSTRAINT fk_txn_to_account   FOREIGN KEY (to_account_id)   REFERENCES accounts(account_id),
    CONSTRAINT chk_txn_type   CHECK (transaction_type IN ('TRANSFER','DEPOSIT','WITHDRAWAL')),
    CONSTRAINT chk_txn_status CHECK (transaction_status IN ('SUCCESS','PENDING','FAILED','REVERSED')),
    CONSTRAINT chk_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_txn_from_account ON transactions(from_account_id);
CREATE INDEX idx_txn_to_account   ON transactions(to_account_id);
CREATE INDEX idx_txn_date         ON transactions(transaction_date);
CREATE INDEX idx_txn_status       ON transactions(transaction_status);

-- ─────────────────────────────
-- AUDIT LOG  (Audit section of the UI — immutable trail)
-- ─────────────────────────────
CREATE TABLE audit_log (
    audit_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_time           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    level                VARCHAR(10)   NOT NULL,   -- INFO, SUCCESS, WARN, ERROR
    message              VARCHAR(500)  NOT NULL,
    related_entity_type  VARCHAR(30),              -- CUSTOMER, ACCOUNT, TRANSACTION
    related_entity_id    VARCHAR(50),

    CONSTRAINT chk_audit_level CHECK (level IN ('INFO','SUCCESS','WARN','ERROR'))
);

CREATE INDEX idx_audit_event_time ON audit_log(event_time);

-- ─────────────────────────────

-- ───────────────────────────── SEED DATA ─────────────────────────────

-- CUSTOMERS
INSERT INTO customers (customer_id, first_name, last_name, email, phone_number, address, date_of_birth, kyc_status, risk_level, created_at) VALUES
(1, 'Manoj', 'Nair', 'manoj.nair1@gmail.com', '9043321819', '55 MG Road, Bengaluru', '1979-03-16', 'REJECTED', 'HIGH', '2025-04-22 07:00:00'),
(2, 'John', 'Das', 'john.das2@gmail.com', '9386379402', '90 Church Street, Kochi', '1987-06-19', 'VERIFIED', 'LOW', '2025-03-21 06:00:00'),
(3, 'Rahul', 'Kapoor', 'rahul.kapoor3@gmail.com', '9155940781', '49 Park Street, Jaipur', '1988-02-25', 'REJECTED', 'LOW', '2026-03-01 20:00:00'),
(4, 'Sanjay', 'Menon', 'sanjay.menon4@gmail.com', '9103413164', '59 Brigade Road, Kolkata', '1991-08-10', 'VERIFIED', 'LOW', '2025-07-01 06:00:00'),
(5, 'Ritu', 'Reddy', 'ritu.reddy5@gmail.com', '9832764835', '99 MG Road, Mumbai', '1976-06-09', 'PENDING', 'LOW', '2026-02-17 10:00:00'),
(6, 'Rahul', 'Menon', 'rahul.menon6@gmail.com', '9953767242', '32 Koramangala, Jaipur', '1986-10-14', 'PENDING', 'HIGH', '2026-01-18 18:00:00'),
(7, 'Rohan', 'Joshi', 'rohan.joshi7@gmail.com', '9328710122', '88 Church Street, Coimbatore', '1977-11-06', 'REJECTED', 'MEDIUM', '2025-07-17 12:00:00'),
(8, 'Amit', 'Rao', 'amit.rao8@gmail.com', '9801845146', '21 Nungambakkam, Bengaluru', '1986-10-25', 'VERIFIED', 'HIGH', '2026-05-13 16:00:00'),
(9, 'Anjali', 'Krishnan', 'anjali.krishnan9@gmail.com', '9893252880', '77 Brigade Road, Delhi', '1975-11-16', 'VERIFIED', 'LOW', '2025-02-27 11:00:00'),
(10, 'Priya', 'Gupta', 'priya.gupta10@gmail.com', '9911718227', '71 Anna Nagar, Hyderabad', '1998-09-02', 'PENDING', 'LOW', '2026-03-23 19:00:00'),
(11, 'Deepa', 'Menon', 'deepa.menon11@gmail.com', '9465787133', '9 Brigade Road, Bengaluru', '2001-05-22', 'REJECTED', 'LOW', '2025-10-11 07:00:00'),
(12, 'John', 'Verma', 'john.verma12@gmail.com', '9031051834', '86 Nungambakkam, Mumbai', '1999-03-10', 'REJECTED', 'HIGH', '2025-03-09 23:00:00'),
(13, 'Neha', 'Gupta', 'neha.gupta13@gmail.com', '9763116566', '60 MG Road, Chennai', '1977-09-20', 'VERIFIED', 'LOW', '2025-07-26 23:00:00'),
(14, 'Divya', 'Menon', 'divya.menon14@gmail.com', '9387262473', '10 Nungambakkam, Jaipur', '1979-05-24', 'REJECTED', 'LOW', '2025-01-26 20:00:00'),
(15, 'Rahul', 'Gupta', 'rahul.gupta15@gmail.com', '9267736026', '1 Church Street, Hyderabad', '1995-05-30', 'REJECTED', 'MEDIUM', '2025-05-27 13:00:00'),
(16, 'Arjun', 'Menon', 'arjun.menon16@gmail.com', '9430980500', '75 Nungambakkam, Jaipur', '1998-10-28', 'REJECTED', 'LOW', '2025-03-22 01:00:00'),
(17, 'Sneha', 'Verma', 'sneha.verma17@gmail.com', '9913619399', '6 Indiranagar, Chennai', '1993-10-21', 'REJECTED', 'HIGH', '2025-12-03 18:00:00'),
(18, 'Aditya', 'Rao', 'aditya.rao18@gmail.com', '9353462475', '97 Park Street, Bengaluru', '1995-07-23', 'VERIFIED', 'LOW', '2025-11-15 18:00:00'),
(19, 'Deepa', 'Menon', 'deepa.menon19@gmail.com', '9842513542', '57 Koramangala, Hyderabad', '2002-06-09', 'REJECTED', 'LOW', '2026-02-18 20:00:00'),
(20, 'Swathi', 'Das', 'swathi.das20@gmail.com', '9412411824', '37 Indiranagar, Mumbai', '1990-05-19', 'VERIFIED', 'HIGH', '2025-04-15 21:00:00'),
(21, 'Neha', 'Rao', 'neha.rao21@gmail.com', '9016400524', '21 Nungambakkam, Jaipur', '1994-03-09', 'VERIFIED', 'LOW', '2025-10-15 00:00:00'),
(22, 'Vivek', 'Iyer', 'vivek.iyer22@gmail.com', '9805982620', '40 Brigade Road, Bengaluru', '1991-01-19', 'VERIFIED', 'LOW', '2025-04-18 21:00:00'),
(23, 'Pooja', 'Das', 'pooja.das23@gmail.com', '9692322602', '95 Brigade Road, Pune', '1986-02-17', 'VERIFIED', 'MEDIUM', '2025-05-17 05:00:00'),
(24, 'Priya', 'Kumar', 'priya.kumar24@gmail.com', '9337543303', '52 Brigade Road, Hyderabad', '1978-02-11', 'VERIFIED', 'HIGH', '2026-05-11 08:00:00'),
(25, 'Rohan', 'Das', 'rohan.das25@gmail.com', '9501429401', '77 Church Street, Kochi', '1989-01-26', 'REJECTED', 'LOW', '2025-08-12 19:00:00');

-- ACCOUNTS
INSERT INTO accounts (account_id, account_number, customer_id, account_type, balance, status, created_at) VALUES
(1, 'FINCO-1001', 13, 'FIXED_DEPOSIT', 9503.94, 'ACTIVE', '2025-08-17 23:00:00'),
(2, 'FINCO-1002', 14, 'SAVINGS', 0.00, 'CLOSED', '2025-02-16 20:00:00'),
(3, 'FINCO-1003', 24, 'FIXED_DEPOSIT', 36851.88, 'ACTIVE', '2026-05-22 08:00:00'),
(4, 'FINCO-1004', 14, 'SAVINGS', 47443.72, 'ACTIVE', '2025-02-14 20:00:00'),
(5, 'FINCO-1005', 11, 'FIXED_DEPOSIT', 42400.76, 'SUSPENDED', '2025-11-08 07:00:00'),
(6, 'FINCO-1006', 10, 'FIXED_DEPOSIT', 15464.23, 'INACTIVE', '2026-04-02 19:00:00'),
(7, 'FINCO-1007', 13, 'FIXED_DEPOSIT', 14782.76, 'ACTIVE', '2025-08-01 23:00:00'),
(8, 'FINCO-1008', 14, 'FIXED_DEPOSIT', 47018.18, 'SUSPENDED', '2025-02-18 20:00:00'),
(9, 'FINCO-1009', 6, 'FIXED_DEPOSIT', 28455.26, 'INACTIVE', '2026-02-04 18:00:00'),
(10, 'FINCO-1010', 1, 'CURRENT', 14345.69, 'INACTIVE', '2025-05-17 07:00:00'),
(11, 'FINCO-1011', 19, 'FIXED_DEPOSIT', 32735.28, 'INACTIVE', '2026-03-04 20:00:00'),
(12, 'FINCO-1012', 15, 'FIXED_DEPOSIT', 10685.07, 'INACTIVE', '2025-06-21 13:00:00'),
(13, 'FINCO-1013', 24, 'SAVINGS', 32942.54, 'ACTIVE', '2026-05-27 08:00:00'),
(14, 'FINCO-1014', 22, 'FIXED_DEPOSIT', 30963.04, 'ACTIVE', '2025-05-14 21:00:00'),
(15, 'FINCO-1015', 25, 'SAVINGS', 33639.78, 'ACTIVE', '2025-09-06 19:00:00'),
(16, 'FINCO-1016', 7, 'SAVINGS', 1221.27, 'ACTIVE', '2025-08-01 12:00:00'),
(17, 'FINCO-1017', 20, 'SAVINGS', 22770.81, 'SUSPENDED', '2025-05-03 21:00:00'),
(18, 'FINCO-1018', 7, 'FIXED_DEPOSIT', 34817.71, 'INACTIVE', '2025-07-29 12:00:00'),
(19, 'FINCO-1019', 8, 'SAVINGS', 32802.90, 'ACTIVE', '2026-06-10 16:00:00'),
(20, 'FINCO-1020', 25, 'SAVINGS', 38921.02, 'ACTIVE', '2025-08-17 19:00:00'),
(21, 'FINCO-1021', 23, 'FIXED_DEPOSIT', 0.00, 'CLOSED', '2025-05-24 05:00:00'),
(22, 'FINCO-1022', 4, 'CURRENT', 6666.96, 'INACTIVE', '2025-07-22 06:00:00'),
(23, 'FINCO-1023', 17, 'FIXED_DEPOSIT', 29772.62, 'INACTIVE', '2025-12-22 18:00:00'),
(24, 'FINCO-1024', 24, 'FIXED_DEPOSIT', 0.00, 'CLOSED', '2026-05-25 08:00:00'),
(25, 'FINCO-1025', 6, 'FIXED_DEPOSIT', 43074.75, 'INACTIVE', '2026-01-26 18:00:00'),
(26, 'FINCO-1026', 25, 'SAVINGS', 41993.14, 'ACTIVE', '2025-09-05 19:00:00'),
(27, 'FINCO-1027', 25, 'FIXED_DEPOSIT', 24229.85, 'ACTIVE', '2025-08-20 19:00:00'),
(28, 'FINCO-1028', 15, 'SAVINGS', 35677.24, 'ACTIVE', '2025-06-04 13:00:00'),
(29, 'FINCO-1029', 11, 'CURRENT', 44651.34, 'ACTIVE', '2025-10-15 07:00:00'),
(30, 'FINCO-1030', 5, 'SAVINGS', 19151.76, 'ACTIVE', '2026-03-11 10:00:00'),
(31, 'FINCO-1031', 7, 'SAVINGS', 20743.39, 'ACTIVE', '2025-08-03 12:00:00'),
(32, 'FINCO-1032', 15, 'CURRENT', 3113.29, 'INACTIVE', '2025-06-08 13:00:00'),
(33, 'FINCO-1033', 25, 'FIXED_DEPOSIT', 47303.10, 'ACTIVE', '2025-09-08 19:00:00'),
(34, 'FINCO-1034', 25, 'FIXED_DEPOSIT', 19019.05, 'ACTIVE', '2025-09-11 19:00:00'),
(35, 'FINCO-1035', 12, 'CURRENT', 37673.76, 'INACTIVE', '2025-03-26 23:00:00');

-- TRANSACTIONS
INSERT INTO transactions (transaction_id, reference_number, transaction_type, from_account_id, to_account_id, amount, transaction_status, transaction_date) VALUES
(1, 'TXN-5681E1046578', 'WITHDRAWAL', 2, NULL, 14711.79, 'FAILED', '2026-07-02 12:37:00'),
(2, 'TXN-4C1A0DF6067E', 'TRANSFER', 15, 5, 1274.50, 'SUCCESS', '2026-08-04 01:22:00'),
(3, 'TXN-AAD73D1B91EF', 'WITHDRAWAL', 7, NULL, 9108.10, 'REVERSED', '2026-07-08 05:19:00'),
(4, 'TXN-AE4905B54B67', 'WITHDRAWAL', 28, NULL, 9026.15, 'SUCCESS', '2026-07-03 11:34:00'),
(5, 'TXN-F2F77B947505', 'WITHDRAWAL', 28, NULL, 14483.83, 'SUCCESS', '2026-08-04 15:29:00'),
(6, 'TXN-3FD8E1634F1F', 'WITHDRAWAL', 18, NULL, 7338.87, 'SUCCESS', '2026-07-17 10:17:00'),
(7, 'TXN-A9B5165416BD', 'WITHDRAWAL', 34, NULL, 10392.22, 'SUCCESS', '2026-07-24 15:35:00'),
(8, 'TXN-05F5EEBDB26C', 'DEPOSIT', NULL, 34, 3284.95, 'PENDING', '2026-07-18 23:37:00'),
(9, 'TXN-EBDDCA2E925C', 'WITHDRAWAL', 19, NULL, 13033.49, 'PENDING', '2026-07-07 00:36:00'),
(10, 'TXN-1F9E7BB134C6', 'DEPOSIT', NULL, 27, 14239.43, 'SUCCESS', '2026-07-16 03:35:00'),
(11, 'TXN-33608E303A9B', 'WITHDRAWAL', 6, NULL, 11452.92, 'REVERSED', '2026-07-14 08:42:00'),
(12, 'TXN-D2C051AEE7BD', 'TRANSFER', 35, 15, 4005.09, 'REVERSED', '2026-07-13 13:07:00'),
(13, 'TXN-CECA637811E0', 'WITHDRAWAL', 3, NULL, 4120.08, 'FAILED', '2026-08-01 14:05:00'),
(14, 'TXN-53AD473A6736', 'DEPOSIT', NULL, 28, 2669.10, 'FAILED', '2026-07-29 08:11:00'),
(15, 'TXN-7910FBC01406', 'WITHDRAWAL', 8, NULL, 598.62, 'SUCCESS', '2026-07-21 08:20:00'),
(16, 'TXN-77A71A2311AE', 'DEPOSIT', NULL, 8, 2008.65, 'SUCCESS', '2026-07-29 22:31:00'),
(17, 'TXN-93DC22B981B7', 'TRANSFER', 18, 27, 7500.71, 'REVERSED', '2026-07-19 16:45:00'),
(18, 'TXN-9D208287E608', 'DEPOSIT', NULL, 32, 7640.68, 'SUCCESS', '2026-07-19 23:19:00'),
(19, 'TXN-11F60879D070', 'TRANSFER', 10, 32, 4806.74, 'PENDING', '2026-07-25 12:42:00'),
(20, 'TXN-C9FB7B8AC79B', 'TRANSFER', 26, 6, 11733.80, 'SUCCESS', '2026-07-22 19:44:00'),
(21, 'TXN-770F567AB489', 'DEPOSIT', NULL, 7, 11214.16, 'PENDING', '2026-07-07 20:45:00'),
(22, 'TXN-CEAFAF0D04CC', 'DEPOSIT', NULL, 10, 9161.90, 'PENDING', '2026-07-16 15:58:00'),
(23, 'TXN-1EEA684C1F34', 'TRANSFER', 25, 31, 6393.42, 'SUCCESS', '2026-07-30 09:12:00'),
(24, 'TXN-D339E94E345A', 'TRANSFER', 23, 15, 9115.78, 'PENDING', '2026-07-19 07:38:00'),
(25, 'TXN-DE664CB4A6AF', 'WITHDRAWAL', 12, NULL, 2014.61, 'SUCCESS', '2026-07-21 23:26:00'),
(26, 'TXN-C29287E7165F', 'TRANSFER', 26, 24, 1771.79, 'SUCCESS', '2026-07-10 07:55:00'),
(27, 'TXN-6A2144379BDA', 'TRANSFER', 5, 30, 13269.31, 'FAILED', '2026-07-21 19:14:00'),
(28, 'TXN-E0C9E1B8C145', 'WITHDRAWAL', 7, NULL, 14192.31, 'PENDING', '2026-07-10 13:41:00'),
(29, 'TXN-39E5D1DF9F84', 'DEPOSIT', NULL, 30, 955.22, 'SUCCESS', '2026-07-13 03:54:00'),
(30, 'TXN-443A6DC3B6DD', 'TRANSFER', 18, 10, 13051.95, 'SUCCESS', '2026-07-10 19:00:00'),
(31, 'TXN-26B7CF63AEC0', 'TRANSFER', 24, 33, 1749.06, 'SUCCESS', '2026-07-31 14:49:00'),
(32, 'TXN-B29A67219A10', 'WITHDRAWAL', 6, NULL, 10307.16, 'PENDING', '2026-07-29 02:57:00'),
(33, 'TXN-3BE42F9213B5', 'DEPOSIT', NULL, 15, 12799.25, 'REVERSED', '2026-07-14 13:28:00'),
(34, 'TXN-F10B04FC8B7B', 'DEPOSIT', NULL, 4, 1493.64, 'REVERSED', '2026-07-24 04:35:00'),
(35, 'TXN-92407908AEEB', 'WITHDRAWAL', 7, NULL, 7635.82, 'SUCCESS', '2026-07-31 07:54:00'),
(36, 'TXN-7F63679734A8', 'DEPOSIT', NULL, 20, 12450.44, 'SUCCESS', '2026-07-02 05:17:00'),
(37, 'TXN-FCC4B59B201C', 'DEPOSIT', NULL, 11, 4708.98, 'SUCCESS', '2026-07-06 01:09:00'),
(38, 'TXN-AB1030D2FB43', 'WITHDRAWAL', 4, NULL, 7927.66, 'SUCCESS', '2026-07-03 07:25:00'),
(39, 'TXN-D966EB10C2D2', 'TRANSFER', 3, 28, 10037.32, 'SUCCESS', '2026-07-05 12:55:00'),
(40, 'TXN-1BF004E09C91', 'TRANSFER', 7, 16, 10359.67, 'SUCCESS', '2026-07-06 13:54:00'),
(41, 'TXN-320EFFC2B28F', 'DEPOSIT', NULL, 10, 10924.32, 'REVERSED', '2026-07-10 07:06:00'),
(42, 'TXN-D364C6166183', 'DEPOSIT', NULL, 10, 9547.71, 'FAILED', '2026-07-21 20:20:00'),
(43, 'TXN-B1EEA2E1A7B7', 'DEPOSIT', NULL, 3, 12836.64, 'FAILED', '2026-08-02 12:29:00'),
(44, 'TXN-83D3291679B4', 'DEPOSIT', NULL, 34, 635.17, 'REVERSED', '2026-07-29 14:33:00'),
(45, 'TXN-CFE0F364BB4E', 'WITHDRAWAL', 10, NULL, 10869.82, 'REVERSED', '2026-07-10 10:05:00'),
(46, 'TXN-E44C5B24FC59', 'DEPOSIT', NULL, 28, 14957.60, 'FAILED', '2026-07-06 20:42:00'),
(47, 'TXN-FFCD91DCB7B6', 'WITHDRAWAL', 9, NULL, 12535.04, 'FAILED', '2026-07-03 21:21:00'),
(48, 'TXN-0C766C104D1E', 'WITHDRAWAL', 20, NULL, 11240.62, 'PENDING', '2026-07-15 17:15:00'),
(49, 'TXN-8D4316620CD3', 'DEPOSIT', NULL, 7, 13101.38, 'SUCCESS', '2026-07-31 11:35:00'),
(50, 'TXN-77E6E8C09D1F', 'WITHDRAWAL', 16, NULL, 448.72, 'SUCCESS', '2026-07-26 16:23:00'),
(51, 'TXN-9FA8746CE75C', 'DEPOSIT', NULL, 17, 10597.77, 'PENDING', '2026-07-01 02:01:00'),
(52, 'TXN-7252BEEA061B', 'TRANSFER', 33, 16, 13581.95, 'FAILED', '2026-08-04 00:40:00'),
(53, 'TXN-C03D04B9B229', 'WITHDRAWAL', 25, NULL, 8334.57, 'PENDING', '2026-07-31 01:40:00'),
(54, 'TXN-EA6F5465FA27', 'DEPOSIT', NULL, 12, 2667.58, 'REVERSED', '2026-07-30 22:30:00'),
(55, 'TXN-B61EADA8292E', 'TRANSFER', 4, 22, 11311.70, 'SUCCESS', '2026-07-19 11:55:00'),
(56, 'TXN-BF8580911826', 'DEPOSIT', NULL, 12, 10919.87, 'SUCCESS', '2026-07-28 19:52:00'),
(57, 'TXN-EBFE15C11583', 'WITHDRAWAL', 26, NULL, 6552.36, 'REVERSED', '2026-07-04 02:42:00'),
(58, 'TXN-25CA741CD4F9', 'DEPOSIT', NULL, 29, 534.16, 'SUCCESS', '2026-07-29 11:23:00'),
(59, 'TXN-3204DB5102EE', 'TRANSFER', 32, 13, 6721.78, 'FAILED', '2026-07-19 22:58:00'),
(60, 'TXN-CBC59699452E', 'TRANSFER', 15, 8, 4534.35, 'SUCCESS', '2026-07-12 11:32:00');

-- AUDIT LOG
INSERT INTO audit_log (audit_id, event_time, level, message, related_entity_type, related_entity_id) VALUES
(1, '2026-08-01 00:23:00', 'INFO', 'Account FINCO-1009 balance checked', 'CUSTOMER', '8'),
(2, '2026-07-09 19:56:00', 'ERROR', 'Transaction TXN-D339E94E345A failed - insufficient balance', 'TRANSACTION', 'TXN-D339E94E345A'),
(3, '2026-07-31 16:26:00', 'SUCCESS', 'Transaction TXN-C9FB7B8AC79B processed successfully', 'ACCOUNT', 'FINCO-1026'),
(4, '2026-07-05 14:29:00', 'ERROR', 'Transaction TXN-F2F77B947505 failed - insufficient balance', 'CUSTOMER', '11'),
(5, '2026-07-12 04:27:00', 'ERROR', 'Transaction TXN-1EEA684C1F34 failed - insufficient balance', 'CUSTOMER', '25'),
(6, '2026-07-10 09:10:00', 'SUCCESS', 'Transaction TXN-EA6F5465FA27 processed successfully', 'TRANSACTION', 'TXN-EA6F5465FA27'),
(7, '2026-08-03 09:54:00', 'SUCCESS', 'Customer 12 KYC verified', 'TRANSACTION', 'TXN-CBC59699452E'),
(8, '2026-07-20 19:34:00', 'SUCCESS', 'Customer 5 KYC verified', 'TRANSACTION', 'TXN-CECA637811E0'),
(9, '2026-07-10 05:42:00', 'ERROR', 'Transaction TXN-D364C6166183 failed - insufficient balance', 'CUSTOMER', '19'),
(10, '2026-07-03 00:05:00', 'INFO', 'Account FINCO-1022 status updated', 'TRANSACTION', 'TXN-25CA741CD4F9'),
(11, '2026-07-14 18:26:00', 'INFO', 'Account FINCO-1017 status updated', 'CUSTOMER', '21'),
(12, '2026-08-04 09:41:00', 'INFO', 'Account FINCO-1032 status updated', 'ACCOUNT', 'FINCO-1032'),
(13, '2026-07-30 02:44:00', 'WARN', 'Transaction TXN-77A71A2311AE pending beyond threshold', 'TRANSACTION', 'TXN-77A71A2311AE'),
(14, '2026-07-30 06:21:00', 'INFO', 'Account FINCO-1027 balance checked', 'CUSTOMER', '16'),
(15, '2026-07-23 12:08:00', 'INFO', 'Account FINCO-1021 balance checked', 'ACCOUNT', 'FINCO-1021'),
(16, '2026-07-16 14:07:00', 'ERROR', 'Transaction TXN-7F63679734A8 failed - insufficient balance', 'ACCOUNT', 'FINCO-1007'),
(17, '2026-07-04 09:24:00', 'WARN', 'Transaction TXN-77A71A2311AE pending beyond threshold', 'CUSTOMER', '4'),
(18, '2026-07-21 06:48:00', 'WARN', 'Transaction TXN-77A71A2311AE pending beyond threshold', 'TRANSACTION', 'TXN-77A71A2311AE'),
(19, '2026-07-20 15:01:00', 'WARN', 'Transaction TXN-3BE42F9213B5 pending beyond threshold', 'TRANSACTION', 'TXN-3BE42F9213B5'),
(20, '2026-07-14 18:22:00', 'WARN', 'Transaction TXN-3BE42F9213B5 pending beyond threshold', 'TRANSACTION', 'TXN-3BE42F9213B5'),
(21, '2026-07-31 09:34:00', 'SUCCESS', 'Transaction TXN-11F60879D070 processed successfully', 'TRANSACTION', 'TXN-11F60879D070'),
(22, '2026-07-24 12:23:00', 'SUCCESS', 'Transaction TXN-E0C9E1B8C145 processed successfully', 'TRANSACTION', 'TXN-E0C9E1B8C145'),
(23, '2026-07-19 02:24:00', 'WARN', 'Transaction TXN-AE4905B54B67 pending beyond threshold', 'CUSTOMER', '12'),
(24, '2026-07-08 04:06:00', 'WARN', 'Transaction TXN-8D4316620CD3 pending beyond threshold', 'ACCOUNT', 'FINCO-1018'),
(25, '2026-07-24 04:12:00', 'SUCCESS', 'Customer 18 KYC verified', 'CUSTOMER', '18'),
(26, '2026-07-03 01:08:00', 'ERROR', 'Transaction TXN-C29287E7165F failed - insufficient balance', 'CUSTOMER', '2'),
(27, '2026-07-30 04:38:00', 'SUCCESS', 'Customer 17 KYC verified', 'CUSTOMER', '17'),
(28, '2026-07-26 19:47:00', 'INFO', 'Account FINCO-1021 balance checked', 'ACCOUNT', 'FINCO-1021'),
(29, '2026-08-04 15:45:00', 'ERROR', 'Transaction TXN-CEAFAF0D04CC failed - insufficient balance', 'CUSTOMER', '17'),
(30, '2026-07-22 21:07:00', 'SUCCESS', 'Customer 12 KYC verified', 'ACCOUNT', 'FINCO-1002'),
(31, '2026-07-31 08:41:00', 'ERROR', 'Transaction TXN-C9FB7B8AC79B failed - insufficient balance', 'CUSTOMER', '20'),
(32, '2026-07-31 05:33:00', 'ERROR', 'Transaction TXN-7910FBC01406 failed - insufficient balance', 'CUSTOMER', '19'),
(33, '2026-07-16 01:36:00', 'INFO', 'Account FINCO-1025 status updated', 'CUSTOMER', '5'),
(34, '2026-07-21 13:09:00', 'SUCCESS', 'Transaction TXN-CECA637811E0 processed successfully', 'ACCOUNT', 'FINCO-1002'),
(35, '2026-07-31 23:46:00', 'INFO', 'Account FINCO-1027 status updated', 'TRANSACTION', 'TXN-53AD473A6736'),
(36, '2026-07-21 21:30:00', 'INFO', 'Account FINCO-1034 status updated', 'CUSTOMER', '7'),
(37, '2026-08-04 10:34:00', 'WARN', 'Transaction TXN-770F567AB489 pending beyond threshold', 'ACCOUNT', 'FINCO-1012'),
(38, '2026-07-31 06:15:00', 'INFO', 'Account FINCO-1017 status updated', 'ACCOUNT', 'FINCO-1017'),
(39, '2026-07-19 22:13:00', 'ERROR', 'Transaction TXN-C9FB7B8AC79B failed - insufficient balance', 'CUSTOMER', '10'),
(40, '2026-07-23 17:59:00', 'INFO', 'Account FINCO-1021 status updated', 'CUSTOMER', '16');

-- ───────────────────────────── RESET AUTO-INCREMENT ─────────────────────────────
-- (MySQL syntax. For Postgres use: SELECT setval('customers_customer_id_seq', 25); etc.)
ALTER TABLE customers    AUTO_INCREMENT = 26;
ALTER TABLE accounts     AUTO_INCREMENT = 36;
ALTER TABLE transactions AUTO_INCREMENT = 61;
ALTER TABLE audit_log    AUTO_INCREMENT = 41;

-- ───────────────────────────── NOTES ─────────────────────────────
-- 1. Application-layer validation still needed (DB CHECK constraints can't
--    easily express conditional logic across columns in MySQL):
--      TRANSFER   -> from_account_id AND to_account_id both required
--      DEPOSIT    -> to_account_id required, from_account_id must be NULL
--      WITHDRAWAL -> from_account_id required, to_account_id must be NULL
-- 2. Balance updates on transactions should run inside a single DB
--    transaction (BEGIN/COMMIT) in the Spring Boot service layer so a
--    transfer's debit + credit + audit-log insert are atomic.
-- 3. If Postgres: replace "AUTO_INCREMENT" with "GENERATED ALWAYS AS IDENTITY"
--    or use BIGSERIAL, and CURRENT_TIMESTAMP works as-is on both engines.
-- 4. Sample data is randomly generated for volume/load testing — emails,
--    phone numbers, and addresses are NOT real people.
