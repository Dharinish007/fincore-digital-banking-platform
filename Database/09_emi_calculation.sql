USE digital_banking;

-- ===========================================
-- EMI CALCULATION
-- ===========================================

INSERT INTO emi_calculation
(
    loan_id,
    principal_amount,
    interest_rate,
    tenure_months,
    monthly_emi,
    total_interest,
    total_payable
)
SELECT
    loan_id,
    loan_amount AS principal_amount,
    interest_rate,
    tenure_months,

    -- Monthly EMI
    ROUND(
        loan_amount *
        (interest_rate / 12 / 100) *
        POW(
            1 + (interest_rate / 12 / 100),
            tenure_months
        )
        /
        (
            POW(
                1 + (interest_rate / 12 / 100),
                tenure_months
            ) - 1
        ),
        2
    ) AS monthly_emi,

    -- Total Interest
    ROUND(
        (
            (
                loan_amount *
                (interest_rate / 12 / 100) *
                POW(
                    1 + (interest_rate / 12 / 100),
                    tenure_months
                )
                /
                (
                    POW(
                        1 + (interest_rate / 12 / 100),
                        tenure_months
                    ) - 1
                )
            ) * tenure_months
        ) - loan_amount,
        2
    ) AS total_interest,

    -- Total Payable
    ROUND(
        (
            loan_amount *
            (interest_rate / 12 / 100) *
            POW(
                1 + (interest_rate / 12 / 100),
                tenure_months
            )
            /
            (
                POW(
                    1 + (interest_rate / 12 / 100),
                    tenure_months
                ) - 1
            )
        ) * tenure_months,
        2
    ) AS total_payable

FROM loan_application
WHERE loan_id IN (1, 2);


-- ===========================================
-- VIEW EMI RESULTS
-- ===========================================

SELECT
    emi_id,
    loan_id,
    principal_amount,
    interest_rate,
    tenure_months,
    monthly_emi,
    total_interest,
    total_payable,
    calculated_at
FROM emi_calculation
ORDER BY emi_id;