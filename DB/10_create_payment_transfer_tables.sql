USE digital_banking;

-- =========================================================
-- 1. BENEFICIARY TABLE
-- =========================================================

CREATE TABLE beneficiary (
    beneficiary_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT NOT NULL,

    beneficiary_name VARCHAR(100) NOT NULL,

    account_no VARCHAR(20) NOT NULL,

    ifsc_code VARCHAR(20) NOT NULL,

    bank_name VARCHAR(100) NOT NULL,

    beneficiary_type ENUM(
        'Internal',
        'External'
    ) DEFAULT 'External',

    status ENUM(
        'Pending',
        'Verified',
        'Blocked'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_beneficiary_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);


-- =========================================================
-- 2. PAYMENT TABLE
-- =========================================================

CREATE TABLE payment (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    from_account_no VARCHAR(20) NOT NULL,

    to_account_no VARCHAR(20) NOT NULL,

    beneficiary_id BIGINT NOT NULL,

    amount DECIMAL(15,2) NOT NULL,

    payment_type ENUM(
        'Transfer',
        'Bill Payment',
        'Other'
    ) DEFAULT 'Transfer',

    payment_mode ENUM(
        'IMPS',
        'NEFT',
        'RTGS',
        'UPI'
    ) DEFAULT 'IMPS',

    payment_status ENUM(
        'Pending',
        'Processing',
        'Success',
        'Failed',
        'Cancelled'
    ) DEFAULT 'Pending',

    transaction_ref VARCHAR(50) UNIQUE,

    description TEXT,

    initiated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_from_account
        FOREIGN KEY (from_account_no)
        REFERENCES account(account_no),

    CONSTRAINT fk_payment_to_account
        FOREIGN KEY (to_account_no)
        REFERENCES account(account_no),

    CONSTRAINT fk_payment_beneficiary
        FOREIGN KEY (beneficiary_id)
        REFERENCES beneficiary(beneficiary_id)
);


-- =========================================================
-- 3. FRAUD CHECK TABLE
-- =========================================================

CREATE TABLE fraud_check (
    fraud_check_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    payment_id BIGINT NOT NULL UNIQUE,

    risk_score INT NOT NULL DEFAULT 0,

    fraud_status ENUM(
        'Pending',
        'Safe',
        'Suspicious',
        'Blocked'
    ) DEFAULT 'Pending',

    rule_triggered VARCHAR(255),

    remarks TEXT,

    checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fraud_payment
        FOREIGN KEY (payment_id)
        REFERENCES payment(payment_id)
);
