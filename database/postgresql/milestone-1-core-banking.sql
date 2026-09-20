/*
====================================================
 FinCore Digital Banking Management Platform
 Database: PostgreSQL

 Modules:
 1. Account Lifecycle
 2. Balance Management
 3. Statement Generation

 Description:
 This file contains complete database setup including
 tables, constraints, sample data, procedures and triggers.
====================================================
*/


/*
====================================================
 1. TABLE CREATION
 Purpose:
 Creating core banking tables and defining
 relationships using primary keys and foreign keys.
====================================================
*/


-- Stores customer information and KYC details
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    address VARCHAR(200),
    kyc_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Stores customer bank account details
-- One customer can have multiple accounts

CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0,
    available_balance DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_customer
    FOREIGN KEY(customer_id)
    REFERENCES customer(customer_id)
);



-- Stores all account transactions
-- Used for balance management and statement generation

CREATE TABLE transaction_details (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(200),
    transaction_status VARCHAR(20) DEFAULT 'SUCCESS',

    CONSTRAINT fk_account_transaction
    FOREIGN KEY(account_id)
    REFERENCES account(account_id)
);



-- Maintains debit and credit accounting records

CREATE TABLE ledger (
    ledger_id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL,
    debit DECIMAL(12,2) DEFAULT 0,
    credit DECIMAL(12,2) DEFAULT 0,
    ledger_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_ledger
    FOREIGN KEY(transaction_id)
    REFERENCES transaction_details(transaction_id)
);



-- Stores generated account statements

CREATE TABLE statement (
    statement_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statement_type VARCHAR(30),

    CONSTRAINT fk_account_statement
    FOREIGN KEY(account_id)
    REFERENCES account(account_id)
);



-- Maintains account status changes
-- Used for audit and lifecycle tracking

CREATE TABLE account_status_history (
    history_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(200),

    CONSTRAINT fk_account_status
    FOREIGN KEY(account_id)
    REFERENCES account(account_id)
);





/*
====================================================
 2. CONSTRAINTS AND VALIDATIONS
 Purpose:
 Maintaining data integrity and preventing invalid data.
====================================================
*/


-- Balance should never become negative

ALTER TABLE account
ADD CONSTRAINT chk_balance
CHECK(balance >= 0);



-- Transaction amount should always be positive

ALTER TABLE transaction_details
ADD CONSTRAINT chk_amount
CHECK(amount > 0);



-- Only CREDIT and DEBIT transactions are allowed

ALTER TABLE transaction_details
ADD CONSTRAINT chk_transaction_type
CHECK(transaction_type IN ('CREDIT','DEBIT'));





/*
====================================================
 3. SAMPLE DATA INSERTION
 Purpose:
 Adding dummy banking data for testing.
====================================================
*/


-- Customer sample records

INSERT INTO customer
(first_name,last_name,email,phone,address,kyc_status)
VALUES
('Rahul','Sharma','rahul@gmail.com','9876543210','Hyderabad','VERIFIED'),
('Anita','Verma','anita@gmail.com','9876543211','Bangalore','VERIFIED'),
('Kiran','Reddy','kiran@gmail.com','9876543212','Kurnool','VERIFIED');



-- Account sample records

INSERT INTO account
(customer_id,account_number,account_type,balance,available_balance,status)
VALUES
(1,'ACC10001','SAVINGS',50000,50000,'ACTIVE'),
(2,'ACC10002','CURRENT',75000,75000,'ACTIVE'),
(3,'ACC10003','SAVINGS',25000,25000,'ACTIVE');



-- Transaction sample records

INSERT INTO transaction_details
(account_id,transaction_type,amount,description)
VALUES
(1,'CREDIT',10000,'Salary Credit'),
(1,'DEBIT',2500,'ATM Withdrawal'),
(2,'CREDIT',20000,'Business Deposit');





/*
====================================================
 4. STORED PROCEDURES
 Purpose:
 Performing secure banking operations.
====================================================
*/


-- Procedure for depositing money

CREATE OR REPLACE PROCEDURE deposit_money(
acc_id INT,
amt NUMERIC,
p_desc TEXT
)

LANGUAGE plpgsql
AS $$

BEGIN

INSERT INTO transaction_details
(account_id,transaction_type,amount,description)
VALUES
(acc_id,'CREDIT',amt,p_desc);

END;

$$;





/*
====================================================
 5. TRIGGERS
 Purpose:
 Automatically updating account balance
 whenever a transaction occurs.
====================================================
*/


CREATE OR REPLACE FUNCTION update_balance()

RETURNS TRIGGER
LANGUAGE plpgsql
AS $$

BEGIN


IF NEW.transaction_type='CREDIT'
THEN

UPDATE account
SET balance = balance + NEW.amount,
available_balance = available_balance + NEW.amount
WHERE account_id = NEW.account_id;


ELSE

UPDATE account
SET balance = balance - NEW.amount,
available_balance = available_balance - NEW.amount
WHERE account_id = NEW.account_id;


END IF;


RETURN NEW;

END;

$$;



CREATE TRIGGER balance_update_trigger

AFTER INSERT ON transaction_details

FOR EACH ROW

EXECUTE FUNCTION update_balance();





/*
====================================================
 6. TEST QUERIES
 Purpose:
 Checking inserted data.
====================================================
*/


SELECT * FROM customer;

SELECT * FROM account;

SELECT * FROM transaction_details;

SELECT * FROM ledger;

SELECT * FROM statement;

SELECT * FROM account_status_history;
