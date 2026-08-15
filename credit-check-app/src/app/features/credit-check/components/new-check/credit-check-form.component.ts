import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CreditCheckService } from '../../../../core/services/credit-check.service';
import { LoanType } from '../../../../core/models/loan-application.model';
import { CreditStatus } from '../../../../core/models/credit-check.model';
import { PreviousLoanRecord } from '../../../../core/models/customer-lookup.model';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

type LookupState = 'idle' | 'loading' | 'found' | 'not-found';

@Component({
  selector: 'app-credit-check-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './credit-check-form.component.html',
  styleUrls: ['./credit-check-form.component.scss'],
})
export class CreditCheckFormComponent {
  private creditCheckService = inject(CreditCheckService);
  private router = inject(Router);

  public sidebarCollapsed = false;

  // ---- Customer ID / Search -------------------------------------------------
  public customerId: number | null = null;
  public lookupState: LookupState = 'idle';

  // ---- Auto-filled from application (read-only) ------------------------------
  public loanId: number | null = null;
  public customerName = '';
  public loanType: LoanType | null = null;
  public loanAmount: number | null = null;

  // ---- Manual input ------------------------------------------------------
  public monthlyIncome: number | null = null;
  public creditScore: number | null = null;
  public fetchingScore = false;

  // ---- Auto-calculated from previous-loan history ------------------------
  public previousLoans: PreviousLoanRecord[] = [];
  public existingLoanCount = 0;
  public hasPreviousLoan = false;
  public outstandingAmount = 0;

  // ---- System-generated ---------------------------------------------------
  public creditStatus: CreditStatus | null = null;
  public remarks = '';
  public checkRun = false;

  public submitted = false;
  public saved = false;

  public loanTypeOptions: LoanType[] = ['Personal', 'Home', 'Vehicle', 'Education', 'Gold', 'Other'];

  public onToggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // ---------------------------------------------------------------------
  // Step 1: Customer ID search -> auto-fill Customer/Loan fields
  // ---------------------------------------------------------------------
  public searchCustomer(): void {
    this.submitted = false;
    this.saved = false;

    if (this.customerId == null || this.customerId <= 0) {
      this.lookupState = 'not-found';
      return;
    }

    this.lookupState = 'loading';
    this.creditCheckService.lookupCustomer(this.customerId).subscribe((result) => {
      if (!result) {
        this.lookupState = 'not-found';
        this.clearAutoFilledFields();
        return;
      }

      this.lookupState = 'found';
      this.loanId = result.loanId;
      this.customerName = result.customerName;
      this.loanType = result.loanType;
      this.loanAmount = result.loanAmount;

      this.previousLoans = result.previousLoans;
      this.existingLoanCount = result.previousLoans.length;
      this.hasPreviousLoan = this.existingLoanCount > 0;
      this.outstandingAmount = result.previousLoans.reduce((sum, l) => sum + l.outstandingAmount, 0);

      // Reset anything downstream of a fresh lookup
      this.monthlyIncome = null;
      this.creditScore = null;
      this.creditStatus = null;
      this.remarks = '';
      this.checkRun = false;
    });
  }

  private clearAutoFilledFields(): void {
    this.loanId = null;
    this.customerName = '';
    this.loanType = null;
    this.loanAmount = null;
    this.previousLoans = [];
    this.existingLoanCount = 0;
    this.hasPreviousLoan = false;
    this.outstandingAmount = 0;
    this.monthlyIncome = null;
    this.creditScore = null;
    this.creditStatus = null;
    this.remarks = '';
    this.checkRun = false;
  }

  // ---------------------------------------------------------------------
  // Simulated "fetch score from credit bureau" for the Credit Score field
  // ---------------------------------------------------------------------
  public fetchCreditScoreFromBureau(): void {
    if (this.customerId == null) return;
    this.fetchingScore = true;
    // Deterministic pseudo-score derived from the customer ID, simulating
    // an external credit-bureau response so the same ID is repeatable.
    setTimeout(() => {
      this.creditScore = 300 + ((this.customerId! * 47) % 601);
      this.fetchingScore = false;
    }, 500);
  }

  // ---------------------------------------------------------------------
  // Step 2: Run eligibility check -> system-generated Credit Status + Remarks
  // ---------------------------------------------------------------------
  public get canRunCheck(): boolean {
    return (
      this.lookupState === 'found' &&
      this.monthlyIncome != null &&
      this.monthlyIncome > 0 &&
      this.creditScore != null &&
      this.creditScore >= 300 &&
      this.creditScore <= 900
    );
  }

  public runEligibilityCheck(): void {
    this.checkRun = true;
    if (!this.canRunCheck || this.loanAmount == null) {
      this.creditStatus = null;
      this.remarks = 'Enter Monthly Income and a valid Credit Score (300-900) to run the check.';
      return;
    }

    const score = this.creditScore!;
    const income = this.monthlyIncome!;

    // Rough EMI estimate (12% p.a., 36 months) used only to gauge affordability.
    const rate = 0.12 / 12;
    const tenure = 36;
    const estimatedEmi =
      (this.loanAmount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);

    // Debt-to-income ratio: existing outstanding EMI-equivalent load (approximated
    // as outstanding/tenure) plus the new loan's EMI, against monthly income.
    const existingMonthlyLoad = this.outstandingAmount / tenure;
    const debtToIncome = (existingMonthlyLoad + estimatedEmi) / income;

    const hasDefault = this.previousLoans.some((l) => l.status === 'Defaulted');

    let status: CreditStatus;
    let remarks: string;

    if (hasDefault) {
      status = 'Fail';
      remarks = 'Customer has a defaulted loan on record. Application does not meet lending criteria.';
    } else if (score < 600) {
      status = 'Fail';
      remarks = `Credit score (${score}) is below the minimum threshold of 600.`;
    } else if (this.existingLoanCount >= 4) {
      status = 'Fail';
      remarks = `Customer already holds ${this.existingLoanCount} loans, exceeding the maximum allowed.`;
    } else if (debtToIncome > 0.6) {
      status = 'Fail';
      remarks = `Debt-to-income ratio is ${(debtToIncome * 100).toFixed(0)}%, exceeding the 60% cap.`;
    } else if (score < 700 || debtToIncome > 0.4 || this.hasPreviousLoan) {
      status = 'Review';
      remarks =
        score < 700
          ? `Credit score (${score}) is in the fair range (600-699); requires manual underwriting review.`
          : debtToIncome > 0.4
            ? `Debt-to-income ratio is ${(debtToIncome * 100).toFixed(0)}%, above the comfortable 40% level.`
            : 'Customer has existing loan history; requires manual underwriting review before approval.';
    } else {
      status = 'Pass';
      remarks = 'Meets standard lending criteria. No further review required.';
    }

    this.creditStatus = status;
    this.remarks = remarks;
  }

  // ---------------------------------------------------------------------
  // Step 3: Save
  // ---------------------------------------------------------------------
  public get canSave(): boolean {
    return (
      this.checkRun &&
      this.creditStatus != null &&
      this.loanId != null &&
      this.loanType != null &&
      this.loanAmount != null &&
      this.monthlyIncome != null &&
      this.creditScore != null
    );
  }

  public saveCreditCheck(): void {
    this.submitted = true;
    if (!this.canSave) return;

    this.creditCheckService.addManualCreditCheck({
      customerId: this.customerId!,
      customerName: this.customerName,
      loanId: this.loanId!,
      loanType: this.loanType!,
      loanAmount: this.loanAmount!,
      monthlyIncome: this.monthlyIncome!,
      creditScore: this.creditScore!,
      existingLoanCount: this.existingLoanCount,
      creditStatus: this.creditStatus!,
      remarks: this.remarks,
    });

    this.saved = true;
  }

  public startNewCheck(): void {
    this.customerId = null;
    this.lookupState = 'idle';
    this.clearAutoFilledFields();
    this.submitted = false;
    this.saved = false;
  }

  public goToDashboard(): void {
    this.router.navigateByUrl('/credit-check');
  }

  public formatCurrency(value: number | null): string {
    if (value == null) return '\u20B90';
    return '\u20B9' + value.toLocaleString('en-IN');
  }
}
