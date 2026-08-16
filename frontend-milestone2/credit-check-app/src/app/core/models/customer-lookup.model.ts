import { LoanType } from './loan-application.model';

export type PreviousLoanStatus = 'Active' | 'Closed' | 'Defaulted';

/**
 * One row of a customer's loan history, shown in the "Previous Loan
 * Details" table/card on the Credit Check form.
 */
export interface PreviousLoanRecord {
  loanId: number;
  loanType: LoanType;
  amount: number;
  outstandingAmount: number;
  status: PreviousLoanStatus;
}

/**
 * Result of searching a Customer ID on the New Credit Check form.
 * Auto-fills Customer Name / Loan Type / Loan Amount, and supplies the
 * previous-loan history used to derive Existing Loan Count,
 * Previous Loan (Yes/No) and Outstanding Amount.
 */
export interface CustomerLookupResult {
  customerId: number;
  customerName: string;
  /** Salary saved for this customer in the database, if available. */
  monthlyIncome: number | null;
  /** Null means this customer is starting a new loan request. */
  loanId: number | null;
  loanType: LoanType | null;
  loanAmount: number | null;
  previousLoans: PreviousLoanRecord[];
}
