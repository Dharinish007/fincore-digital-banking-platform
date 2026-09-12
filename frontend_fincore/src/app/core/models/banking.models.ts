export type KYCStatus = 'Verified' | 'Pending' | 'Rejected' | 'Review Required';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type AccountType = 'Savings' | 'Current' | 'Salary' | 'Fixed Deposit';
export type AccountStatus = 'Active' | 'Dormant' | 'Frozen' | 'Closed';
export type TransactionType = 'Credit' | 'Debit' | 'Transfer' | 'Deposit' | 'Withdrawal';
export type TransactionStatus = 'Success' | 'Pending' | 'Failed' | 'Reversed';
export type PaymentChannel = 'UPI' | 'IMPS' | 'NEFT' | 'ATM' | 'Branch' | 'Net Banking' | 'Mobile Banking';
export type LoanType = 'Home Loan' | 'Personal Loan' | 'Vehicle Loan' | 'Business Loan' | 'Education Loan';
export type LoanStatus = 'Applied' | 'Under Review' | 'Approved' | 'Disbursed' | 'Rejected' | 'NPA' | 'Closed';
export type UserRole = 'Super Admin' | 'Banking Admin' | 'Branch Manager' | 'Loan Officer' | 'KYC Officer' | 'Auditor' | 'Support Agent' | 'Customer';

export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  pan: string;
  aadhaarRef: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  employmentType: 'Salaried' | 'Self-Employed' | 'Business' | 'Retired' | 'Professional';
  annualIncome: number;
  kycStatus: KYCStatus;
  riskScore: number; // 0 - 100
  riskCategory: RiskLevel;
  customerSince: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  profileImage?: string;
}

export interface Account {
  accountId: string;
  accountNumber: string; // e.g. "XXXX XXXX 4592"
  fullAccountNumber?: string;
  customerId: string;
  customerName: string;
  accountType: AccountType;
  balance: number;
  availableBalance: number;
  currency: string;
  branchCode: string;
  branchName: string;
  ifsc: string;
  status: AccountStatus;
  openedDate: string;
  lastUpdated: string;
  interestRate?: number;
}

export interface Transaction {
  transactionId: string;
  accountId: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  referenceNumber: string;
  description: string;
  channel: PaymentChannel;
  status: TransactionStatus;
  timestamp: string;
  balanceAfter: number;
  category?: string;
}

export interface Loan {
  loanId: string;
  customerId: string;
  customerName: string;
  loanType: LoanType;
  principalAmount: number;
  interestRate: number; // % annual
  tenureMonths: number;
  emiAmount: number;
  outstandingAmount: number;
  creditScore: number;
  applicationDate: string;
  disbursementDate?: string;
  nextPaymentDate?: string;
  status: LoanStatus;
  isNPA: boolean;
  repaidAmount: number;
}

export interface Payment {
  paymentId: string;
  customerId: string;
  sourceAccount: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  paymentType: 'UPI' | 'IMPS' | 'NEFT';
  amount: number;
  transactionReference: string;
  status: 'Initiated' | 'Processing' | 'Success' | 'Failed' | 'Settled';
  fraudScore: number;
  settlementStatus: 'Pending' | 'Settled' | 'Failed';
  initiatedAt: string;
  completedAt?: string;
  remarks?: string;
}

export interface Beneficiary {
  beneficiaryId: string;
  customerId: string;
  beneficiaryName: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  paymentType: 'UPI' | 'IMPS' | 'NEFT' | 'All';
  verified: boolean;
  createdDate: string;
  status: 'Active' | 'Inactive';
  nickName?: string;
}

export interface KYCRecord {
  kycId: string;
  customerId: string;
  customerName: string;
  documentType: 'Aadhaar' | 'PAN' | 'Passport' | 'Driving Licence';
  documentNumber: string;
  documentStatus: 'Uploaded' | 'OCR Processed' | 'Verified' | 'Rejected';
  ocrScore: number;
  faceMatchScore: number;
  livenessScore: number;
  riskScore: number;
  verificationStatus: KYCStatus;
  verifiedAt?: string;
  remarks?: string;
  extractedData?: {
    name: string;
    dob: string;
    docNumber: string;
    address: string;
    confidence: number;
  };
}

export interface FraudRecord {
  fraudId: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  amount: number;
  location: string;
  device: string;
  ipAddress: string;
  fraudScore: number; // 0 - 100
  riskLevel: RiskLevel;
  status: 'Flagged' | 'Blocked' | 'Cleared' | 'Under Investigation';
  timestamp: string;
  ruleViolated: string;
}

export interface NotificationItem {
  notificationId: string;
  customerId: string;
  customerName: string;
  notificationType: 'Security' | 'Transaction' | 'Loan' | 'KYC' | 'System';
  channel: 'Email' | 'SMS' | 'Push' | 'In-App';
  title: string;
  message: string;
  status: 'Delivered' | 'Pending' | 'Failed' | 'Read';
  createdAt: string;
  deliveredAt?: string;
}

export interface AuditLog {
  auditId: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  previousValue: string;
  newValue: string;
  ipAddress: string;
  timestamp: string;
  result: 'Success' | 'Failed' | 'Warning';
  integrityHash: string;
}

export interface AppUser {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'Active' | 'Inactive' | 'Locked';
  lastLogin: string;
  createdAt: string;
  department: string;
  avatar?: string;
}

export interface MicroserviceHealth {
  name: string;
  description: string;
  status: 'Healthy' | 'Warning' | 'Down';
  requestsPerSec: number;
  avgResponseMs: number;
  errorRatePercent: number;
  cpuPercent: number;
  memoryPercent: number;
  version: string;
  uptime: string;
}

export interface KafkaTopicEvent {
  eventId: string;
  topic: string;
  producer: string;
  consumer: string;
  timestamp: string;
  status: 'Committed' | 'Processing' | 'Failed' | 'Re-queued';
  payloadSummary: string;
}
