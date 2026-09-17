// Comprehensive system integration and end-to-end communication test
import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const bodyStr = data ? JSON.stringify(data) : null;
    if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr);

    const req = http.request(url, { method, headers }, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: rawData });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Full System Verification & Communication Test...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Authentication & RBAC Tests
    console.log('--- [Module: Authentication & RBAC] ---');
    const loginRes = await request('POST', '/api/auth/login', { username: 'teller', password: 'password123' });
    assert(loginRes.status === 200 && loginRes.data.token, 'Teller Login & JWT Token issuance');
    const tellerToken = loginRes.data?.token;

    const meRes = await request('GET', '/api/auth/me', null, tellerToken);
    assert(meRes.status === 200 && meRes.data.user.role === 'TELLER', 'Token validation & Role retrieval (TELLER)');

    const adminLogin = await request('POST', '/api/auth/login', { username: 'admin', password: 'password123' });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'ADMIN', 'Admin Login verification');

    // 2. Customer Directory & Teller Onboarding
    console.log('\n--- [Milestone 1: Customer Onboarding & KYC Verification] ---');
    const customersRes = await request('GET', '/api/customers');
    assert(customersRes.status === 200 && Array.isArray(customersRes.data) && customersRes.data.length > 0, `Fetch Customers (Count: ${customersRes.data.length})`);

    const newCust = await request('POST', '/api/customers', {
      name: 'Automated Test Client',
      email: `test-${Date.now()}@example.com`,
      phone: '+1 (555) 345-6789',
      accountType: 'Premium Savings',
      initialDeposit: 15000,
      documentType: 'Passport',
      documentNumber: 'TST-8849120',
      pepStatus: 'NO',
      createdBy: 'teller'
    }, tellerToken);
    assert(newCust.status === 200 && newCust.data.customer?.id, `Teller Customer Onboarding (${newCust.data.customer?.id})`);
    const createdCustomerId = newCust.data.customer?.id;

    // KYC Records & Submission
    const kycList = await request('GET', '/api/kyc');
    assert(kycList.status === 200 && Array.isArray(kycList.data), `Fetch KYC records (Count: ${kycList.data.length})`);

    const kycSubmit = await request('POST', '/api/kyc/submit', {
      customerId: createdCustomerId,
      customerName: 'Automated Test Client',
      documentType: 'National Identity Card',
      documentNumber: 'NID-9921448',
      issuingAuthority: 'Department of National Registration',
      expiryDate: '2034-12-31',
      submittedBy: 'Marcus Brody (Teller)'
    });
    assert(kycSubmit.status === 200 && kycSubmit.data.kyc?.id, `Teller KYC Document Filing (${kycSubmit.data.kyc?.id})`);
    const kycRecordId = kycSubmit.data.kyc?.id;

    // Supervisor Verification
    const kycVerify = await request('POST', '/api/kyc/verify', {
      kycId: kycRecordId,
      status: 'VERIFIED',
      notes: 'Automated verification check passed with zero sanctions hits.',
      reviewerName: 'Elena Rostova (Supervisor)'
    });
    assert(kycVerify.status === 200 && kycVerify.data.kyc?.status === 'VERIFIED', 'Supervisor KYC Approval & Customer Status Update');

    // 3. Transactions & Teller Counter Operations
    console.log('\n--- [Module: Teller Counter Operations & Ledger Transactions] ---');
    const depositRes = await request('POST', '/api/transactions/deposit', {
      accountNumber: newCust.data.customer.accountNumber,
      amount: 2500,
      tellerName: 'Marcus Brody',
      depositType: 'Cash Counter'
    });
    assert(depositRes.status === 200 && depositRes.data.transaction?.id, `Teller Cash Deposit of $2,500.00 (New balance: $${depositRes.data.newBalance})`);

    const transferRes = await request('POST', '/api/transactions/transfer', {
      fromAccountNumber: newCust.data.customer.accountNumber,
      toAccountNumber: 'FC-8820-9104-3312',
      amount: 500,
      description: 'System test inter-account transfer',
      senderName: 'Automated Test Client'
    });
    assert(transferRes.status === 200 && transferRes.data.transaction?.id, `Inter-Account Transfer of $500.00 (Ref: ${transferRes.data.transaction?.id})`);

    // 4. Milestone 2: Lending, Repayments & NPA Engine
    console.log('\n--- [Milestone 2: Repayment Tracking, Disbursement Saga & NPA Classification] ---');
    const loansRes = await request('GET', '/api/loans');
    assert(loansRes.status === 200 && Array.isArray(loansRes.data), `Fetch Active Credit Facilities (Count: ${loansRes.data.length})`);

    // Verify NPA classification stages exist
    const hasNpa = loansRes.data.some(l => l.npaClassification === 'NPA' || l.npaStage === 'NPA');
    const hasStandard = loansRes.data.some(l => l.npaClassification === 'STANDARD' || l.npaStage === 'STANDARD');
    assert(hasNpa && hasStandard, 'NPA Classification Engine verification (STANDARD and NPA stages present)');

    // Process Repayment
    const targetLoan = loansRes.data[0];
    const repayRes = await request('POST', '/api/repayments/pay', {
      loanId: targetLoan.id,
      amount: targetLoan.emiAmount || 2000,
      paidBy: 'Automated Test Payer'
    });
    assert(repayRes.status === 200 && repayRes.data.repayment?.id, `Process Installment Repayment ($${targetLoan.emiAmount || 2000} on ${targetLoan.id})`);

    // Sagas (Milestone 2 & 3)
    const sagasRes = await request('GET', '/api/sagas');
    assert(sagasRes.status === 200 && Array.isArray(sagasRes.data), `Fetch Disbursement Sagas (Count: ${sagasRes.data.length})`);

    const sagaExec = await request('POST', '/api/sagas/execute', {
      customerName: 'Marcus Wellington Corp',
      amount: 350000
    });
    assert(sagaExec.status === 200 && sagaExec.data.saga?.id, `Execute Distributed Disbursement Saga (Steps executed: ${sagaExec.data.saga?.steps?.length || 4})`);

    // 5. Milestone 3: Interbank Settlements & Notifications
    console.log('\n--- [Milestone 3: Saga Execution, Settlement Confirmation & Notifications] ---');
    const settlementsRes = await request('GET', '/api/settlements');
    assert(settlementsRes.status === 200 && Array.isArray(settlementsRes.data), `Fetch Interbank Settlements (Count: ${settlementsRes.data.length})`);

    const pendingSettlement = settlementsRes.data.find(s => s.status === 'PENDING' || s.confirmationStatus === 'PENDING') || settlementsRes.data[0];
    const confirmRes = await request('POST', '/api/settlements/confirm', {
      settlementId: pendingSettlement.id
    });
    assert(confirmRes.status === 200, `Confirm Interbank Settlement (${pendingSettlement.id})`);

    const notifsRes = await request('GET', '/api/notifications');
    assert(notifsRes.status === 200 && Array.isArray(notifsRes.data), `Fetch Notification Register (Count: ${notifsRes.data.length})`);

    const sendNotifRes = await request('POST', '/api/notifications/send', {
      recipient: 'Elena Rostova',
      channel: 'In-App & SMS',
      message: 'Settlement confirmed via RTGS window.',
      type: 'TREASURY_ALERT'
    });
    assert(sendNotifRes.status === 200, 'Dispatch Notification alert');

    // 6. Milestone 4: Risk Scoring, Compliance & Audit Integrity
    console.log('\n--- [Milestone 4: Risk Scoring, Compliance Check & Audit Integrity] ---');
    const riskRes = await request('GET', '/api/risk');
    assert(riskRes.status === 200 && Array.isArray(riskRes.data), `Fetch Risk Scores (Count: ${riskRes.data.length})`);

    const reassessRes = await request('POST', '/api/risk/reassess', {
      customerId: 'CUST-1002',
      newCreditScore: 790,
      notes: 'Institutional liquidity position upgraded after Q3 audit review.'
    });
    assert(reassessRes.status === 200 && reassessRes.data.updatedScore?.creditScore === 790, `Reassess Credit Risk (New score: ${reassessRes.data.updatedScore?.score}, Rating: 790)`);

    // Compliance Checks
    const compRes = await request('GET', '/api/compliance');
    assert(compRes.status === 200 && Array.isArray(compRes.data), `Fetch Regulatory Compliance Checks (Count: ${compRes.data.length})`);

    const compSubmit = await request('POST', '/api/compliance/submit', {
      customerId: createdCustomerId,
      customerName: 'Automated Test Client',
      checkType: 'AML & Sanctions Screening',
      categories: ['AML', 'OFAC Sanctions', 'PEP'],
      submittedBy: 'Marcus Brody (Teller)'
    });
    assert(compSubmit.status === 200 && compSubmit.data.check?.id, `Submit Compliance Investigation (${compSubmit.data.check?.id})`);

    const compReview = await request('POST', '/api/compliance/review', {
      checkId: compSubmit.data.check?.id,
      status: 'PASS',
      reviewedBy: 'Elena Rostova (Supervisor)',
      notes: 'Cleared all checks. No adverse regulatory media.'
    });
    assert(compReview.status === 200 && compReview.data.check?.status === 'PASS', 'Supervisor Compliance Sign-off');

    // Cryptographic Audit Integrity & Hash Chaining
    const logsRes = await request('GET', '/api/audit/logs');
    assert(logsRes.status === 200 && Array.isArray(logsRes.data) && logsRes.data.length >= 5, `Audit Trail Ledger (Chain Length: ${logsRes.data.length} SHA-256 blocks)`);

    const integrityRes = await request('GET', '/api/audit/integrity');
    assert(integrityRes.status === 200 && integrityRes.data.valid === true, `Cryptographic Hash Chain Verification (Valid: ${integrityRes.data.valid}, Blocks: ${integrityRes.data.totalBlocks})`);

    // Tamper Detection Simulation & Recovery
    console.log('\n--- [Testing Forensic Tamper Detection & Recovery] ---');
    const tamperRes = await request('POST', '/api/audit/tamper', { blockIndex: 1 });
    assert(tamperRes.status === 200, 'Simulate Forensic Tamper on Block 1');

    const checkTampered = await request('GET', '/api/audit/integrity');
    const tamperedBlock = checkTampered.data.tamperedIndex ?? checkTampered.data.tamperedBlockIndex;
    assert((checkTampered.data.valid === false || checkTampered.data.isValid === false) && tamperedBlock !== null, `Tamper Detected Successfully (Valid: ${checkTampered.data.valid}, Broken at Block: ${tamperedBlock})`);

    const restoreRes = await request('POST', '/api/audit/restore');
    assert(restoreRes.status === 200, 'Restore Ledger to Canonical State');

    const checkRestored = await request('GET', '/api/audit/integrity');
    assert(checkRestored.data.valid === true, `Cryptographic Hash Chain Re-verified (Valid: ${checkRestored.data.valid})`);

    // 7. Cross-Module Communication & End-to-End Pipeline
    console.log('\n--- [Testing Cross-Module Integration Pipeline] ---');
    const workflowRes = await request('POST', '/api/cross-module/run-workflow', {
      customerName: 'Ambassador Victoria Sterling'
    });
    assert(workflowRes.status === 200 && workflowRes.data.success === true, 'End-to-End Pipeline: Onboarding -> KYC -> Risk -> Compliance -> Audit Hash Chaining');

    console.log(`\n==================================================`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`==================================================\n`);
  } catch (err) {
    console.error('Fatal Test Exception:', err);
  }
}

runTests();
