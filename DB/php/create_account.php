<?php

include("db_connect.php");

// -----------------------------
// Sample Data (Testing Purpose)
// -----------------------------

$full_name = "Rahul Sharma";
$email = "rahul@gmail.com";
$phone = "9876543210";

$account_no = "SB10000001";

$account_type = "Savings";
$balance = 10000.00;
$status = "Active";
$branch_name = "Indore Branch";
$ifsc_code = "SBIN0001234";

// -----------------------------
// Insert Customer
// -----------------------------

$sql = "INSERT INTO customer(full_name, email, phone)
VALUES ('$full_name', '$email', '$phone')";

if(mysqli_query($conn, $sql))
{

    // Get Last Inserted Customer ID

    $customer_id = mysqli_insert_id($conn);

    // -----------------------------
    // Create Account
    // -----------------------------

  $account_no = "SB" . rand(10000000, 99999999);

$sql2 = "INSERT INTO account
(account_no, customer_id, account_type, balance, status, branch_name, ifsc_code)

VALUES

('$account_no', $customer_id, '$account_type', $balance,
'$status', '$branch_name', '$ifsc_code')";

    if(mysqli_query($conn, $sql2))
    {
        echo "<h2 style='color:green;'>Account Created Successfully ✅</h2>";
    }
    else
    {
        echo "<h2 style='color:red;'>Account Creation Failed ❌</h2>";
        echo mysqli_error($conn);
    }

}
else
{
    echo "<h2 style='color:red;'>Customer Registration Failed ❌</h2>";
    echo mysqli_error($conn);
}

mysqli_close($conn);

?>