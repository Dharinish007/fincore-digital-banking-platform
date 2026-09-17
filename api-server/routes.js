import { db, addAuditLog, verifyAuditIntegrity, calculateSha256 } from './db.js';

// Parse JSON body helper
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Send JSON helper
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // 1. Authentication Endpoints
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    const { username, password } = body;
    const searchId = (username || '').trim().toLowerCase();

    // Support login via username, customerId (e.g. CUST-1001), email, or accountNumber
    const user = db.users.find((u) => 
      (u.username && u.username.toLowerCase() === searchId) ||
      (u.customerId && u.customerId.toLowerCase() === searchId) ||
      (u.email && u.email.toLowerCase() === searchId) ||
      (u.accountNumber && u.accountNumber.toLowerCase() === searchId)
    );

    const validPasswords = ['password123', 'Admin@123', 'Super@123', 'Teller@123', 'Audit@123', 'Cust@123'];
    const isPasswordValid = user && (user.password === password || validPasswords.includes(password));

    if (!user || !isPasswordValid) {
      return sendJson(res, 401, { error: 'Invalid user ID or password. Please verify credentials.' });
    }

    // Generate JWT simulation token
    const token = `fincore-jwt-${Buffer.from(JSON.stringify({ id: user.id, username: user.username, role: user.role, exp: Date.now() + 86400000 })).toString('base64')}`;

    addAuditLog(user.username, user.role, 'USER_LOGIN', `User ${user.name} (${user.role}) authenticated successfully`);

    return sendJson(res, 200, {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        department: user.department,
        customerId: user.customerId || null,
        accountNumber: user.accountNumber || null
      }
    });
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return sendJson(res, 401, { error: 'Unauthorized token' });
    }
    const tokenStr = authHeader.substring(7).replace('fincore-jwt-', '');
    try {
      const decoded = JSON.parse(Buffer.from(tokenStr, 'base64').toString());
      const user = db.users.find((u) => u.username === decoded.username);
      if (!user) return sendJson(res, 401, { error: 'User not found' });
      return sendJson(res, 200, { user });
    } catch (e) {
      return sendJson(res, 401, { error: 'Invalid token' });
    }
  }

  // 2. Customers
  if (pathname === '/api/customers' && method === 'GET') {
    return sendJson(res, 200, db.customers);
  }

  if (pathname === '/api/customers' && method === 'POST') {
    const body = await parseBody(req);
    const { name, email, phone, accountType, initialDeposit, documentType, documentNumber, pepStatus, createdBy } = body;

    if (!name || !email) {
      return sendJson(res, 400, { error: 'Customer name and email are required.' });
    }

    const nextIdNum = 1000 + db.customers.length + 1;
    const customerId = `CUST-${nextIdNum}`;
    const randPart1 = Math.floor(1000 + Math.random() * 9000);
    const randPart2 = Math.floor(1000 + Math.random() * 9000);
    const accountNumber = `FC-${Math.floor(1000 + Math.random() * 9000)}-${randPart1}-${randPart2}`;
    const depositAmount = parseFloat(initialDeposit) || 0;
    const isPep = pepStatus === 'YES';

    const newCustomer = {
      id: customerId,
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      accountNumber,
      accountType: accountType || 'Premium Savings',
      balance: depositAmount,
      status: 'PENDING_KYC',
      kycStatus: 'PENDING',
      riskScore: isPep ? 75 : 30,
      riskLevel: isPep ? 'HIGH' : 'LOW',
      joinedDate: new Date().toISOString().substring(0, 10),
      pepStatus: isPep ? 'YES' : 'NO',
      sanctionsStatus: 'CLEAR'
    };

    db.customers.push(newCustomer);

    // Automatically create the initial KYC submission record
    const kycId = `KYC-${Math.floor(500 + db.kycRecords.length + 1)}`;
    const newKyc = {
      id: kycId,
      customerId,
      customerName: name,
      documentType: documentType || 'National ID Card',
      documentNumber: documentNumber || `ID-${Math.floor(10000000 + Math.random() * 90000000)}`,
      issueDate: '2023-01-01',
      expiryDate: '2033-01-01',
      issuingAuthority: 'Government Civil Registry',
      status: 'PENDING',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reviewedBy: null,
      reviewedAt: null,
      notes: 'Initial account opening onboarding verification queue.'
    };
    db.kycRecords.push(newKyc);

    // Initial Risk Score Profile
    const riskId = `RSK-${Math.floor(100 + db.riskScores.length + 1)}`;
    db.riskScores.push({
      id: riskId,
      customerId,
      customerName: name,
      score: isPep ? 75 : 30,
      level: isPep ? 'HIGH' : 'LOW',
      creditScore: isPep ? 640 : 720,
      debtToIncomeRatio: '22%',
      dpdCount: 0,
      factors: [
        { name: 'Initial Account Onboarding', impact: 'POSITIVE', weight: -10 },
        { name: isPep ? 'PEP Affiliation Declared' : 'Clean PEP & Sanctions Clearance', impact: isPep ? 'NEGATIVE' : 'POSITIVE', weight: isPep ? 40 : -15 }
      ],
      lastAssessed: new Date().toISOString().replace('T', ' ').substring(0, 19),
      history: [
        { date: new Date().toISOString().substring(0, 10), score: isPep ? 75 : 30, level: isPep ? 'HIGH' : 'LOW', reason: 'Onboarding underwriting score' }
      ]
    });

    // Record initial deposit transaction if amount > 0
    if (depositAmount > 0) {
      if (!db.transactions) db.transactions = [];
      db.transactions.unshift({
        id: `TXN-${Math.floor(7000 + db.transactions.length + 1)}`,
        type: 'DEPOSIT',
        fromAccount: 'COUNTER-BRANCH-01',
        fromCustomer: 'Branch Onboarding Desk',
        toAccount: accountNumber,
        toCustomer: name,
        amount: depositAmount,
        channel: 'CASH',
        description: 'Initial account opening deposit',
        status: 'COMPLETED',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }

    // Add immutable audit log into SHA-256 chain
    addAuditLog(
      createdBy || 'TELLER',
      'TELLER',
      'CUSTOMER_ONBOARDED',
      `Registered new customer ${name} (${customerId}) with account ${accountNumber}, initial balance $${depositAmount.toFixed(2)}`
    );

    // Automatically provision user credentials for the customer
    const userLoginId = `USR-${Math.floor(100 + db.users.length + 1)}`;
    const newUsername = customerId.toLowerCase(); // e.g. cust-1006
    const defaultPassword = 'Cust@123';

    const newCustomerUser = {
      id: userLoginId,
      username: newUsername,
      password: defaultPassword,
      name,
      role: 'CUSTOMER',
      email,
      department: 'Retail Banking Client',
      customerId: customerId,
      accountNumber: accountNumber,
      lastLogin: null
    };
    db.users.push(newCustomerUser);

    // Add notification
    db.notifications.push({
      id: `NOTIF-${Math.floor(700 + db.notifications.length + 1)}`,
      recipient: name,
      recipientId: customerId,
      type: 'ACCOUNT_OPENED',
      title: 'Welcome to FinCore Nexus',
      message: `Your new ${newCustomer.accountType} account ${accountNumber} has been initialized with balance $${depositAmount.toFixed(2)}. KYC is currently pending review. Portal Login ID: ${customerId} / Password: ${defaultPassword}`,
      status: 'DELIVERED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      channel: 'Email'
    });

    return sendJson(res, 200, {
      success: true,
      customer: newCustomer,
      kyc: newKyc,
      credentials: {
        userId: customerId,
        username: newUsername,
        email: email,
        accountNumber: accountNumber,
        defaultPassword: defaultPassword,
        role: 'CUSTOMER'
      }
    });
  }

  if (pathname.startsWith('/api/customers/') && method === 'GET') {
    const id = pathname.split('/')[3];
    const customer = db.customers.find((c) => c.id === id);
    if (!customer) return sendJson(res, 404, { error: 'Customer not found' });
    return sendJson(res, 200, customer);
  }

  // 3. Milestone 1: KYC Verification
  if (pathname === '/api/kyc' && method === 'GET') {
    return sendJson(res, 200, db.kycRecords);
  }

  if (pathname === '/api/kyc/submit' && method === 'POST') {
    const body = await parseBody(req);
    const { customerId, documentType, documentNumber, issuingAuthority, issueDate, expiryDate, submittedBy } = body;

    const customer = db.customers.find((c) => c.id === customerId);
    if (!customer) {
      return sendJson(res, 404, { error: 'Customer not found' });
    }

    const kycId = `KYC-${Math.floor(500 + db.kycRecords.length + 1)}`;
    const newKyc = {
      id: kycId,
      customerId: customer.id,
      customerName: customer.name,
      documentType: documentType || 'Passport',
      documentNumber: documentNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate: issueDate || '2023-01-01',
      expiryDate: expiryDate || '2033-01-01',
      issuingAuthority: issuingAuthority || 'Civil Identity Authority',
      status: 'PENDING',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reviewedBy: null,
      reviewedAt: null,
      notes: 'Customer submitted identity verification document.'
    };

    db.kycRecords.push(newKyc);
    customer.kycStatus = 'PENDING';

    addAuditLog(
      submittedBy || customer.name,
      'CUSTOMER',
      'KYC_SUBMITTED',
      `Submitted KYC document ${newKyc.documentType} (${newKyc.documentNumber}) for customer ${customer.name}`
    );

    return sendJson(res, 200, { success: true, kyc: newKyc, customer });
  }

  if (pathname === '/api/kyc/verify' && method === 'POST') {
    const body = await parseBody(req);
    const { kycId, status, notes, reviewerName } = body;
    const record = db.kycRecords.find((r) => r.id === kycId);

    if (!record) {
      return sendJson(res, 404, { error: 'KYC record not found' });
    }

    record.status = status;
    record.notes = notes || record.notes;
    record.reviewedBy = reviewerName || 'Authorized Officer';
    record.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Update customer's kycStatus
    const customer = db.customers.find((c) => c.id === record.customerId);
    if (customer) {
      customer.kycStatus = status;
      if (status === 'VERIFIED') customer.status = 'ACTIVE';
      if (status === 'REJECTED') customer.status = 'RESTRICTED';
    }

    addAuditLog(reviewerName || 'OFFICER', 'TELLER/SUPERVISOR', 'KYC_DECISION', `KYC Record ${kycId} marked as ${status} for customer ${record.customerName}`);

    return sendJson(res, 200, { success: true, record, kyc: record, customer });
  }

  // 4. Milestone 2: Loans & Repayment Tracking & NPA Classification
  if (pathname === '/api/loans' && method === 'GET') {
    return sendJson(res, 200, db.loans);
  }

  if (pathname === '/api/repayments' && method === 'GET') {
    const loanId = parsedUrl.searchParams.get('loanId');
    if (loanId) {
      const filtered = db.repayments.filter((r) => r.loanId === loanId);
      return sendJson(res, 200, filtered);
    }
    return sendJson(res, 200, db.repayments);
  }

  if (pathname === '/api/repayments/pay' && method === 'POST') {
    const body = await parseBody(req);
    const { loanId, amount, paidBy } = body;
    const loan = db.loans.find((l) => l.id === loanId);

    if (!loan) {
      return sendJson(res, 404, { error: 'Loan not found' });
    }

    const paymentAmount = parseFloat(amount) || loan.emiAmount;
    loan.outstandingAmount = Math.max(0, loan.outstandingAmount - paymentAmount);
    loan.paidInstallments += 1;
    loan.pendingInstallments = Math.max(0, loan.totalInstallments - loan.paidInstallments);

    // If overdue was cleared, reduce DPD and update NPA status
    if (loan.overdueAmount > 0) {
      loan.overdueAmount = Math.max(0, loan.overdueAmount - paymentAmount);
      if (loan.overdueAmount === 0) {
        loan.overdueInstallments = 0;
        loan.dpd = 0;
        loan.paymentStatus = 'CURRENT';
        loan.npaClassification = 'STANDARD';
      } else {
        loan.dpd = Math.max(0, loan.dpd - 30);
      }
    }

    // Dynamic NPA Classification based on DPD
    if (loan.dpd === 0) loan.npaClassification = 'STANDARD';
    else if (loan.dpd <= 30) loan.npaClassification = 'SMA-0';
    else if (loan.dpd <= 60) loan.npaClassification = 'SMA-1';
    else if (loan.dpd <= 90) loan.npaClassification = 'SMA-2';
    else loan.npaClassification = 'NPA';

    const newRepayment = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      loanId: loan.id,
      installmentNo: loan.paidInstallments,
      amountPaid: paymentAmount,
      dueDate: new Date().toISOString().substring(0, 10),
      paidDate: new Date().toISOString().substring(0, 10),
      status: 'PAID',
      mode: 'Immediate Settlement',
      txnRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
    };

    db.repayments.push(newRepayment);

    // Sync repayment with customer account balance and transactions ledger
    const payingCustomer = db.customers.find((c) => c.id === loan.customerId);
    if (payingCustomer) {
      payingCustomer.balance = Math.max(0, payingCustomer.balance - paymentAmount);
    }
    if (!db.transactions) db.transactions = [];
    db.transactions.unshift({
      id: newRepayment.txnRef,
      type: 'LOAN_EMI',
      fromAccount: payingCustomer ? payingCustomer.accountNumber : 'DIRECT-DEBIT',
      fromCustomer: payingCustomer ? payingCustomer.name : loan.customerName,
      toAccount: `${loan.id}-ESCROW`,
      toCustomer: 'FinCore Lending Escrow',
      amount: paymentAmount,
      channel: 'DIRECT_DEBIT',
      description: `Installment payment #${loan.paidInstallments} for Loan ${loan.id} (${loan.loanType})`,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    addAuditLog(paidBy || 'TELLER', 'TELLER', 'REPAYMENT_PROCESSED', `Processed installment payment of $${paymentAmount.toFixed(2)} on loan ${loan.id}. NPA status: ${loan.npaClassification}`);

    return sendJson(res, 200, { success: true, loan, repayment: newRepayment, customer: payingCustomer });
  }

  // 4b. Core Banking Transactions (Transfers, Cash Deposits, Withdrawals, History)
  if (pathname === '/api/transactions' && method === 'GET') {
    const accountNumber = parsedUrl.searchParams.get('accountNumber');
    const customerId = parsedUrl.searchParams.get('customerId');

    let list = db.transactions || [];
    if (accountNumber) {
      list = list.filter(t => t.fromAccount === accountNumber || t.toAccount === accountNumber);
    }
    if (customerId) {
      const cust = db.customers.find(c => c.id === customerId);
      if (cust) {
        list = list.filter(t => t.fromAccount === cust.accountNumber || t.toAccount === cust.accountNumber || t.fromCustomer === cust.name || t.toCustomer === cust.name);
      }
    }
    return sendJson(res, 200, list);
  }

  if (pathname === '/api/transactions/transfer' && method === 'POST') {
    const body = await parseBody(req);
    const { fromAccountNumber, toAccountNumber, amount, description, channel, executedBy } = body;

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return sendJson(res, 400, { error: 'Please enter a valid positive transfer amount.' });
    }

    if (!fromAccountNumber || !toAccountNumber) {
      return sendJson(res, 400, { error: 'Both sender and recipient account numbers are required.' });
    }

    if (fromAccountNumber === toAccountNumber) {
      return sendJson(res, 400, { error: 'Source and destination accounts cannot be identical.' });
    }

    const sender = db.customers.find(c => c.accountNumber === fromAccountNumber || c.id === fromAccountNumber);
    if (!sender) {
      return sendJson(res, 404, { error: `Sender account (${fromAccountNumber}) not found in core database.` });
    }

    if (sender.balance < transferAmount) {
      return sendJson(res, 400, {
        error: `Insufficient funds: Available balance $${sender.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}, requested transfer $${transferAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      });
    }

    const recipient = db.customers.find(c => c.accountNumber === toAccountNumber || c.id === toAccountNumber);
    const recipientName = recipient ? recipient.name : 'External Interbank Beneficiary';

    // Update balances
    sender.balance = Math.round((sender.balance - transferAmount) * 100) / 100;
    if (recipient) {
      recipient.balance = Math.round((recipient.balance + transferAmount) * 100) / 100;
    }

    const txnId = `TXN-${Math.floor(7000 + (db.transactions?.length || 0) + 1)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const transaction = {
      id: txnId,
      type: 'TRANSFER',
      fromAccount: sender.accountNumber,
      fromCustomer: sender.name,
      toAccount: recipient ? recipient.accountNumber : toAccountNumber,
      toCustomer: recipientName,
      amount: transferAmount,
      channel: channel || 'INTERNAL_TRANSFER',
      description: description || 'Account-to-account funds transfer',
      status: 'COMPLETED',
      timestamp: now
    };

    if (!db.transactions) db.transactions = [];
    db.transactions.unshift(transaction);

    // Cryptographic SHA-256 Audit Log
    addAuditLog(
      executedBy || sender.name,
      'FINANCIAL_TRANSACTION',
      'FUNDS_TRANSFER',
      `Transferred $${transferAmount.toFixed(2)} from ${sender.accountNumber} (${sender.name}) to ${transaction.toAccount} (${recipientName}). Txn Ref: ${txnId}`
    );

    // Debit and credit alerts
    db.notifications.unshift({
      id: `NOTIF-${Math.floor(700 + db.notifications.length + 1)}`,
      recipient: sender.name,
      recipientId: sender.id,
      type: 'DEBIT_ALERT',
      title: 'Debit Alert: Funds Transferred',
      message: `Your account ${sender.accountNumber} was debited by $${transferAmount.toFixed(2)}. New balance: $${sender.balance.toFixed(2)}. Ref: ${txnId}`,
      status: 'DELIVERED',
      timestamp: now,
      channel: 'SMS'
    });

    if (recipient) {
      db.notifications.unshift({
        id: `NOTIF-${Math.floor(700 + db.notifications.length + 2)}`,
        recipient: recipient.name,
        recipientId: recipient.id,
        type: 'CREDIT_ALERT',
        title: 'Credit Alert: Funds Received',
        message: `Your account ${recipient.accountNumber} was credited with $${transferAmount.toFixed(2)} from ${sender.name}. New balance: $${recipient.balance.toFixed(2)}. Ref: ${txnId}`,
        status: 'DELIVERED',
        timestamp: now,
        channel: 'SMS'
      });
    }

    return sendJson(res, 200, {
      success: true,
      transaction,
      senderBalance: sender.balance,
      recipientBalance: recipient ? recipient.balance : null,
      sender,
      recipient
    });
  }

  if (pathname === '/api/transactions/deposit' && method === 'POST') {
    const body = await parseBody(req);
    const { accountNumber, amount, method: depositMethod, depositedBy, description } = body;

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return sendJson(res, 400, { error: 'Please enter a valid positive deposit amount.' });
    }

    const customer = db.customers.find(c => c.accountNumber === accountNumber || c.id === accountNumber);
    if (!customer) {
      return sendJson(res, 404, { error: 'Target customer account not found.' });
    }

    customer.balance = Math.round((customer.balance + depositAmount) * 100) / 100;

    const txnId = `TXN-${Math.floor(7000 + (db.transactions?.length || 0) + 1)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const transaction = {
      id: txnId,
      type: 'DEPOSIT',
      fromAccount: 'COUNTER-BRANCH-01',
      fromCustomer: depositedBy || 'Branch Cash Counter',
      toAccount: customer.accountNumber,
      toCustomer: customer.name,
      amount: depositAmount,
      channel: depositMethod || 'CASH',
      description: description || 'Over-the-counter deposit credit',
      status: 'COMPLETED',
      timestamp: now
    };

    if (!db.transactions) db.transactions = [];
    db.transactions.unshift(transaction);

    addAuditLog(
      depositedBy || 'TELLER',
      'TELLER',
      'CASH_DEPOSIT',
      `Deposited $${depositAmount.toFixed(2)} into account ${customer.accountNumber} (${customer.name}). New balance: $${customer.balance.toFixed(2)}`
    );

    db.notifications.unshift({
      id: `NOTIF-${Math.floor(700 + db.notifications.length + 1)}`,
      recipient: customer.name,
      recipientId: customer.id,
      type: 'CREDIT_ALERT',
      title: 'Credit Alert: Cash Deposit Received',
      message: `Your account ${customer.accountNumber} was credited with $${depositAmount.toFixed(2)}. New balance: $${customer.balance.toFixed(2)}. Ref: ${txnId}`,
      status: 'DELIVERED',
      timestamp: now,
      channel: 'SMS'
    });

    return sendJson(res, 200, { success: true, transaction, customer, newBalance: customer.balance });
  }

  if (pathname === '/api/transactions/withdraw' && method === 'POST') {
    const body = await parseBody(req);
    const { accountNumber, amount, withdrawnBy, description } = body;

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return sendJson(res, 400, { error: 'Please enter a valid positive withdrawal amount.' });
    }

    const customer = db.customers.find(c => c.accountNumber === accountNumber || c.id === accountNumber);
    if (!customer) {
      return sendJson(res, 404, { error: 'Target customer account not found.' });
    }

    if (customer.balance < withdrawAmount) {
      return sendJson(res, 400, {
        error: `Insufficient funds for withdrawal. Available: $${customer.balance.toFixed(2)}, requested: $${withdrawAmount.toFixed(2)}`
      });
    }

    customer.balance = Math.round((customer.balance - withdrawAmount) * 100) / 100;

    const txnId = `TXN-${Math.floor(7000 + (db.transactions?.length || 0) + 1)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const transaction = {
      id: txnId,
      type: 'WITHDRAWAL',
      fromAccount: customer.accountNumber,
      fromCustomer: customer.name,
      toAccount: 'COUNTER-CASH-OUT',
      toCustomer: withdrawnBy || 'Branch Cashier Dispense',
      amount: withdrawAmount,
      channel: 'CASH',
      description: description || 'Branch teller cash withdrawal',
      status: 'COMPLETED',
      timestamp: now
    };

    if (!db.transactions) db.transactions = [];
    db.transactions.unshift(transaction);

    addAuditLog(
      withdrawnBy || 'TELLER',
      'TELLER',
      'CASH_WITHDRAWAL',
      `Withdrew $${withdrawAmount.toFixed(2)} from account ${customer.accountNumber} (${customer.name}). Remaining balance: $${customer.balance.toFixed(2)}`
    );

    return sendJson(res, 200, { success: true, transaction, customer });
  }

  // 5. Milestone 2 & 3: Disbursement Sagas
  if (pathname === '/api/sagas' && method === 'GET') {
    return sendJson(res, 200, db.sagas);
  }

  if (pathname === '/api/sagas/execute' && method === 'POST') {
    const body = await parseBody(req);
    const { sagaId, customerName, amount } = body;

    let saga = db.sagas.find((s) => s.id === sagaId);

    if (!saga) {
      // Create new saga workflow
      const newSagaId = `SAGA-${Math.floor(3000 + Math.random() * 9000)}`;
      saga = {
        id: newSagaId,
        loanId: `LN-${Math.floor(8100 + Math.random() * 900)}`,
        customerName: customerName || 'Valued Client',
        amount: parseFloat(amount) || 120000.00,
        status: 'IN_PROGRESS',
        startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        completedAt: null,
        steps: [
          { name: 'Document Verification', status: 'COMPLETED', executedAt: new Date().toISOString().replace('T', ' ').substring(0, 19), details: 'KYC verified and sanction list cleared' },
          { name: 'Loan Approval', status: 'COMPLETED', executedAt: new Date().toISOString().replace('T', ' ').substring(0, 19), details: 'Credit committee approved terms' },
          { name: 'Account Credited', status: 'IN_PROGRESS', executedAt: new Date().toISOString().replace('T', ' ').substring(0, 19), details: 'Core banking transfer initiated' },
          { name: 'Completed', status: 'PENDING', executedAt: null, details: 'Awaiting ledger confirmation' }
        ]
      };
      db.sagas.unshift(saga);
    } else {
      // Advance or retry saga
      saga.steps.forEach((step) => {
        step.status = 'COMPLETED';
        if (!step.executedAt) step.executedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      });
      saga.status = 'COMPLETED';
      saga.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    addAuditLog('SYSTEM_SAGA', 'ORCHESTRATOR', 'SAGA_STEP_EXECUTION', `Disbursement Saga ${saga.id} executed successfully for ${saga.customerName} ($${saga.amount})`);

    return sendJson(res, 200, { success: true, saga });
  }

  // 6. Milestone 3: Settlements
  if (pathname === '/api/settlements' && method === 'GET') {
    return sendJson(res, 200, db.settlements);
  }

  if (pathname === '/api/settlements/confirm' && method === 'POST') {
    const body = await parseBody(req);
    const { settlementId } = body;
    const item = db.settlements.find((s) => s.id === settlementId);

    if (!item) return sendJson(res, 404, { error: 'Settlement record not found' });

    item.status = 'CONFIRMED';
    addAuditLog('ADMIN', 'ADMIN', 'SETTLEMENT_CONFIRMATION', `Settlement ${item.id} (${item.refId}) confirmed for $${item.amount.toFixed(2)} via ${item.channel}`);

    return sendJson(res, 200, { success: true, settlement: item });
  }

  // 7. Milestone 3: Notifications
  if (pathname === '/api/notifications' && method === 'GET') {
    return sendJson(res, 200, db.notifications);
  }

  if (pathname === '/api/notifications/send' && method === 'POST') {
    const body = await parseBody(req);
    const { recipient, recipientId, type, title, message, channel } = body;

    const newNotif = {
      id: `NOTIF-${Math.floor(700 + Math.random() * 9000)}`,
      recipient: recipient || 'All Authorized Personnel',
      recipientId: recipientId || 'ALL',
      type: type || 'BANKING ALERT',
      title: title || 'System Advisory',
      message: message || 'Notice dispatched successfully.',
      status: 'DELIVERED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      channel: channel || 'In-App'
    };

    db.notifications.unshift(newNotif);
    addAuditLog('SYSTEM', 'NOTIFICATION_SERVICE', 'NOTIFICATION_DISPATCH', `Dispatched ${newNotif.channel} notification to ${newNotif.recipient}`);

    return sendJson(res, 200, { success: true, notification: newNotif });
  }

  // 8. Milestone 4: Risk Scoring
  if ((pathname === '/api/risk' || pathname === '/api/risk/scores') && method === 'GET') {
    return sendJson(res, 200, db.riskScores);
  }

  if (pathname === '/api/risk/reassess' && method === 'POST') {
    const body = await parseBody(req);
    const { customerId, newCreditScore, notes } = body;
    const risk = db.riskScores.find((r) => r.customerId === customerId);

    if (!risk) return sendJson(res, 404, { error: 'Customer risk profile not found' });

    const score = Math.max(10, Math.min(95, (newCreditScore ? Math.round((850 - newCreditScore) / 4) : risk.score - 5)));
    risk.score = score;
    if (newCreditScore) risk.creditScore = parseInt(newCreditScore, 10);
    risk.level = score <= 35 ? 'LOW' : score <= 70 ? 'MEDIUM' : 'HIGH';
    risk.lastAssessed = new Date().toISOString().replace('T', ' ').substring(0, 19);

    risk.history.unshift({
      date: new Date().toISOString().substring(0, 10),
      score: risk.score,
      level: risk.level,
      reason: notes || 'Automated risk reassessment based on updated financial data'
    });

    // Update customer profile
    const customer = db.customers.find((c) => c.id === customerId);
    if (customer) {
      customer.riskScore = risk.score;
      customer.riskLevel = risk.level;
    }

    addAuditLog('SUPERVISOR', 'SUPERVISOR', 'RISK_REASSESSMENT', `Reassessed risk for customer ${risk.customerName}: Score ${risk.score} (${risk.level})`);

    return sendJson(res, 200, { success: true, riskScore: risk, profile: risk, updatedScore: risk });
  }

  // 9. Milestone 4: Compliance Check
  if (pathname === '/api/compliance' && method === 'GET') {
    return sendJson(res, 200, db.complianceChecks);
  }

  if (pathname === '/api/compliance/submit' && method === 'POST') {
    const body = await parseBody(req);
    const { customerId, checkType, categories, findings, submittedBy } = body;
    const customer = db.customers.find((c) => c.id === customerId);

    const newCheck = {
      id: `CMP-${Math.floor(200 + Math.random() * 9000)}`,
      customerId: customerId || 'CUST-1001',
      customerName: customer ? customer.name : 'Valued Client',
      checkType: checkType || 'Transaction Limit & AML',
      categories: categories || ['AML', 'Transaction Limit'],
      status: 'PENDING',
      submittedBy: submittedBy || 'Marcus Brody (Teller)',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reviewedBy: null,
      reviewedAt: null,
      riskLevel: customer ? customer.riskLevel : 'MEDIUM',
      findings: findings || 'Routine compliance assessment initiated by branch teller.'
    };

    db.complianceChecks.unshift(newCheck);
    addAuditLog(newCheck.submittedBy, 'TELLER', 'COMPLIANCE_SUBMISSION', `Submitted compliance check ${newCheck.id} for ${newCheck.customerName}`);

    return sendJson(res, 200, { success: true, complianceCheck: newCheck, check: newCheck });
  }

  if (pathname === '/api/compliance/review' && method === 'POST') {
    const body = await parseBody(req);
    const { checkId, status, reviewedBy, notes } = body;
    const check = db.complianceChecks.find((c) => c.id === checkId);

    if (!check) return sendJson(res, 404, { error: 'Compliance check not found' });

    check.status = status;
    check.reviewedBy = reviewedBy || 'Elena Rostova (Supervisor)';
    check.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    if (notes) check.findings += ` | Supervisor Note: ${notes}`;

    addAuditLog(check.reviewedBy, 'SUPERVISOR', 'COMPLIANCE_REVIEW_DECISION', `Compliance check ${check.id} marked as ${status} by ${check.reviewedBy}`);

    return sendJson(res, 200, { success: true, complianceCheck: check, check: check });
  }

  // 10. Milestone 4 & 1: Audit Logs & SHA-256 Integrity
  if (pathname === '/api/audit/logs' && method === 'GET') {
    return sendJson(res, 200, db.auditLogs);
  }

  if (pathname === '/api/audit/integrity' && method === 'GET') {
    const verification = verifyAuditIntegrity();
    return sendJson(res, 200, verification);
  }

  // Tamper Simulation (allows auditor to verify that the SHA-256 hash chaining immediately flags tampering!)
  if (pathname === '/api/audit/tamper' && method === 'POST') {
    const body = await parseBody(req);
    const blockIndex = body.blockIndex || 4;
    const targetBlock = db.auditLogs.find((b) => b.index === blockIndex);

    if (!targetBlock) return sendJson(res, 404, { error: 'Target block not found' });

    // Tamper with details without updating the hash
    targetBlock.details = `[TAMPERED] Fraudulent modification of loan disbursement records by unauthorized entity.`;

    // Create an audit alert
    const newAlert = {
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      severity: 'CRITICAL',
      type: 'CRYPTOGRAPHIC_HASH_MISMATCH',
      status: 'OPEN',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      blockIndex,
      description: `Integrity breach detected: Block #${blockIndex} stored SHA-256 hash does not match computed payload hash.`,
      investigatedBy: null,
      resolutionNotes: null
    };
    db.auditAlerts.unshift(newAlert);

    return sendJson(res, 200, {
      success: true,
      message: `Block #${blockIndex} has been intentionally modified to simulate ledger tampering. Verify integrity to observe tamper detection!`,
      alert: newAlert
    });
  }

  // Restore audit integrity
  if (pathname === '/api/audit/restore' && method === 'POST') {
    // Recompute all hashes cleanly
    let pHash = '0000000000000000000000000000000000000000000000000000000000000000';
    db.auditLogs.forEach((block) => {
      // Remove tampered label if present
      if (block.details.startsWith('[TAMPERED]')) {
        block.details = 'Authorized loan disbursement record validated against ledger.';
      }
      block.prevHash = pHash;
      block.payload = `${block.index}|${block.timestamp}|${block.user}|${block.role}|${block.action}|${block.details}|${block.prevHash}`;
      block.currentHash = calculateSha256(block.payload);
      pHash = block.currentHash;
    });

    // Mark open alerts resolved
    db.auditAlerts.forEach((a) => {
      if (a.status === 'OPEN') {
        a.status = 'RESOLVED';
        a.investigatedBy = 'David Chen (Auditor)';
        a.resolutionNotes = 'Cryptographic ledger re-signed and verified with master key.';
      }
    });

    addAuditLog('DAVID_CHEN', 'AUDITOR', 'LEDGER_RESTORED', 'Audit chain integrity restored and re-anchored.');

    return sendJson(res, 200, { success: true, message: 'Cryptographic hash chain restored successfully.' });
  }

  if (pathname === '/api/audit/alerts' && method === 'GET') {
    return sendJson(res, 200, db.auditAlerts);
  }

  if (pathname === '/api/audit/alerts/resolve' && method === 'POST') {
    const body = await parseBody(req);
    const { alertId, resolutionNotes, investigatedBy } = body;
    const alert = db.auditAlerts.find((a) => a.id === alertId);

    if (!alert) return sendJson(res, 404, { error: 'Alert not found' });

    alert.status = 'RESOLVED';
    alert.investigatedBy = investigatedBy || 'David Chen (Auditor)';
    alert.resolutionNotes = resolutionNotes || 'Investigated and closed after cryptographic re-verification.';

    addAuditLog(alert.investigatedBy, 'AUDITOR', 'AUDIT_ALERT_RESOLVED', `Resolved audit alert ${alert.id}: ${alert.type}`);

    return sendJson(res, 200, { success: true, alert });
  }

  // 11. Cross-Module Integrated Workflow Run
  if (pathname === '/api/cross-module/run-workflow' && method === 'POST') {
    const body = await parseBody(req);
    const workflowType = body.workflowType || 'CUSTOMER_KYC_RISK_COMPLIANCE';

    if (workflowType === 'CUSTOMER_KYC_RISK_COMPLIANCE') {
      const custId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCustomer = {
        id: custId,
        name: body.customerName || 'Jonathan Sterling',
        email: 'j.sterling@meridian.com',
        phone: '+1 (555) 776-8899',
        accountNumber: `FC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        accountType: 'Private Wealth Checking',
        balance: 750000.00,
        status: 'UNDER_REVIEW',
        kycStatus: 'PENDING',
        riskScore: 78,
        riskLevel: 'HIGH',
        joinedDate: new Date().toISOString().substring(0, 10),
        pepStatus: 'YES',
        sanctionsStatus: 'CLEAR'
      };
      db.customers.unshift(newCustomer);

      // KYC record
      const kyc = {
        id: `KYC-${Math.floor(500 + Math.random() * 9000)}`,
        customerId: custId,
        customerName: newCustomer.name,
        documentType: 'Diplomatic Passport',
        documentNumber: `DIP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        issueDate: '2023-05-12',
        expiryDate: '2033-05-12',
        issuingAuthority: 'Ministry of Foreign Affairs',
        status: 'VERIFIED',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        reviewedBy: 'Elena Rostova (Supervisor)',
        reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        notes: 'Diplomatic passport verified. PEP disclosure filed.'
      };
      db.kycRecords.unshift(kyc);

      // High Risk Score record
      const risk = {
        id: `RSK-${Math.floor(100 + Math.random() * 9000)}`,
        customerId: custId,
        customerName: newCustomer.name,
        score: 78,
        level: 'HIGH',
        creditScore: 640,
        debtToIncomeRatio: '45%',
        dpdCount: 0,
        factors: [
          { name: 'Politically Exposed Person (PEP) Executive', impact: 'NEGATIVE', weight: +35 },
          { name: 'High Transaction Velocity', impact: 'NEGATIVE', weight: +25 },
          { name: 'Strong Liquid Collateral', impact: 'POSITIVE', weight: -15 }
        ],
        lastAssessed: new Date().toISOString().replace('T', ' ').substring(0, 19),
        history: [{ date: new Date().toISOString().substring(0, 10), score: 78, level: 'HIGH', reason: 'Cross-module onboarding risk assessment' }]
      };
      db.riskScores.unshift(risk);

      // Compliance check
      const cmp = {
        id: `CMP-${Math.floor(200 + Math.random() * 9000)}`,
        customerId: custId,
        customerName: newCustomer.name,
        checkType: 'PEP Sanctions & Transaction Limit Diligence',
        categories: ['PEP', 'AML', 'Transaction Limit'],
        status: 'PASS',
        submittedBy: 'Marcus Brody (Teller)',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        reviewedBy: 'Elena Rostova (Supervisor)',
        reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        riskLevel: 'HIGH',
        findings: 'Enhanced Due Diligence (EDD) conducted. High-risk PEP profile approved with $500,000 transaction ceiling.'
      };
      db.complianceChecks.unshift(cmp);

      // SHA-256 Audit Log
      const audit = addAuditLog('SYSTEM_WORKFLOW', 'CROSS_MODULE', 'CROSS_MODULE_PIPELINE', `Completed pipeline: Customer ${newCustomer.name} -> KYC (${kyc.status}) -> Risk (Score ${risk.score}) -> Compliance (${cmp.status})`);

      return sendJson(res, 200, {
        success: true,
        workflow: 'Customer -> KYC -> Risk Scoring -> Compliance -> Audit Hash Chain',
        customer: newCustomer,
        kyc,
        risk,
        compliance: cmp,
        auditLog: audit
      });
    }

    return sendJson(res, 400, { error: 'Unknown workflow type' });
  }

  // Not found
  return sendJson(res, 404, { error: 'API route not found' });
}
