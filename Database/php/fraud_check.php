<?php

include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $payment_id = $_POST['payment_id'] ?? '';

    if (empty($payment_id)) {
        die("Payment ID is required.");
    }

    // Get payment details
    $payment_stmt = $conn->prepare(
        "SELECT payment_id, amount, beneficiary_id, payment_status
         FROM payment
         WHERE payment_id = ?"
    );

    $payment_stmt->bind_param("i", $payment_id);
    $payment_stmt->execute();

    $payment_result = $payment_stmt->get_result();

    if ($payment_result->num_rows == 0) {
        die("Payment not found.");
    }

    $payment = $payment_result->fetch_assoc();

    // Check beneficiary
    $beneficiary_stmt = $conn->prepare(
        "SELECT status
         FROM beneficiary
         WHERE beneficiary_id = ?"
    );

    $beneficiary_stmt->bind_param(
        "i",
        $payment['beneficiary_id']
    );

    $beneficiary_stmt->execute();

    $beneficiary_result = $beneficiary_stmt->get_result();
    $beneficiary = $beneficiary_result->fetch_assoc();

    if (!$beneficiary || $beneficiary['status'] != 'Verified') {
        die("Beneficiary verification failed.");
    }

    // ===========================================
    // BASIC FRAUD RISK CALCULATION
    // ===========================================

    $amount = $payment['amount'];

    if ($amount >= 100000) {

        $risk_score = 80;
        $fraud_status = "Suspicious";
        $rule_triggered = "High transaction amount";
        $remarks = "Transaction requires additional verification.";

    } elseif ($amount >= 50000) {

        $risk_score = 50;
        $fraud_status = "Suspicious";
        $rule_triggered = "Medium-high transaction amount";
        $remarks = "Transaction flagged for review.";

    } else {

        $risk_score = 15;
        $fraud_status = "Safe";
        $rule_triggered = "Normal transaction amount";
        $remarks = "Transaction passed fraud verification.";
    }

    // Insert fraud check
    $sql = "INSERT INTO fraud_check
            (
                payment_id,
                risk_score,
                fraud_status,
                rule_triggered,
                remarks
            )
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "iisss",
        $payment_id,
        $risk_score,
        $fraud_status,
        $rule_triggered,
        $remarks
    );

    if ($stmt->execute()) {

        echo "Fraud Check Completed!<br>";
        echo "Payment ID: " . $payment_id . "<br>";
        echo "Risk Score: " . $risk_score . "<br>";
        echo "Fraud Status: " . $fraud_status . "<br>";
        echo "Remarks: " . $remarks;

        // Update payment status
        if ($fraud_status == "Safe") {

            $update = $conn->prepare(
                "UPDATE payment
                 SET payment_status = 'Processing'
                 WHERE payment_id = ?"
            );

        } else {

            $update = $conn->prepare(
                "UPDATE payment
                 SET payment_status = 'Failed'
                 WHERE payment_id = ?"
            );
        }

        $update->bind_param("i", $payment_id);
        $update->execute();
        $update->close();

    } else {

        echo "Fraud Check Failed: " . $stmt->error;
    }

    $stmt->close();
    $payment_stmt->close();
    $beneficiary_stmt->close();

} else {

    echo "Invalid Request Method.";
}

$conn->close();

?>