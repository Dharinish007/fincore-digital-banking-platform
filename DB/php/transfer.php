<?php

include("db_connect.php");

// ------------------------------
// Sample Data (Testing Purpose)
// ------------------------------
$sender_account="SB10000001";
$receiver_account="SB10000002";
$amount = 3000;

// Start Transaction

mysqli_begin_transaction($conn);

try {

    // Check Sender Balance

    $result = mysqli_query($conn,
    "SELECT balance FROM account WHERE account_no = $sender_account");

    $row = mysqli_fetch_assoc($result);

    if($row['balance'] < $amount)
    {
        throw new Exception("Insufficient Balance");
    }

    // Debit Sender

    mysqli_query($conn,
    "UPDATE account
     SET balance = balance - $amount
     WHERE account_no = $sender_account");

    // Credit Receiver

    mysqli_query($conn,
    "UPDATE account
     SET balance = balance + $amount
     WHERE account_no = $receiver_account");

    // Insert Transaction Record

    mysqli_query($conn,
    "INSERT INTO transactions(account_no, transaction_type, amount)
     VALUES($sender_account,'Transfer',$amount)");

    // Commit

    mysqli_commit($conn);

    echo "<h2 style='color:green;'>Transfer Successful ✅</h2>";

}
catch(Exception $e)
{
    mysqli_rollback($conn);

    echo "<h2 style='color:red;'>Transfer Failed ❌</h2>";
    echo $e->getMessage();
}

mysqli_close($conn);

?>