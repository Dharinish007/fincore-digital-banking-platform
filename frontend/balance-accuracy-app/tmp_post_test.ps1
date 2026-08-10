$acct = @{ 
  customerName='Test User'
  email='test@example.com'
  phone='9999999999'
  accountNo='SB99999999'
  accountType='Savings'
  balance=1000
  status='Active'
  branchName='Main'
  ifscCode='IFSC000'
}
$json = $acct | ConvertTo-Json
Write-Host "Posting account creation..."
try {
  $resp = Invoke-RestMethod -Uri 'http://localhost:8080/accountCreation' -Method Post -ContentType 'application/json' -Body $json -ErrorAction Stop
  Write-Host "Account creation response:"
  $resp | ConvertTo-Json | Write-Host
} catch {
  Write-Host "Account creation failed: " $_.Exception.Message
}

$trans = @{ 
  senderAccountNumber='SB10000001'
  receiverAccountNumber='SB10000002'
  amount=123.45
}
$t = $trans | ConvertTo-Json
Write-Host "Posting transfer..."
try {
  $resp2 = Invoke-RestMethod -Uri 'http://localhost:8080/api/transfer/transfer' -Method Post -ContentType 'application/json' -Body $t -ErrorAction Stop
  Write-Host "Transfer response:"
  $resp2 | ConvertTo-Json | Write-Host
} catch {
  Write-Host "Transfer failed: " $_.Exception.Message
}
