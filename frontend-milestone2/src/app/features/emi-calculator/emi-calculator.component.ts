import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmiService } from '../../core/services/emi.service';

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}

function greaterThanZeroValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  return !isNaN(num) && num > 0 ? null : { greaterThanZero: true };
}

function greaterThanOrEqualToZeroValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  return !isNaN(num) && num >= 0 ? null : { greaterThanOrEqualToZero: true };
}

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss']
})
export class EmiCalculatorComponent {
  private emiService = inject(EmiService);
  private fb = inject(FormBuilder);

  title = 'EMI Calculator';
  emiForm: FormGroup;
  result: EmiResult | null = null;
  isSubmitted = false;

  constructor() {
    this.emiForm = this.fb.group({
      loanAmount: [null, [Validators.required, greaterThanZeroValidator]],
      interestRate: [null, [Validators.required, greaterThanOrEqualToZeroValidator]],
      loanTenure: [null, [Validators.required, greaterThanZeroValidator]]
    });
  }

  get f() {
    return this.emiForm.controls;
  }

  calculateEmi(): void {
    this.isSubmitted = true;

    if (this.emiForm.invalid) {
      this.emiForm.markAllAsTouched();
      return;
    }

    const loanAmount = Number(this.emiForm.get('loanAmount')?.value);
    const interestRate = Number(this.emiForm.get('interestRate')?.value);
    const tenureMonths = Number(this.emiForm.get('loanTenure')?.value);

    this.emiService.calculateEMI({
      principalAmount: loanAmount,
      interestRate,
      tenureMonths
    }).subscribe((res) => {
      this.result = {
        monthlyEmi: res.monthlyEMI,
        totalInterest: res.totalInterest,
        totalPayment: res.totalPayment
      };
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}

