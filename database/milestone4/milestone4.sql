-- ============================================================================
-- FINCORE NEXUS ENTERBANK PLATFORM
-- MILESTONE 4: RISK SCORING, COMPLIANCE CHECKS & AUDIT INTEGRITY
-- Target Engine: MySQL 8.0+ / MariaDB / PostgreSQL compatible
-- ============================================================================

USE fincore_nexus;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS compliance_documents;
DROP TABLE IF EXISTS compliance_details;
DROP TABLE IF EXISTS compliance_checks;
DROP TABLE IF EXISTS risk_score_history;
DROP TABLE IF EXISTS risk_factors;
DROP TABLE IF EXISTS risk_scores;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. INSTITUTIONAL RISK SCORING ENGINE
CREATE TABLE risk_scores (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL UNIQUE,
    credit_score INT NOT NULL, -- 300 to 850 Bureau rating
    debt_to_income_ratio DECIMAL(5, 2),
    dpd_count INT DEFAULT 0,
    calculated_score INT NOT NULL, -- 0 (Safest) to 100 (Highest Risk)
    risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH
    last_assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessed_by VARCHAR(50) DEFAULT 'ALGORITHMIC_MODEL_V2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE risk_factors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    risk_score_id VARCHAR(36) NOT NULL,
    factor_name VARCHAR(150) NOT NULL,
    impact_type VARCHAR(20) NOT NULL, -- POSITIVE, NEGATIVE, NEUTRAL
    weight_score INT NOT NULL,
    CONSTRAINT fk_rf_riskscore FOREIGN KEY (risk_score_id) REFERENCES risk_scores (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE risk_score_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    score INT NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    reason TEXT,
    assessed_by VARCHAR(50) NOT NULL,
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. REGULATORY COMPLIANCE CHECKS & SANCTIONS SCREENING
CREATE TABLE compliance_checks (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    check_type VARCHAR(100) NOT NULL, -- AML_SANCTIONS, KYC_REVERIFICATION, SOURCE_OF_WEALTH, PEP_SCREENING
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, PASS, FAIL, ESCALATED
    submitted_by VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by VARCHAR(50),
    reviewed_at TIMESTAMP NULL,
    risk_level VARCHAR(20),
    findings TEXT,
    INDEX idx_comp_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE compliance_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    check_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL, -- KYC, AML, PEP, OFAC_Sanctions, Adverse_Media, FATCA
    result VARCHAR(30) NOT NULL, -- PASS, FAIL, PENDING
    notes TEXT,
    CONSTRAINT fk_cd_check FOREIGN KEY (check_id) REFERENCES compliance_checks (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE compliance_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    check_id VARCHAR(36) NOT NULL,
    document_name VARCHAR(100) NOT NULL,
    document_type VARCHAR(50),
    document_url VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_doc_check FOREIGN KEY (check_id) REFERENCES compliance_checks (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA FOR MILESTONE 4
INSERT INTO risk_scores (id, customer_id, credit_score, debt_to_income_ratio, dpd_count, calculated_score, risk_level, last_assessed_at) VALUES
('RSK-001', 'CUST-1001', 780, 22.50, 0, 24, 'LOW', '2026-09-08 10:00:00'),
('RSK-002', 'CUST-1002', 710, 34.00, 14, 42, 'MEDIUM', '2026-09-07 14:30:00'),
('RSK-003', 'CUST-1003', 590, 52.80, 48, 82, 'HIGH', '2026-09-09 11:15:00'),
('RSK-004', 'CUST-1004', 680, 28.00, 76, 68, 'MEDIUM', '2026-09-06 16:45:00'),
('RSK-005', 'CUST-1005', 520, 68.40, 112, 88, 'HIGH', '2026-09-05 09:00:00');

INSERT INTO risk_factors (risk_score_id, factor_name, impact_type, weight_score) VALUES
('RSK-001', 'Flawless 24-month repayment track record', 'POSITIVE', -15),
('RSK-001', 'Low Debt-to-Income ratio (22.5%)', 'POSITIVE', -10),
('RSK-002', 'Occasional minor installment delay (SMA-0 stage)', 'NEGATIVE', 12),
('RSK-003', 'Politically Exposed Person (PEP) flag active', 'NEGATIVE', 25),
('RSK-003', '48 Days Past Due on commercial line', 'NEGATIVE', 20),
('RSK-005', 'NPA default status (>90 DPD)', 'NEGATIVE', 40);

INSERT INTO compliance_checks (id, customer_id, check_type, status, submitted_by, submitted_at, reviewed_by, reviewed_at, risk_level, findings) VALUES
('CHK-301', 'CUST-1001', 'AML & Sanctions Screening', 'PASS', 'teller', '2026-09-01 08:35:00', 'supervisor', '2026-09-01 09:10:00', 'LOW', 'Clear of all global sanctions lists. No adverse regulatory media found.'),
('CHK-302', 'CUST-1003', 'Enhanced Due Diligence (EDD)', 'PENDING', 'teller', '2026-09-02 11:20:00', NULL, NULL, 'HIGH', 'PEP declaration flagged. Source of overseas export wealth requires consular verification.'),
('CHK-303', 'CUST-1005', 'Forensic Default Review', 'FAIL', 'supervisor', '2026-09-04 15:00:00', 'auditor', '2026-09-05 10:30:00', 'HIGH', 'Sub-prime risk score (88/100) and repeated failure to furnish certified tax schedules.');

INSERT INTO compliance_details (check_id, category, result, notes) VALUES
('CHK-301', 'OFAC Sanctions List', 'PASS', 'Screened against OFAC, EU, UN, and UK HM Treasury databases with 0 hits.'),
('CHK-301', 'AML Threshold Inspection', 'PASS', 'Customer cash velocity is consistent with declared retail payroll profile.'),
('CHK-302', 'PEP Screening', 'FAIL', 'Direct familial affiliation with foreign trade ministry official.'),
('CHK-302', 'Source of Wealth', 'PENDING', 'Awaiting audited balance sheet and cross-border bank statements.');
