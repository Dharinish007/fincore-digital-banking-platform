export type LoanType = 'Personal' | 'Home' | 'Vehicle' | 'Education' | 'Gold' | 'Other';
export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

/**
 * Maps directly to the `loan_application` table (Database_Schema_WEEK-2.docx).
 */
export interface LoanApplication {
  loanId: number;
  customerId: number;
  loanType: LoanType;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  purpose: string;
  applicationStatus: ApplicationStatus;
  applicationDate: string;

  /**
   * Added for the frontend: the schema only stores customerId as a foreign
   * key. The UI needs a readable name, so this is populated by joining
   * against the Customer entity used by the Account Creation module.
   */
  customerName: string;
}
