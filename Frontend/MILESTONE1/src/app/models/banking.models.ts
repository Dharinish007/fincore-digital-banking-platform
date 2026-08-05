export type AccountType = 'SAVINGS' | 'CHECKING' | 'CREDIT_CARD' | 'INVESTMENT' | 'FIXED_DEPOSIT' | 'JOINT' | 'CRYPTO_CUSTODY';
export type AccountStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'CLOSED';
export type OwnershipStatus = 'VERIFIED_OWNER' | 'JOINT_OWNER' | 'UNAUTHORIZED';
export type TransactionType = 'DEBIT' | 'CREDIT' | 'WIRE_TRANSFER' | 'ATM_WITHDRAWAL' | 'FEE' | 'INTEREST';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'SCHEDULED';
export type DatePreset = '30_DAYS' | 'CURRENT_MONTH' | 'LAST_FINANCIAL_YEAR' | 'YEAR_TO_DATE' | 'CUSTOM';
export type ExportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
export type StatementTemplate = 'CLASSIC' | 'EXECUTIVE' | 'TAX';
export type KYCStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED' | 'NOT_SUBMITTED';

export interface MonthlyBalancePoint {
  month: string;
  balance: number;
  inflow: number;
  outflow: number;
}

export interface PendingHold {
  id: string;
  description: string;
  amount: number;
  holdType: 'CARD_AUTHORIZATION' | 'UNCLEARED_CHECK' | 'LOAN_COLLATERAL' | 'SECURITY_DEPOSIT';
  createdAt: string;
  expiresAt: string;
  status: 'ACTIVE_HOLD' | 'SETTLED' | 'RELEASED';
}

export interface Account {
  id: string;
  accountNumber: string;
  type: AccountType;
  name: string;
  balance: number;
  availableBalance: number;
  currency: string;
  holderName: string;
  holderSSN: string;
  email: string;
  phone: string;
  address: string;
  ownershipStatus: OwnershipStatus;
  status: AccountStatus;
  kycStatus: KYCStatus;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  bankBranch: string;
  routingNumber: string;
  openedDate: string;
  minBalanceThreshold: number;
  overdraftLimit: number;
  isOverdraftEligible: boolean;
  holds: PendingHold[];
  history: MonthlyBalancePoint[];
  netGrowthRate: number;
}

export interface Transaction {
  id: string;
  date: string;
  referenceId: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  status: TransactionStatus;
  merchantName?: string;
  location?: string;
  notes?: string;
}

export interface StatementFilter {
  accountId: string;
  datePreset: DatePreset;
  startDate: string;
  endDate: string;
  selectedTypes: TransactionType[];
  category: string;
  minAmount: number | null;
  maxAmount: number | null;
  searchQuery: string;
}

export interface FinancialSummary {
  openingBalance: number;
  totalCredits: number;
  totalDebits: number;
  netCashflow: number;
  totalFees: number;
  totalInterest: number;
  closingBalance: number;
  creditCount: number;
  debitCount: number;
  totalTransactionsCount: number;
  averageDailyBalance: number;
  categoryBreakdown: { category: string; amount: number; percentage: number; color: string }[];
}

export interface StatementArchive {
  id: string;
  accountId: string;
  accountNumber: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
  format: ExportFormat;
  template: StatementTemplate;
  generatedAt: string;
  fileSize: string;
  checksum: string;
  s3BucketPath: string;
  isPasswordProtected: boolean;
  downloadCount: number;
}

export interface EmailSchedule {
  id: string;
  accountId: string;
  recipientEmail: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'INSTANT';
  format: ExportFormat;
  template: StatementTemplate;
  isEncrypted: boolean;
  passwordHint?: string;
  lastSent?: string;
  nextScheduledDate?: string;
  status: 'ACTIVE' | 'PAUSED';
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  eventType: 'STATEMENT_GENERATE' | 'STATEMENT_DOWNLOAD' | 'STATEMENT_EMAIL' | 'DATA_MASK_TOGGLE' | 'AUTH_CHECK' | 'BALANCE_DEPOSIT' | 'BALANCE_WITHDRAW' | 'ACCOUNT_STATUS_CHANGE' | 'ACCOUNT_CREATE' | 'TRANSFER_FUNDS';
  accountNumberMasked: string;
  userIP: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
}

export interface OnboardingForm {
  fullName: string;
  email: string;
  phone: string;
  ssn: string;
  address: string;
  accountType: AccountType;
  initialDeposit: number;
  overdraftOptIn: boolean;
  minBalanceThreshold: number;
}
