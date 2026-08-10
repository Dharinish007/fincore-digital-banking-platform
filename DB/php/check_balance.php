<?php

include("db_connect.php");

// ------------------------------
// Sample Data (Testing Purpose)
// ------------------------------

$account_no="SB10000001";

// ------------------------------
// Check Account
// ------------------------------

$query = "SELECT account_no, balance
          FROM account
          WHERE account_no = $account_no";

$result = mysqli_query($conn, $query);

if(mysqli_num_rows($result) > 0)
{
    $row = mysqli_fetch_assoc($result);

    echo "<h2 style='color:green;'>Account Found ✅</h2>";

    echo "<p><strong>Account Number :</strong> "
    . $row['account_no'] . "</p>";

    echo "<p><strong>Current Balance :</strong> ₹"
    . $row['balance'] . "</p>";
}
else
{
    echo "<h2 style='color:red;'>Account Not Found ❌</h2>";
}

mysqli_close($conn);

?>