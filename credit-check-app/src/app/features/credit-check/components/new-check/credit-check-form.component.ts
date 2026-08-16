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
  public isNewLoanRequest = false;

  // ---- Manual input ------------------------------------------------------
  public monthlyIncome: number | null = null;
  public creditScore: number | null = null;

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
  public submitError = '';

  public loanTypeOptions: LoanType[] = [
    'Personal',
    'Home',
    'Vehicle',
    'Education',
    'Gold',
    'Other',
  ];

  public onToggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // ---------------------------------------------------------------------
  // Step 1: Customer ID search -> auto-fill Customer/Loan fields
  // ---------------------------------------------------------------------
  public searchCustomer(): void {
    this.submitted = false;
    this.saved = false;
    this.submitError = '';

    if (this.customerId == null || this.customerId <= 0) {
      this.lookupState = 'not-found';
      return;
    }

    this.lookupState = 'loading';
    this.creditCheckService
      .lookupCustomer(this.customerId)
      .subscribe((result) => {
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
        this.isNewLoanRequest = result.loanId == null;

        this.previousLoans = result.previousLoans;
        this.existingLoanCount = result.previousLoans.length;
        this.hasPreviousLoan = this.existingLoanCount > 0;
        this.outstandingAmount = result.previousLoans.reduce(
          (sum, l) => sum + l.outstandingAmount,
          0,
        );

        // Reset anything downstream of a fresh lookup
        this.monthlyIncome = result.monthlyIncome;
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
    this.isNewLoanRequest = false;
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
  // Step 2: Run eligibility check -> system-generated Credit Status + Remarks
  // ---------------------------------------------------------------------
  public get canRunCheck(): boolean {
    return (
      this.lookupState === 'found' &&
      this.loanType != null &&
      this.loanAmount != null &&
      this.loanAmount > 0 &&
      this.monthlyIncome != null &&
      this.monthlyIncome > 0 &&
      this.creditScore != null &&
      this.creditScore >= 300 &&
      this.creditScore <= 900
    );
  }

  public runEligibilityCheck(): void {
    this.checkRun = true;
    if (!this.canRunCheck || this.loanAmount == null || this.loanType == null) {
      this.creditStatus = null;
      this.remarks =
        'Enter loan type, loan amount, salary, and a valid credit score (300-900) to run the check.';
      return;
    }

    this.creditCheckService
      .evaluateEligibility({
        customerId: this.customerId!,
        loanId: this.loanId,
        loanType: this.loanType,
        loanAmount: this.loanAmount,
        monthlyIncome: this.monthlyIncome!,
        creditScore: this.creditScore!,
      })
      .subscribe({
        next: (result) => {
          this.creditStatus = result.creditStatus;
          this.remarks = result.remarks;
          this.existingLoanCount = result.existingLoanCount;
          this.hasPreviousLoan = this.existingLoanCount > 0;
        },
        error: (error) => {
          this.creditStatus = null;
          this.remarks =
            error?.error?.message ?? 'Unable to calculate eligibility from the database.';
        },
      });
  }

  // ---------------------------------------------------------------------
  // Step 3: Save
  // ---------------------------------------------------------------------
  public get canSave(): boolean {
    return (
      this.checkRun &&
      this.creditStatus != null &&
      this.loanType != null &&
      this.loanAmount != null &&
      this.monthlyIncome != null &&
      this.creditScore != null
    );
  }

  public saveCreditCheck(): void {
    this.submitted = true;
    if (!this.canSave) return;

    this.creditCheckService
      .submitCreditCheck({
        customerId: this.customerId!,
        customerName: this.customerName,
        loanId: this.loanId,
        loanType: this.loanType!,
        loanAmount: this.loanAmount!,
        monthlyIncome: this.monthlyIncome!,
        creditScore: this.creditScore!,
        existingLoanCount: this.existingLoanCount,
        creditStatus: this.creditStatus!,
        remarks: this.remarks,
      })
      .subscribe({
        next: () => {
          this.saved = true;
          this.submitError = '';
        },
        error: () => {
          this.saved = false;
          this.submitError = 'Credit check could not be saved to the database.';
        },
      });
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
