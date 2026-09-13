import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { LoanType, PreQualificationData } from '../../models/application.model';

@Component({
  selector: 'app-pre-qualification-page',
  standalone: false,
  templateUrl: './pre-qualification-page.component.html',
  styleUrls: ['./pre-qualification-page.component.scss']
})
export class PreQualificationPageComponent {
  form: FormGroup;
  isEvaluated = false;
  isEligible = false;
  statusMessage = '';
  statusType: 'success' | 'warning' | 'error' | 'info' = 'info';

  // Calculated metrics
  maxEligibleAmount = 0;
  estimatedEmi = 0;
  estimatedRate = 8.5;
  dtiRatio = 0;
  rejectionReason = '';

  loanTypes: { label: string; value: LoanType }[] = [
    { label: 'Home Loan', value: 'Home' },
    { label: 'Personal Loan', value: 'Personal' },
    { label: 'Vehicle Loan', value: 'Vehicle' },
    { label: 'Education Loan', value: 'Education' },
    { label: 'Gold Loan', value: 'Gold' },
    { label: 'Other', value: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mockData: MockDataService
  ) {
    this.form = this.fb.group({
      customerId: [101, [Validators.required, Validators.min(1)]],
      fullName: ['Aarav Sharma', Validators.required],
      mobile: ['+91 98765 43210', [Validators.required, Validators.pattern('^\\+?[0-9\\s\\-]{10,15}$')]],
      email: ['aarav.sharma@example.com', [Validators.required, Validators.email]],
      loanType: ['Home', Validators.required],
      employmentType: ['Salaried', Validators.required],
      creditScore: [760, [Validators.required, Validators.min(300), Validators.max(900)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  checkQualification() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.isEvaluated = true;
      this.isEligible = false;
      this.statusType = 'error';
      this.statusMessage = 'Please complete all mandatory parameters with valid values.';
      this.rejectionReason = 'Form contains missing or invalid inputs.';
      return;
    }

    const val = this.form.value;
    const score = Number(val.creditScore) || 600;
    const type = val.loanType as LoanType;

    // Estimated Interest rate based on credit score & type
    if (score >= 780) this.estimatedRate = type === 'Home' ? 7.25 : 8.00;
    else if (score >= 720) this.estimatedRate = type === 'Home' ? 7.75 : 8.75;
    else if (score >= 650) this.estimatedRate = type === 'Home' ? 8.50 : 9.75;
    else this.estimatedRate = 12.00;

    // Eligibility Rules
    const isCreditSufficient = score >= 650;

    this.isEvaluated = true;

    if (isCreditSufficient) {
      this.isEligible = true;
      this.statusType = 'success';
      this.statusMessage = 'Borrower pre-qualified successfully! Credit score and profile meet underwriting thresholds.';
      this.rejectionReason = '';
    } else {
      this.isEligible = false;
      this.statusType = 'error';
      this.statusMessage = 'Pre-Qualification declined: Applicant parameters do not meet minimum eligibility criteria.';
      this.rejectionReason = `Credit score (${score}) is below the required 650 minimum score threshold.`;
    }
  }

  proceedToNewApplication() {
    if (!this.isEligible) return;

    const val = this.form.value;
    const preQualData: PreQualificationData = {
      customerId: val.customerId,
      fullName: val.fullName,
      mobile: val.mobile,
      email: val.email,
      loanType: val.loanType,
      employmentType: val.employmentType,
      creditScore: Number(val.creditScore),
      estimatedRate: this.estimatedRate,
      isEligible: true
    };

    // Buffer in service and navigate to step 3
    this.mockData.setPendingPreQualification(preQualData);
    this.router.navigate(['/loan-application'], {
      state: { preQualified: preQualData }
    });
  }

  reset() {
    this.form.reset({
      customerId: 101,
      fullName: '',
      mobile: '',
      email: '',
      loanType: 'Home',
      employmentType: 'Salaried',
      creditScore: 750
    });
    this.isEvaluated = false;
    this.isEligible = false;
    this.statusMessage = '';
    this.rejectionReason = '';
    this.statusType = 'info';
  }
}
