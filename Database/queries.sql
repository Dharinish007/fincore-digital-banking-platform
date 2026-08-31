-- ============================================================
-- Milestone 4 - Useful Database Queries
-- ============================================================

USE milestone4_db;

-- 1. Customer risk overview
SELECT
    c.customer_id,
    c.customer_name,
    rs.risk_score,
    rs.risk_level,
    rs.score_date
FROM customers c
JOIN risk_scores rs
  ON rs.customer_id = c.customer_id
WHERE rs.risk_id = (
    SELECT MAX(rs2.risk_id)
    FROM risk_scores rs2
    WHERE rs2.customer_id = c.customer_id
)
ORDER BY rs.risk_score DESC;

-- 2. High-risk customers
SELECT
    c.customer_id,
    c.customer_name,
    rs.risk_score,
    rs.risk_level,
    rs.score_date
FROM customers c
JOIN risk_scores rs ON rs.customer_id = c.customer_id
WHERE rs.risk_level = 'HIGH'
ORDER BY rs.risk_score DESC;

-- 3. Latest compliance status for each customer
SELECT
    c.customer_id,
    c.customer_name,
    cc.check_type,
    cc.status,
    cc.performed_on,
    cc.remarks
FROM customers c
JOIN compliance_checks cc
  ON cc.customer_id = c.customer_id
ORDER BY cc.performed_on DESC;

-- 4. Failed compliance checks
SELECT
    c.customer_name,
    cc.compliance_id,
    cc.check_type,
    cc.status,
    cc.remarks
FROM compliance_checks cc
JOIN customers c ON c.customer_id = cc.customer_id
WHERE cc.status = 'FAIL'
ORDER BY cc.created_at DESC;

-- 5. Compliance documents pending/rejected
SELECT
    c.customer_name,
    cd.document_name,
    cd.document_type,
    cd.status,
    cd.verified_on
FROM compliance_documents cd
JOIN compliance_checks cc ON cc.compliance_id = cd.compliance_id
JOIN customers c ON c.customer_id = cc.customer_id
WHERE cd.status IN ('PENDING', 'REJECTED')
ORDER BY cd.status, cd.document_id;

-- 6. Risk factors for high-risk customers
SELECT
    c.customer_name,
    rs.risk_score,
    rs.risk_level,
    rf.factor_type,
    rf.factor_value,
    rf.weightage,
    rf.description
FROM risk_factors rf
JOIN risk_scores rs ON rs.risk_id = rf.risk_id
JOIN customers c ON c.customer_id = rs.customer_id
WHERE rs.risk_level = 'HIGH'
ORDER BY rf.weightage DESC;

-- 7. Audit trail
SELECT
    al.audit_id,
    al.user_id,
    al.action,
    al.entity_type,
    al.entity_id,
    al.details,
    al.ip_address,
    al.created_at,
    ai.is_valid
FROM audit_logs al
LEFT JOIN audit_integrity ai ON ai.audit_id = al.audit_id
ORDER BY al.created_at DESC;

-- 8. Open audit alerts
SELECT
    aa.alert_id,
    aa.alert_type,
    aa.description,
    aa.status,
    aa.created_at,
    ai.audit_id
FROM audit_alerts aa
JOIN audit_integrity ai ON ai.integrity_id = aa.integrity_id
WHERE aa.status = 'OPEN'
ORDER BY aa.created_at DESC;

-- 9. Audit integrity chain
SELECT
    ai.integrity_id,
    ai.audit_id,
    ai.hash_value,
    ai.previous_hash,
    ai.is_valid,
    ai.verified_on,
    ai.verified_by
FROM audit_integrity ai
ORDER BY ai.integrity_id;

-- 10. Dashboard counts
SELECT
    (SELECT COUNT(*) FROM customers) AS total_customers,
    (SELECT COUNT(*) FROM risk_scores WHERE risk_level = 'HIGH') AS high_risk_records,
    (SELECT COUNT(*) FROM compliance_checks WHERE status = 'PENDING') AS pending_compliance,
    (SELECT COUNT(*) FROM compliance_checks WHERE status = 'FAIL') AS failed_compliance,
    (SELECT COUNT(*) FROM audit_alerts WHERE status = 'OPEN') AS open_alerts;
