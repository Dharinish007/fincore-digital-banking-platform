USE digital_banking;

-- =========================================================
-- MILESTONE 4 - SAMPLE DATA FOR ALL 3 AI TABLES
-- =========================================================

-- =========================================================
-- 1. DOCUMENT OCR DATA
-- =========================================================
-- AI OCR extracts the customer's document information.
-- =========================================================

INSERT INTO document_ocr (
    customer_id,
    document_type,
    document_reference,
    extracted_name,
    extracted_id_number,
    extracted_date_of_birth,
    extracted_gender,
    extracted_address,
    ocr_confidence,
    ocr_status,
    processed_at
)
VALUES (
    1,
    'Aadhaar',
    'uploads/kyc/customer_1_aadhaar.jpg',
    'Rahul Sharma',
    'XXXX-XXXX-1234',
    '2002-05-15',
    'Male',
    'Sample Address',
    96.50,
    'Verified',
    CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. LIVENESS DETECTION DATA
-- =========================================================
-- AI checks whether the captured person is a real/live person.
-- =========================================================

INSERT INTO liveness_detection (
    customer_id,
    capture_reference,
    liveness_score,
    liveness_threshold,
    detection_result,
    checked_at
)
VALUES (
    1,
    'uploads/kyc/customer_1_liveness.mp4',
    98.10,
    80.00,
    'Passed',
    CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. FACE MATCH DATA
-- =========================================================
-- UI requires only:
-- Match: SUCCESS
-- Confidence: 92.35%
-- =========================================================

INSERT INTO face_match (
    customer_id,
    match_result,
    confidence
)
VALUES (
    1,
    'SUCCESS',
    92.35
);


-- =========================================================
-- 4. VERIFY ALL 3 M4 TABLES
-- =========================================================

SELECT * FROM document_ocr;

SELECT * FROM liveness_detection;

SELECT * FROM face_match;


-- =========================================================
-- 5. SHOW ALL 3 AI RESULTS TOGETHER
-- =========================================================

SELECT
    c.customer_id,
    c.full_name,

    o.document_type,
    o.extracted_name,
    o.extracted_id_number,
    o.ocr_confidence,
    o.ocr_status,

    l.liveness_score,
    l.liveness_threshold,
    l.detection_result,

    f.match_result,
    f.confidence AS face_match_confidence

FROM customer c

LEFT JOIN document_ocr o
    ON c.customer_id = o.customer_id

LEFT JOIN liveness_detection l
    ON c.customer_id = l.customer_id

LEFT JOIN face_match f
    ON c.customer_id = f.customer_id

WHERE c.customer_id = 1;


-- =========================================================
-- 6. OVERALL M4 AI VERIFICATION
-- =========================================================

SELECT
    c.customer_id,
    c.full_name,

    CASE
        WHEN EXISTS (
            SELECT 1
            FROM document_ocr o
            WHERE o.customer_id = c.customer_id
              AND o.ocr_status = 'Verified'
        )
        AND EXISTS (
            SELECT 1
            FROM liveness_detection l
            WHERE l.customer_id = c.customer_id
              AND l.detection_result = 'Passed'
        )
        AND EXISTS (
            SELECT 1
            FROM face_match f
            WHERE f.customer_id = c.customer_id
              AND f.match_result = 'SUCCESS'
        )
        THEN 'AI VERIFICATION PASSED'

        ELSE 'AI VERIFICATION PENDING / FAILED'
    END AS overall_ai_verification

FROM customer c
WHERE c.customer_id = 1;
