export interface EmiCalculationRequest {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  tenureType: 'YEARS' | 'MONTHS';
  startDate?: string;
  repaymentFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
}

export interface EmiSummary {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
}

export interface AmortizationScheduleItem {
  month: number;
  paymentDate: string;
  emi: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanDetails {
  loanId: string;
  customerId: string;
  customerName: string;
  loanType: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  remainingAmount: number;
  creditScore: number;
  status: 'APPROVED' | 'DISBURSED' | 'ACTIVE' | 'CLOSED' | 'OVERDUE';
  nextEmiDate: string;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  startDate: string;
  outstandingPrincipal?: number;
  paidAmount?: number;
  partialPaidAmount?: number;
  emiStatus?: 'DUE' | 'PAID' | 'PARTIAL' | 'OVERDUE';
  autoDebitEnabled: boolean;
  kafkaSagaStatus: string;
}

export interface DisbursementRequest {
  loanId: string;
  disbursementAmount: number;
  beneficiaryAccount: string;
  disbursementDate: string;
  disbursementMode: 'Bank Transfer' | 'NEFT' | 'RTGS' | 'IMPS' | 'Cheque';
  remarks: string;
}

export interface DisbursementRecord {
  disbursementId: string;
  loanId: string;
  customerName: string;
  disbursementAmount: number;
  beneficiaryAccount: string;
  disbursementDate: string;
  disbursementMode: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  referenceNumber: string;
  remarks: string;
}

export interface PaymentRequest {
  loanId: string;
  customerId: string;
  paymentAmount: number;
  paymentDate: string;
  paymentMode: 'UPI' | 'NEFT' | 'IMPS' | 'Debit Card' | 'Cash';
  referenceNumber: string;
  remarks: string;
}

export interface PaymentRecord {
  paymentId: string;
  loanId: string;
  customerName: string;
  paymentAmount: number;
  paymentDate: string;
  paymentMode: string;
  referenceNumber: string;
  status: 'PAID' | 'PARTIAL' | 'FAILED' | 'REVERSED';
  remarks: string;
}

export interface CollectionDashboardMetrics {
  totalLoans: number;
  emisDueToday: number;
  emisPaid: number;
  overdueCount: number;
  totalOutstanding: number;
}

export interface CreateLoanRequest {
  customerName: string;
  loanType: string;
  sanctionedAmount: number;
  interestRate: number;
  tenureMonths: number;
  creditScore: number;
}
