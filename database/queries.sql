-- ==========================================
-- FinCore Digital Banking Application
-- Common SQL Queries
-- ==========================================

USE fincore_db;

-- ==========================================
-- RBAC (Role-Based Access Control)
-- ==========================================

-- View all roles
SELECT * FROM Roles;

-- View all users with their roles
SELECT
    u.user_id,
    u.full_name,
    u.email,
    r.role_name
FROM Users u
JOIN Roles r
ON u.role_id = r.role_id;

-- Get role of a specific user
SELECT
    u.full_name,
    r.role_name
FROM Users u
JOIN Roles r
ON u.role_id = r.role_id
WHERE u.user_id = 1;

-- ==========================================
-- USER LOGIN
-- ==========================================

SELECT *
FROM Users
WHERE username = 'customer1'
AND password = 'password123';

-- ==========================================
-- KYC VERIFICATION
-- ==========================================

-- View all KYC records
SELECT * FROM KYC_Details;

-- View pending KYC requests
SELECT *
FROM KYC_Details
WHERE verification_status='Pending';

-- View approved KYC
SELECT *
FROM KYC_Details
WHERE verification_status='Approved';

-- View rejected KYC
SELECT *
FROM KYC_Details
WHERE verification_status='Rejected';

-- Approve KYC
UPDATE KYC_Details
SET verification_status='Approved',
verified_by=2,
verified_date=NOW()
WHERE kyc_id=1;

-- Reject KYC
UPDATE KYC_Details
SET verification_status='Rejected',
verified_by=2,
verified_date=NOW(),
remarks='Document mismatch'
WHERE kyc_id=2;

-- Customer KYC Status
SELECT
u.full_name,
k.verification_status,
k.verified_date
FROM Users u
JOIN KYC_Details k
ON u.user_id=k.user_id;

-- ==========================================
-- AUDIT TRAIL
-- ==========================================

-- View complete audit logs
SELECT *
FROM Audit_Logs
ORDER BY action_time DESC;

-- View logs of a specific user
SELECT *
FROM Audit_Logs
WHERE user_id=1;

-- View logs of KYC module
SELECT *
FROM Audit_Logs
WHERE module_name='KYC';

-- Search audit logs by action
SELECT *
FROM Audit_Logs
WHERE action='KYC Approved';

-- ==========================================
-- REPORTS
-- ==========================================

-- Total Users
SELECT COUNT(*) AS Total_Users
FROM Users;

-- Total Customers
SELECT COUNT(*) AS Total_Customers
FROM Users
WHERE role_id=3;

-- Total Pending KYC
SELECT COUNT(*) AS Pending_KYC
FROM KYC_Details
WHERE verification_status='Pending';

-- Total Approved KYC
SELECT COUNT(*) AS Approved_KYC
FROM KYC_Details
WHERE verification_status='Approved';

-- Total Rejected KYC
SELECT COUNT(*) AS Rejected_KYC
FROM KYC_Details
WHERE verification_status='Rejected';

-- ==========================================
-- USER MANAGEMENT
-- ==========================================

-- Update User Email
UPDATE Users
SET email='newmail@example.com'
WHERE user_id=1;

-- Change User Status
UPDATE Users
SET status='BLOCKED'
WHERE user_id=5;

-- Delete Audit Log
DELETE FROM Audit_Logs
WHERE log_id=10;

-- ==========================================
-- END OF FILE
-- ==========================================