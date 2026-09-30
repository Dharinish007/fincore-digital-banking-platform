// FinCore Enterprise Digital Banking Type Definitions and Constants

export const UserRole = {
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  TELLER: 'TELLER',
  CUSTOMER: 'CUSTOMER',
  AUDITOR: 'AUDITOR',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole] | string;
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED' | string;

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  customerId?: string;
  [key: string]: any;
}

export const KYCStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;

export type KYCStatus = (typeof KYCStatus)[keyof typeof KYCStatus] | string;

export const RiskLevel = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel] | string;

export interface Customer {
  id: string;
  customerCode: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  kycStatus: KYCStatus;
  riskCategory?: RiskLevel;
  dateOfBirth?: string;
  createdAt: string;
  [key: string]: any;
}

export const AccountType = {
  SAVINGS: 'SAVINGS',
  CURRENT: 'CURRENT',
  LOAN_DISBURSEMENT: 'LOAN_DISBURSEMENT',
  ESCROW: 'ESCROW',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType] | string;
export type AccountStatus = 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'CLOSED' | string;

export interface Account {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName?: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  createdAt: string;
  lienAmount?: number;
  [key: string]: any;
}

export const LoanStatus = {
  APPLIED: 'APPLIED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  DISBURSED: 'DISBURSED',
  ACTIVE: 'ACTIVE',
  NPA: 'NPA',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus] | string;
export type LoanType = 'PERSONAL' | 'HOME' | 'VEHICLE' | 'BUSINESS' | string;

export const NPACategory = {
  STANDARD: 'STANDARD',
  SMA_0: 'SMA_0',
  SMA_1: 'SMA_1',
  SMA_2: 'SMA_2',
  SUBSTANDARD: 'SUBSTANDARD',
  DOUBTFUL: 'DOUBTFUL',
  LOSS: 'LOSS',
} as const;

export type NPACategory = (typeof NPACategory)[keyof typeof NPACategory] | string;
export type SMACategory = 'SMA_0' | 'SMA_1' | 'SMA_2' | string;
export type NPAStatus = 'STANDARD' | 'SMA' | 'NPA' | string;

export interface Loan {
  id: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  principalAmount?: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  disbursedAmount: number;
  remainingPrincipal: number;
  outstandingPrincipal?: number;
  paidAmount?: number;
  status: LoanStatus;
  loanType: LoanType;
  createdAt: string;
  disbursedAt?: string;
  npaCategory?: NPACategory;
  overdueDays?: number;
  [key: string]: any;
}

export interface KYCRecord {
  id: string;
  customerId: string;
  fullName: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  documentType: string;
  documentNumber: string;
  documentUrl?: string;
  verificationStatus: KYCStatus;
  riskLevel: RiskLevel;
  submittedBy?: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
  ocrExtractedData?: any;
  faceMatchScore?: number;
  livenessVerified?: boolean;
  [key: string]: any;
}

export interface RepaymentSchedule {
  id: string;
  loanId: string;
  customerId: string;
  customerName: string;
  installmentNumber: number;
  dueDate: string;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  paidAmount: number;
  paidDate?: string;
  overdueAmount: number;
  daysPastDue: number;
  status: 'PAID' | 'UPCOMING' | 'OVERDUE' | 'PARTIAL' | string;
  penaltyAmount: number;
  [key: string]: any;
}

export interface NPARecord {
  id: string;
  loanId: string;
  customerName: string;
  daysPastDue: number;
  category: NPACategory;
  overdueAmount: number;
  provisionAmount: number;
  status: NPAStatus;
  lastClassifiedAt: string;
  [key: string]: any;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'LOAN_DISBURSEMENT' | 'LOAN_REPAYMENT' | 'FEE' | string;
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REVERSED' | string;

export interface Transaction {
  id: string;
  transactionReference: string;
  sourceAccountId: string;
  destinationAccountId: string;
  customerId?: string;
  customerName?: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  timestamp: string;
  sagaId?: string;
  settlementId?: string;
  [key: string]: any;
}

export type SagaStatus = 'SUCCESS' | 'RUNNING' | 'COMPENSATED' | 'FAILED' | 'COMPENSATING' | 'PROCESSING' | 'COMPLETED' | string;
export type SagaType = 'DISBURSEMENT' | 'INTERBANK_TRANSFER' | 'LOAN_ORIGINATION' | 'BILL_PAYMENT' | 'REPAYMENT' | string;

export interface SagaStep {
  name: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'COMPENSATED' | 'COMPLETED' | string;
  timestamp?: string;
  executedAt?: string;
  stepNumber?: number;
  error?: string;
  errorMessage?: string;
  [key: string]: any;
}

export interface SagaInstance {
  id: string;
  sagaType: SagaType;
  status: SagaStatus;
  currentStep: any;
  idempotencyKey?: string;
  customerName?: string;
  amount?: number;
  loanId?: string;
  transactionId?: string;
  retryCount?: number;
  maxRetries?: number;
  failureReason?: string;
  startTime: string;
  endTime?: string;
  updatedAt?: string;
  steps: SagaStep[];
  [key: string]: any;
}

export type SettlementStatus = 'PENDING' | 'SETTLED' | 'RECONCILED' | 'DISCREPANCY' | 'SUCCESS' | string;
export type SettlementNetwork = 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | string;

export interface Settlement {
  id: string;
  batchNumber: string;
  settlementReference?: string;
  networkType: SettlementNetwork;
  clearingHouse: string;
  totalTransactions: number;
  netSettlementAmount: number;
  status: SettlementStatus;
  settlementTime?: string;
  reconciledAt?: string;
  [key: string]: any;
}

export type NotificationType = 'KYC_APPROVED' | 'KYC_REJECTED' | 'LOAN_DISBURSED' | 'REPAYMENT_SUCCESS' | 'REPAYMENT_FAILED' | 'NPA_CLASSIFIED' | 'SAGA_COMPENSATED' | 'TRANSFER_ALERT' | string;
export type NotificationChannel = 'IN_APP' | 'SMS' | 'EMAIL' | string;
export type NotificationStatus = 'DELIVERED' | 'SENT' | 'FAILED' | 'QUEUED' | string;

export interface Notification {
  id: string;
  customerId: string;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  recipient?: string;
  subject?: string;
  body?: string;
  sentAt?: string;
  [key: string]: any;
}

export type AuditAction = 'SYSTEM_STARTUP' | 'LOGIN' | 'LOGOUT' | 'USER_CREATED' | 'ROLE_CHANGED' | 'USER_SUSPENDED' | 'USER_ACTIVATED' | 'USER_DEACTIVATED' | 'USER_AUDIT' | 'KYC_SUBMITTED' | 'KYC_APPROVED' | 'KYC_REJECTED' | 'ACCOUNT_CREATED' | 'ACCOUNT_FROZEN' | 'ACCOUNT_UNFROZEN' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'LOAN_SANCTIONED' | 'LOAN_REJECTED' | 'LOAN_DISBURSED' | 'REPAYMENT_COLLECTED' | 'REPAYMENT_PROCESSED' | 'NPA_BATCH_CLASSIFICATION' | 'SAGA_EXECUTED' | 'SAGA_FAILED' | 'SAGA_COMPENSATED' | 'SETTLEMENT_PROCESSED' | string;

export interface AuditLog {
  id: string;
  timestamp: string;
  performedBy?: string;
  user?: string;
  role?: UserRole | string;
  action: AuditAction | string;
  module?: string;
  entity?: string;
  entityType?: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  status?: string;
  ipAddress?: string;
  details?: string;
  [key: string]: any;
}

export interface DashboardStats {
  totalCustomers: number;
  totalAccounts: number;
  totalLoans: number;
  totalTransactions: number;
  pendingKyc: number;
  activeSagas: number;
  pendingRepayments: number;
  npaLoans: number;
  pendingSettlements: number;
  unreadNotifications: number;
  totalDepositBalance: number;
  totalDisbursedAmount: number;
  totalOverdueAmount: number;
  transactionVolumeToday: number;
  [key: string]: any;
}
