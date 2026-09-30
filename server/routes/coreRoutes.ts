import { Router } from 'express';
import { db } from '../db.js';
import { AuditService } from '../services/auditService.js';
import { NotificationService } from '../services/notificationService.js';
import { Customer, Account, Loan, Transaction } from '../../src/types/index.js';

export const coreRouter = Router();

// Dashboard Stats & Summary
coreRouter.get('/dashboard/stats', (req, res) => {
  const stats = db.getDashboardStats();
  res.json({ success: true, stats });
});

// Dashboard Charts Data
coreRouter.get('/dashboard/charts', (req, res) => {
  const state = db.getState();

  // Transaction Volume by Type
  const txByType: Record<string, number> = {};
  state.transactions.forEach((t) => {
    txByType[t.type] = (txByType[t.type] || 0) + t.amount;
  });

  const transactionVolumeData = Object.entries(txByType).map(([type, amount]) => ({
    type: type.replace(/_/g, ' '),
    amount,
  }));

  // Loan status breakdown
  const loanStatusData = [
    { name: 'Disbursed', count: state.loans.filter((l) => l.status === 'DISBURSED').length, color: '#3B82F6' },
    { name: 'Approved', count: state.loans.filter((l) => l.status === 'APPROVED').length, color: '#10B981' },
    { name: 'Applied', count: state.loans.filter((l) => l.status === 'APPLIED').length, color: '#F59E0B' },
    { name: 'Closed', count: state.loans.filter((l) => l.status === 'CLOSED').length, color: '#6B7280' },
  ];

  // NPA distribution
  const npaBreakdown = [
    { name: 'Standard Performing', value: state.npaRecords.filter((n) => n.npaStatus === 'STANDARD').length, color: '#10B981' },
    { name: 'Special Mention (SMA)', value: state.npaRecords.filter((n) => n.npaStatus === 'SMA').length, color: '#F59E0B' },
    { name: 'Non-Performing (NPA)', value: state.npaRecords.filter((n) => n.npaStatus === 'NPA').length, color: '#EF4444' },
  ];

  // Saga execution status
  const sagaStatusData = [
    { name: 'Completed', count: state.sagas.filter((s) => s.status === 'COMPLETED').length, fill: '#10B981' },
    { name: 'Processing', count: state.sagas.filter((s) => s.status === 'PROCESSING').length, fill: '#3B82F6' },
    { name: 'Failed', count: state.sagas.filter((s) => s.status === 'FAILED').length, fill: '#EF4444' },
    { name: 'Compensated', count: state.sagas.filter((s) => s.status === 'COMPENSATED').length, fill: '#8B5CF6' },
  ];

  // Monthly trends mock
  const monthlyTrend = [
    { month: 'Apr', disbursements: 3200000, collections: 2800000, npa: 120000 },
    { month: 'May', disbursements: 4100000, collections: 3400000, npa: 150000 },
    { month: 'Jun', disbursements: 3800000, collections: 3700000, npa: 180000 },
    { month: 'Jul', disbursements: 5200000, collections: 4600000, npa: 140000 },
    { month: 'Aug', disbursements: 6400000, collections: 5800000, npa: 160000 },
  ];

  res.json({
    success: true,
    data: {
      transactionVolumeData,
      loanStatusData,
      npaBreakdown,
      sagaStatusData,
      monthlyTrend,
    },
  });
});

// Operations Console triage endpoint
coreRouter.get('/operations/console', (req, res) => {
  const state = db.getState();

  const failedSagas = state.sagas.filter((s) => s.status === 'FAILED' || s.status === 'COMPENSATING' || s.status === 'COMPENSATED');
  const overdueLoans = state.repaymentSchedules.filter((r) => r.status === 'OVERDUE' || r.status === 'DEFAULTED');
  const stuckSettlements = state.settlements.filter((s) => s.status === 'FAILED' || (s.status === 'PENDING' && s.retryCount > 0));
  const npaAccounts = state.npaRecords.filter((n) => n.npaStatus === 'NPA' || n.npaStatus === 'SMA');
  const unverifiedKyc = state.kycRecords.filter((k) => k.verificationStatus === 'PENDING' || k.verificationStatus === 'UNDER_REVIEW');

  res.json({
    success: true,
    operations: {
      failedSagas,
      overdueLoans,
      stuckSettlements,
      npaAccounts,
      unverifiedKyc,
    },
  });
});

// Customers
coreRouter.get('/customers', (req, res) => {
  const state = db.getState();
  res.json({ success: true, customers: state.customers });
});

coreRouter.post('/customers', (req, res) => {
  const { fullName, email, phone, address, riskLevel, initialDeposit, accountType, password } = req.body;
  const state = db.getState();

  if (!fullName || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
  }

  // 1. Create Customer record
  const custId = `CUST-${1000 + state.customers.length + 1}`;
  const newCustomer: Customer = {
    id: custId,
    customerCode: `FC-${custId}`,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    address: address ? address.trim() : 'Mumbai, India',
    kycStatus: 'PENDING',
    riskLevel: riskLevel || 'LOW',
    totalAccounts: 1,
    totalLoans: 0,
    createdAt: new Date().toISOString(),
  };
  state.customers.unshift(newCustomer);

  // 2. Open Primary Account for Customer
  const accId = `ACC-${8000 + state.accounts.length + 1}`;
  const accNum = `10984420${String(state.accounts.length + 1).padStart(4, '0')}`;
  const deposit = Number(initialDeposit) >= 0 ? Number(initialDeposit) : 25000;

  const newAccount: Account = {
    id: accId,
    accountNumber: accNum,
    customerId: newCustomer.id,
    customerName: newCustomer.fullName,
    accountType: accountType || 'SAVINGS',
    balance: deposit,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };
  state.accounts.unshift(newAccount);

  // 3. Create Login User for Customer
  const sanitizedName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '.');
  let generatedUsername = sanitizedName.endsWith('.') ? sanitizedName.slice(0, -1) : sanitizedName;
  if (state.users.some((u) => u.username.toLowerCase() === generatedUsername)) {
    generatedUsername = `${generatedUsername}.${newCustomer.id.toLowerCase()}`;
  }

  const userPassword = password && password.trim() ? password.trim() : 'password123';
  const userId = `USR-${String(state.users.length + 1).padStart(3, '0')}`;
  const newUser = {
    id: userId,
    username: generatedUsername,
    password: userPassword,
    name: newCustomer.fullName,
    email: newCustomer.email,
    role: 'CUSTOMER' as const,
    status: 'ACTIVE' as const,
    customerId: newCustomer.id,
    createdAt: new Date().toISOString(),
  };
  state.users.unshift(newUser);

  // 4. If initial deposit > 0, log initial deposit transaction
  if (deposit > 0) {
    const txnId = `TXN-${9000 + state.transactions.length + 1}`;
    const txn: Transaction = {
      id: txnId,
      transactionReference: `TXN-ONBOARD-${Date.now().toString().slice(-6)}`,
      destinationAccountId: newAccount.id,
      customerId: newCustomer.id,
      customerName: newCustomer.fullName,
      amount: deposit,
      currency: 'INR',
      type: 'DEPOSIT',
      status: 'SUCCESS',
      description: 'Initial Account Funding upon Customer Onboarding',
      createdAt: new Date().toISOString(),
    };
    state.transactions.unshift(txn);
  }

  // 5. Audit Logging
  AuditService.log({
    user: (req.body.submittedBy as string) || 'teller',
    role: 'TELLER',
    action: 'USER_CREATED',
    module: 'CORE',
    entity: 'CUSTOMER',
    entityId: newCustomer.id,
    details: `Customer profile created for ${newCustomer.fullName} (${newCustomer.id}) with username: ${newUser.username}`,
  });

  AuditService.log({
    user: (req.body.submittedBy as string) || 'teller',
    role: 'TELLER',
    action: 'ACCOUNT_CREATED',
    module: 'CORE',
    entity: 'ACCOUNT',
    entityId: newAccount.id,
    details: `Primary ${newAccount.accountType} account ${newAccount.accountNumber} opened for ${newCustomer.fullName} with initial deposit ₹${deposit.toLocaleString('en-IN')}`,
  });

  NotificationService.send({
    customerId: newCustomer.id,
    type: 'TRANSACTION_SUCCESS',
    title: `Welcome to FinCore Bank, ${newCustomer.fullName}!`,
    message: `Your account ${newAccount.accountNumber} has been provisioned. Login Username: ${newUser.username}`,
    channel: 'IN_APP',
  });

  res.json({
    success: true,
    customer: newCustomer,
    user: newUser,
    account: newAccount,
    credentials: {
      username: newUser.username,
      password: userPassword,
      accountNumber: newAccount.accountNumber,
    },
  });
});

// Accounts
coreRouter.get('/accounts', (req, res) => {
  const state = db.getState();
  const { customerId } = req.query;
  let accounts = state.accounts;
  if (customerId) {
    accounts = accounts.filter((a) => a.customerId === customerId);
  }
  res.json({ success: true, accounts });
});

coreRouter.post('/accounts', (req, res) => {
  const { customerId, accountType, initialDeposit } = req.body;
  const state = db.getState();
  const customer = state.customers.find((c) => c.id === customerId);

  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }

  const accId = `ACC-${8000 + state.accounts.length + 1}`;
  const accNum = `10984420${String(state.accounts.length + 1).padStart(4, '0')}`;
  const deposit = Number(initialDeposit) || 10000;

  const newAccount: Account = {
    id: accId,
    accountNumber: accNum,
    customerId: customer.id,
    customerName: customer.fullName,
    accountType: accountType || 'SAVINGS',
    balance: deposit,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  state.accounts.unshift(newAccount);
  customer.totalAccounts = (customer.totalAccounts || 0) + 1;

  AuditService.log({
    user: (req.body.createdBy as string) || 'teller',
    role: 'TELLER',
    action: 'ACCOUNT_CREATED',
    module: 'CORE',
    entity: 'ACCOUNT',
    entityId: accId,
    details: `Account ${accNum} opened for ${customer.fullName} with initial deposit ₹${deposit.toLocaleString('en-IN')}`,
  });

  res.json({ success: true, account: newAccount });
});

// Freeze Account
coreRouter.post('/accounts/:id/freeze', (req, res) => {
  const { id } = req.params;
  const { performedBy, role, reason } = req.body;
  const state = db.getState();
  const account = state.accounts.find((a) => a.id === id || a.accountNumber === id);

  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found.' });
  }

  const oldStatus = account.status;
  account.status = 'FROZEN';

  AuditService.log({
    user: performedBy || 'supervisor',
    role: role || 'SUPERVISOR',
    action: 'ACCOUNT_FROZEN',
    module: 'CORE',
    entity: 'ACCOUNT',
    entityId: account.id,
    oldValue: oldStatus,
    newValue: 'FROZEN',
    details: `Account ${account.accountNumber} (${account.customerName}) FROZEN. Reason: ${reason || 'Administrative Compliance Order'}`,
  });

  NotificationService.send({
    customerId: account.customerId,
    type: 'TRANSACTION_FAILED',
    title: `Account Notice: Account ${account.accountNumber} Frozen`,
    message: `Your account ${account.accountNumber} has been temporarily frozen for administrative review. Debits and online transfers are restricted.`,
    channel: 'IN_APP',
  });

  res.json({ success: true, account, message: `Account ${account.accountNumber} is now FROZEN.` });
});

// Unfreeze Account
coreRouter.post('/accounts/:id/unfreeze', (req, res) => {
  const { id } = req.params;
  const { performedBy, role, reason } = req.body;
  const state = db.getState();
  const account = state.accounts.find((a) => a.id === id || a.accountNumber === id);

  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found.' });
  }

  const oldStatus = account.status;
  account.status = 'ACTIVE';

  AuditService.log({
    user: performedBy || 'supervisor',
    role: role || 'SUPERVISOR',
    action: 'ACCOUNT_UNFROZEN',
    module: 'CORE',
    entity: 'ACCOUNT',
    entityId: account.id,
    oldValue: oldStatus,
    newValue: 'ACTIVE',
    details: `Account ${account.accountNumber} (${account.customerName}) UNFROZEN and restored to ACTIVE status. Note: ${reason || 'Verification Completed'}`,
  });

  NotificationService.send({
    customerId: account.customerId,
    type: 'TRANSACTION_SUCCESS',
    title: `Account Restored: Account ${account.accountNumber} Unfrozen`,
    message: `Your account ${account.accountNumber} has been reactivated. All banking services are restored.`,
    channel: 'IN_APP',
  });

  res.json({ success: true, account, message: `Account ${account.accountNumber} is now ACTIVE.` });
});

// Update Account Status (PUT / PATCH)
coreRouter.put('/accounts/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, performedBy, role, reason } = req.body;
  const state = db.getState();
  const account = state.accounts.find((a) => a.id === id || a.accountNumber === id);

  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found.' });
  }

  const oldStatus = account.status;
  account.status = status;

  AuditService.log({
    user: performedBy || 'admin',
    role: role || 'ADMIN',
    action: status === 'FROZEN' ? 'ACCOUNT_FROZEN' : 'ACCOUNT_STATUS_CHANGED',
    module: 'CORE',
    entity: 'ACCOUNT',
    entityId: account.id,
    oldValue: oldStatus,
    newValue: status,
    details: `Account ${account.accountNumber} status changed from ${oldStatus} to ${status}. ${reason ? `Reason: ${reason}` : ''}`,
  });

  res.json({ success: true, account });
});

// Deposit into account
coreRouter.post('/accounts/deposit', (req, res) => {
  const { accountId, amount, description } = req.body;
  const state = db.getState();
  const account = state.accounts.find((a) => a.id === accountId || a.accountNumber === accountId);

  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found.' });
  }

  if (account.status === 'FROZEN') {
    return res.status(403).json({
      success: false,
      message: `Transaction Denied: Account ${account.accountNumber} is FROZEN by Bank Administration. Credits are blocked.`,
    });
  }

  const depositAmount = Number(amount);
  if (isNaN(depositAmount) || depositAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid deposit amount.' });
  }

  account.balance += depositAmount;

  const txnId = `TXN-${9000 + state.transactions.length + 1}`;
  const txn: Transaction = {
    id: txnId,
    transactionReference: `TXN-DEP-${Date.now().toString().slice(-6)}`,
    destinationAccountId: account.id,
    customerId: account.customerId,
    customerName: account.customerName,
    amount: depositAmount,
    currency: 'INR',
    type: 'DEPOSIT',
    status: 'SUCCESS',
    description: description || 'Cash Deposit at Branch Counter',
    createdAt: new Date().toISOString(),
  };
  state.transactions.unshift(txn);

  AuditService.log({
    user: (req.body.performedBy as string) || 'teller',
    role: 'TELLER',
    action: 'TRANSACTION_CREATED',
    module: 'CORE',
    entity: 'ACCOUNT',
    entityId: account.id,
    details: `Deposit of ₹${depositAmount.toLocaleString('en-IN')} into account ${account.accountNumber}. New balance: ₹${account.balance.toLocaleString('en-IN')}`,
  });

  NotificationService.send({
    customerId: account.customerId,
    type: 'TRANSACTION_SUCCESS',
    title: `Account Credited: ₹${depositAmount.toLocaleString('en-IN')}`,
    message: `₹${depositAmount.toLocaleString('en-IN')} deposited to account ${account.accountNumber}. Available balance: ₹${account.balance.toLocaleString('en-IN')}`,
    channel: 'IN_APP',
  });

  res.json({ success: true, account, transaction: txn });
});

// Withdraw from account
coreRouter.post('/accounts/withdraw', (req, res) => {
  const { accountId, amount, description } = req.body;
  const state = db.getState();
  const account = state.accounts.find((a) => a.id === accountId || a.accountNumber === accountId);

  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found.' });
  }

  if (account.status === 'FROZEN') {
    return res.status(403).json({
      success: false,
      message: `Transaction Denied: Account ${account.accountNumber} is FROZEN by Bank Administration. Debits are blocked.`,
    });
  }

  const withdrawAmount = Number(amount);
  if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid withdrawal amount.' });
  }

  if (account.balance < withdrawAmount) {
    return res.status(400).json({ success: false, message: `Insufficient funds. Current balance: ₹${account.balance.toLocaleString('en-IN')}` });
  }

  account.balance -= withdrawAmount;

  const txnId = `TXN-${9000 + state.transactions.length + 1}`;
  const txn: Transaction = {
    id: txnId,
    transactionReference: `TXN-WTH-${Date.now().toString().slice(-6)}`,
    sourceAccountId: account.id,
    customerId: account.customerId,
    customerName: account.customerName,
    amount: withdrawAmount,
    currency: 'INR',
    type: 'WITHDRAWAL',
    status: 'SUCCESS',
    description: description || 'Cash Withdrawal at Branch Counter',
    createdAt: new Date().toISOString(),
  };
  state.transactions.unshift(txn);

  AuditService.log({
    user: (req.body.performedBy as string) || 'teller',
    role: 'TELLER',
    action: 'TRANSACTION_CREATED',
    module: 'CORE',
    entity: 'ACCOUNT',
    entityId: account.id,
    details: `Withdrawal of ₹${withdrawAmount.toLocaleString('en-IN')} from account ${account.accountNumber}. Remaining balance: ₹${account.balance.toLocaleString('en-IN')}`,
  });

  NotificationService.send({
    customerId: account.customerId,
    type: 'TRANSACTION_SUCCESS',
    title: `Account Debited: ₹${withdrawAmount.toLocaleString('en-IN')}`,
    message: `₹${withdrawAmount.toLocaleString('en-IN')} withdrawn from account ${account.accountNumber}. Available balance: ₹${account.balance.toLocaleString('en-IN')}`,
    channel: 'IN_APP',
  });

  res.json({ success: true, account, transaction: txn });
});

// Inter-Account Transfer
coreRouter.post('/accounts/transfer', (req, res) => {
  const { sourceAccountId, destinationAccountId, amount, description, performedBy, role } = req.body;
  const state = db.getState();

  const cleanSrc = (sourceAccountId || '').toString().trim();
  const cleanDest = (destinationAccountId || '').toString().trim();

  const source = state.accounts.find(
    (a) => a.id === cleanSrc || a.accountNumber === cleanSrc || a.customerId === cleanSrc
  );
  const dest = state.accounts.find(
    (a) => a.id === cleanDest || a.accountNumber === cleanDest || a.customerId === cleanDest
  );

  if (!source) {
    return res.status(404).json({ success: false, message: 'Source account not found. Please verify source account number.' });
  }
  if (!dest) {
    return res.status(404).json({ success: false, message: 'Destination beneficiary account not found. Please verify the 12-digit account number.' });
  }
  if (source.id === dest.id) {
    return res.status(400).json({ success: false, message: 'Source and destination accounts must be distinct.' });
  }

  if (source.status === 'FROZEN') {
    return res.status(403).json({
      success: false,
      message: `Transfer Rejected: Source account ${source.accountNumber} is FROZEN by Bank Administration. Debits are blocked.`,
    });
  }
  if (dest.status === 'FROZEN') {
    return res.status(403).json({
      success: false,
      message: `Transfer Rejected: Destination account ${dest.accountNumber} is FROZEN by Bank Administration. Credits are blocked.`,
    });
  }

  const transferAmount = Number(amount);
  if (isNaN(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Please enter a valid transfer amount greater than 0.' });
  }

  if (source.balance < transferAmount) {
    return res.status(400).json({
      success: false,
      message: `Insufficient balance in source account. Available: ₹${source.balance.toLocaleString('en-IN')}, Requested: ₹${transferAmount.toLocaleString('en-IN')}`,
    });
  }

  // Update balances immediately
  const sourceBalanceBefore = source.balance;
  const destBalanceBefore = dest.balance;

  source.balance -= transferAmount;
  dest.balance += transferAmount;

  const txnId = `TXN-${9000 + state.transactions.length + 1}`;
  const refNum = `TXN-TRF-${Date.now().toString().slice(-6)}`;
  const txn: Transaction = {
    id: txnId,
    transactionReference: refNum,
    sourceAccountId: source.id,
    destinationAccountId: dest.id,
    customerId: source.customerId,
    customerName: source.customerName,
    amount: transferAmount,
    currency: 'INR',
    type: 'TRANSFER',
    status: 'SUCCESS',
    description: description || `Transfer to ${dest.customerName} (A/C ${dest.accountNumber})`,
    createdAt: new Date().toISOString(),
  };
  state.transactions.unshift(txn);

  AuditService.log({
    user: (performedBy as string) || source.customerName || 'customer',
    role: (role as any) || 'CUSTOMER',
    action: 'TRANSACTION_CREATED',
    module: 'CORE',
    entity: 'ACCOUNT',
    entityId: source.id,
    details: `Fund transfer of ₹${transferAmount.toLocaleString('en-IN')} from ${source.accountNumber} (${source.customerName}) to ${dest.accountNumber} (${dest.customerName}). Ref: ${refNum}`,
  });

  NotificationService.send({
    customerId: source.customerId,
    type: 'TRANSACTION_SUCCESS',
    title: `Transfer Sent: ₹${transferAmount.toLocaleString('en-IN')}`,
    message: `₹${transferAmount.toLocaleString('en-IN')} transferred to ${dest.customerName} (A/C ${dest.accountNumber}). New balance: ₹${source.balance.toLocaleString('en-IN')}`,
    channel: 'IN_APP',
  });

  NotificationService.send({
    customerId: dest.customerId,
    type: 'TRANSACTION_SUCCESS',
    title: `Money Received: ₹${transferAmount.toLocaleString('en-IN')}`,
    message: `₹${transferAmount.toLocaleString('en-IN')} received from ${source.customerName} (A/C ${source.accountNumber}). New balance: ₹${dest.balance.toLocaleString('en-IN')}`,
    channel: 'IN_APP',
  });

  res.json({
    success: true,
    message: `₹${transferAmount.toLocaleString('en-IN')} transferred successfully to ${dest.customerName}!`,
    sourceAccount: source,
    destinationAccount: dest,
    transaction: txn,
    balances: {
      source: { before: sourceBalanceBefore, after: source.balance },
      dest: { before: destBalanceBefore, after: dest.balance },
    },
  });
});

// Loans
coreRouter.get('/loans', (req, res) => {
  const state = db.getState();
  const { customerId } = req.query;
  let loans = state.loans;
  if (customerId) {
    loans = loans.filter((l) => l.customerId === customerId);
  }
  res.json({ success: true, loans });
});

coreRouter.post('/loans', (req, res) => {
  const { customerId, accountId, loanType, principalAmount, interestRate, tenureMonths } = req.body;
  const state = db.getState();
  const customer = state.customers.find((c) => c.id === customerId);
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });

  const principal = Number(principalAmount) || 200000;
  const rate = Number(interestRate) || 10.5;
  const tenure = Number(tenureMonths) || 24;

  const monthlyRate = rate / 12 / 100;
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
  );
  const totalPayable = emi * tenure;

  const loanId = `LN-${3000 + state.loans.length + 1}`;
  const loanNumber = `LN-FC-${new Date().getFullYear()}-${String(state.loans.length + 1).padStart(3, '0')}`;

  const newLoan: Loan = {
    id: loanId,
    loanNumber,
    customerId: customer.id,
    customerName: customer.fullName,
    accountId: accountId || (state.accounts.find((a) => a.customerId === customerId)?.id ?? 'ACC-8001'),
    loanType: loanType || 'PERSONAL_LOAN',
    principalAmount: principal,
    interestRate: rate,
    tenureMonths: tenure,
    emiAmount: emi,
    totalPayable,
    paidAmount: 0,
    outstandingPrincipal: principal,
    status: 'APPLIED',
    appliedDate: new Date().toISOString(),
  };

  state.loans.unshift(newLoan);
  customer.totalLoans += 1;

  AuditService.log({
    user: (req.body.submittedBy as string) || 'teller',
    role: 'TELLER',
    action: 'LOAN_APPLIED',
    module: 'CORE',
    entity: 'LOAN',
    entityId: loanId,
    details: `Loan application for ₹${principal.toLocaleString('en-IN')} submitted by ${customer.fullName}`,
  });

  res.json({ success: true, loan: newLoan });
});

coreRouter.post('/loans/:id/approve', (req, res) => {
  const { id } = req.params;
  const { approvedBy } = req.body;
  const state = db.getState();
  const loan = state.loans.find((l) => l.id === id);

  if (!loan) return res.status(404).json({ success: false, message: 'Loan not found.' });
  if (loan.status !== 'APPLIED' && loan.status !== 'UNDER_REVIEW') {
    return res.status(400).json({ success: false, message: `Cannot approve loan in ${loan.status} status.` });
  }

  loan.status = 'APPROVED';
  loan.approvedDate = new Date().toISOString();
  loan.approvedBy = approvedBy || 'supervisor';

  AuditService.log({
    user: approvedBy || 'supervisor',
    role: 'SUPERVISOR',
    action: 'LOAN_APPROVED',
    module: 'CORE',
    entity: 'LOAN',
    entityId: loan.id,
    oldValue: 'APPLIED',
    newValue: 'APPROVED',
    details: `Sanctioned loan ${loan.loanNumber} for ₹${loan.principalAmount.toLocaleString('en-IN')}`,
  });

  NotificationService.send({
    customerId: loan.customerId,
    type: 'LOAN_APPROVED',
    title: `Loan Sanctioned: ${loan.loanNumber}`,
    message: `Your ${loan.loanType.replace('_', ' ')} for ₹${loan.principalAmount.toLocaleString('en-IN')} has been approved by the credit committee. Disbursement Saga is ready.`,
    channel: 'IN_APP',
  });

  res.json({ success: true, loan });
});

// Transactions
coreRouter.get('/transactions', (req, res) => {
  const state = db.getState();
  const { customerId, accountId, type, status, limit } = req.query;
  let txns = [...state.transactions];

  if (customerId) {
    const cleanCustId = (customerId as string).trim();
    // Find all accounts owned by this customer
    const custAccounts = state.accounts.filter((a) => a.customerId === cleanCustId);
    const accountIds = new Set(custAccounts.map((a) => a.id));
    const accountNumbers = new Set(custAccounts.map((a) => a.accountNumber));

    txns = txns.filter(
      (t) =>
        t.customerId === cleanCustId ||
        (t.sourceAccountId && (accountIds.has(t.sourceAccountId) || accountNumbers.has(t.sourceAccountId))) ||
        (t.destinationAccountId && (accountIds.has(t.destinationAccountId) || accountNumbers.has(t.destinationAccountId)))
    );
  }

  if (accountId) {
    const cleanAccId = (accountId as string).trim();
    txns = txns.filter((t) => t.sourceAccountId === cleanAccId || t.destinationAccountId === cleanAccId);
  }

  if (type) txns = txns.filter((t) => t.type === type);
  if (status) txns = txns.filter((t) => t.status === status);

  if (limit) {
    const num = parseInt(limit as string, 10);
    if (!isNaN(num) && num > 0) {
      txns = txns.slice(0, num);
    }
  }

  res.json({ success: true, transactions: txns });
});
