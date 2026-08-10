<?php

include("db_connect.php");

// -----------------------------
// Sample Data (Testing Purpose)
// -----------------------------

$account_no = "SB10000001";
$amount = 5000;

// -----------------------------
// Check if Account Exists
// -----------------------------

$check = "SELECT * FROM account WHERE account_no = $account_no";
$result = mysqli_query($conn, $check);

if(mysqli_num_rows($result) > 0)
{
    // -----------------------------
    // Deposit Money
    // -----------------------------

    $sql = "UPDATE account
            SET balance = balance + $amount
            WHERE account_no = $account_no";

    if(mysqli_query($conn, $sql))
    {
        // -----------------------------
        // Insert Transaction Record
        // -----------------------------

        $sql2 = "INSERT INTO transactions
                (account_no, transaction_type, amount)

                VALUES

                ($account_no, 'Deposit', $amount)";

        if(mysqli_query($conn, $sql2))
        {
            echo "<h2 style='color:green;'>Deposit Successful ✅</h2>";
        }
        else
        {
            echo "<h2 style='color:red;'>Transaction Record Failed ❌</h2>";
            echo mysqli_error($conn);
        }

    }
    else
    {
        echo "<h2 style='color:red;'>Deposit Failed ❌</h2>";
        echo mysqli_error($conn);
    }

}
else
{
    echo "<h2 style='color:red;'>Account Not Found ❌</h2>";
}

mysqli_close($conn);

?>