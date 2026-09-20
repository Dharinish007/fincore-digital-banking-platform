import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CardContainerComponent } from '../../../../shared/components/card-container/card-container.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { LoanProductCardComponent } from '../../components/loan-product-card/loan-product-card.component';
import { LoanService } from '../../services/loan.service';
import { AccountService } from '../../../account/services/account.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LoanProduct, LoanApplicationRequest, LoanApplication } from '../../models/loan.models';
import { AccountSummary, AccountStatus, AccountFilter } from '../../../account/models/account.model';

@Component({
  selector: 'app-loan-apply',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    CardContainerComponent,
    LoadingSpinnerComponent,
    LoanProductCardComponent
  ],
  templateUrl: './loan-apply.component.html',
  styleUrl: './loan-apply.component.scss'
})
export class LoanApplyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loanService = inject(LoanService);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  currentStep = signal<number>(1);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);

  products = signal<LoanProduct[]>([]);
  accounts = signal<AccountSummary[]>([]);
  selectedProduct = signal<LoanProduct | null>(null);
  submittedApplication = signal<LoanApplication | null>(null);

  form!: FormGroup;

  // Real-time EMI projection
  projectedEmi = computed(() => {
    const product = this.selectedProduct();
    if (!product) return 0;

    const p = this.form?.get('requestedAmount')?.value || product.minAmount;
    const r = product.interestRate / 12 / 100;
    const n = this.form?.get('requestedTenureMonths')?.value || product.minTenureMonths;

    if (r === 0) return p / n;
    const pow = Math.pow(1 + r, n);
    return (p * r * pow) / (pow - 1);
  });

  totalPayable = computed(() => {
    const tenure = this.form?.get('requestedTenureMonths')?.value || 12;
    return this.projectedEmi() * tenure;
  });

  totalInterest = computed(() => {
    const amount = this.form?.get('requestedAmount')?.value || 0;
    return Math.max(0, this.totalPayable() - amount);
  });

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  private initForm(): void {
    this.form = this.fb.group({
      requestedAmount: [5000, [Validators.required, Validators.min(100)]],
      requestedTenureMonths: [12, [Validators.required, Validators.min(1)]],
      accountNumber: ['', Validators.required],
      monthlyIncome: [4500, [Validators.required, Validators.min(1)]],
      monthlyExpenses: [1500, [Validators.required, Validators.min(0)]],
      purpose: ['Debt Consolidation', Validators.required],
      remarks: ['']
    });
  }

  private loadInitialData(): void {
    this.isLoading.set(true);

    // Fetch active products
    this.loanService.getLoanProducts('ACTIVE').subscribe({
      next: (prods) => {
        this.products.set(prods || []);
        if (prods && prods.length > 0) {
          this.onSelectProduct(prods[0]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading loan products:', err);
        this.notificationService.error('Failed to load available loan products.');
        this.isLoading.set(false);
      }
    });

    // Fetch authenticated customer active bank accounts for disbursement
    const currentUser = this.authService.getCurrentUser();
    const customerId = currentUser?.customerId;

    const filter: AccountFilter = {
      status: AccountStatus.ACTIVE
    };
    if (customerId !== undefined && customerId !== null) {
      filter.customerId = customerId;
    }

    this.accountService.getAccounts(filter).subscribe({
      next: (accs) => {
        // Enforce client-side check if customerId is present to only retain owned & active accounts
        const filtered = (accs || []).filter(a => {
          const matchesCustomer = customerId ? String(a.customerId) === String(customerId) : true;
          const isActive = !a.status || a.status === AccountStatus.ACTIVE;
          return matchesCustomer && isActive;
        });

        this.accounts.set(filtered);
        if (filtered.length > 0) {
          this.form.patchValue({ accountNumber: filtered[0].accountNumber });
        } else {
          this.form.patchValue({ accountNumber: '' });
        }
      },
      error: (err) => {
        console.warn('Could not load bank accounts:', err);
        this.accounts.set([]);
        this.form.patchValue({ accountNumber: '' });
      }
    });
  }

  onSelectProduct(product: LoanProduct): void {
    this.selectedProduct.set(product);
    this.form.get('requestedAmount')?.setValidators([
      Validators.required,
      Validators.min(product.minAmount),
      Validators.max(product.maxAmount)
    ]);
    this.form.get('requestedTenureMonths')?.setValidators([
      Validators.required,
      Validators.min(product.minTenureMonths),
      Validators.max(product.maxTenureMonths)
    ]);

    // Adjust default values to fall within boundary
    const currAmt = this.form.get('requestedAmount')?.value;
    if (!currAmt || currAmt < product.minAmount || currAmt > product.maxAmount) {
      this.form.patchValue({ requestedAmount: product.minAmount });
    }

    const currTenure = this.form.get('requestedTenureMonths')?.value;
    if (!currTenure || currTenure < product.minTenureMonths || currTenure > product.maxTenureMonths) {
      this.form.patchValue({ requestedTenureMonths: product.minTenureMonths });
    }

    this.form.get('requestedAmount')?.updateValueAndValidity();
    this.form.get('requestedTenureMonths')?.updateValueAndValidity();
  }

  goToStep(step: number): void {
    if (step > this.currentStep()) {
      if (this.currentStep() === 1 && !this.selectedProduct()) {
        this.notificationService.warning('Please select a loan product to proceed.');
        return;
      }
      if (this.currentStep() === 2 && (this.form.get('requestedAmount')?.invalid || this.form.get('requestedTenureMonths')?.invalid || this.form.get('accountNumber')?.invalid)) {
        this.form.get('requestedAmount')?.markAsTouched();
        this.form.get('requestedTenureMonths')?.markAsTouched();
        this.form.get('accountNumber')?.markAsTouched();
        this.notificationService.warning('Please complete all loan and account details.');
        return;
      }
      if (this.currentStep() === 3 && (this.form.get('monthlyIncome')?.invalid || this.form.get('purpose')?.invalid)) {
        this.form.get('monthlyIncome')?.markAsTouched();
        this.form.get('purpose')?.markAsTouched();
        this.notificationService.warning('Please complete income and purpose information.');
        return;
      }
    }
    this.currentStep.set(step);
  }

  submitApplication(): void {
    if (this.form.invalid || !this.selectedProduct()) {
      this.form.markAllAsTouched();
      this.notificationService.warning('Please resolve all validation errors before submitting.');
      return;
    }

    this.isSubmitting.set(true);
    const formVals = this.form.getRawValue();

    // Resolve customer identity purely from authenticated session context
    const currentUser = this.authService.getCurrentUser();
    const customerId = currentUser?.customerId ? Number(currentUser.customerId) : undefined;

    const requestPayload: LoanApplicationRequest = {
      customerId: customerId,
      accountNumber: formVals.accountNumber,
      loanProductId: this.selectedProduct()!.id,
      requestedAmount: Number(formVals.requestedAmount),
      requestedTenureMonths: Number(formVals.requestedTenureMonths),
      monthlyIncome: Number(formVals.monthlyIncome),
      monthlyExpenses: Number(formVals.monthlyExpenses),
      purpose: formVals.purpose,
      remarks: formVals.remarks || undefined
    };

    this.loanService.submitApplication(requestPayload).subscribe({
      next: (application) => {
        this.isSubmitting.set(false);
        this.submittedApplication.set(application);
        this.currentStep.set(5); // Success step
        this.notificationService.success('Loan application submitted successfully!');
      },
      error: (err) => {
        console.error('Failed to submit loan application:', err);
        this.isSubmitting.set(false);
        const errMsg = err?.error?.message || 'Failed to submit loan application. Please verify details and try again.';
        this.notificationService.error(errMsg);
      }
    });
  }

  viewApplicationDetails(): void {
    const app = this.submittedApplication();
    if (app) {
      this.router.navigate(['/loan/application', app.id]);
    } else {
      this.router.navigate(['/loan']);
    }
  }

  cancel(): void {
    this.router.navigate(['/loan']);
  }
}
