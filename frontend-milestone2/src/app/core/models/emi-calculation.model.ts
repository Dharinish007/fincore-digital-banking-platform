import { LoanApplication } from './loan-application.model';
import { CreditCheck } from './credit-check.model';

/**
 * Maps directly to the `emi_calculation` table (Database_Schema_WEEK-2.docx).
 */
export interface EmiCalculation {
  emiId: number;
  loanId: number;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayable: number;
  calculatedAt: string;
}

/**
 * Added for the frontend: a flattened, joined view combining one
 * LoanApplication + its CreditCheck + its EmiCalculation into a single row,
 * since the dashboard table needs to display all three together. This is
 * not a database table — it's assembled by CreditCheckService.
 */
export interface CreditCheckRecord {
  application: LoanApplication;
  credit: CreditCheck;
  emi: EmiCalculation;
}
