USE digital_banking;

-- ===========================================
-- CUSTOMER TABLE
-- ===========================================

CREATE TABLE customer (
    customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ACCOUNT TABLE
-- ===========================================

CREATE TABLE account (
    account_no VARCHAR(20) PRIMARY KEY,
    customer_id BIGINT NOT NULL,

    account_type ENUM('Savings','Current') NOT NULL,

    balance DECIMAL(15,2) DEFAULT 0.00,

    status ENUM('Active','Blocked','Closed')
    DEFAULT 'Active',

    branch_name VARCHAR(100),

    ifsc_code VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_customer
    FOREIGN KEY (customer_id)
    REFERENCES customer(customer_id)
);

-- ===========================================
-- TRANSACTIONS TABLE
-- ===========================================

CREATE TABLE transactions (

    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    account_no VARCHAR(20) NOT NULL,

    transaction_type ENUM('Deposit','Withdraw','Transfer')
    NOT NULL,

    amount DECIMAL(15,2) NOT NULL,

    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_account
    FOREIGN KEY (account_no)
    REFERENCES account(account_no)
);