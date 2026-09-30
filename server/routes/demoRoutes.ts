import { Router } from 'express';
import { db } from '../db.js';
import { SagaOrchestrator } from '../services/sagaOrchestrator.js';
import { NPAService } from '../services/npaService.js';
import { AuditService } from '../services/auditService.js';
import { NotificationService } from '../services/notificationService.js';

export const demoRouter = Router();

// Reset data to initial state
demoRouter.post('/reset', (req, res) => {
  db.reset();
  AuditService.log({
    user: 'admin',
    role: 'ADMIN',
    action: 'CONFIG_UPDATED',
    module: 'CORE',
    entity: 'SYSTEM',
    entityId: 'DATABASE_RESET',
    details: 'Reset system state and reloaded default operational dataset.',
  });
  res.json({ success: true, message: 'Database reset to default operational state.' });
});

// Run Milestone 1 Flow
demoRouter.post('/flow/milestone1', async (req, res) => {
  const state = db.getState();

  // 1. Find or create an operational customer
  let cust = state.customers.find((c) => c.fullName === 'Arjun Kapoor');
  if (!cust) {
    cust = {
      id: `CUST-${1000 + state.customers.length + 1}`,
      customerCode: `FC-CUST-${1000 + state.customers.length + 1}`,
      fullName: 'Arjun Kapoor',
      email: 'arjun.kapoor@example.com',
      phone: '+91 99880 11223',
      address: 'Skyline Residency, Bandra West, Mumbai - 400050',
      kycStatus: 'PENDING',
      riskLevel: 'LOW',
      totalAccounts: 1,
      totalLoans: 0,
      createdAt: new Date().toISOString(),
    };
    state.customers.unshift(cust);
  }

  // 2. Teller submits KYC
  const kycId = `KYC-${5000 + state.kycRecords.length + 1}`;
  const kyc: any = {
    id: kycId,
    customerId: cust.id,
    fullName: cust.fullName,
    dateOfBirth: '1995-08-14',
    phone: cust.phone,
    email: cust.email,
    address: cust.address,
    documentType: 'PAN',
    documentNumber: 'ARJKP9912D',
    verificationStatus: 'UNDER_REVIEW',
    riskLevel: 'LOW',
    submittedBy: 'teller',
    submittedAt: new Date().toISOString(),
    remarks: 'Submitted by Teller Karan for high-speed KYC verification.',
  };
  state.kycRecords.unshift(kyc);
  cust.kycStatus = 'UNDER_REVIEW';

  AuditService.log({
    user: 'teller',
    role: 'TELLER',
    action: 'KYC_SUBMITTED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'KYC_RECORD',
    entityId: kycId,
    details: 'Teller Karan submitted KYC for Arjun Kapoor',
  });

  // 3. Supervisor approves KYC
  kyc.verificationStatus = 'VERIFIED';
  kyc.verifiedBy = 'supervisor';
  kyc.verifiedAt = new Date().toISOString();
  kyc.remarks = 'Supervisor Sunita verified Aadhaar-PAN cross-reference successfully.';
  cust.kycStatus = 'VERIFIED';

  AuditService.log({
    user: 'supervisor',
    role: 'SUPERVISOR',
    action: 'KYC_APPROVED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'KYC_RECORD',
    entityId: kycId,
    oldValue: 'UNDER_REVIEW',
    newValue: 'VERIFIED',
    details: 'Supervisor approved KYC for Arjun Kapoor. Risk: LOW',
  });

  NotificationService.send({
    customerId: cust.id,
    type: 'KYC_APPROVED',
    title: 'KYC Approved: Welcome to FinCore',
    message: 'Your KYC records have been verified by Supervisor. You are eligible for instant loan sanctions.',
    channel: 'IN_APP',
  });

  res.json({
    success: true,
    message: 'Milestone 1 workflow executed successfully: Teller Submission -> Supervisor Approval -> RBAC & Audit Trail generated.',
    customer: cust,
    kyc,
  });
});

// Run Milestone 2 Flow
demoRouter.post('/flow/milestone2', async (req, res) => {
  const state = db.getState();
  const customer = state.customers.find((c) => c.kycStatus === 'VERIFIED') || state.customers[0];

  // Find or create account
  let account = state.accounts.find((a) => a.customerId === customer.id);
  if (!account) {
    account = {
      id: `ACC-${8000 + state.accounts.length + 1}`,
      accountNumber: `10984420${String(state.accounts.length + 1).padStart(4, '0')}`,
      customerId: customer.id,
      customerName: customer.fullName,
      accountType: 'SAVINGS',
      balance: 50000,
      currency: 'INR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    state.accounts.unshift(account);
  }

  // Create & Approve a new loan
  const loanId = `LN-${3000 + state.loans.length + 1}`;
  const loan = {
    id: loanId,
    loanNumber: `LN-M2-AUTO-${Date.now().toString().slice(-4)}`,
    customerId: customer.id,
    customerName: customer.fullName,
    accountId: account.id,
    loanType: 'PERSONAL_LOAN' as const,
    principalAmount: 300000,
    interestRate: 11.0,
    tenureMonths: 12,
    emiAmount: 26520,
    totalPayable: 318240,
    paidAmount: 0,
    outstandingPrincipal: 300000,
    status: 'APPROVED' as const,
    appliedDate: new Date().toISOString(),
    approvedDate: new Date().toISOString(),
    approvedBy: 'supervisor',
  };
  state.loans.unshift(loan);

  // Execute Disbursement Saga
  const disbResult = await SagaOrchestrator.executeDisbursementSaga({
    loanId: loan.id,
    executedBy: 'supervisor',
  });

  // Reclassify NPA
  NPAService.classifyAllLoans('supervisor');

  res.json({
    success: true,
    message: 'Milestone 2 workflow executed successfully: Loan Sanctioned -> 6-Step Disbursement Saga executed -> Account Credited -> Repayment Schedule generated -> Asset Classified.',
    loan,
    saga: disbResult.saga,
  });
});

// Run Milestone 3 Flow (Success + Failed Compensation test)
demoRouter.post('/flow/milestone3', async (req, res) => {
  const state = db.getState();
  const customer = state.customers[0];
  const account = state.accounts.find((a) => a.customerId === customer.id) || state.accounts[0];

  // 1. Execute a successful repayment saga
  const pendingSchedule = state.repaymentSchedules.find((r) => r.status === 'UPCOMING' || r.status === 'DUE');
  let repResult;
  if (pendingSchedule) {
    repResult = await SagaOrchestrator.executeRepaymentSaga({
      scheduleId: pendingSchedule.id,
      accountId: account.id,
      executedBy: 'teller',
      simulateFailure: false,
    });
  }

  // 2. Also simulate a failed settlement / compensation saga for automated rollback test
  const failLoan = state.loans.find((l) => l.status === 'APPROVED');
  let failResult = null;
  if (failLoan) {
    failResult = await SagaOrchestrator.executeDisbursementSaga({
      loanId: failLoan.id,
      executedBy: 'supervisor',
      simulateFailureAtStep: 4, // Fail at ledger credit step
    });
  }

  res.json({
    success: true,
    message: 'Milestone 3 workflow executed successfully: Transaction Lifecycle -> Saga Orchestration -> Settlement Confirmation -> Notification Delivery -> Auto Compensation on Failure.',
    repaymentSaga: repResult?.saga,
    compensatedSaga: failResult?.saga,
  });
});

// Run Complete End-to-End Customer Journey
demoRouter.post('/flow/e2e-journey', async (req, res) => {
  const state = db.getState();
  const timestamp = Date.now().toString().slice(-4);
  const fullName = `Devendra Sen ${timestamp}`;

  // 1. Create Customer
  const custId = `CUST-${1000 + state.customers.length + 1}`;
  const customer = {
    id: custId,
    customerCode: `FC-CUST-${1000 + state.customers.length + 1}`,
    fullName,
    email: `devendra.${timestamp}@fincore.bank`,
    phone: `+91 98199 ${timestamp}`,
    address: '702, Cyber Tower, Hitech City, Hyderabad - 500081',
    kycStatus: 'PENDING' as any,
    riskLevel: 'LOW' as const,
    totalAccounts: 1,
    totalLoans: 1,
    createdAt: new Date().toISOString(),
  };
  state.customers.unshift(customer);

  // 2. Open Account
  const accId = `ACC-${8000 + state.accounts.length + 1}`;
  const account = {
    id: accId,
    accountNumber: `10984420${String(state.accounts.length + 1).padStart(4, '0')}`,
    customerId: customer.id,
    customerName: customer.fullName,
    accountType: 'SAVINGS' as const,
    balance: 50000,
    currency: 'INR',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
  };
  state.accounts.unshift(account);

  // 3. Submit KYC by Teller
  const kycId = `KYC-${5000 + state.kycRecords.length + 1}`;
  const kyc: any = {
    id: kycId,
    customerId: customer.id,
    fullName: customer.fullName,
    dateOfBirth: '1993-11-20',
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    documentType: 'PAN',
    documentNumber: `DEVPS${timestamp}F`,
    verificationStatus: 'UNDER_REVIEW',
    riskLevel: 'LOW',
    submittedBy: 'teller',
    submittedAt: new Date().toISOString(),
  };
  state.kycRecords.unshift(kyc);

  // 4. Supervisor Approves KYC
  kyc.verificationStatus = 'VERIFIED';
  kyc.verifiedBy = 'supervisor';
  kyc.verifiedAt = new Date().toISOString();
  customer.kycStatus = 'VERIFIED';

  AuditService.log({
    user: 'supervisor',
    role: 'SUPERVISOR',
    action: 'KYC_APPROVED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'KYC_RECORD',
    entityId: kycId,
    newValue: 'VERIFIED',
    details: `E2E Journey: KYC Approved for ${fullName}`,
  });

  // 5. Loan Sanction
  const loanId = `LN-${3000 + state.loans.length + 1}`;
  const loan = {
    id: loanId,
    loanNumber: `LN-E2E-${timestamp}`,
    customerId: customer.id,
    customerName: customer.fullName,
    accountId: account.id,
    loanType: 'PERSONAL_LOAN' as const,
    principalAmount: 400000,
    interestRate: 10.0,
    tenureMonths: 24,
    emiAmount: 18458,
    totalPayable: 442992,
    paidAmount: 0,
    outstandingPrincipal: 400000,
    status: 'APPROVED' as const,
    appliedDate: new Date().toISOString(),
    approvedDate: new Date().toISOString(),
    approvedBy: 'supervisor',
  };
  state.loans.unshift(loan);

  // 6. Disbursement Saga Execution
  const disbResult = await SagaOrchestrator.executeDisbursementSaga({
    loanId: loan.id,
    executedBy: 'supervisor',
  });

  // 7. Repayment of Installment #1
  const firstSchedule = state.repaymentSchedules.find((r) => r.loanId === loan.id && r.installmentNumber === 1);
  let repResult = null;
  if (firstSchedule) {
    repResult = await SagaOrchestrator.executeRepaymentSaga({
      scheduleId: firstSchedule.id,
      accountId: account.id,
      executedBy: 'teller',
    });
  }

  // 8. Reclassify NPA
  NPAService.classifyAllLoans('supervisor');

  res.json({
    success: true,
    message: 'Complete End-to-End Banking Journey Executed: Customer Onboarded -> KYC Submitted & Approved -> Account Opened -> Loan Approved -> 6-Step Disbursement Saga Executed -> Amortization Schedule Generated -> EMI Repayment Saga Executed & Settled -> Notifications & Audit Logs Recorded.',
    customer,
    account,
    kyc,
    loan,
    disbursementSaga: disbResult.saga,
    repaymentSaga: repResult?.saga,
  });
});
