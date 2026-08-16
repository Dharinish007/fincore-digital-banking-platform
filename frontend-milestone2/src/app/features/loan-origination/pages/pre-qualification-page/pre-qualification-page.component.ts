import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pre-qualification-page',
  standalone: false,
  templateUrl: './pre-qualification-page.component.html',
  styleUrls: ['./pre-qualification-page.component.scss']
})
export class PreQualificationPageComponent {
  statusMessage = 'Ready to verify qualification status.';
  statusType: 'success' | 'warning' | 'error' | 'info' = 'info';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      customerId: ['C-84729', Validators.required],
      fullName: ['Aarav Sharma', Validators.required],
      dateOfBirth: ['1990-05-14', Validators.required],
      mobile: ['+91 98765 43210', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]],
      email: ['aarav.sharma@example.com', [Validators.required, Validators.email]],
      employmentType: ['Salaried', Validators.required],
      monthlyIncome: [85000, [Validators.required, Validators.min(0)]],
      existingObligations: [12000, [Validators.required, Validators.min(0)]],
      loanType: ['Home Loan', Validators.required],
      requestedLoanAmount: [4500000, [Validators.required, Validators.min(1)]],
      preferredTenure: ['15 years', Validators.required]
    });
  }

  checkQualification() {
    if (this.form.valid) {
      this.statusMessage = 'Pre-qualified: Customer information looks strong for a first review.';
      this.statusType = 'success';
    } else {
      this.statusMessage = 'Please complete all required fields to determine pre-qualification.';
      this.statusType = 'error';
    }
  }

  continue() {
    this.statusMessage = 'Continue to Loan Application when ready.';
    this.statusType = 'info';
  }

  reset() {
    this.form.reset();
    this.statusMessage = 'Form reset. Enter borrower details to begin.';
    this.statusType = 'info';
  }
}
