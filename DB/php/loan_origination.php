<?php

include 'db_connect.php';

// ===========================================
// LOAN ORIGINATION
// ===========================================

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get form data
    $customer_id = $_POST['customer_id'] ?? '';
    $loan_type = $_POST['loan_type'] ?? '';
    $loan_amount = $_POST['loan_amount'] ?? '';
    $tenure_months = $_POST['tenure_months'] ?? '';
    $interest_rate = $_POST['interest_rate'] ?? '';
    $purpose = $_POST['purpose'] ?? '';

    // Validate required fields
    if (
        empty($customer_id) ||
        empty($loan_type) ||
        empty($loan_amount) ||
        empty($tenure_months) ||
        empty($interest_rate)
    ) {
        die("All required fields must be filled.");
    }

    // Validate loan amount
    if ($loan_amount <= 0) {
        die("Loan amount must be greater than 0.");
    }

    // Validate tenure
    if ($tenure_months <= 0) {
        die("Loan tenure must be greater than 0.");
    }

    // Validate interest rate
    if ($interest_rate < 0) {
        die("Interest rate cannot be negative.");
    }

    // Check customer exists
    $customer_check = $conn->prepare(
        "SELECT customer_id FROM customer WHERE customer_id = ?"
    );

    $customer_check->bind_param("i", $customer_id);
    $customer_check->execute();

    $customer_result = $customer_check->get_result();

    if ($customer_result->num_rows == 0) {
        die("Customer does not exist.");
    }

    // Insert loan application
    $sql = "INSERT INTO loan_application
            (customer_id, loan_type, loan_amount, tenure_months,
             interest_rate, purpose, application_status)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending')";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "isdids",
        $customer_id,
        $loan_type,
        $loan_amount,
        $tenure_months,
        $interest_rate,
        $purpose
    );

    // Execute
    if ($stmt->execute()) {

        $loan_id = $stmt->insert_id;

        echo "Loan Application Created Successfully!<br>";
        echo "Loan ID: " . $loan_id;

    } else {

        echo "Loan Application Failed: " . $stmt->error;
    }

    $stmt->close();
    $customer_check->close();

} else {

    echo "Invalid Request Method.";
}

$conn->close();

?>
