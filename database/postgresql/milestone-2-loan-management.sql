-- ============================================================
-- FINCORE DIGITAL BANKING MANAGEMENT SYSTEM
-- EMI CALCULATION, DISBURSEMENT AND COLLECTIONS
-- PostgreSQL
-- ============================================================

-- ============================================================
-- 1. DATABASE
-- ============================================================

-- Run this separately if the database does not exist:
-- CREATE DATABASE fincore_db;

-- Connect to fincore_db before running the remaining script.


-- ============================================================
-- 2. DROP TABLES
-- ============================================================

DROP TABLE IF EXISTS emi_collections CASCADE;
DROP TABLE IF EXISTS emi_schedule CASCADE;
DROP TABLE IF EXISTS loan_transactions CASCADE;
DROP TABLE IF EXISTS loan_disbursement CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;


-- ============================================================
-- 3. CUSTOMERS
-- ============================================================

CREATE TABLE customers (
    customer_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. ACCOUNTS
-- ============================================================

CREATE TABLE accounts (
    account_id BIGSERIAL PRIMARY KEY,

    customer_id BIGINT NOT NULL,

    account_number VARCHAR(30) UNIQUE NOT NULL,

    account_type VARCHAR(30)
        CHECK (account_type IN ('SAVINGS', 'CURRENT')),

    balance NUMERIC(15,2) DEFAULT 0
        CHECK (balance >= 0),

    status VARCHAR(20) DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'BLOCKED', 'CLOSED')),

    opening_date DATE DEFAULT CURRENT_DATE,

    CONSTRAINT fk_account_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 5. LOANS
-- ============================================================

CREATE TABLE loans (
    loan_id BIGSERIAL PRIMARY KEY,

    customer_id BIGINT NOT NULL,

    account_id BIGINT NOT NULL,

    loan_number VARCHAR(30) UNIQUE NOT NULL,

    loan_type VARCHAR(50) NOT NULL,

    principal_amount NUMERIC(15,2) NOT NULL
        CHECK (principal_amount > 0),

    annual_interest_rate NUMERIC(5,2) NOT NULL
        CHECK (annual_interest_rate >= 0),

    tenure_months INTEGER NOT NULL
        CHECK (tenure_months > 0),

    monthly_emi NUMERIC(15,2),

    total_interest NUMERIC(15,2),

    total_payable NUMERIC(15,2),

    disbursed_amount NUMERIC(15,2) DEFAULT 0,

    outstanding_principal NUMERIC(15,2),

    outstanding_interest NUMERIC(15,2) DEFAULT 0,

    loan_status VARCHAR(30) DEFAULT 'PENDING'
        CHECK (
            loan_status IN
            ('PENDING', 'APPROVED', 'DISBURSED',
             'ACTIVE', 'COMPLETED', 'DEFAULTED', 'CLOSED')
        ),

    application_date DATE DEFAULT CURRENT_DATE,

    approval_date DATE,

    disbursement_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loan_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id),

    CONSTRAINT fk_loan_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
);


-- ============================================================
-- 6. LOAN DISBURSEMENT
-- ============================================================

CREATE TABLE loan_disbursement (
    disbursement_id BIGSERIAL PRIMARY KEY,

    loan_id BIGINT NOT NULL,

    account_id BIGINT NOT NULL,

    disbursement_amount NUMERIC(15,2) NOT NULL
        CHECK (disbursement_amount > 0),

    disbursement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    disbursement_status VARCHAR(20) DEFAULT 'SUCCESS'
        CHECK (
            disbursement_status IN
            ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED')
        ),

    reference_number VARCHAR(50) UNIQUE,

    remarks TEXT,

    CONSTRAINT fk_disbursement_loan
        FOREIGN KEY (loan_id)
        REFERENCES loans(loan_id),

    CONSTRAINT fk_disbursement_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
);


-- ============================================================
-- 7. EMI SCHEDULE
-- ============================================================

CREATE TABLE emi_schedule (
    emi_id BIGSERIAL PRIMARY KEY,

    loan_id BIGINT NOT NULL,

    emi_number INTEGER NOT NULL,

    due_date DATE NOT NULL,

    opening_principal NUMERIC(15,2) NOT NULL,

    emi_amount NUMERIC(15,2) NOT NULL,

    principal_component NUMERIC(15,2) NOT NULL,

    interest_component NUMERIC(15,2) NOT NULL,

    closing_principal NUMERIC(15,2) NOT NULL,

    paid_amount NUMERIC(15,2) DEFAULT 0,

    remaining_amount NUMERIC(15,2),

    emi_status VARCHAR(20) DEFAULT 'PENDING'
        CHECK (
            emi_status IN
            ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE')
        ),

    payment_date DATE,

    CONSTRAINT fk_emi_loan
        FOREIGN KEY (loan_id)
        REFERENCES loans(loan_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_loan_emi
        UNIQUE (loan_id, emi_number)
);


-- ============================================================
-- 8. EMI COLLECTIONS
-- ============================================================

CREATE TABLE emi_collections (
    collection_id BIGSERIAL PRIMARY KEY,

    emi_id BIGINT NOT NULL,

    loan_id BIGINT NOT NULL,

    customer_id BIGINT NOT NULL,

    payment_amount NUMERIC(15,2) NOT NULL
        CHECK (payment_amount > 0),

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    payment_method VARCHAR(30)
        CHECK (
            payment_method IN
            ('CASH', 'BANK_TRANSFER', 'UPI',
             'CARD', 'AUTO_DEBIT')
        ),

    transaction_reference VARCHAR(100) UNIQUE,

    collection_status VARCHAR(20) DEFAULT 'SUCCESS'
        CHECK (
            collection_status IN
            ('SUCCESS', 'FAILED', 'REVERSED')
        ),

    remarks TEXT,

    CONSTRAINT fk_collection_emi
        FOREIGN KEY (emi_id)
        REFERENCES emi_schedule(emi_id),

    CONSTRAINT fk_collection_loan
        FOREIGN KEY (loan_id)
        REFERENCES loans(loan_id),

    CONSTRAINT fk_collection_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);


-- ============================================================
-- 9. LOAN TRANSACTIONS
-- ============================================================

CREATE TABLE loan_transactions (
    transaction_id BIGSERIAL PRIMARY KEY,

    loan_id BIGINT NOT NULL,

    customer_id BIGINT NOT NULL,

    transaction_type VARCHAR(30) NOT NULL
        CHECK (
            transaction_type IN
            ('DISBURSEMENT',
             'EMI_PAYMENT',
             'INTEREST',
             'PENALTY',
             'REVERSAL')
        ),

    amount NUMERIC(15,2) NOT NULL
        CHECK (amount > 0),

    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    reference_number VARCHAR(100),

    remarks TEXT,

    CONSTRAINT fk_transaction_loan
        FOREIGN KEY (loan_id)
        REFERENCES loans(loan_id),

    CONSTRAINT fk_transaction_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);


-- ============================================================
-- 10. INDEXES
-- ============================================================

CREATE INDEX idx_customer_email
ON customers(email);

CREATE INDEX idx_account_customer
ON accounts(customer_id);

CREATE INDEX idx_loan_customer
ON loans(customer_id);

CREATE INDEX idx_loan_status
ON loans(loan_status);

CREATE INDEX idx_emi_loan
ON emi_schedule(loan_id);

CREATE INDEX idx_emi_due_date
ON emi_schedule(due_date);

CREATE INDEX idx_emi_status
ON emi_schedule(emi_status);

CREATE INDEX idx_collection_loan
ON emi_collections(loan_id);

CREATE INDEX idx_transaction_loan
ON loan_transactions(loan_id);


-- ============================================================
-- 11. EMI CALCULATION FUNCTION
--
-- EMI = P * r * (1+r)^n / ((1+r)^n - 1)
--
-- P = Principal
-- r = Monthly interest rate
-- n = Number of months
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_emi(
    p_principal NUMERIC,
    p_annual_rate NUMERIC,
    p_tenure INTEGER
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    monthly_rate NUMERIC;
    emi NUMERIC;
BEGIN

    monthly_rate := p_annual_rate / 12 / 100;

    IF monthly_rate = 0 THEN
        emi := p_principal / p_tenure;
    ELSE
        emi :=
            p_principal
            * monthly_rate
            * POWER(1 + monthly_rate, p_tenure)
            / (
                POWER(1 + monthly_rate, p_tenure) - 1
            );
    END IF;

    RETURN ROUND(emi, 2);

END;
$$;


-- ============================================================
-- 12. CREATE EMI SCHEDULE
-- ============================================================

CREATE OR REPLACE PROCEDURE generate_emi_schedule(
    p_loan_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE

    loan_record RECORD;

    monthly_rate NUMERIC;
    emi NUMERIC;

    opening_balance NUMERIC;
    interest_amount NUMERIC;
    principal_amount NUMERIC;
    closing_balance NUMERIC;

    i INTEGER;

BEGIN

    SELECT *
    INTO loan_record
    FROM loans
    WHERE loan_id = p_loan_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Loan not found';
    END IF;

    monthly_rate :=
        loan_record.annual_interest_rate / 12 / 100;

    emi :=
        calculate_emi(
            loan_record.principal_amount,
            loan_record.annual_interest_rate,
            loan_record.tenure_months
        );

    opening_balance :=
        loan_record.principal_amount;

    -- Remove existing schedule if any
    DELETE FROM emi_schedule
    WHERE loan_id = p_loan_id;

    FOR i IN 1..loan_record.tenure_months LOOP

        interest_amount :=
            ROUND(opening_balance * monthly_rate, 2);

        principal_amount :=
            ROUND(emi - interest_amount, 2);

        -- Last EMI adjustment
        IF i = loan_record.tenure_months THEN
            principal_amount := opening_balance;
            emi := principal_amount + interest_amount;
        END IF;

        closing_balance :=
            ROUND(opening_balance - principal_amount, 2);

        INSERT INTO emi_schedule (
            loan_id,
            emi_number,
            due_date,
            opening_principal,
            emi_amount,
            principal_component,
            interest_component,
            closing_principal,
            paid_amount,
            remaining_amount,
            emi_status
        )
        VALUES (
            p_loan_id,
            i,
            CURRENT_DATE + (i || ' months')::INTERVAL,
            opening_balance,
            emi,
            principal_amount,
            interest_amount,
            closing_balance,
            0,
            emi,
            'PENDING'
        );

        opening_balance := closing_balance;

    END LOOP;

    UPDATE loans
    SET
        monthly_emi = calculate_emi(
            principal_amount,
            annual_interest_rate,
            tenure_months
        ),
        total_interest =
            (
                SELECT COALESCE(
                    SUM(interest_component), 0
                )
                FROM emi_schedule
                WHERE loan_id = p_loan_id
            ),
        total_payable =
            (
                SELECT COALESCE(
                    SUM(emi_amount), 0
                )
                FROM emi_schedule
                WHERE loan_id = p_loan_id
            ),
        outstanding_principal =
            principal_amount
    WHERE loan_id = p_loan_id;

END;
$$;


-- ============================================================
-- 13. DISBURSE LOAN
-- ============================================================

CREATE OR REPLACE PROCEDURE disburse_loan(
    p_loan_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE

    loan_record RECORD;

BEGIN

    SELECT *
    INTO loan_record
    FROM loans
    WHERE loan_id = p_loan_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Loan not found';
    END IF;

    IF loan_record.loan_status NOT IN
        ('APPROVED', 'PENDING') THEN

        RAISE EXCEPTION
        'Loan cannot be disbursed in current status';

    END IF;

    -- Add money to customer's account
    UPDATE accounts
    SET balance = balance + loan_record.principal_amount
    WHERE account_id = loan_record.account_id;

    -- Record disbursement
    INSERT INTO loan_disbursement (
        loan_id,
        account_id,
        disbursement_amount,
        reference_number,
        remarks
    )
    VALUES (
        p_loan_id,
        loan_record.account_id,
        loan_record.principal_amount,
        'DISB-' || p_loan_id || '-' ||
        EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT,
        'Loan amount disbursed'
    );

    -- Update loan
    UPDATE loans
    SET
        disbursed_amount = principal_amount,
        outstanding_principal = principal_amount,
        loan_status = 'ACTIVE',
        disbursement_date = CURRENT_DATE,
        approval_date = COALESCE(
            approval_date,
            CURRENT_DATE
        )
    WHERE loan_id = p_loan_id;

    -- Transaction record
    INSERT INTO loan_transactions (
        loan_id,
        customer_id,
        transaction_type,
        amount,
        reference_number,
        remarks
    )
    VALUES (
        p_loan_id,
        loan_record.customer_id,
        'DISBURSEMENT',
        loan_record.principal_amount,
        'DISB-' || p_loan_id,
        'Loan disbursement'
    );

    -- Generate EMI schedule
    CALL generate_emi_schedule(p_loan_id);

END;
$$;


-- ============================================================
-- 14. EMI COLLECTION PROCEDURE
-- ============================================================

CREATE OR REPLACE PROCEDURE collect_emi(
    p_emi_id BIGINT,
    p_amount NUMERIC,
    p_payment_method VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE

    emi_record RECORD;
    loan_record RECORD;

    new_paid_amount NUMERIC;
    new_remaining_amount NUMERIC;

BEGIN

    SELECT *
    INTO emi_record
    FROM emi_schedule
    WHERE emi_id = p_emi_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'EMI not found';
    END IF;

    SELECT *
    INTO loan_record
    FROM loans
    WHERE loan_id = emi_record.loan_id;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Payment amount must be greater than zero';
    END IF;

    new_paid_amount :=
        emi_record.paid_amount + p_amount;

    new_remaining_amount :=
        GREATEST(
            emi_record.emi_amount - new_paid_amount,
            0
        );

    -- Update EMI
    UPDATE emi_schedule
    SET
        paid_amount = new_paid_amount,

        remaining_amount =
            new_remaining_amount,

        emi_status =
            CASE
                WHEN new_remaining_amount = 0
                    THEN 'PAID'
                ELSE 'PARTIAL'
            END,

        payment_date =
            CASE
                WHEN new_remaining_amount = 0
                    THEN CURRENT_DATE
                ELSE payment_date
            END

    WHERE emi_id = p_emi_id;

    -- Reduce loan outstanding principal
    UPDATE loans
    SET outstanding_principal =
        GREATEST(
            outstanding_principal
            - LEAST(
                p_amount,
                emi_record.principal_component
              ),
            0
        )
    WHERE loan_id = emi_record.loan_id;

    -- Collection record
    INSERT INTO emi_collections (
        emi_id,
        loan_id,
        customer_id,
        payment_amount,
        payment_method,
        transaction_reference,
        remarks
    )
    VALUES (
        p_emi_id,
        emi_record.loan_id,
        loan_record.customer_id,
        p_amount,
        p_payment_method,
        'PAY-' || p_emi_id || '-' ||
        EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT,
        'EMI collection'
    );

    -- Transaction record
    INSERT INTO loan_transactions (
        loan_id,
        customer_id,
        transaction_type,
        amount,
        reference_number,
        remarks
    )
    VALUES (
        emi_record.loan_id,
        loan_record.customer_id,
        'EMI_PAYMENT',
        p_amount,
        'PAY-' || p_emi_id,
        'EMI payment received'
    );

    -- Check whether all EMIs are paid
    IF NOT EXISTS (
        SELECT 1
        FROM emi_schedule
        WHERE loan_id = emi_record.loan_id
        AND emi_status <> 'PAID'
    ) THEN

        UPDATE loans
        SET
            loan_status = 'COMPLETED',
            outstanding_principal = 0
        WHERE loan_id = emi_record.loan_id;

    END IF;

END;
$$;


-- ============================================================
-- 15. MARK OVERDUE EMIs
-- ============================================================

CREATE OR REPLACE PROCEDURE mark_overdue_emis()
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE emi_schedule
    SET emi_status = 'OVERDUE'
    WHERE due_date < CURRENT_DATE
    AND remaining_amount > 0
    AND emi_status IN ('PENDING', 'PARTIAL');

END;
$$;


-- ============================================================
-- 16. VIEW: LOAN SUMMARY
-- ============================================================

CREATE OR REPLACE VIEW loan_summary AS
SELECT

    l.loan_id,

    l.loan_number,

    c.customer_id,

    c.first_name || ' ' ||
    COALESCE(c.last_name, '') AS customer_name,

    c.email,

    l.loan_type,

    l.principal_amount,

    l.annual_interest_rate,

    l.tenure_months,

    l.monthly_emi,

    l.total_interest,

    l.total_payable,

    l.disbursed_amount,

    l.outstanding_principal,

    l.loan_status,

    l.disbursement_date

FROM loans l

JOIN customers c
    ON l.customer_id = c.customer_id;


-- ============================================================
-- 17. VIEW: EMI COLLECTION STATUS
-- ============================================================

CREATE OR REPLACE VIEW emi_collection_status AS
SELECT

    e.emi_id,

    e.loan_id,

    l.loan_number,

    c.customer_id,

    c.first_name || ' ' ||
    COALESCE(c.last_name, '') AS customer_name,

    e.emi_number,

    e.due_date,

    e.emi_amount,

    e.principal_component,

    e.interest_component,

    e.paid_amount,

    e.remaining_amount,

    e.emi_status,

    e.payment_date

FROM emi_schedule e

JOIN loans l
    ON e.loan_id = l.loan_id

JOIN customers c
    ON l.customer_id = c.customer_id;


-- ============================================================
-- 18. VIEW: OVERDUE EMIs
-- ============================================================

CREATE OR REPLACE VIEW overdue_emis AS
SELECT

    e.emi_id,

    e.loan_id,

    l.loan_number,

    c.customer_id,

    c.first_name || ' ' ||
    COALESCE(c.last_name, '') AS customer_name,

    c.phone,

    e.emi_number,

    e.due_date,

    e.emi_amount,

    e.paid_amount,

    e.remaining_amount,

    CURRENT_DATE - e.due_date AS days_overdue

FROM emi_schedule e

JOIN loans l
    ON e.loan_id = l.loan_id

JOIN customers c
    ON l.customer_id = c.customer_id

WHERE e.remaining_amount > 0
AND e.due_date < CURRENT_DATE;


-- ============================================================
-- 19. SAMPLE CUSTOMERS
-- ============================================================

INSERT INTO customers (
    first_name,
    last_name,
    email,
    phone,
    address
)
VALUES
(
    'Indu',
    'Patil',
    'indu@example.com',
    '9876543210',
    'Andhra Pradesh'
),
(
    'Rahul',
    'Kumar',
    'rahul@example.com',
    '9876543211',
    'Hyderabad'
),
(
    'Priya',
    'Reddy',
    'priya@example.com',
    '9876543212',
    'Bangalore'
);


-- ============================================================
-- 20. SAMPLE ACCOUNTS
-- ============================================================

INSERT INTO accounts (
    customer_id,
    account_number,
    account_type,
    balance
)
VALUES
(
    1,
    'FINC100001',
    'SAVINGS',
    50000
),
(
    2,
    'FINC100002',
    'SAVINGS',
    75000
),
(
    3,
    'FINC100003',
    'SAVINGS',
    100000
);


-- ============================================================
-- 21. SAMPLE LOANS
-- ============================================================

INSERT INTO loans (
    customer_id,
    account_id,
    loan_number,
    loan_type,
    principal_amount,
    annual_interest_rate,
    tenure_months,
    loan_status
)
VALUES
(
    1,
    1,
    'LN100001',
    'PERSONAL',
    500000,
    10.5,
    24,
    'APPROVED'
),
(
    2,
    2,
    'LN100002',
    'HOME',
    2000000,
    8.5,
    120,
    'APPROVED'
),
(
    3,
    3,
    'LN100003',
    'VEHICLE',
    800000,
    9.5,
    60,
    'APPROVED'
);


-- ============================================================
-- 22. GENERATE EMI FOR SAMPLE LOAN
-- ============================================================

CALL generate_emi_schedule(1);


-- ============================================================
-- 23. DISBURSE SAMPLE LOAN
-- ============================================================

CALL disburse_loan(1);


-- ============================================================
-- 24. SAMPLE EMI COLLECTION
-- ============================================================

-- First EMI ID for loan 1
-- Uncomment after checking EMI ID.

-- CALL collect_emi(
--     1,
--     23000,
--     'UPI'
-- );


-- ============================================================
-- 25. USEFUL QUERIES
-- ============================================================

-- All customers
-- SELECT * FROM customers;


-- All accounts
-- SELECT * FROM accounts;


-- All loans
-- SELECT * FROM loans;


-- Loan summary
-- SELECT * FROM loan_summary;


-- EMI schedule
-- SELECT * FROM emi_collection_status
-- WHERE loan_id = 1
-- ORDER BY emi_number;


-- Overdue EMIs
-- SELECT * FROM overdue_emis;


-- Total collection for a loan
-- SELECT
--     loan_id,
--     SUM(payment_amount) AS total_collected
-- FROM emi_collections
-- WHERE collection_status = 'SUCCESS'
-- GROUP BY loan_id;


-- Monthly collections
-- SELECT
--     DATE_TRUNC('month', payment_date) AS month,
--     SUM(payment_amount) AS total_collection
-- FROM emi_collections
-- WHERE collection_status = 'SUCCESS'
-- GROUP BY DATE_TRUNC('month', payment_date)
-- ORDER BY month;


-- Outstanding loans
-- SELECT
--     loan_number,
--     principal_amount,
--     outstanding_principal,
--     loan_status
-- FROM loans
-- WHERE outstanding_principal > 0;


-- ============================================================
-- END OF FINCORE EMI DATABASE
-- ============================================================
