import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaymentInitiationService, UserAccount } from './payment-initiation.service';
import { Beneficiary } from './models/beneficiary.model';
import { Payment } from './models/payment.model';
import { FraudCheck } from './models/fraud-check.model';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

export type FlowStep = 'FORM' | 'REVIEW' | 'PROCESSING' | 'SUCCESS';

@Component({
  selector: 'app-payment-initiation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './payment-initiation.component.html',
  styleUrls: ['./payment-initiation.component.scss'],
})
export class PaymentInitiationComponent implements OnInit {
  sidebarCollapsed = false;

  currentStep: FlowStep = 'FORM';

  accounts: UserAccount[] = [];
  allBeneficiaries: Beneficiary[] = [];
  verifiedBeneficiaries: Beneficiary[] = [];
  nonVerifiedBeneficiaries: Beneficiary[] = [];

  selectedBeneficiary: Beneficiary | null = null;
  paymentForm!: FormGroup;

  isSubmitting = false;
  processingStage = '';

  // Completed result storage
  completedPayment: Payment | null = null;
  fraudCheckResult: FraudCheck | null = null;

  paymentTypes: ('Transfer' | 'Bill Payment' | 'Other')[] = [
    'Transfer',
    'Bill Payment',
    'Other',
  ];

  paymentModes: ('IMPS' | 'NEFT' | 'RTGS' | 'UPI')[] = [
    'IMPS',
    'NEFT',
    'RTGS',
    'UPI',
  ];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentInitiationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  private initForm(): void {
    this.paymentForm = this.fb.group({
      from_account_no: ['', [Validators.required]],
      beneficiary_id: ['', [Validators.required]],
      to_account_no: ['', [Validators.required]],
      amount: [
        null,
        [Validators.required, Validators.min(0.01)],
      ],
      payment_type: ['Transfer', [Validators.required]],
      payment_mode: ['IMPS', [Validators.required]],
      description: [''],
    });

    // Listen to beneficiary change to auto-populate destination account
    this.paymentForm.get('beneficiary_id')?.valueChanges.subscribe((beneficiaryId) => {
      this.onBeneficiarySelect(Number(beneficiaryId));
    });
  }

  private loadInitialData(): void {
    this.paymentService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
      if (this.accounts.length > 0) {
        this.paymentForm.patchValue({ from_account_no: this.accounts[0].account_no });
      }
    });

    this.paymentService.getBeneficiaries().subscribe((beneficiaries) => {
      this.allBeneficiaries = beneficiaries;
      this.verifiedBeneficiaries = beneficiaries.filter((b) => b.status === 'Verified');
      this.nonVerifiedBeneficiaries = beneficiaries.filter((b) => b.status !== 'Verified');
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onBeneficiarySelect(beneficiaryId: number): void {
    if (!beneficiaryId) {
      this.selectedBeneficiary = null;
      this.paymentForm.patchValue({ to_account_no: '' });
      return;
    }

    const found = this.allBeneficiaries.find((b) => b.beneficiary_id === beneficiaryId);
    if (found) {
      if (found.status !== 'Verified') {
        // Prevent selecting non-verified beneficiary
        this.selectedBeneficiary = null;
        this.paymentForm.patchValue({ beneficiary_id: '', to_account_no: '' });
        return;
      }
      this.selectedBeneficiary = found;
      this.paymentForm.patchValue({ to_account_no: found.account_no });
    }
  }

  // Navigate to Review step if valid
  goToReview(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.currentStep = 'REVIEW';
  }

  // Edit payment / back to form
  editPayment(): void {
    this.currentStep = 'FORM';
  }

  // Confirm payment and trigger processing simulation
  confirmPayment(): void {
    if (this.paymentForm.invalid) return;

    this.currentStep = 'PROCESSING';
    this.isSubmitting = true;
    this.processingStage = 'Validating Account Balance & Sanction Screening...';

    setTimeout(() => {
      this.processingStage = 'Running AI Fraud & Risk Analysis...';
    }, 600);

    setTimeout(() => {
      this.processingStage = 'Executing Interbank Settlement Protocol...';
    }, 1100);

    const formValues = this.paymentForm.value;

    const payload: Payment = {
      from_account_no: formValues.from_account_no,
      to_account_no: formValues.to_account_no,
      beneficiary_id: Number(formValues.beneficiary_id),
      amount: Number(formValues.amount),
      payment_type: formValues.payment_type,
      payment_mode: formValues.payment_mode,
      description: formValues.description ? formValues.description.trim() : undefined,
    };

    this.paymentService.initiatePayment(payload).subscribe({
      next: (res) => {
        this.completedPayment = res.payment;
        this.fraudCheckResult = res.fraudCheck;
        this.isSubmitting = false;
        this.currentStep = 'SUCCESS';
      },
      error: (err) => {
        this.isSubmitting = false;
        this.currentStep = 'FORM';
        alert('Payment processing failed. Please try again.');
      },
    });
  }

  // Reset form to make another payment
  resetForm(): void {
    this.currentStep = 'FORM';
    this.completedPayment = null;
    this.fraudCheckResult = null;
    this.selectedBeneficiary = null;
    this.paymentForm.reset({
      from_account_no: this.accounts.length > 0 ? this.accounts[0].account_no : '',
      beneficiary_id: '',
      to_account_no: '',
      amount: null,
      payment_type: 'Transfer',
      payment_mode: 'IMPS',
      description: '',
    });
  }

  // Helper getters for validation display
  get f() {
    return this.paymentForm.controls;
  }
}
