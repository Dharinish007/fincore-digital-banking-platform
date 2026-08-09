-- FinCore Digital Banking Platform - Database Schema
-- MySQL 8.x
-- Databases: kyc_db (core banking + KYC + auth), fincore_audit (audit trail)

CREATE DATABASE IF NOT EXISTS kyc_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS fincore_audit
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kyc_db;

-- -----------------------------------------------------
-- users (staff + customers for authentication / RBAC)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password      VARCHAR(100) NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  role          VARCHAR(20)  NOT NULL,
  status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'SUPERVISOR', 'TELLER', 'CUSTOMER')),
  CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'DISABLED'))
) ENGINE=InnoDB;

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- -----------------------------------------------------
-- customers
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_number  VARCHAR(50)  NOT NULL UNIQUE,
  first_name       VARCHAR(50)  NOT NULL,
  last_name        VARCHAR(50)  NOT NULL,
  email            VARCHAR(100) NOT NULL UNIQUE,
  phone            VARCHAR(20)  NULL,
  kyc_status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  risk_level       VARCHAR(20)  NULL DEFAULT 'LOW',
  user_id          BIGINT       NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_customers_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT chk_customers_kyc CHECK (kyc_status IN ('PENDING', 'APPROVED', 'REJECTED', 'VERIFIED')),
  CONSTRAINT chk_customers_risk CHECK (risk_level IS NULL OR risk_level IN ('LOW', 'MEDIUM', 'HIGH'))
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- accounts
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  account_number  VARCHAR(50)    NOT NULL UNIQUE,
  account_type    VARCHAR(20)    NOT NULL,
  balance         DECIMAL(15,2)  NOT NULL DEFAULT 0.00,
  status          VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
  customer_id     BIGINT         NOT NULL,
  created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT chk_accounts_type CHECK (account_type IN ('SAVINGS', 'CURRENT')),
  CONSTRAINT chk_accounts_status CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED', 'PENDING')),
  CONSTRAINT chk_accounts_balance CHECK (balance >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_accounts_status ON accounts(status);

-- -----------------------------------------------------
-- transactions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
  id                     BIGINT AUTO_INCREMENT PRIMARY KEY,
  transaction_reference  VARCHAR(50)    NOT NULL UNIQUE,
  source_account_id      BIGINT         NOT NULL,
  target_account_id      BIGINT         NULL,
  transaction_type       VARCHAR(20)    NOT NULL,
  amount                 DECIMAL(15,2)  NOT NULL,
  status                 VARCHAR(20)    NOT NULL,
  description            VARCHAR(255)   NULL,
  performed_by           VARCHAR(100)   NOT NULL,
  timestamp              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_txn_source FOREIGN KEY (source_account_id) REFERENCES accounts(id),
  CONSTRAINT fk_txn_target FOREIGN KEY (target_account_id) REFERENCES accounts(id),
  CONSTRAINT chk_txn_type CHECK (transaction_type IN ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'PAYMENT')),
  CONSTRAINT chk_txn_status CHECK (status IN ('SUCCESS', 'FAILED', 'CANCELLED')),
  CONSTRAINT chk_txn_amount CHECK (amount > 0)
) ENGINE=InnoDB;

CREATE INDEX idx_txn_source ON transactions(source_account_id);
CREATE INDEX idx_txn_target ON transactions(target_account_id);
CREATE INDEX idx_txn_time ON transactions(timestamp);

-- -----------------------------------------------------
-- kyc
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS kyc (
  kyc_id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  first_name             VARCHAR(100) NOT NULL,
  last_name              VARCHAR(100) NOT NULL,
  date_of_birth          DATE         NULL,
  gender                 VARCHAR(20)  NULL,
  government_id_type     VARCHAR(50)  NULL,
  government_id_number   VARCHAR(100) NULL,
  address_line1          VARCHAR(255) NULL,
  address_line2          VARCHAR(255) NULL,
  city                   VARCHAR(100) NULL,
  state                  VARCHAR(100) NULL,
  postal_code            VARCHAR(20)  NULL,
  country                VARCHAR(100) NULL,
  occupation_status      VARCHAR(50)  NULL,
  annual_income_range    VARCHAR(50)  NULL,
  pep_declaration        BOOLEAN      NOT NULL DEFAULT FALSE,
  email                  VARCHAR(100) NULL,
  status                 VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  customer_id            BIGINT       NULL,
  created_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_kyc_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT chk_kyc_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'))
) ENGINE=InnoDB;

CREATE INDEX idx_kyc_status ON kyc(status);
CREATE INDEX idx_kyc_email ON kyc(email);

-- -----------------------------------------------------
-- Audit database
-- -----------------------------------------------------
USE fincore_audit;

CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  entity_name   VARCHAR(100) NOT NULL,
  entity_id     VARCHAR(100) NULL,
  action        VARCHAR(50)  NOT NULL,
  performed_by  VARCHAR(100) NOT NULL,
  status        VARCHAR(20)  NOT NULL,
  description   VARCHAR(500) NULL,
  timestamp     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_audit_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(performed_by);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_time ON audit_logs(timestamp);
