import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanOriginationService } from '../../../../core/services/loan-origination.service';

@Component({
  selector: 'app-pre-qualification-page',
  standalone: false,
  templateUrl: './pre-qualification-page.component.html',
  styleUrls: ['./pre-qualification-page.component.scss']
})
export class PreQualificationPageComponent {
  private loanService = inject(LoanOriginationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  statusMessage = 'Ready to evaluate pre-qualification status.';
  statusType: 'success' | 'warning' | 'error' | 'info' = 'info';
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      customerId: ['5001', [Validators.required, Validators.min(1)]],
      fullName: ['Aarav Sharma', Validators.required],
      dateOfBirth: ['1990-05-14', Validators.required],
      mobile: ['+91 98765 43210', [Validators.required, Validators.pattern('^\\+?[0-9\\s-]{10,15}$')]],
      email: ['aarav.sharma@example.com', [Validators.required, Validators.email]],
      employmentType: ['Salaried', Validators.required],
      monthlyIncome: [85000, [Validators.required, Validators.min(0)]],
      existingObligations: [12000, [Validators.min(0)]],
      loanType: ['Home', Validators.required],
      requestedLoanAmount: [3500000, [Validators.required, Validators.min(1)]],
      preferredTenure: ['180', Validators.required]
    });
  }

  checkQualification() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.statusMessage = 'Please correct all highlighted validation errors to check pre-qualification.';
      this.statusType = 'error';
      return;
    }

    const income = Number(this.form.value.monthlyIncome) || 0;
    const obligations = Number(this.form.value.existingObligations) || 0;
    const requested = Number(this.form.value.requestedLoanAmount) || 0;
    const dtiRatio = ((obligations + requested * 0.01) / income) * 100;

    if (dtiRatio > 70) {
      this.statusMessage = 'High Debt-to-Income ratio detected. Additional guarantor or lower loan amount recommended.';
      this.statusType = 'warning';
    } else {
      this.statusMessage = `Pre-Qualified! Borrower meets standard debt-to-income limits (${dtiRatio.toFixed(1)}% DTI).`;
      this.statusType = 'success';
    }
  }

  continueToApplication() {
    if (this.form.valid) {
      this.loanService.createLoanApplication({
        customerId: Number(this.form.value.customerId),
        customerName: this.form.value.fullName,
        loanType: this.form.value.loanType,
        loanAmount: Number(this.form.value.requestedLoanAmount),
        tenureMonths: Number(this.form.value.preferredTenure),
        interestRate: 8.5,
        purpose: 'Pre-qualified loan application',
        applicationStatus: 'Pending'
      }).subscribe(() => {
        this.router.navigateByUrl('/loan-origination/loan-application');
      });
    } else {
      this.form.markAllAsTouched();
      this.statusMessage = 'Complete all required fields before proceeding to Application.';
      this.statusType = 'error';
    }
  }

  reset() {
    this.form.reset();
    this.statusMessage = 'Form reset. Enter borrower details to begin evaluation.';
    this.statusType = 'info';
  }
}

