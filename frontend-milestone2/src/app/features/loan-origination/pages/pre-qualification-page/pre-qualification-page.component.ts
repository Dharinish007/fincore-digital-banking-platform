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
      dateOfBirth: ['1990-05-14', Validators.required],
      mobile: ['+91 98765 43210', [Validators.required, Validators.pattern('^\\+?[0-9\\s\\-]{10,15}$')]],
      email: ['aarav.sharma@example.com', [Validators.required, Validators.email]],
      loanType: ['Home', Validators.required],
      requestedAmount: [3000000, [Validators.required, Validators.min(25000)]],
      employmentType: ['Salaried', Validators.required],
      monthlyIncome: [125000, [Validators.required, Validators.min(10000)]],
      existingEmi: [15000, [Validators.min(0)]],
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
    const income = Number(val.monthlyIncome) || 0;
    const existing = Number(val.existingEmi) || 0;
    const requested = Number(val.requestedAmount) || 0;
    const score = Number(val.creditScore) || 600;
    const type = val.loanType as LoanType;

    // Debt-to-Income (DTI) ratio
    this.dtiRatio = Math.round((existing / income) * 100);

    // Multiplier based on loan type
    let multiplier = 50; // default
    if (type === 'Home') multiplier = 60;
    else if (type === 'Personal') multiplier = 20;
    else if (type === 'Vehicle') multiplier = 30;
    else if (type === 'Education') multiplier = 40;
    else if (type === 'Gold') multiplier = 25;

    // Max loan capacity (discounted by existing obligations)
    const capacityFactor = Math.max(0.1, (100 - this.dtiRatio) / 100);
    this.maxEligibleAmount = Math.round(income * multiplier * capacityFactor);

    // Estimated Interest rate based on credit score & type
    if (score >= 780) this.estimatedRate = type === 'Home' ? 7.25 : 8.00;
    else if (score >= 720) this.estimatedRate = type === 'Home' ? 7.75 : 8.75;
    else if (score >= 650) this.estimatedRate = type === 'Home' ? 8.50 : 9.75;
    else this.estimatedRate = 12.00;

    // Estimated EMI for a standard term (e.g. 10 years / 120 months)
    const r = this.estimatedRate / (12 * 100);
    const n = type === 'Home' ? 240 : (type === 'Personal' ? 60 : 84);
    this.estimatedEmi = Math.round((requested * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    // Eligibility Rules
    const isCreditSufficient = score >= 650;
    const isDtiAcceptable = this.dtiRatio <= 55;
    const isAmountWithinCap = requested <= this.maxEligibleAmount;

    this.isEvaluated = true;

    if (isCreditSufficient && isDtiAcceptable && isAmountWithinCap) {
      this.isEligible = true;
      this.statusType = 'success';
      this.statusMessage = 'Borrower pre-qualified successfully! Financial profile meets underwriting thresholds.';
      this.rejectionReason = '';
    } else {
      this.isEligible = false;
      this.statusType = 'error';
      this.statusMessage = 'Pre-Qualification declined: Applicant parameters do not meet minimum eligibility criteria.';
      
      const reasons: string[] = [];
      if (!isCreditSufficient) {
        reasons.push(`Credit score (${score}) is below the required 650 minimum score threshold.`);
      }
      if (!isDtiAcceptable) {
        reasons.push(`High Debt-to-Income ratio (${this.dtiRatio}%). Monthly obligations exceed 55% of monthly income.`);
      }
      if (!isAmountWithinCap) {
        reasons.push(`Requested amount (₹${requested.toLocaleString()}) exceeds the maximum eligible ceiling of ₹${this.maxEligibleAmount.toLocaleString()}.`);
      }
      this.rejectionReason = reasons.join(' ');
    }
  }

  proceedToNewApplication() {
    if (!this.isEligible) return;

    const val = this.form.value;
    const preQualData: PreQualificationData = {
      customerId: val.customerId,
      fullName: val.fullName,
      dateOfBirth: val.dateOfBirth,
      mobile: val.mobile,
      email: val.email,
      loanType: val.loanType,
      requestedAmount: Number(val.requestedAmount),
      employmentType: val.employmentType,
      monthlyIncome: Number(val.monthlyIncome),
      existingEmi: Number(val.existingEmi),
      creditScore: Number(val.creditScore),
      maxEligibleAmount: this.maxEligibleAmount,
      estimatedEmi: this.estimatedEmi,
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
      dateOfBirth: '',
      mobile: '',
      email: '',
      loanType: 'Home',
      requestedAmount: 1000000,
      employmentType: 'Salaried',
      monthlyIncome: 75000,
      existingEmi: 0,
      creditScore: 750
    });
    this.isEvaluated = false;
    this.isEligible = false;
    this.statusMessage = '';
    this.rejectionReason = '';
    this.statusType = 'info';
  }
}
