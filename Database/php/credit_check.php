<?php

include 'db_connect.php';

// ===========================================
// CREDIT CHECK
// ===========================================

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $loan_id = $_POST['loan_id'] ?? '';
    $credit_score = $_POST['credit_score'] ?? '';
    $monthly_income = $_POST['monthly_income'] ?? '';

    // Validate required fields
    if (
        empty($loan_id) ||
        empty($credit_score) ||
        empty($monthly_income)
    ) {
        die("Loan ID, Credit Score and Monthly Income are required.");
    }

    // Validate credit score
    if ($credit_score < 300 || $credit_score > 900) {
        die("Credit score must be between 300 and 900.");
    }

    // Validate income
    if ($monthly_income <= 0) {
        die("Monthly income must be greater than 0.");
    }


    // ===========================================
    // GET CUSTOMER ID FROM LOAN
    // ===========================================

    $loan_stmt = $conn->prepare(
        "SELECT customer_id
         FROM loan_application
         WHERE loan_id = ?"
    );

    $loan_stmt->bind_param("i", $loan_id);
    $loan_stmt->execute();

    $loan_result = $loan_stmt->get_result();

    if ($loan_result->num_rows == 0) {
        die("Loan application not found.");
    }

    $loan_data = $loan_result->fetch_assoc();
    $customer_id = $loan_data['customer_id'];


    // ===========================================
    // CHECK PREVIOUS LOANS
    // ===========================================

    $history_stmt = $conn->prepare(
        "SELECT COUNT(*) AS previous_loan_count
         FROM loan_history
         WHERE customer_id = ?"
    );

    $history_stmt->bind_param("i", $customer_id);
    $history_stmt->execute();

    $history_result = $history_stmt->get_result();
    $history_data = $history_result->fetch_assoc();

    $previous_loan_count = $history_data['previous_loan_count'];


    // ===========================================
    // CHECK ACTIVE LOANS
    // ===========================================

    $active_stmt = $conn->prepare(
        "SELECT COUNT(*) AS active_loan_count
         FROM loan_history
         WHERE customer_id = ?
         AND loan_status = 'Active'"
    );

    $active_stmt->bind_param("i", $customer_id);
    $active_stmt->execute();

    $active_result = $active_stmt->get_result();
    $active_data = $active_result->fetch_assoc();

    $active_loan_count = $active_data['active_loan_count'];


    // ===========================================
    // DETERMINE PREVIOUS LOAN STATUS
    // ===========================================

    $previous_loan_status =
        ($previous_loan_count > 0) ? 'Yes' : 'No';


    // ===========================================
    // CREDIT STATUS
    // ===========================================

    if ($credit_score >= 750 && $active_loan_count == 0) {

        $credit_status = 'Pass';
        $remarks = 'Good credit profile. Eligible for further processing.';

    } elseif ($credit_score >= 650) {

        $credit_status = 'Review';
        $remarks = 'Application requires additional verification.';

    } else {

        $credit_status = 'Fail';
        $remarks = 'Credit score is below the required threshold.';
    }


    // ===========================================
    // INSERT CREDIT CHECK RESULT
    // ===========================================

    $sql = "INSERT INTO credit_check
            (
                loan_id,
                credit_score,
                monthly_income,
                existing_loan_count,
                previous_loan_status,
                credit_status,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "idissss",
        $loan_id,
        $credit_score,
        $monthly_income,
        $active_loan_count,
        $previous_loan_status,
        $credit_status,
        $remarks
    );


    // ===========================================
    // EXECUTE
    // ===========================================

    if ($stmt->execute()) {

        echo "Credit Check Completed Successfully!<br>";
        echo "Loan ID: " . $loan_id . "<br>";
        echo "Previous Loan: " . $previous_loan_status . "<br>";
        echo "Existing Active Loans: " . $active_loan_count . "<br>";
        echo "Credit Status: " . $credit_status . "<br>";
        echo "Remarks: " . $remarks;

    } else {

        echo "Credit Check Failed: " . $stmt->error;
    }


    $stmt->close();
    $loan_stmt->close();
    $history_stmt->close();
    $active_stmt->close();

} else {

    echo "Invalid Request Method.";
}

$conn->close();

?>