-- ============================================================
-- Milestone 4 - Sample Data
-- Run schema.sql first.
-- ============================================================

USE milestone4_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE audit_alerts;
TRUNCATE TABLE audit_integrity;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE compliance_documents;
TRUNCATE TABLE compliance_details;
TRUNCATE TABLE compliance_checks;
TRUNCATE TABLE risk_factors;
TRUNCATE TABLE risk_score_history;
TRUNCATE TABLE risk_scores;
TRUNCATE TABLE customers;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Customers
-- ------------------------------------------------------------
INSERT INTO customers
(customer_id, customer_name, mobile_number, email, date_of_birth, address)
VALUES
(1, 'Aarav Sharma', '9876543210', 'aarav.sharma@example.com', '1998-04-12', 'Pune, Maharashtra'),
(2, 'Priya Patil', '9876543211', 'priya.patil@example.com', '1996-09-23', 'Nashik, Maharashtra'),
(3, 'Rahul Deshmukh', '9876543212', 'rahul.deshmukh@example.com', '1994-01-15', 'Mumbai, Maharashtra'),
(4, 'Sneha Kulkarni', '9876543213', 'sneha.kulkarni@example.com', '1999-07-08', 'Aurangabad, Maharashtra'),
(5, 'Rohan Joshi', '9876543214', 'rohan.joshi@example.com', '1992-11-30', 'Ahmednagar, Maharashtra');

-- ------------------------------------------------------------
-- Risk Scores
-- ------------------------------------------------------------
INSERT INTO risk_scores
(risk_id, customer_id, risk_score, risk_level, risk_factors, score_date)
VALUES
(1, 1, 18.50, 'LOW', 'Stable income; regular transactions', '2026-08-20'),
(2, 1, 24.00, 'LOW', 'Slight transaction increase', '2026-08-30'),
(3, 2, 47.50, 'MEDIUM', 'High transaction frequency; moderate exposure', '2026-08-25'),
(4, 3, 78.00, 'HIGH', 'Unusual transaction pattern; high exposure', '2026-08-27'),
(5, 4, 12.00, 'LOW', 'Normal account activity', '2026-08-29'),
(6, 5, 55.00, 'MEDIUM', 'Multiple failed verification attempts', '2026-08-30');

-- ------------------------------------------------------------
-- Risk Factors
-- ------------------------------------------------------------
INSERT INTO risk_factors
(factor_id, risk_id, factor_type, factor_value, weightage, description)
VALUES
(1, 1, 'TRANSACTION_PATTERN', 'NORMAL', 20.00, 'Transactions match normal customer behaviour'),
(2, 1, 'ACCOUNT_AGE', '5 YEARS', 10.00, 'Long-standing customer account'),
(3, 2, 'TRANSACTION_VOLUME', 'MODERATE', 25.00, 'Recent transaction volume is moderately higher'),
(4, 3, 'TRANSACTION_FREQUENCY', 'HIGH', 40.00, 'Frequent transactions detected'),
(5, 3, 'EXPOSURE', 'MEDIUM', 35.00, 'Moderate financial exposure'),
(6, 4, 'UNUSUAL_ACTIVITY', 'DETECTED', 60.00, 'Unusual transaction behaviour detected'),
(7, 4, 'EXPOSURE', 'HIGH', 40.00, 'High exposure requires review'),
(8, 5, 'TRANSACTION_PATTERN', 'NORMAL', 15.00, 'No abnormal activity found'),
(9, 6, 'VERIFICATION_FAILURES', 'MULTIPLE', 50.00, 'Multiple verification attempts failed');

-- ------------------------------------------------------------
-- Risk Score History
-- ------------------------------------------------------------
INSERT INTO risk_score_history
(history_id, customer_id, risk_score, risk_level, changed_on, changed_by, remarks)
VALUES
(1, 1, 15.00, 'LOW', '2026-08-10 10:15:00', 101, 'Initial assessment'),
(2, 1, 18.50, 'LOW', '2026-08-20 11:20:00', 101, 'Score increased slightly'),
(3, 1, 24.00, 'LOW', '2026-08-30 09:45:00', 102, 'Updated after transaction review'),
(4, 2, 47.50, 'MEDIUM', '2026-08-25 14:10:00', 103, 'Risk increased due to transaction frequency'),
(5, 3, 78.00, 'HIGH', '2026-08-27 16:30:00', 104, 'High-risk activity detected'),
(6, 5, 55.00, 'MEDIUM', '2026-08-30 12:00:00', 102, 'Verification failures increased score');

-- ------------------------------------------------------------
-- Compliance Checks
-- ------------------------------------------------------------
INSERT INTO compliance_checks
(compliance_id, customer_id, check_type, status, performed_on, performed_by, remarks)
VALUES
(1, 1, 'KYC', 'PASS', '2026-08-20 10:00:00', 101, 'KYC successfully verified'),
(2, 1, 'AML', 'PASS', '2026-08-20 10:30:00', 101, 'AML screening clear'),
(3, 2, 'KYC', 'PASS', '2026-08-25 09:30:00', 103, 'KYC verified'),
(4, 2, 'TXN_LIMIT', 'FAIL', '2026-08-25 15:00:00', 103, 'Transaction threshold exceeded'),
(5, 3, 'AML', 'FAIL', '2026-08-27 16:00:00', 104, 'AML review required'),
(6, 4, 'DOC_VERIFY', 'PENDING', NULL, NULL, 'Document verification pending'),
(7, 5, 'KYC', 'FAIL', '2026-08-30 11:30:00', 102, 'Submitted document could not be verified');

-- ------------------------------------------------------------
-- Compliance Details
-- ------------------------------------------------------------
INSERT INTO compliance_details
(detail_id, compliance_id, rule_code, rule_description, expected_value, actual_value, result)
VALUES
(1, 1, 'KYC-001', 'Customer identity must be verified', 'VERIFIED', 'VERIFIED', 'PASS'),
(2, 1, 'KYC-002', 'Customer mobile number must be present', 'PRESENT', 'PRESENT', 'PASS'),
(3, 2, 'AML-001', 'Customer must not match AML watchlist', 'NO_MATCH', 'NO_MATCH', 'PASS'),
(4, 4, 'TXN-001', 'Daily transaction must be within permitted limit', '<= 500000', '650000', 'FAIL'),
(5, 5, 'AML-002', 'Suspicious activity must be absent', 'NO_SUSPICION', 'SUSPICION', 'FAIL'),
(6, 7, 'KYC-003', 'Identity document must be valid', 'VALID', 'INVALID', 'FAIL');

-- ------------------------------------------------------------
-- Compliance Documents
-- ------------------------------------------------------------
INSERT INTO compliance_documents
(document_id, compliance_id, document_name, document_type, file_path, verified_by, verified_on, status)
VALUES
(1, 1, 'Aarav_Aadhaar.pdf', 'AADHAAR', '/documents/kyc/aarav_aadhaar.pdf', 101, '2026-08-20 10:05:00', 'VERIFIED'),
(2, 1, 'Aarav_PAN.pdf', 'PAN', '/documents/kyc/aarav_pan.pdf', 101, '2026-08-20 10:06:00', 'VERIFIED'),
(3, 3, 'Priya_Aadhaar.pdf', 'AADHAAR', '/documents/kyc/priya_aadhaar.pdf', 103, '2026-08-25 09:35:00', 'VERIFIED'),
(4, 6, 'Sneha_AddressProof.pdf', 'ADDRESS_PROOF', '/documents/kyc/sneha_address.pdf', NULL, NULL, 'PENDING'),
(5, 7, 'Rohan_ID.pdf', 'IDENTITY_PROOF', '/documents/kyc/rohan_id.pdf', 102, '2026-08-30 11:35:00', 'REJECTED');

-- ------------------------------------------------------------
-- Audit Logs
-- ------------------------------------------------------------
INSERT INTO audit_logs
(audit_id, user_id, action, entity_type, entity_id, details, ip_address, created_at)
VALUES
(1, 101, 'CREATE', 'CUSTOMER', 1, 'Customer profile created', '192.168.1.10', '2026-08-20 09:00:00'),
(2, 101, 'UPDATE', 'RISK_SCORE', 1, 'Risk score updated to 18.50', '192.168.1.10', '2026-08-20 11:20:00'),
(3, 103, 'VERIFY', 'COMPLIANCE', 3, 'KYC verification completed', '192.168.1.12', '2026-08-25 09:30:00'),
(4, 104, 'FLAG', 'COMPLIANCE', 5, 'AML compliance failure recorded', '192.168.1.15', '2026-08-27 16:05:00'),
(5, 102, 'VERIFY', 'DOCUMENT', 5, 'Document verification failed', '192.168.1.11', '2026-08-30 11:35:00'),
(6, 102, 'UPDATE', 'RISK_SCORE', 6, 'Risk score updated after verification failure', '192.168.1.11', '2026-08-30 12:00:00');

-- ------------------------------------------------------------
-- Audit Integrity
-- Hash values are sample placeholders for development/testing.
-- ------------------------------------------------------------
INSERT INTO audit_integrity
(integrity_id, audit_id, hash_value, previous_hash, is_valid, verified_on, verified_by)
VALUES
(1, 1, 'HASH_AUDIT_001', NULL, TRUE, '2026-08-20 09:01:00', 101),
(2, 2, 'HASH_AUDIT_002', 'HASH_AUDIT_001', TRUE, '2026-08-20 11:21:00', 101),
(3, 3, 'HASH_AUDIT_003', 'HASH_AUDIT_002', TRUE, '2026-08-25 09:31:00', 103),
(4, 4, 'HASH_AUDIT_004', 'HASH_AUDIT_003', FALSE, '2026-08-27 16:10:00', 104),
(5, 5, 'HASH_AUDIT_005', 'HASH_AUDIT_004', FALSE, '2026-08-30 11:36:00', 102),
(6, 6, 'HASH_AUDIT_006', 'HASH_AUDIT_005', TRUE, '2026-08-30 12:01:00', 102);

-- ------------------------------------------------------------
-- Audit Alerts
-- ------------------------------------------------------------
INSERT INTO audit_alerts
(alert_id, integrity_id, alert_type, description, status, created_at, resolved_on, resolved_by)
VALUES
(1, 4, 'INVALID_HASH', 'Audit hash validation failed for AML compliance event', 'OPEN', '2026-08-27 16:11:00', NULL, NULL),
(2, 4, 'TAMPER_DETECTED', 'Unexpected change detected in audit integrity chain', 'OPEN', '2026-08-27 16:12:00', NULL, NULL),
(3, 5, 'INVALID_HASH', 'Document verification audit hash is invalid', 'RESOLVED', '2026-08-30 11:37:00', '2026-08-30 12:15:00', 102);

-- ============================================================
-- End of sample data
-- ============================================================
