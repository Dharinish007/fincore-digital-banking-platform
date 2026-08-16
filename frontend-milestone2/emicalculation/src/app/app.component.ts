import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}

/**
 * Custom Validator: Value must be greater than 0
 */
function greaterThanZeroValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null; // Handled by Validators.required
  }
  const num = Number(value);
  return !isNaN(num) && num > 0 ? null : { greaterThanZero: true };
}

/**
 * Custom Validator: Value must be 0 or greater
 */
function greaterThanOrEqualToZeroValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null; // Handled by Validators.required
  }
  const num = Number(value);
  return !isNaN(num) && num >= 0 ? null : { greaterThanOrEqualToZero: true };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EMI Calculator';
  emiForm: FormGroup;
  result: EmiResult | null = null;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.emiForm = this.fb.group({
      loanAmount: [null, [Validators.required, greaterThanZeroValidator]],
      interestRate: [null, [Validators.required, greaterThanOrEqualToZeroValidator]],
      loanTenure: [null, [Validators.required, greaterThanZeroValidator]]
    });
  }

  /**
   * Helper getters for clean template checks
   */
  get f() {
    return this.emiForm.controls;
  }

  /**
   * Standard reducing-balance EMI formula calculation:
   * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
   * If Interest Rate is 0%: EMI = P / n
   */
  calculateEmi(): void {
    this.isSubmitted = true;

    if (this.emiForm.invalid) {
      this.emiForm.markAllAsTouched();
      return;
    }

    const loanAmount = Number(this.emiForm.get('loanAmount')?.value);
    const annualInterestRate = Number(this.emiForm.get('interestRate')?.value);
    const tenureMonths = Number(this.emiForm.get('loanTenure')?.value);

    let monthlyEmi = 0;

    if (annualInterestRate === 0) {
      monthlyEmi = loanAmount / tenureMonths;
    } else {
      const monthlyRate = annualInterestRate / 12 / 100;
      const compoundFactor = Math.pow(1 + monthlyRate, tenureMonths);
      monthlyEmi = (loanAmount * monthlyRate * compoundFactor) / (compoundFactor - 1);
    }

    const totalPayment = monthlyEmi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    this.result = {
      monthlyEmi: Number(monthlyEmi.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2))
    };
  }

  /**
   * Formats numeric values to Indian Rupee currency format (e.g., ₹ 1,00,000.00)
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}
