export type CreditStatus = 'Pass' | 'Review' | 'Fail';

/**
 * Maps directly to the `credit_check` table (Database_Schema_WEEK-2.docx).
 */
export interface CreditCheck {
  creditCheckId: number;
  loanId: number;
  creditScore: number;
  monthlyIncome: number;
  existingLoanCount: number;
  creditStatus: CreditStatus;
  remarks: string;
  checkedAt: string;
}
