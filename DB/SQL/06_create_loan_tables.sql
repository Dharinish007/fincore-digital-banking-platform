USE digital_banking;

-- ===========================================
-- LOAN APPLICATION TABLE
-- ===========================================

CREATE TABLE loan_application (
    loan_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT NOT NULL,

    loan_type ENUM(
        'Personal',
        'Home',
        'Vehicle',
        'Education',
        'Gold',
        'Other'
    ) NOT NULL,

    loan_amount DECIMAL(15,2) NOT NULL,

    tenure_months INT NOT NULL,

    interest_rate DECIMAL(5,2) NOT NULL,

    purpose VARCHAR(255),

    application_status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) DEFAULT 'Pending',

    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loan_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);


-- ===========================================
-- LOAN HISTORY TABLE
-- ===========================================

CREATE TABLE loan_history (
    history_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT NOT NULL,

    loan_id BIGINT,

    loan_type ENUM(
        'Personal',
        'Home',
        'Vehicle',
        'Education',
        'Gold',
        'Other'
    ) NOT NULL,

    loan_amount DECIMAL(15,2) NOT NULL,

    outstanding_amount DECIMAL(15,2) DEFAULT 0.00,

    loan_status ENUM(
        'Active',
        'Closed',
        'Defaulted'
    ) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id),

    CONSTRAINT fk_history_loan
        FOREIGN KEY (loan_id)
        REFERENCES loan_application(loan_id)
);


-- ===========================================
-- CREDIT CHECK TABLE
-- ===========================================

CREATE TABLE credit_check (
    credit_check_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    loan_id BIGINT NOT NULL,

    credit_score INT,

    monthly_income DECIMAL(15,2),

    existing_loan_count INT DEFAULT 0,

    previous_loan_status ENUM(
        'Yes',
        'No'
    ) DEFAULT 'No',

    credit_status ENUM(
        'Pass',
        'Review',
        'Fail'
    ) DEFAULT 'Review',

    remarks VARCHAR(255),

    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_credit_loan
        FOREIGN KEY (loan_id)
        REFERENCES loan_application(loan_id)
);


-- ===========================================
-- EMI CALCULATION TABLE
-- ===========================================

CREATE TABLE emi_calculation (
    emi_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    loan_id BIGINT NOT NULL,

    principal_amount DECIMAL(15,2) NOT NULL,

    interest_rate DECIMAL(5,2) NOT NULL,

    tenure_months INT NOT NULL,

    monthly_emi DECIMAL(15,2) NOT NULL,

    total_interest DECIMAL(15,2) NOT NULL,

    total_payable DECIMAL(15,2) NOT NULL,

    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_emi_loan
        FOREIGN KEY (loan_id)
        REFERENCES loan_application(loan_id)
);
