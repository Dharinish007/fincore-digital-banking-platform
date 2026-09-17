-- ============================================================================
-- FINCORE NEXUS ENTERPRISE BANKING PLATFORM
-- MILESTONE 3: SAGA EXECUTION, SETTLEMENT CONFIRMATION & NOTIFICATIONS
-- Target Engine: MySQL 8.0+ / MariaDB / PostgreSQL compatible
-- ============================================================================

USE fincore_nexus;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notification_records;
DROP TABLE IF EXISTS settlement_records;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. INTERBANK TREASURY SETTLEMENT CONFIRMATIONS (RTGS, NEFT, SWIFT)
CREATE TABLE settlement_records (
    id VARCHAR(36) PRIMARY KEY,
    reference_id VARCHAR(100) NOT NULL UNIQUE,
    batch_id VARCHAR(100) NOT NULL,
    counterparty_bank VARCHAR(100) NOT NULL,
    settlement_amount DECIMAL(15, 2) NOT NULL,
    settlement_date TIMESTAMP NOT NULL,
    channel VARCHAR(30) NOT NULL, -- RTGS, NEFT, SWIFT, FEDWIRE
    confirmation_status VARCHAR(30) DEFAULT 'PENDING', -- CONFIRMED, PENDING, FAILED, SETTLING
    confirmed_by VARCHAR(50),
    confirmed_at TIMESTAMP NULL,
    clearing_cycle VARCHAR(50) DEFAULT 'STANDARD_NETTING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_settle_ref (reference_id),
    INDEX idx_settle_status (confirmation_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. NOTIFICATION DELIVERY DISPATCH REGISTER
CREATE TABLE notification_records (
    id VARCHAR(36) PRIMARY KEY,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_id VARCHAR(36),
    channel VARCHAR(30) NOT NULL, -- SMS, Email, In-App, Push Notification
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    delivery_status VARCHAR(30) DEFAULT 'DELIVERED', -- DELIVERED, PENDING, FAILED, RETRYING
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_timestamp TIMESTAMP NULL,
    external_provider_ref VARCHAR(100),
    INDEX idx_notif_recipient (recipient_name),
    INDEX idx_notif_status (delivery_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA FOR MILESTONE 3
INSERT INTO settlement_records (id, reference_id, batch_id, counterparty_bank, settlement_amount, settlement_date, channel, confirmation_status, confirmed_by, confirmed_at) VALUES
('STL-001', 'SETTLE-20260905-001', 'BATCH-US-NY-881', 'JPMorgan Chase & Co.', 1250000.00, '2026-09-05 14:00:00', 'RTGS', 'CONFIRMED', 'David Chen', '2026-09-05 14:05:12'),
('STL-002', 'SETTLE-20260905-002', 'BATCH-EU-LON-442', 'Barclays Bank PLC', 850000.00, '2026-09-05 15:30:00', 'SWIFT', 'CONFIRMED', 'David Chen', '2026-09-05 15:32:45'),
('STL-003', 'SETTLE-20260905-003', 'BATCH-APAC-SG-109', 'DBS Bank Ltd.', 420000.00, '2026-09-05 16:45:00', 'NEFT', 'PENDING', NULL, NULL);

INSERT INTO notification_records (id, recipient_name, recipient_id, channel, title, message, delivery_status, sent_at) VALUES
('NOTIF-701', 'Sarah Jenkins', 'CUST-1001', 'SMS', 'Loan Installment Debited', 'Your Home Mortgage installment of $2,145.00 has been debited. Next due date: Oct 15, 2026.', 'DELIVERED', '2026-08-15 09:30:00'),
('NOTIF-702', 'Robert Vance', 'CUST-1002', 'Email', 'Commercial Facility Partial Repayment', 'Receipt confirmed for $5,000.00 counter payment towards LN-8002.', 'DELIVERED', '2026-08-12 11:15:00'),
('NOTIF-703', 'Vikram Patel', 'CUST-1003', 'SMS', 'Critical Overdue Notice: Trade Working Capital', 'URGENT: Installment overdue by 48 days. Please contact your loan officer immediately.', 'DELIVERED', '2026-09-01 08:00:00');
