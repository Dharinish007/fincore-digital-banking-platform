-- ==========================================
-- FinCore Digital Banking Application
-- Database Schema
-- ==========================================

CREATE DATABASE IF NOT EXISTS fincore_db;
USE fincore_db;

-- ==========================================
-- ROLES TABLE
-- ==========================================

CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE','INACTIVE','BLOCKED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY(role_id)
        REFERENCES Roles(role_id)
);

-- ==========================================
-- KYC DETAILS TABLE
-- ==========================================

CREATE TABLE KYC_Details (

    kyc_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    verified_by INT,

    aadhaar_number VARCHAR(12) UNIQUE,

    pan_number VARCHAR(10) UNIQUE,

    document_type VARCHAR(50),

    document_path VARCHAR(255),

    address TEXT,

    city VARCHAR(100),

    state VARCHAR(100),

    pincode VARCHAR(10),

    verification_status
    ENUM('Pending','Approved','Rejected')
    DEFAULT 'Pending',

    remarks VARCHAR(255),

    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    verified_date TIMESTAMP NULL,

    CONSTRAINT fk_kyc_user
        FOREIGN KEY(user_id)
        REFERENCES Users(user_id),

    CONSTRAINT fk_kyc_verifier
        FOREIGN KEY(verified_by)
        REFERENCES Users(user_id)

);

-- ==========================================
-- AUDIT LOG TABLE
-- ==========================================

CREATE TABLE Audit_Logs (

    log_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    kyc_id INT,

    action VARCHAR(100) NOT NULL,

    module_name VARCHAR(100),

    description TEXT,

    ip_address VARCHAR(45),

    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY(user_id)
        REFERENCES Users(user_id),

    CONSTRAINT fk_audit_kyc
        FOREIGN KEY(kyc_id)
        REFERENCES KYC_Details(kyc_id)

);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_email
ON Users(email);

CREATE INDEX idx_username
ON Users(username);

CREATE INDEX idx_kyc_status
ON KYC_Details(verification_status);

CREATE INDEX idx_audit_time
ON Audit_Logs(action_time);

-- ==========================================
-- END OF SCHEMA
-- ==========================================