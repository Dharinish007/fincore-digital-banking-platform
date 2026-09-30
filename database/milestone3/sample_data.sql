-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - MILESTONE 3 SAMPLE DATA
-- =========================================================
USE fincore_db;

INSERT INTO transactions (id, transaction_reference, source_account_id, destination_account_id, customer_id, customer_name, amount, currency, type, status, description, saga_id, settlement_id) VALUES
('TXN-10001', 'TXN-FC-20250303-0982', 'ACC-SYSTEM-POOL', 'ACC-8001', 'CUST-1001', 'Rohan Sharma', 500000.00, 'INR', 'LOAN_DISBURSEMENT', 'SUCCESS', 'Loan Disbursement for LN-MUM-2025-081', 'SAGA-DISB-001', 'SETTL-8801'),
('TXN-10002', 'TXN-FC-20250903-4412', 'ACC-8001', 'ACC-SYSTEM-LOAN', 'CUST-1001', 'Rohan Sharma', 23190.00, 'INR', 'LOAN_REPAYMENT', 'SUCCESS', 'EMI Repayment Installment #6 for LN-MUM-2025-081', 'SAGA-REP-006', 'SETTL-8802'),
('TXN-10004', 'TXN-FC-20250915-7781', 'ACC-8003', 'ACC-EXTERNAL-HDFC', 'CUST-1002', 'Priya Patel', 120000.00, 'INR', 'TRANSFER', 'FAILED', 'NEFT Transfer to HDFC Bank A/c 5010049219', 'SAGA-PAY-004', 'SETTL-8804');

INSERT INTO saga_instances (id, saga_type, transaction_id, customer_id, customer_name, loan_id, account_id, amount, currency, current_step, total_steps, status, retry_count, max_retries, idempotency_key, failure_reason) VALUES
('SAGA-DISB-001', 'DISBURSEMENT', 'TXN-10001', 'CUST-1001', 'Rohan Sharma', 'LN-3001', 'ACC-8001', 500000.00, 'INR', 6, 6, 'COMPLETED', 0, 3, 'IDEMP-DISB-LN3001-20250303', NULL),
('SAGA-PAY-004', 'PAYMENT', 'TXN-10004', 'CUST-1002', 'Priya Patel', NULL, 'ACC-8003', 120000.00, 'INR', 4, 5, 'COMPENSATED', 3, 3, 'IDEMP-NEFT-CUST1002-20250915', 'External Clearing House (HDFC Bank Gateway) returned E-503 Timeout after 3 retry attempts.');

INSERT INTO settlements (id, settlement_reference, transaction_id, saga_id, customer_id, customer_name, amount, currency, settlement_type, bank_reference, clearing_house, status, failure_reason, retry_count) VALUES
('SETTL-8801', 'STL-FC-20250303-0192', 'TXN-10001', 'SAGA-DISB-001', 'CUST-1001', 'Rohan Sharma', 500000.00, 'INR', 'INTERNAL_CLEARING', 'FC-INT-DISB-880199', 'FinCore Core Ledger Settlement', 'SUCCESS', NULL, 0),
('SETTL-8804', 'STL-FC-20250915-7781', 'TXN-10004', 'SAGA-PAY-004', 'CUST-1002', 'Priya Patel', 120000.00, 'INR', 'NEFT', 'RBI-NEFT-PENDING-ERR', 'Reserve Bank of India NEFT Clearing Hub', 'REVERSED', 'Clearing partner HDFC gateway dropped connection. Funds reversed to customer account.', 3);

INSERT INTO notifications (id, customer_id, type, title, message, channel, status, is_read) VALUES
('NOTIF-001', 'CUST-1001', 'KYC_APPROVED', 'KYC Document Verification Approved', 'Your KYC records have been verified by Supervisor.', 'IN_APP', 'DELIVERED', TRUE),
('NOTIF-002', 'CUST-1001', 'LOAN_DISBURSED', 'Loan Disbursed: ₹5,00,000 Credited', 'Personal Loan LN-MUM-2025-081 has been disbursed via Saga Orchestrator.', 'SMS', 'SENT', TRUE),
('NOTIF-005', 'CUST-1002', 'SAGA_COMPENSATED', 'Transfer Failed & Compensated', 'Your NEFT transfer of ₹1,20,000 encountered a partner gateway timeout. Funds safely restored.', 'IN_APP', 'DELIVERED', FALSE);
