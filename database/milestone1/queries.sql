-- =========================================================
-- FINCORE DIGITAL BANKING PLATFORM - MILESTONE 1 QUERIES
-- =========================================================
USE fincore_db;

-- 1. Fetch pending KYC records for Supervisor review
SELECT k.id, k.customer_id, c.customer_code, k.full_name, k.document_type, k.document_number, k.risk_level, k.verification_status, k.submitted_at
FROM kyc_records k
JOIN customers c ON k.customer_id = c.id
WHERE k.verification_status IN ('PENDING', 'UNDER_REVIEW')
ORDER BY k.submitted_at DESC;

-- 2. Fetch User permissions and role mapping
SELECT u.username, u.full_name, u.email, u.role, u.status, u.last_login
FROM users u
WHERE u.status = 'ACTIVE'
ORDER BY u.created_at DESC;

-- 3. Query Audit Trail for specific entity or user
SELECT a.id, a.user, a.role, a.action, a.entity, a.entity_id, a.old_value, a.new_value, a.ip_address, a.created_at, a.details
FROM audit_logs a
WHERE a.module = 'MILESTONE_1_KYC_RBAC'
ORDER BY a.created_at DESC
LIMIT 50;

-- 4. Supervisor approve KYC update transaction
UPDATE kyc_records
SET verification_status = 'VERIFIED',
    verified_by = 'supervisor',
    verified_at = CURRENT_TIMESTAMP,
    remarks = 'Verified via automated UIDAI/PAN verification gateway'
WHERE id = 'KYC-5002';

UPDATE customers
SET kyc_status = 'VERIFIED'
WHERE id = (SELECT customer_id FROM kyc_records WHERE id = 'KYC-5002');
