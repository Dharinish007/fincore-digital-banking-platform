export enum LoanType {
  PERSONAL = 'PERSONAL',
  HOME = 'HOME',
  AUTO = 'AUTO',
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION'
}

export enum LoanProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  CREDIT_ASSESSED = 'CREDIT_ASSESSED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum AssessmentDecision {
  APPROVED = 'APPROVED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  REJECTED = 'REJECTED'
}

export enum LoanStatus {
  PENDING_DISBURSEMENT = 'PENDING_DISBURSEMENT',
  ACTIVE = 'ACTIVE',
  PAID_OFF = 'PAID_OFF',
  DEFAULTED = 'DEFAULTED',
  CANCELLED = 'CANCELLED'
}

export interface LoanProduct {
  id: number;
  productCode: string;
  name: string;
  loanType: LoanType;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  processingFeePercentage?: number;
  status: LoanProductStatus;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreditAssessment {
  id: number;
  applicationId: number;
  creditScore: number;
  riskLevel: RiskLevel;
  decision: AssessmentDecision;
  assessedMonthlyIncome: number;
  assessedMonthlyExpenses: number;
  existingMonthlyDebt: number;
  debtToIncomeRatio: number;
  proposedEmi: number;
  maxEligibleAmount: number;
  scoreBreakdown?: string;
  assessmentSummary?: string;
  assessedAt: string;
}

export interface LoanApplication {
  id: number;
  applicationNumber: string;
  customerId: number;
  accountId?: number;
  accountNumber: string;
  loanProduct: LoanProduct;
  requestedAmount: number;
  requestedTenureMonths: number;
  purpose?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  status: ApplicationStatus;
  rejectionReason?: string;
  remarks?: string;
  creditAssessment?: CreditAssessment;
  createdAt: string;
  updatedAt?: string;
}

export interface Loan {
  id: number;
  loanNumber: string;
  applicationId: number;
  customerId: number;
  accountId?: number;
  accountNumber: string;
  loanProductId: number;
  loanProductName: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  totalRepaymentAmount: number;
  totalInterest: number;
  outstandingAmount: number;
  status: LoanStatus;
  disbursedAt?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RepaymentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  beginningBalance: number;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  endingBalance: number;
}

export interface RepaymentSchedule {
  loanNumber: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepaymentAmount: number;
  schedule: RepaymentScheduleItem[];
}

export interface EmiCalculationRequest {
  principalAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
}

export interface EmiCalculationResponse {
  principalAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepaymentAmount: number;
  amortizationSchedule: RepaymentScheduleItem[];
}

export interface LoanStatistics {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalLoans: number;
  activeLoans: number;
  pendingDisbursementLoans: number;
  totalDisbursedAmount: number;
  totalActiveOutstandingAmount: number;
}

export interface LoanApplicationRequest {
  customerId?: number | string;
  accountId?: number | string;
  accountNumber?: string;
  loanProductId: number;
  requestedAmount: number;
  requestedTenureMonths: number;
  purpose?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  remarks?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}
