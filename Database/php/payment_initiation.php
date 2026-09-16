<?php

include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $from_account_no = $_POST['from_account_no'] ?? '';
    $to_account_no = $_POST['to_account_no'] ?? '';
    $beneficiary_id = $_POST['beneficiary_id'] ?? '';
    $amount = $_POST['amount'] ?? '';
    $payment_type = $_POST['payment_type'] ?? 'Transfer';
    $payment_mode = $_POST['payment_mode'] ?? 'IMPS';
    $description = $_POST['description'] ?? '';

    if (
        empty($from_account_no) ||
        empty($to_account_no) ||
        empty($beneficiary_id) ||
        empty($amount)
    ) {
        die("Required payment details are missing.");
    }

    if ($amount <= 0) {
        die("Payment amount must be greater than 0.");
    }

    // Check sender account
    $sender_stmt = $conn->prepare(
        "SELECT account_no, balance
         FROM account
         WHERE account_no = ?"
    );

    $sender_stmt->bind_param("s", $from_account_no);
    $sender_stmt->execute();

    $sender_result = $sender_stmt->get_result();

    if ($sender_result->num_rows == 0) {
        die("Sender account not found.");
    }

    $sender = $sender_result->fetch_assoc();

    if ($sender['balance'] < $amount) {
        die("Insufficient account balance.");
    }

    // Check beneficiary
    $beneficiary_stmt = $conn->prepare(
        "SELECT beneficiary_id, status
         FROM beneficiary
         WHERE beneficiary_id = ?"
    );

    $beneficiary_stmt->bind_param("i", $beneficiary_id);
    $beneficiary_stmt->execute();

    $beneficiary_result = $beneficiary_stmt->get_result();

    if ($beneficiary_result->num_rows == 0) {
        die("Beneficiary not found.");
    }

    $beneficiary = $beneficiary_result->fetch_assoc();

    if ($beneficiary['status'] != 'Verified') {
        die("Beneficiary is not verified.");
    }

    // Generate transaction reference
    $transaction_ref = "TXN-" . date("YmdHis") . rand(100, 999);

    // Payment remains Pending until verification and fraud check
    $sql = "INSERT INTO payment
            (
                from_account_no,
                to_account_no,
                beneficiary_id,
                amount,
                payment_type,
                payment_mode,
                payment_status,
                transaction_ref,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "ssidssss",
        $from_account_no,
        $to_account_no,
        $beneficiary_id,
        $amount,
        $payment_type,
        $payment_mode,
        $transaction_ref,
        $description
    );

    if ($stmt->execute()) {

        echo "Payment Initiated Successfully!<br>";
        echo "Payment ID: " . $stmt->insert_id . "<br>";
        echo "Transaction Reference: " . $transaction_ref . "<br>";
        echo "Status: Pending";

    } else {

        echo "Payment Initiation Failed: " . $stmt->error;
    }

    $stmt->close();
    $sender_stmt->close();
    $beneficiary_stmt->close();

} else {

    echo "Invalid Request Method.";
}

$conn->close();

?>