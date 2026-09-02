USE digital_banking;

-- =========================================================
-- MILESTONE 4 - DOCUMENT OCR
-- =========================================================
-- =========================================================

CREATE TABLE IF NOT EXISTS document_ocr (
    ocr_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,

    document_type ENUM(
        'Aadhaar',
        'PAN',
        'Passport',
        'Driving License',
        'Voter ID',
        'Other'
    ) NOT NULL,

    document_reference VARCHAR(255),

    extracted_name VARCHAR(150),
    extracted_id_number VARCHAR(100),
    extracted_date_of_birth DATE,
    extracted_gender VARCHAR(20),
    extracted_address TEXT,

    ocr_confidence DECIMAL(5,2),

    ocr_status ENUM(
        'Pending',
        'Processing',
        'Verified',
        'Failed'
    ) NOT NULL DEFAULT 'Pending',

    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ocr_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_ocr_confidence
        CHECK (
            ocr_confidence IS NULL
            OR (ocr_confidence >= 0 AND ocr_confidence <= 100)
        )
);

CREATE INDEX idx_ocr_customer ON document_ocr(customer_id);
CREATE INDEX idx_ocr_status ON document_ocr(ocr_status);
