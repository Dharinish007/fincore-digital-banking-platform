CREATE TABLE face_match (
    face_match_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,

    match_result ENUM('SUCCESS', 'FAILED') NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_face_match_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_face_confidence
        CHECK (confidence >= 0 AND confidence <= 100)
);

CREATE INDEX idx_face_match_customer
    ON face_match(customer_id);