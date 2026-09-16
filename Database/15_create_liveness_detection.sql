USE digital_banking;

-- =========================================================
-- MILESTONE 4 - AI LIVENESS DETECTION
-- =========================================================

CREATE TABLE IF NOT EXISTS liveness_detection (
    liveness_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,

    capture_reference VARCHAR(255),

    liveness_score DECIMAL(5,2),
    liveness_threshold DECIMAL(5,2) DEFAULT 80.00,

    detection_result ENUM(
        'Pending',
        'Passed',
        'Failed'
    ) NOT NULL DEFAULT 'Pending',

    checked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_liveness_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_liveness_score
        CHECK (
            liveness_score IS NULL
            OR (liveness_score >= 0 AND liveness_score <= 100)
        )
);

CREATE INDEX idx_liveness_customer
    ON liveness_detection(customer_id);

CREATE INDEX idx_liveness_result
    ON liveness_detection(detection_result);
