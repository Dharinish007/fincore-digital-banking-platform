<?php

include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $customer_id = $_POST['customer_id'] ?? '';
    $beneficiary_name = $_POST['beneficiary_name'] ?? '';
    $account_no = $_POST['account_no'] ?? '';
    $ifsc_code = $_POST['ifsc_code'] ?? '';
    $bank_name = $_POST['bank_name'] ?? '';

    if (
        empty($customer_id) ||
        empty($beneficiary_name) ||
        empty($account_no) ||
        empty($ifsc_code) ||
        empty($bank_name)
    ) {
        die("All beneficiary details are required.");
    }

    // Check customer
    $customer_stmt = $conn->prepare(
        "SELECT customer_id FROM customer WHERE customer_id = ?"
    );

    $customer_stmt->bind_param("i", $customer_id);
    $customer_stmt->execute();

    $customer_result = $customer_stmt->get_result();

    if ($customer_result->num_rows == 0) {
        die("Customer not found.");
    }

    // Check account exists
    $account_stmt = $conn->prepare(
        "SELECT account_no FROM account WHERE account_no = ?"
    );

    $account_stmt->bind_param("s", $account_no);
    $account_stmt->execute();

    $account_result = $account_stmt->get_result();

    if ($account_result->num_rows == 0) {
        die("Beneficiary account not found.");
    }

    // Insert beneficiary
    $sql = "INSERT INTO beneficiary
            (
                customer_id,
                beneficiary_name,
                account_no,
                ifsc_code,
                bank_name,
                beneficiary_type,
                status
            )
            VALUES (?, ?, ?, ?, ?, 'Internal', 'Pending')";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "issss",
        $customer_id,
        $beneficiary_name,
        $account_no,
        $ifsc_code,
        $bank_name
    );

    if ($stmt->execute()) {

        echo "Beneficiary Added Successfully!<br>";
        echo "Beneficiary ID: " . $stmt->insert_id . "<br>";
        echo "Status: Pending Verification";

    } else {

        echo "Beneficiary Registration Failed: " . $stmt->error;
    }

    $stmt->close();
    $customer_stmt->close();
    $account_stmt->close();

} else {

    echo "Invalid Request Method.";
}

$conn->close();

?>
