import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AccountService, OpenedAccount, OpenedAccountType } from '../../../../core/services/account.service';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss']
})
export class NewAccountComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);

  public sidebarCollapsed = false;

  public form: FormGroup;
  public selectedAccountType: OpenedAccountType | '' = '';
  public submitting = false;
  public submitted = false;
  public createdAccount: OpenedAccount | null = null;
  public serverError = '';

  public branches = [
    'Main Branch - Downtown',
    'North Avenue Branch',
    'Westside Metro',
    'East Commerce',
    'Global Treasury'
  ];

  public accountTypeOptions: { type: OpenedAccountType; icon: string; desc: string; minDeposit: number }[] = [
    { type: 'Savings', icon: 'savings', desc: 'Everyday banking, earns interest', minDeposit: 500 },
    { type: 'Checking', icon: 'account_balance_wallet', desc: 'High transaction volume, no interest', minDeposit: 100 },
    { type: 'Corporate', icon: 'apartment', desc: 'Business accounts, bulk processing', minDeposit: 5000 },
    { type: 'Fixed Deposit', icon: 'lock_clock', desc: 'Locked term, higher fixed returns', minDeposit: 10000 },
    { type: 'Money Market', icon: 'trending_up', desc: 'Tiered interest, limited withdrawals', minDeposit: 2500 }
  ];

  constructor() {
    this.form = this.fb.group({
      fullname: ['', [Validators.required, CustomValidators.name()]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, CustomValidators.mobile()]],
      dob: ['', [Validators.required, CustomValidators.dateOfBirth()]],
      pan: ['', [Validators.required, CustomValidators.pan()]],
      aadhaar: ['', [Validators.required, CustomValidators.aadhaar()]],
      address: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      income: ['', [Validators.required, CustomValidators.income()]],
      nomineeName: ['', [Validators.required, CustomValidators.name(), CustomValidators.nomineeNotSelf('fullname')]],
      nomineeRelation: ['', [Validators.required]],
      branch: ['', [Validators.required]],
      accountType: ['', [Validators.required]],
      initialDeposit: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required, CustomValidators.passwordsMatch('password')]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  fieldError(name: string): string | null {
    const c = this.form.get(name);
    if (!c || !c.touched || c.valid) return null;

    if (c.errors?.['required']) return this.requiredMessage(name);
    if (c.errors?.['email']) return 'Enter a valid email address.';
    if (c.errors?.['invalidName']) return 'Enter a valid name (letters and spaces only).';
    if (c.errors?.['invalidMobile']) return 'Enter a valid 10-digit mobile number.';
    if (c.errors?.['unrealisticMobile']) return 'Enter a real mobile number.';
    if (c.errors?.['invalidPan']) return 'PAN format should be like ABCDE1234F.';
    if (c.errors?.['invalidAadhaar']) return 'Aadhaar must be exactly 12 digits.';
    if (c.errors?.['unrealisticAadhaar']) return 'Enter a real Aadhaar number.';
    if (c.errors?.['invalidDate']) return 'Enter a valid date of birth.';
    if (c.errors?.['futureDate']) return 'Date of birth cannot be in the future.';
    if (c.errors?.['tooYoung']) return 'Customer must be at least 18 years old to open an account.';
    if (c.errors?.['invalidIncome']) return 'Enter a valid numeric income.';
    if (c.errors?.['tooLowIncome']) return 'Annual income must be greater than zero.';
    if (c.errors?.['tooHighIncome']) return 'Enter a realistic annual income.';
    if (c.errors?.['sameAsHolder']) return 'Nominee cannot be the same as the account holder.';
    if (c.errors?.['invalidDeposit']) return 'Enter a valid deposit amount.';
    if (c.errors?.['tooLowDeposit']) return `Minimum opening deposit for this account type is $${c.errors['tooLowDeposit'].min.toLocaleString()}.`;
    if (c.errors?.['minlength']) return 'Password must be at least 8 characters.';
    if (c.errors?.['passwordMismatch']) return 'Passwords do not match.';
    if (c.errors?.['requiredTrue']) return 'You must agree to the Terms & Conditions.';
    return 'This field is invalid.';
  }

  private requiredMessage(name: string): string {
    const labels: { [k: string]: string } = {
      fullname: 'Full name is required.',
      email: 'Email address is required.',
      mobile: 'Mobile number is required.',
      dob: 'Date of birth is required.',
      pan: 'PAN number is required.',
      aadhaar: 'Aadhaar number is required.',
      address: 'Residential address is required.',
      occupation: 'Occupation is required.',
      income: 'Annual income is required.',
      nomineeName: 'Nominee name is required.',
      nomineeRelation: 'Relationship with nominee is required.',
      branch: 'Home branch is required.',
      accountType: 'Select an account type.',
      initialDeposit: 'Opening deposit amount is required.',
      password: 'Password is required.',
      confirm: 'Please confirm your password.',
      terms: 'You must agree to the Terms & Conditions.'
    };
    return labels[name] || 'This field is required.';
  }

  selectAccountType(type: OpenedAccountType): void {
    this.selectedAccountType = type;
    this.form.get('accountType')?.setValue(type);
    this.form.get('accountType')?.markAsTouched();

    const option = this.accountTypeOptions.find(o => o.type === type);
    const depositControl = this.form.get('initialDeposit');
    depositControl?.setValidators([Validators.required, CustomValidators.deposit(option?.minDeposit ?? 0)]);
    depositControl?.updateValueAndValidity();
  }

  fillSampleData(): void {
    this.form.setValue({
      fullname: 'Aditi Verma',
      email: 'aditi.verma@example.com',
      mobile: '9876543210',
      dob: new Date(1994, 5, 18),
      pan: 'ABCDE1234F',
      aadhaar: '123456789012',
      address: '204, Silver Oak Residency, Baner, Pune, Maharashtra, 411045',
      occupation: 'Salaried',
      income: '600000',
      nomineeName: 'Rohan Verma',
      nomineeRelation: 'Spouse',
      branch: 'Main Branch - Downtown',
      accountType: 'Savings',
      initialDeposit: '1000',
      password: 'Passw0rd!',
      confirm: 'Passw0rd!',
      terms: true
    });
    this.selectedAccountType = 'Savings';
    Object.values(this.form.controls).forEach((c) => c.markAsTouched());
  }

  clearForm(): void {
    this.resetAll();
  }

  private resetAll(): void {
    this.form.reset({
      fullname: '', email: '', mobile: '', dob: '', pan: '', aadhaar: '', address: '',
      occupation: '', income: '', nomineeName: '', nomineeRelation: '', branch: '',
      accountType: '', initialDeposit: '', password: '', confirm: '', terms: false
    });
    this.selectedAccountType = '';
    this.submitting = false;
    this.submitted = false;
    this.createdAccount = null;
    this.serverError = '';
  }

  onSubmit(): void {
    this.serverError = '';
    Object.values(this.form.controls).forEach((c) => c.markAsTouched());
    if (this.form.invalid) return;

    this.submitting = true;
    const v = this.form.value;

    const dobValue: string = v.dob instanceof Date
      ? v.dob.toISOString().slice(0, 10)
      : v.dob;

    this.accountService
      .create({
        fullname: v.fullname,
        email: v.email,
        mobile: v.mobile,
        dob: dobValue,
        pan: v.pan,
        aadhaar: v.aadhaar,
        address: v.address,
        occupation: v.occupation,
        income: Number(v.income),
        nomineeName: v.nomineeName,
        nomineeRelation: v.nomineeRelation,
        branch: v.branch,
        accountType: v.accountType,
        initialDeposit: Number(v.initialDeposit),
        password: v.password,
        confirm: v.confirm,
        terms: v.terms
      })
      .subscribe({
        next: (account) => {
          this.submitting = false;
          this.submitted = true;
          this.createdAccount = account;
        },
        error: () => {
          this.submitting = false;
          this.serverError = 'Something went wrong while opening the account. Please try again.';
        }
      });
  }

  createAnother(): void {
    this.resetAll();
  }

  backToDashboard(): void {
    this.resetAll();
    this.router.navigate(['/']);
  }

  cancel(): void {
    this.resetAll();
    this.router.navigate(['/']);
  }
}
