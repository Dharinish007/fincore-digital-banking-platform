<?php

include("db_connect.php");

// ------------------------------
// Sample Data (Testing Purpose)
// ------------------------------

$account_no="SB10000001";
$amount = 2000;

// ------------------------------
// Check Account
// ------------------------------

$checkQuery = "SELECT balance FROM account WHERE account_no = $account_no";
$result = mysqli_query($conn, $checkQuery);

if(mysqli_num_rows($result) > 0)
{
    $row = mysqli_fetch_assoc($result);
    $current_balance = $row['balance'];

    // Check Sufficient Balance

    if($current_balance >= $amount)
    {
        // Withdraw Amount

        $updateQuery = "UPDATE account
                        SET balance = balance - $amount
                        WHERE account_no = $account_no";

        if(mysqli_query($conn, $updateQuery))
        {
            // Insert Transaction

            $transactionQuery = "INSERT INTO transactions
            (account_no, transaction_type, amount)
            VALUES
            ($account_no,'Withdraw',$amount)";

            mysqli_query($conn, $transactionQuery);

            // Show Updated Balance

            $newBalance = mysqli_query($conn,
            "SELECT balance FROM account WHERE account_no=$account_no");

            $data = mysqli_fetch_assoc($newBalance);

            echo "<h2 style='color:green;'>Withdrawal Successful ✅</h2>";
            echo "<h3>Updated Balance : ₹".$data['balance']."</h3>";
        }
        else
        {
            echo "Withdrawal Failed";
        }
    }
    else
    {
        echo "<h2 style='color:red;'>Insufficient Balance ❌</h2>";
    }

}
else
{
    echo "<h2 style='color:red;'>Account Not Found ❌</h2>";
}

mysqli_close($conn);

?>