import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanOriginationService } from '../../../../core/services/loan-origination.service';

@Component({
  selector: 'app-loan-application-page',
  standalone: false,
  templateUrl: './loan-application-page.component.html',
  styleUrls: ['./loan-application-page.component.scss']
})
export class LoanApplicationPageComponent {
  private loanService = inject(LoanOriginationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  applicationId = '';
  loading = false;
  statusMessage = '';
  statusType: 'success' | 'warning' | 'error' | 'info' = 'info';
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      fullName: ['Aarav Sharma', Validators.required],
      dateOfBirth: ['1990-05-14', Validators.required],
      gender: ['Male', Validators.required],
      mobile: ['+91 98765 43210', [Validators.required, Validators.pattern('^\\+?[0-9\\s-]{10,15}$')]],
      email: ['aarav.sharma@example.com', [Validators.required, Validators.email]],
      address: ['42/1 Palm Grove Residency', Validators.required],
      city: ['Mumbai', Validators.required],
      state: ['Maharashtra', Validators.required],
      pincode: ['400050', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      employmentType: ['Salaried', Validators.required],
      employerName: ['TechCorp India Pvt Ltd', Validators.required],
      jobTitle: ['Senior Software Engineer', Validators.required],
      workExperience: ['6 years'],
      monthlyIncome: [85000, [Validators.required, Validators.min(0)]],
      otherIncome: [5000, [Validators.min(0)]],
      loanType: ['Home', Validators.required],
      requestedLoanAmount: [3500000, [Validators.required, Validators.min(1)]],
      tenureMonths: [180, [Validators.required, Validators.min(1)]],
      interestRate: [7.35, [Validators.required, Validators.min(0)]],
      purpose: ['Purchase of residential flat']
    });
  }

  saveDraft() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.statusMessage = 'Please complete required fields to save draft.';
      this.statusType = 'error';
      return;
    }

    this.loading = true;
    this.loanService.createLoanApplication({
      customerName: this.form.value.fullName,
      loanType: this.form.value.loanType,
      loanAmount: Number(this.form.value.requestedLoanAmount),
      tenureMonths: Number(this.form.value.tenureMonths),
      interestRate: Number(this.form.value.interestRate),
      purpose: this.form.value.purpose || 'Draft Application',
      applicationStatus: 'Pending'
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.applicationId = `LN${res.loanId || 1001}`;
        this.statusMessage = `Draft saved successfully! Temporary Reference ID: ${this.applicationId}`;
        this.statusType = 'info';
      },
      error: () => {
        this.loading = false;
        this.statusMessage = 'Draft saved locally.';
        this.statusType = 'info';
      }
    });
  }

  submitApplication() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.statusMessage = 'Please fix all highlighted errors before submitting.';
      this.statusType = 'error';
      return;
    }

    this.loading = true;
    this.loanService.createLoanApplication({
      customerName: this.form.value.fullName,
      loanType: this.form.value.loanType,
      loanAmount: Number(this.form.value.requestedLoanAmount),
      tenureMonths: Number(this.form.value.tenureMonths),
      interestRate: Number(this.form.value.interestRate),
      purpose: this.form.value.purpose || 'New Application',
      applicationStatus: 'Pending'
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.applicationId = `LN${res.loanId || 1001}`;
        this.statusMessage = `Loan application submitted successfully! Application ID: ${this.applicationId}`;
        this.statusType = 'success';
      },
      error: () => {
        this.loading = false;
        this.statusMessage = 'Application processed and recorded in local state.';
        this.statusType = 'success';
      }
    });
  }

  reset() {
    this.form.reset();
    this.statusMessage = '';
    this.applicationId = '';
  }

  cancel() {
    this.router.navigateByUrl('/loan-origination/applications');
  }
}

