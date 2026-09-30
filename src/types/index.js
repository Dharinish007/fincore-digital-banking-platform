// FinCore Domain Enums and Constants

export const UserRole = {
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  TELLER: 'TELLER',
  CUSTOMER: 'CUSTOMER',
  AUDITOR: 'AUDITOR',
};

export const KYCStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

export const RiskLevel = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const AccountType = {
  SAVINGS: 'SAVINGS',
  CURRENT: 'CURRENT',
  LOAN_DISBURSEMENT: 'LOAN_DISBURSEMENT',
  ESCROW: 'ESCROW',
};

export const LoanStatus = {
  APPLIED: 'APPLIED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  DISBURSED: 'DISBURSED',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
};

export const NPACategory = {
  STANDARD: 'STANDARD',
  SMA_0: 'SMA_0',
  SMA_1: 'SMA_1',
  SMA_2: 'SMA_2',
  SUBSTANDARD: 'SUBSTANDARD',
  DOUBTFUL: 'DOUBTFUL',
  LOSS: 'LOSS',
};
