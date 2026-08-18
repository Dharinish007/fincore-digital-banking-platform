-- ==========================================
-- LOAN DUMMY DATA
-- ==========================================

INSERT INTO loans
(id, principal_amount, annual_interest_rate, tenure_months,
 emi_amount, total_interest, total_amount, start_date, end_date)
VALUES
    (1, 500000.00, 10.50, 60,
     10748.33, 144899.80, 644899.80,
     '2026-08-01', '2031-08-01');

INSERT INTO loans
(id, principal_amount, annual_interest_rate, tenure_months,
 emi_amount, total_interest, total_amount, start_date, end_date)
VALUES
    (2, 300000.00, 9.50, 36,
     9615.15, 46145.40, 346145.40,
     '2026-08-01', '2029-08-01');


-- ==========================================
-- EMI DUMMY DATA
-- ==========================================

INSERT INTO emis
(id, installment_number, due_date, emi_amount,
 principal_amount, interest_amount, amount_paid,
 payment_date, status, loan_id)
VALUES
    (1, 1, '2026-09-01', 10748.33,
     6373.33, 4375.00, 0.00,
     NULL, 'PENDING', 1);

INSERT INTO emis
(id, installment_number, due_date, emi_amount,
 principal_amount, interest_amount, amount_paid,
 payment_date, status, loan_id)
VALUES
    (2, 2, '2026-10-01', 10748.33,
     6429.10, 4319.23, 0.00,
     NULL, 'PENDING', 1);

INSERT INTO emis
(id, installment_number, due_date, emi_amount,
 principal_amount, interest_amount, amount_paid,
 payment_date, status, loan_id)
VALUES
    (3, 3, '2026-11-01', 10748.33,
     6485.36, 4262.97, 0.00,
     NULL, 'PENDING', 1);

INSERT INTO emis
(id, installment_number, due_date, emi_amount,
 principal_amount, interest_amount, amount_paid,
 payment_date, status, loan_id)
VALUES
    (4, 1, '2026-09-01', 9615.15,
     7240.15, 2375.00, 0.00,
     NULL, 'PENDING', 2);


-- ==========================================
-- DISBURSEMENT DUMMY DATA
-- ==========================================

INSERT INTO disbursements
(id, amount, disbursement_date, reference_number,
 beneficiary_account, status, loan_id)
VALUES
    (1, 500000.00,
     '2026-08-02 10:30:00',
     'DISB-10001',
     '1234567890',
     'COMPLETED',
     1);

INSERT INTO disbursements
(id, amount, disbursement_date, reference_number,
 beneficiary_account, status, loan_id)
VALUES
    (2, 300000.00,
     '2026-08-02 11:00:00',
     'DISB-10002',
     '9876543210',
     'COMPLETED',
     2);


-- ==========================================
-- COLLECTION DUMMY DATA
-- ==========================================

INSERT INTO collections
(id, amount_due, amount_collected, due_date,
 collection_date, days_overdue, status, emi_id)
VALUES
    (1, 10748.33, 0.00,
     '2026-08-01',
     NULL,
     15,
     'OVERDUE',
     1);

INSERT INTO collections
(id, amount_due, amount_collected, due_date,
 collection_date, days_overdue, status, emi_id)
VALUES
    (2, 10748.33, 5000.00,
     '2026-08-01',
     '2026-08-10',
     9,
     'PARTIALLY_PAID',
     2);

ALTER TABLE loans ALTER COLUMN id RESTART WITH 3;

ALTER TABLE emis ALTER COLUMN id RESTART WITH 5;

ALTER TABLE disbursements ALTER COLUMN id RESTART WITH 3;

ALTER TABLE collections ALTER COLUMN id RESTART WITH 3;