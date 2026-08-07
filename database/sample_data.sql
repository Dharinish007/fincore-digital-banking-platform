
-- ==========================================
-- FinCore Digital Banking Application
-- Sample Data
-- ==========================================

USE fincore_db;

-- ==========================================
-- INSERT ROLES
-- ==========================================

INSERT INTO Roles (role_name, description) VALUES
('Admin', 'System Administrator'),
('Teller', 'Bank Teller'),
('Customer', 'Bank Customer');

-- ==========================================
-- INSERT USERS
-- ==========================================

INSERT INTO Users
(role_id, full_name, email, phone, username, password, status)
VALUES

(1,
'Rohan Sharma',
'admin@fincore.com',
'9876543210',
'admin01',
'admin123',
'ACTIVE'),

(2,
'Priya Patil',
'teller@fincore.com',
'9876543211',
'teller01',
'teller123',
'ACTIVE'),

(3,
'Amit Kumar',
'amit@gmail.com',
'9876543212',
'amit01',
'amit123',
'ACTIVE'),

(3,
'Sneha Joshi',
'sneha@gmail.com',
'9876543213',
'sneha01',
'sneha123',
'ACTIVE'),

(3,
'Rahul Verma',
'rahul@gmail.com',
'9876543214',
'rahul01',
'rahul123',
'ACTIVE');

-- ==========================================
-- INSERT KYC DETAILS
-- ==========================================

INSERT INTO KYC_Details
(
user_id,
verified_by,
aadhaar_number,
pan_number,
document_type,
document_path,
address,
city,
state,
pincode,
verification_status,
remarks,
verified_date
)

VALUES

(
3,
2,
'123456789012',
'ABCDE1234F',
'Aadhaar + PAN',
'/documents/amit/',
'MG Road',
'Pune',
'Maharashtra',
'411001',
'Approved',
'Verified Successfully',
NOW()
),

(
4,
NULL,
'234567890123',
'PQRSX2345K',
'Aadhaar',
'/documents/sneha/',
'Shivaji Nagar',
'Nashik',
'Maharashtra',
'422001',
'Pending',
NULL,
NULL
),

(
5,
2,
'345678901234',
'LMNOP6789Q',
'PAN',
'/documents/rahul/',
'Station Road',
'Mumbai',
'Maharashtra',
'400001',
'Rejected',
'PAN image not clear',
NOW()
);

-- ==========================================
-- INSERT AUDIT LOGS
-- ==========================================

INSERT INTO Audit_Logs
(
user_id,
kyc_id,
action,
module_name,
description,
ip_address
)

VALUES

(
1,
NULL,
'Login',
'Authentication',
'Administrator Logged In',
'192.168.1.10'
),

(
2,
1,
'KYC Approved',
'KYC',
'Teller approved customer KYC',
'192.168.1.20'
),

(
2,
3,
'KYC Rejected',
'KYC',
'Teller rejected KYC due to invalid document',
'192.168.1.20'
),

(
3,
1,
'View KYC Status',
'KYC',
'Customer viewed KYC status',
'192.168.1.30'
),

(
4,
2,
'Submit KYC',
'KYC',
'Customer submitted KYC documents',
'192.168.1.31'
),

(
1,
NULL,
'View Audit Logs',
'Audit',
'Administrator viewed audit logs',
'192.168.1.10'
);

-- ==========================================
-- VERIFY DATA
-- ==========================================

SELECT * FROM Roles;

SELECT * FROM Users;

SELECT * FROM KYC_Details;

SELECT * FROM Audit_Logs;

-- ==========================================
-- END OF FILE
-- ==========================================