<?php

// ===========================================
// EMI CALCULATION
// ===========================================

// Database Connection
include 'db_connect.php';


// Check Loan ID
if (!isset($_GET['loan_id'])) {
    die("Loan ID is required.");
}

$loan_id = intval($_GET['loan_id']);


// ===========================================
// FETCH LOAN DETAILS
// ===========================================

$sql = "SELECT 
            loan_id,
            loan_amount,
            interest_rate,
            tenure_months,
            application_status
        FROM loan_application
        WHERE loan_id = ?";

$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    die("Prepare Failed: " . mysqli_error($conn));
}

mysqli_stmt_bind_param($stmt, "i", $loan_id);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);


// Check Loan Exists
if (mysqli_num_rows($result) == 0) {
    die("Loan application not found.");
}

$loan = mysqli_fetch_assoc($result);

mysqli_stmt_close($stmt);


// ===========================================
// CHECK LOAN STATUS
// ===========================================

if ($loan['application_status'] !== 'Approved') {
    die("EMI can be calculated only for an Approved loan.");
}


// ===========================================
// GET LOAN DETAILS
// ===========================================

$principal_amount = floatval($loan['loan_amount']);
$interest_rate = floatval($loan['interest_rate']);
$tenure_months = intval($loan['tenure_months']);


// Validate Loan Details
if ($principal_amount <= 0) {
    die("Invalid loan amount.");
}

if ($tenure_months <= 0) {
    die("Invalid loan tenure.");
}

if ($interest_rate < 0) {
    die("Invalid interest rate.");
}


// ===========================================
// CHECK EXISTING EMI CALCULATION
// ===========================================

$check_sql = "SELECT 
                emi_id,
                principal_amount,
                interest_rate,
                tenure_months,
                monthly_emi,
                total_interest,
                total_payable,
                calculated_at
              FROM emi_calculation
              WHERE loan_id = ?";

$check_stmt = mysqli_prepare($conn, $check_sql);

if (!$check_stmt) {
    die("EMI Check Failed: " . mysqli_error($conn));
}

mysqli_stmt_bind_param($check_stmt, "i", $loan_id);
mysqli_stmt_execute($check_stmt);

$existing_result = mysqli_stmt_get_result($check_stmt);


// If EMI already exists
if (mysqli_num_rows($existing_result) > 0) {

    $emi_data = mysqli_fetch_assoc($existing_result);

    echo "<h2>EMI Calculation Already Exists</h2>";

    echo "Loan ID: " . $loan_id . "<br>";
    echo "Principal Amount: ₹" .
         number_format($emi_data['principal_amount'], 2) . "<br>";

    echo "Interest Rate: " .
         $emi_data['interest_rate'] . "%<br>";

    echo "Tenure: " .
         $emi_data['tenure_months'] . " months<br>";

    echo "<strong>Monthly EMI: ₹" .
         number_format($emi_data['monthly_emi'], 2) .
         "</strong><br>";

    echo "Total Interest: ₹" .
         number_format($emi_data['total_interest'], 2) .
         "<br>";

    echo "Total Payable: ₹" .
         number_format($emi_data['total_payable'], 2) .
         "<br>";

    echo "Calculated At: " .
         $emi_data['calculated_at'];

    mysqli_stmt_close($check_stmt);
    mysqli_close($conn);

    exit();
}

mysqli_stmt_close($check_stmt);


// ===========================================
// EMI CALCULATION
// ===========================================

// Monthly Interest Rate
$monthly_rate = ($interest_rate / 12) / 100;


// Calculate EMI
if ($monthly_rate > 0) {

    $monthly_emi =
        $principal_amount *
        $monthly_rate *
        pow(1 + $monthly_rate, $tenure_months) /
        (pow(1 + $monthly_rate, $tenure_months) - 1);

} else {

    // EMI when interest rate is 0%
    $monthly_emi = $principal_amount / $tenure_months;
}


// Round EMI
$monthly_emi = round($monthly_emi, 2);


// ===========================================
// TOTAL INTEREST & PAYABLE
// ===========================================

$total_payable = $monthly_emi * $tenure_months;

$total_interest = $total_payable - $principal_amount;


// Round values
$total_payable = round($total_payable, 2);
$total_interest = round($total_interest, 2);


// ===========================================
// SAVE EMI CALCULATION
// ===========================================

$insert_sql = "INSERT INTO emi_calculation
               (
                   loan_id,
                   principal_amount,
                   interest_rate,
                   tenure_months,
                   monthly_emi,
                   total_interest,
                   total_payable
               )
               VALUES (?, ?, ?, ?, ?, ?, ?)";

$insert_stmt = mysqli_prepare($conn, $insert_sql);

if (!$insert_stmt) {
    die("EMI Insert Prepare Failed: " . mysqli_error($conn));
}


// Bind Values
mysqli_stmt_bind_param(
    $insert_stmt,
    "iddiddd",
    $loan_id,
    $principal_amount,
    $interest_rate,
    $tenure_months,
    $monthly_emi,
    $total_interest,
    $total_payable
);


// Execute Insert
if (mysqli_stmt_execute($insert_stmt)) {

    echo "<h2>EMI Calculation Successful!</h2>";

    echo "Loan ID: " . $loan_id . "<br>";

    echo "Principal Amount: ₹" .
         number_format($principal_amount, 2) .
         "<br>";

    echo "Interest Rate: " .
         $interest_rate .
         "%<br>";

    echo "Tenure: " .
         $tenure_months .
         " months<br>";

    echo "<strong>Monthly EMI: ₹" .
         number_format($monthly_emi, 2) .
         "</strong><br>";

    echo "Total Interest: ₹" .
         number_format($total_interest, 2) .
         "<br>";

    echo "Total Payable: ₹" .
         number_format($total_payable, 2) .
         "<br>";

} else {

    echo "Failed to save EMI calculation: " .
         mysqli_error($conn);
}


// ===========================================
// CLOSE CONNECTION
// ===========================================

mysqli_stmt_close($insert_stmt);
mysqli_close($conn);

?>