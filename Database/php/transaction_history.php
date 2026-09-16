<?php

include("db_connect.php");

// ------------------------------
// Sample Data (Testing Purpose)
// ------------------------------
$account_no="SB10000001";

// ------------------------------
// Fetch Transaction History
// ------------------------------

$query = "SELECT transaction_id,
                 account_no,
                 transaction_type,
                 amount,
                 transaction_date
          FROM transactions
          WHERE account_no = $account_no
          ORDER BY transaction_date DESC";

$result = mysqli_query($conn, $query);

echo "<h2>Transaction History</h2>";

if(mysqli_num_rows($result) > 0)
{
    echo "<table border='1' cellpadding='10'>";

    echo "<tr>
            <th>Transaction ID</th>
            <th>Account No</th>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Date & Time</th>
          </tr>";

    while($row = mysqli_fetch_assoc($result))
    {
        echo "<tr>";

        echo "<td>".$row['transaction_id']."</td>";
        echo "<td>".$row['account_no']."</td>";
        echo "<td>".$row['transaction_type']."</td>";
        echo "<td>₹".$row['amount']."</td>";
        echo "<td>".$row['transaction_date']."</td>";

        echo "</tr>";
    }

    echo "</table>";
}
else
{
    echo "<h3>No Transactions Found.</h3>";
}

mysqli_close($conn);

?>