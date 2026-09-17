import crypto from 'crypto';

// Generate SHA-256 hash matching Java's MessageDigest.getInstance("SHA-256")
export function calculateSha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Initial Database State
export const db = {
  users: [
    { id: 'USR-001', username: 'admin', password: 'password123', name: 'Alexander Vance', role: 'ADMIN', email: 'admin@fincore-nexus.bank', department: 'Executive Management', lastLogin: '2026-09-04 14:30:00' },
    { id: 'USR-002', username: 'supervisor', password: 'password123', name: 'Elena Rostova', role: 'SUPERVISOR', email: 'elena.r@fincore-nexus.bank', department: 'Credit & Risk Operations', lastLogin: '2026-09-04 16:15:22' },
    { id: 'USR-003', username: 'teller', password: 'password123', name: 'Marcus Brody', role: 'TELLER', email: 'marcus.b@fincore-nexus.bank', department: 'Retail Branch Operations', lastLogin: '2026-09-05 08:45:10' },
    { id: 'USR-004', username: 'auditor', password: 'password123', name: 'David Chen', role: 'AUDITOR', email: 'david.c@fincore-nexus.bank', department: 'Internal Governance & Compliance', lastLogin: '2026-09-05 09:12:44' },
    { id: 'USR-005', username: 'customer', password: 'password123', name: 'Sarah Jenkins', role: 'CUSTOMER', email: 'sarah.jenkins@email.com', department: 'Retail Banking Client', lastLogin: '2026-09-05 10:05:18' },
  ],

  customers: [
    {
      id: 'CUST-1001',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@email.com',
      phone: '+1 (555) 234-5678',
      accountNumber: 'FC-8820-9104-3312',
      accountType: 'Premium Savings',
      balance: 48520.50,
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
      riskScore: 24,
      riskLevel: 'LOW',
      joinedDate: '2023-04-12',
      pepStatus: 'NO',
      sanctionsStatus: 'CLEAR'
    },
    {
      id: 'CUST-1002',
      name: 'Robert Vance',
      email: 'robert.vance@techcorp.io',
      phone: '+1 (555) 876-5432',
      accountNumber: 'FC-4491-0021-8874',
      accountType: 'Corporate Checking',
      balance: 312890.00,
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
      riskScore: 42,
      riskLevel: 'MEDIUM',
      joinedDate: '2022-11-05',
      pepStatus: 'NO',
      sanctionsStatus: 'CLEAR'
    },
    {
      id: 'CUST-1003',
      name: 'Vikram Patel',
      email: 'v.patel@globalexport.biz',
      phone: '+1 (555) 901-2345',
      accountNumber: 'FC-6632-1145-9920',
      accountType: 'Commercial Trade Account',
      balance: 125400.75,
      status: 'UNDER_REVIEW',
      kycStatus: 'PENDING',
      riskScore: 82,
      riskLevel: 'HIGH',
      joinedDate: '2024-01-18',
      pepStatus: 'YES',
      sanctionsStatus: 'FLAGGED'
    },
    {
      id: 'CUST-1004',
      name: 'Helena Thorne',
      email: 'h.thorne@apexholdings.org',
      phone: '+1 (555) 432-1098',
      accountNumber: 'FC-1188-7729-4401',
      accountType: 'Wealth Management Trust',
      balance: 950000.00,
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
      riskScore: 68,
      riskLevel: 'MEDIUM',
      joinedDate: '2021-08-30',
      pepStatus: 'NO',
      sanctionsStatus: 'CLEAR'
    },
    {
      id: 'CUST-1005',
      name: 'Liam O\'Connor',
      email: 'liam.oc@construction.ie',
      phone: '+1 (555) 654-7890',
      accountNumber: 'FC-9930-4412-5567',
      accountType: 'Standard Business',
      balance: 18450.20,
      status: 'RESTRICTED',
      kycStatus: 'REJECTED',
      riskScore: 88,
      riskLevel: 'HIGH',
      joinedDate: '2024-05-10',
      pepStatus: 'NO',
      sanctionsStatus: 'CLEAR'
    }
  ],

  kycRecords: [
    {
      id: 'KYC-501',
      customerId: 'CUST-1001',
      customerName: 'Sarah Jenkins',
      documentType: 'Passport',
      documentNumber: 'USA-99824102',
      issueDate: '2022-01-15',
      expiryDate: '2032-01-15',
      issuingAuthority: 'Department of State',
      status: 'VERIFIED',
      submittedAt: '2026-08-10 11:30:00',
      reviewedBy: 'Elena Rostova',
      reviewedAt: '2026-08-11 09:15:00',
      notes: 'Identity verified with biometrics and proof of address.'
    },
    {
      id: 'KYC-502',
      customerId: 'CUST-1002',
      customerName: 'Robert Vance',
      documentType: 'National ID Card',
      documentNumber: 'NID-77209144',
      issueDate: '2020-06-10',
      expiryDate: '2030-06-10',
      issuingAuthority: 'National Identity Registry',
      status: 'VERIFIED',
      submittedAt: '2026-08-15 14:20:00',
      reviewedBy: 'Marcus Brody',
      reviewedAt: '2026-08-16 10:00:00',
      notes: 'Corporate authorization documents and National ID certified.'
    },
    {
      id: 'KYC-503',
      customerId: 'CUST-1003',
      customerName: 'Vikram Patel',
      documentType: 'International Passport',
      documentNumber: 'IND-Z8819203',
      issueDate: '2021-03-20',
      expiryDate: '2031-03-20',
      issuingAuthority: 'Consular Affairs',
      status: 'PENDING',
      submittedAt: '2026-09-02 16:45:00',
      reviewedBy: null,
      reviewedAt: null,
      notes: 'Awaiting PEP clearance declaration and source-of-wealth documentation.'
    },
    {
      id: 'KYC-504',
      customerId: 'CUST-1005',
      customerName: 'Liam O\'Connor',
      documentType: 'Driving License',
      documentNumber: 'DL-88391203',
      issueDate: '2019-09-01',
      expiryDate: '2024-09-01',
      issuingAuthority: 'Motor Transport Bureau',
      status: 'REJECTED',
      submittedAt: '2026-08-25 10:15:00',
      reviewedBy: 'Elena Rostova',
      reviewedAt: '2026-08-26 14:30:00',
      notes: 'Document expired prior to application. Resubmission required.'
    }
  ],

  loans: [
    {
      id: 'LN-8001',
      customerId: 'CUST-1001',
      customerName: 'Sarah Jenkins',
      loanType: 'Home Mortgage',
      principalAmount: 250000.00,
      outstandingAmount: 218450.00,
      interestRate: 6.25,
      tenorMonths: 180,
      emiAmount: 2145.00,
      totalInstallments: 180,
      paidInstallments: 24,
      pendingInstallments: 156,
      overdueInstallments: 0,
      overdueAmount: 0.00,
      dpd: 0,
      paymentStatus: 'CURRENT',
      npaClassification: 'STANDARD',
      disbursementDate: '2024-08-01',
      nextDueDate: '2026-09-15'
    },
    {
      id: 'LN-8002',
      customerId: 'CUST-1002',
      customerName: 'Robert Vance',
      loanType: 'Commercial Term Loan',
      principalAmount: 500000.00,
      outstandingAmount: 412000.00,
      interestRate: 7.50,
      tenorMonths: 60,
      emiAmount: 10018.00,
      totalInstallments: 60,
      paidInstallments: 12,
      pendingInstallments: 47,
      overdueInstallments: 1,
      overdueAmount: 10018.00,
      dpd: 14,
      paymentStatus: 'PARTIAL_PENDING',
      npaClassification: 'SMA-0',
      disbursementDate: '2025-08-15',
      nextDueDate: '2026-09-10'
    },
    {
      id: 'LN-8003',
      customerId: 'CUST-1003',
      customerName: 'Vikram Patel',
      loanType: 'Trade Working Capital',
      principalAmount: 150000.00,
      outstandingAmount: 145000.00,
      interestRate: 9.20,
      tenorMonths: 36,
      emiAmount: 4785.00,
      totalInstallments: 36,
      paidInstallments: 3,
      pendingInstallments: 31,
      overdueInstallments: 2,
      overdueAmount: 9570.00,
      dpd: 48,
      paymentStatus: 'OVERDUE',
      npaClassification: 'SMA-1',
      disbursementDate: '2026-02-01',
      nextDueDate: '2026-09-01'
    },
    {
      id: 'LN-8004',
      customerId: 'CUST-1004',
      customerName: 'Helena Thorne',
      loanType: 'Secured Asset Backed',
      principalAmount: 380000.00,
      outstandingAmount: 330000.00,
      interestRate: 5.80,
      tenorMonths: 84,
      emiAmount: 5512.00,
      totalInstallments: 84,
      paidInstallments: 18,
      pendingInstallments: 63,
      overdueInstallments: 3,
      overdueAmount: 16536.00,
      dpd: 76,
      paymentStatus: 'CRITICAL_OVERDUE',
      npaClassification: 'SMA-2',
      disbursementDate: '2025-01-10',
      nextDueDate: '2026-08-20'
    },
    {
      id: 'LN-8005',
      customerId: 'CUST-1005',
      customerName: 'Liam O\'Connor',
      loanType: 'Equipment Finance',
      principalAmount: 85000.00,
      outstandingAmount: 79200.00,
      interestRate: 10.50,
      tenorMonths: 48,
      emiAmount: 2174.00,
      totalInstallments: 48,
      paidInstallments: 4,
      pendingInstallments: 40,
      overdueInstallments: 4,
      overdueAmount: 8696.00,
      dpd: 112,
      paymentStatus: 'DEFAULTED',
      npaClassification: 'NPA',
      disbursementDate: '2025-09-15',
      nextDueDate: '2026-08-01'
    }
  ],

  repayments: [
    { id: 'REP-9001', loanId: 'LN-8001', installmentNo: 23, amountPaid: 2145.00, dueDate: '2026-07-15', paidDate: '2026-07-14', status: 'PAID', mode: 'Direct Debit', txnRef: 'TXN-998811' },
    { id: 'REP-9002', loanId: 'LN-8001', installmentNo: 24, amountPaid: 2145.00, dueDate: '2026-08-15', paidDate: '2026-08-15', status: 'PAID', mode: 'Direct Debit', txnRef: 'TXN-998812' },
    { id: 'REP-9003', loanId: 'LN-8001', installmentNo: 25, amountPaid: 0, dueDate: '2026-09-15', paidDate: null, status: 'PENDING', mode: 'Auto-Pay Scheduled', txnRef: null },
    { id: 'REP-9004', loanId: 'LN-8002', installmentNo: 12, amountPaid: 10018.00, dueDate: '2026-07-10', paidDate: '2026-07-12', status: 'PAID', mode: 'NEFT Transfer', txnRef: 'TXN-773120' },
    { id: 'REP-9005', loanId: 'LN-8002', installmentNo: 13, amountPaid: 0, dueDate: '2026-08-10', paidDate: null, status: 'OVERDUE', mode: 'Pending Settlement', txnRef: null },
    { id: 'REP-9006', loanId: 'LN-8003', installmentNo: 4, amountPaid: 0, dueDate: '2026-07-01', paidDate: null, status: 'OVERDUE', mode: 'Pending Settlement', txnRef: null },
    { id: 'REP-9007', loanId: 'LN-8003', installmentNo: 5, amountPaid: 0, dueDate: '2026-08-01', paidDate: null, status: 'OVERDUE', mode: 'Pending Settlement', txnRef: null }
  ],

  sagas: [
    {
      id: 'SAGA-3001',
      loanId: 'LN-8001',
      customerName: 'Sarah Jenkins',
      amount: 250000.00,
      status: 'COMPLETED',
      startedAt: '2024-07-28 09:30:00',
      completedAt: '2024-07-28 09:35:12',
      steps: [
        { name: 'Document Verification', status: 'COMPLETED', executedAt: '2024-07-28 09:30:15', details: 'All ID and salary proofs validated' },
        { name: 'Loan Approval', status: 'COMPLETED', executedAt: '2024-07-28 09:31:40', details: 'Underwriting committee signoff granted' },
        { name: 'Account Credited', status: 'COMPLETED', executedAt: '2024-07-28 09:33:05', details: 'Beneficiary account FC-8820 credited' },
        { name: 'Completed', status: 'COMPLETED', executedAt: '2024-07-28 09:35:12', details: 'Disbursement saga committed successfully' }
      ]
    },
    {
      id: 'SAGA-3002',
      loanId: 'LN-8006',
      customerName: 'Vikram Patel',
      amount: 150000.00,
      status: 'IN_PROGRESS',
      startedAt: '2026-09-05 07:15:00',
      completedAt: null,
      steps: [
        { name: 'Document Verification', status: 'COMPLETED', executedAt: '2026-09-05 07:15:20', details: 'Cross-checked with tax registry' },
        { name: 'Loan Approval', status: 'COMPLETED', executedAt: '2026-09-05 07:18:40', details: 'Risk scoring passed credit policy check' },
        { name: 'Account Credited', status: 'IN_PROGRESS', executedAt: '2026-09-05 07:20:10', details: 'Awaiting clearinghouse confirmation' },
        { name: 'Completed', status: 'PENDING', executedAt: null, details: 'Pending previous step' }
      ]
    },
    {
      id: 'SAGA-3003',
      loanId: 'LN-8007',
      customerName: 'Liam O\'Connor',
      amount: 85000.00,
      status: 'FAILED',
      startedAt: '2026-09-04 15:10:00',
      completedAt: '2026-09-04 15:12:45',
      steps: [
        { name: 'Document Verification', status: 'COMPLETED', executedAt: '2026-09-04 15:10:15', details: 'Documentation presented' },
        { name: 'Loan Approval', status: 'FAILED', executedAt: '2026-09-04 15:11:30', details: 'Failed due to KYC expiration and credit score anomaly' },
        { name: 'Account Credited', status: 'COMPENSATED', executedAt: '2026-09-04 15:12:00', details: 'Transaction rolled back, no funds released' },
        { name: 'Completed', status: 'ABORTED', executedAt: '2026-09-04 15:12:45', details: 'Saga aborted with compensation logic' }
      ]
    }
  ],

  settlements: [
    { id: 'SETTL-401', refId: 'REF-TX-88390', batchId: 'BATCH-2026-09-05-A', counterparty: 'Federal Clearing System', amount: 142500.00, date: '2026-09-05 10:30:00', channel: 'RTGS', status: 'CONFIRMED' },
    { id: 'SETTL-402', refId: 'REF-TX-88391', batchId: 'BATCH-2026-09-05-A', counterparty: 'JPMorgan Chase Interbank', amount: 89320.50, date: '2026-09-05 11:15:00', channel: 'NEFT', status: 'CONFIRMED' },
    { id: 'SETTL-403', refId: 'REF-TX-88392', batchId: 'BATCH-2026-09-05-B', counterparty: 'Bank of England Clearing', amount: 350000.00, date: '2026-09-05 12:00:00', channel: 'SWIFT', status: 'PENDING' },
    { id: 'SETTL-404', refId: 'REF-TX-88393', batchId: 'BATCH-2026-09-04-C', counterparty: 'Standard Chartered Int', amount: 54000.00, date: '2026-09-04 18:20:00', channel: 'SWIFT', status: 'FAILED' }
  ],

  notifications: [
    { id: 'NOTIF-701', recipient: 'Sarah Jenkins', recipientId: 'CUST-1001', type: 'SMS & EMAIL', title: 'EMI Scheduled Debit Alert', message: 'Your upcoming EMI installment of $2,145.00 is due on 2026-09-15.', status: 'DELIVERED', timestamp: '2026-09-04 09:00:00', channel: 'SMS' },
    { id: 'NOTIF-702', recipient: 'Vikram Patel', recipientId: 'CUST-1003', type: 'IN-APP & EMAIL', title: 'High-Risk Compliance Review Required', message: 'Additional source-of-funds verification is needed for trade account approval.', status: 'DELIVERED', timestamp: '2026-09-04 14:10:00', channel: 'Email' },
    { id: 'NOTIF-703', recipient: 'Elena Rostova (Supervisor)', recipientId: 'USR-002', type: 'ALERT', title: 'Saga Disbursement Approval Request', message: 'Loan LN-8006 requires supervisor authorization for interbank disbursement.', status: 'DELIVERED', timestamp: '2026-09-05 07:16:00', channel: 'In-App' },
    { id: 'NOTIF-704', recipient: 'David Chen (Auditor)', recipientId: 'USR-004', type: 'SECURITY ALERT', title: 'SHA-256 Audit Integrity Verification Completed', message: 'Daily audit hash chain verification passed with 0 discrepancies.', status: 'DELIVERED', timestamp: '2026-09-05 06:00:00', channel: 'In-App' }
  ],

  riskScores: [
    {
      id: 'RSK-101',
      customerId: 'CUST-1001',
      customerName: 'Sarah Jenkins',
      score: 24,
      level: 'LOW',
      creditScore: 785,
      debtToIncomeRatio: '18%',
      dpdCount: 0,
      factors: [
        { name: 'Pristine Repayment History', impact: 'POSITIVE', weight: -30 },
        { name: 'Low Credit Utilization (12%)', impact: 'POSITIVE', weight: -20 },
        { name: 'Verified Employment & High Net Worth', impact: 'POSITIVE', weight: -25 }
      ],
      lastAssessed: '2026-09-01 10:00:00',
      history: [
        { date: '2026-03-01', score: 28, level: 'LOW', reason: 'Initial mortgage underwriting assessment' },
        { date: '2026-09-01', score: 24, level: 'LOW', reason: 'On-time consecutive EMI bonus adjustment' }
      ]
    },
    {
      id: 'RSK-102',
      customerId: 'CUST-1002',
      customerName: 'Robert Vance',
      score: 42,
      level: 'MEDIUM',
      creditScore: 710,
      debtToIncomeRatio: '34%',
      dpdCount: 14,
      factors: [
        { name: 'Commercial Revenue Stability', impact: 'POSITIVE', weight: -15 },
        { name: 'Minor DPD (14 days past due on commercial loan)', impact: 'NEGATIVE', weight: +22 },
        { name: 'Moderate Leverage Ratio', impact: 'NEUTRAL', weight: +5 }
      ],
      lastAssessed: '2026-09-02 11:30:00',
      history: [
        { date: '2026-01-10', score: 35, level: 'LOW', reason: 'Yearly commercial credit review' },
        { date: '2026-09-02', score: 42, level: 'MEDIUM', reason: 'Recent 14-day DPD emergence on LN-8002' }
      ]
    },
    {
      id: 'RSK-103',
      customerId: 'CUST-1003',
      customerName: 'Vikram Patel',
      score: 82,
      level: 'HIGH',
      creditScore: 615,
      debtToIncomeRatio: '58%',
      dpdCount: 48,
      factors: [
        { name: 'High DPD (48 days overdue on working capital loan)', impact: 'NEGATIVE', weight: +35 },
        { name: 'Politically Exposed Person (PEP) Family Affiliation', impact: 'NEGATIVE', weight: +25 },
        { name: 'High Cross-Border Wire Frequency', impact: 'NEGATIVE', weight: +22 }
      ],
      lastAssessed: '2026-09-04 16:00:00',
      history: [
        { date: '2026-05-15', score: 62, level: 'MEDIUM', reason: 'Quarterly review' },
        { date: '2026-09-04', score: 82, level: 'HIGH', reason: 'SMA-1 classification + PEP flag escalation' }
      ]
    },
    {
      id: 'RSK-104',
      customerId: 'CUST-1004',
      customerName: 'Helena Thorne',
      score: 68,
      level: 'MEDIUM',
      creditScore: 690,
      debtToIncomeRatio: '42%',
      dpdCount: 76,
      factors: [
        { name: 'High Collateral Coverage (180%)', impact: 'POSITIVE', weight: -20 },
        { name: 'Extended Delinquency (76 days - SMA-2)', impact: 'NEGATIVE', weight: +48 },
        { name: 'Established 5-Year Banking Relationship', impact: 'POSITIVE', weight: -10 }
      ],
      lastAssessed: '2026-09-03 14:15:00',
      history: [
        { date: '2026-06-01', score: 45, level: 'MEDIUM', reason: 'Mid-year audit' },
        { date: '2026-09-03', score: 68, level: 'MEDIUM', reason: 'Delinquency extended to SMA-2 category' }
      ]
    },
    {
      id: 'RSK-105',
      customerId: 'CUST-1005',
      customerName: 'Liam O\'Connor',
      score: 88,
      level: 'HIGH',
      creditScore: 540,
      debtToIncomeRatio: '72%',
      dpdCount: 112,
      factors: [
        { name: 'NPA Default (>90 DPD on equipment finance)', impact: 'NEGATIVE', weight: +50 },
        { name: 'Expired Regulatory Identification', impact: 'NEGATIVE', weight: +20 },
        { name: 'Multiple Third-Party Collection Inquiries', impact: 'NEGATIVE', weight: +18 }
      ],
      lastAssessed: '2026-09-05 08:30:00',
      history: [
        { date: '2026-04-10', score: 75, level: 'HIGH', reason: 'SMA-2 delinquency onset' },
        { date: '2026-09-05', score: 88, level: 'HIGH', reason: 'NPA classification confirmed by credit bureau' }
      ]
    }
  ],

  complianceChecks: [
    {
      id: 'CMP-201',
      customerId: 'CUST-1001',
      customerName: 'Sarah Jenkins',
      checkType: 'KYC & Transaction Limit',
      categories: ['KYC', 'Transaction Limit', 'Document Verification'],
      status: 'PASS',
      submittedBy: 'Marcus Brody (Teller)',
      submittedAt: '2026-08-10 11:35:00',
      reviewedBy: 'Elena Rostova (Supervisor)',
      reviewedAt: '2026-08-10 14:00:00',
      riskLevel: 'LOW',
      findings: 'Clean AML record, verified biometric ID, transaction threshold compliant with tier-1 profile.'
    },
    {
      id: 'CMP-202',
      customerId: 'CUST-1003',
      customerName: 'Vikram Patel',
      checkType: 'AML & PEP Sanctions Screening',
      categories: ['AML', 'PEP', 'Sanctions', 'Transaction Limit'],
      status: 'PENDING',
      submittedBy: 'Marcus Brody (Teller)',
      submittedAt: '2026-09-04 16:30:00',
      reviewedBy: null,
      reviewedAt: null,
      riskLevel: 'HIGH',
      findings: 'Escalated due to PEP affiliation in South Asian energy sector and large international transfer velocity.'
    },
    {
      id: 'CMP-203',
      customerId: 'CUST-1005',
      customerName: 'Liam O\'Connor',
      checkType: 'Document Verification & Default Review',
      categories: ['Document Verification', 'AML'],
      status: 'FAIL',
      submittedBy: 'Marcus Brody (Teller)',
      submittedAt: '2026-08-25 10:30:00',
      reviewedBy: 'Elena Rostova (Supervisor)',
      reviewedAt: '2026-08-26 15:00:00',
      riskLevel: 'HIGH',
      findings: 'Provided driving license expired. Unverified beneficiary addresses. Failed secondary diligence.'
    },
    {
      id: 'CMP-204',
      customerId: 'CUST-1002',
      customerName: 'Robert Vance',
      checkType: 'Annual Commercial AML Audit',
      categories: ['AML', 'Transaction Limit'],
      status: 'PASS',
      submittedBy: 'Marcus Brody (Teller)',
      submittedAt: '2026-09-02 12:00:00',
      reviewedBy: 'Elena Rostova (Supervisor)',
      reviewedAt: '2026-09-03 09:30:00',
      riskLevel: 'MEDIUM',
      findings: 'Beneficial ownership register verified. High turnover consistent with audited corporate revenues.'
    }
  ],

  // Audit Logs with SHA-256 Hash Chain
  auditLogs: [],

  // Audit Integrity Alerts (when tampering or hash mismatches are found)
  auditAlerts: [
    {
      id: 'ALT-101',
      severity: 'HIGH',
      type: 'HASH_CHAIN_ANOMALY',
      status: 'RESOLVED',
      timestamp: '2026-08-20 16:40:12',
      blockIndex: 4,
      description: 'Discrepancy detected between stored block #4 hash and recalculation. Re-synchronized from primary ledger.',
      investigatedBy: 'David Chen (Auditor)',
      resolutionNotes: 'Network glitch caused delayed ledger write. Block rebuilt and re-signed.'
    }
  ],

  // Core Ledger Transactions (Transfers, Deposits, Withdrawals, Repayments)
  transactions: [
    {
      id: 'TXN-7001',
      type: 'TRANSFER',
      fromAccount: 'FC-4491-0021-8874',
      fromCustomer: 'Robert Vance',
      toAccount: 'FC-8820-9104-3312',
      toCustomer: 'Sarah Jenkins',
      amount: 4500.00,
      channel: 'INTERNAL_TRANSFER',
      description: 'Consulting invoice payment INV-2026-08',
      status: 'COMPLETED',
      timestamp: '2026-09-04 14:10:25'
    },
    {
      id: 'TXN-7002',
      type: 'DEPOSIT',
      fromAccount: 'COUNTER-BRANCH-01',
      fromCustomer: 'Branch Teller Station',
      toAccount: 'FC-8820-9104-3312',
      toCustomer: 'Sarah Jenkins',
      amount: 12000.00,
      channel: 'CASH',
      description: 'Over-the-counter branch cash deposit',
      status: 'COMPLETED',
      timestamp: '2026-09-04 11:20:10'
    },
    {
      id: 'TXN-7003',
      type: 'LOAN_EMI',
      fromAccount: 'FC-8820-9104-3312',
      fromCustomer: 'Sarah Jenkins',
      toAccount: 'LN-8001-ESCROW',
      toCustomer: 'FinCore Lending Escrow',
      amount: 2145.00,
      channel: 'DIRECT_DEBIT',
      description: 'Automated installment repayment for Mortgage LN-8001',
      status: 'COMPLETED',
      timestamp: '2026-08-15 09:00:00'
    },
    {
      id: 'TXN-7004',
      type: 'SETTLEMENT',
      fromAccount: 'FC-TREASURY-RTGS',
      fromCustomer: 'FinCore Treasury Reserve',
      toAccount: 'FC-4491-0021-8874',
      toCustomer: 'Robert Vance',
      amount: 142500.00,
      channel: 'RTGS',
      description: 'Federal Clearing System RTGS batch settlement credit',
      status: 'COMPLETED',
      timestamp: '2026-09-05 10:30:00'
    },
    {
      id: 'TXN-7005',
      type: 'WITHDRAWAL',
      fromAccount: 'FC-1188-7729-4401',
      fromCustomer: 'Helena Thorne',
      toAccount: 'ATM-DISPENSE-04',
      toCustomer: 'Branch ATM Dispenser',
      amount: 2500.00,
      channel: 'ATM',
      description: 'Authorized high-limit card withdrawal',
      status: 'COMPLETED',
      timestamp: '2026-09-05 08:15:30'
    }
  ]
};

// Initialize SHA-256 Hash Chain for Audit Logs
const initialAuditEntries = [
  { index: 1, action: 'GENESIS_BLOCK', user: 'SYSTEM', role: 'SYSTEM', details: 'FinCore Nexus Cryptographic Audit Chain Initialized', timestamp: '2026-09-01 00:00:00' },
  { index: 2, action: 'USER_LOGIN', user: 'admin', role: 'ADMIN', details: 'Successful administrative authentication from Secure Gateway', timestamp: '2026-09-04 08:30:00' },
  { index: 3, action: 'KYC_VERIFICATION', user: 'marcus.b', role: 'TELLER', details: 'Customer CUST-1001 KYC marked as VERIFIED', timestamp: '2026-09-04 09:15:20' },
  { index: 4, action: 'LOAN_DISBURSEMENT', user: 'elena.r', role: 'SUPERVISOR', details: 'Approved Saga Disbursement for Loan LN-8001 ($250,000)', timestamp: '2026-09-04 10:22:45' },
  { index: 5, action: 'RISK_SCORING_RUN', user: 'SYSTEM', role: 'SYSTEM', details: 'Automated batch risk scoring completed for 5 portfolios', timestamp: '2026-09-04 12:00:00' },
  { index: 6, action: 'COMPLIANCE_ESCALATION', user: 'marcus.b', role: 'TELLER', details: 'Submitted high-risk compliance check for customer CUST-1003 (PEP)', timestamp: '2026-09-04 16:30:10' },
  { index: 7, action: 'SETTLEMENT_CONFIRMATION', user: 'admin', role: 'ADMIN', details: 'Confirmed RTGS settlement batch BATCH-2026-09-05-A', timestamp: '2026-09-05 10:30:00' },
  { index: 8, action: 'AUDIT_VERIFICATION', user: 'david.c', role: 'AUDITOR', details: 'Manual cryptographic integrity audit conducted across 8 blocks', timestamp: '2026-09-05 11:00:00' }
];

let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';

initialAuditEntries.forEach((entry) => {
  const payload = `${entry.index}|${entry.timestamp}|${entry.user}|${entry.role}|${entry.action}|${entry.details}|${prevHash}`;
  const currentHash = calculateSha256(payload);
  db.auditLogs.push({
    ...entry,
    prevHash,
    currentHash,
    payload
  });
  prevHash = currentHash;
});

// Helper function to append new entry to the SHA-256 Audit Chain
export function addAuditLog(user, role, action, details) {
  const index = db.auditLogs.length + 1;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const lastLog = db.auditLogs[db.auditLogs.length - 1];
  const previousHash = lastLog ? lastLog.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';

  const payload = `${index}|${timestamp}|${user}|${role}|${action}|${details}|${previousHash}`;
  const currentHash = calculateSha256(payload);

  const newLog = {
    index,
    timestamp,
    user,
    role,
    action,
    details,
    prevHash: previousHash,
    currentHash,
    payload
  };

  db.auditLogs.push(newLog);
  return newLog;
}

// Function to verify entire cryptographic chain
export function verifyAuditIntegrity() {
  const results = {
    isValid: true,
    valid: true,
    totalBlocks: db.auditLogs.length,
    tamperedIndex: null,
    tamperedBlockIndex: null,
    details: 'Cryptographic hash chain is intact and valid.',
    checkedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  for (let i = 0; i < db.auditLogs.length; i++) {
    const block = db.auditLogs[i];
    
    // Check previous hash link
    if (i > 0) {
      const prevBlock = db.auditLogs[i - 1];
      if (block.prevHash !== prevBlock.currentHash) {
        results.isValid = false;
        results.valid = false;
        results.tamperedIndex = block.index;
        results.tamperedBlockIndex = block.index;
        results.details = `Hash pointer mismatch at Block #${block.index}. Expected prevHash ${prevBlock.currentHash.substring(0, 12)}..., but found ${block.prevHash.substring(0, 12)}...`;
        return results;
      }
    } else {
      if (block.prevHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        results.isValid = false;
        results.valid = false;
        results.tamperedIndex = 1;
        results.tamperedBlockIndex = 1;
        results.details = 'Genesis block previous hash is corrupted.';
        return results;
      }
    }

    // Recalculate hash
    const expectedPayload = `${block.index}|${block.timestamp}|${block.user}|${block.role}|${block.action}|${block.details}|${block.prevHash}`;
    const calculatedHash = calculateSha256(expectedPayload);
    if (calculatedHash !== block.currentHash) {
      results.isValid = false;
      results.valid = false;
      results.tamperedIndex = block.index;
      results.tamperedBlockIndex = block.index;
      results.details = `Content tampering detected at Block #${block.index}! Calculated hash does not match stored block signature.`;
      return results;
    }
  }

  return results;
}
