import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisbursementService } from '../../services/disbursement.service';
import { LoanDetails, DisbursementRecord } from '../../models/loan.model';

@Component({
  selector: 'app-disbursement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './disbursement.component.html',
  styleUrl: './disbursement.component.css'
})
export class DisbursementComponent implements OnInit {
  loans: LoanDetails[] = [];
  selectedLoan: LoanDetails | null = null;
  disbursements: DisbursementRecord[] = [];
  filteredDisbursements: DisbursementRecord[] = [];
  showAllHistory: boolean = false;

  disbursementForm!: FormGroup;
  newLoanForm!: FormGroup;

  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  lastDisbursementRecord: DisbursementRecord | null = null;
  isCreateModalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private disbursementService: DisbursementService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initNewLoanForm();

    this.disbursementService.getLoans().subscribe(data => {
      this.loans = data;
      if (this.selectedLoan) {
        const updated = this.loans.find(l => l.loanId === this.selectedLoan?.loanId);
        if (updated) this.selectLoan(this.selectedLoan.loanId);
      } else if (this.loans.length > 0) {
        this.selectLoan(this.loans[0].loanId);
      }
    });

    this.disbursementService.getDisbursements().subscribe(data => {
      this.disbursements = data;
      this.applyDisbursementFilter();
    });
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.disbursementForm = this.fb.group({
      loanId: ['', Validators.required],
      disbursementAmount: [0, [Validators.required, Validators.min(1)]],
      beneficiaryAccount: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{8,18}$')]],
      disbursementDate: [today, Validators.required],
      disbursementMode: ['Bank Transfer', Validators.required],
      remarks: ['Tranche disbursement release']
    });
  }

  initNewLoanForm(): void {
    this.newLoanForm = this.fb.group({
      customerName: ['', Validators.required],
      loanType: ['Home Loan', Validators.required],
      sanctionedAmount: [500000, [Validators.required, Validators.min(10000)]],
      interestRate: [9.5, [Validators.required, Validators.min(0.1), Validators.max(50)]],
      tenureMonths: [120, [Validators.required, Validators.min(6)]],
      creditScore: [760, [Validators.required, Validators.min(300), Validators.max(900)]]
    });
  }

  selectLoan(loanId: string): void {
    const loan = this.disbursementService.getLoanById(loanId);
    if (loan) {
      this.selectedLoan = loan;
      const defaultAmt = loan.remainingAmount > 0 ? Math.min(200000, loan.remainingAmount) : 0;
      
      const amtControl = this.disbursementForm.get('disbursementAmount');
      amtControl?.setValidators([Validators.required, Validators.min(1), Validators.max(loan.remainingAmount)]);
      amtControl?.updateValueAndValidity();

      this.disbursementForm.patchValue({
        loanId: loan.loanId,
        disbursementAmount: defaultAmt,
        beneficiaryAccount: 'XXXX' + Math.floor(1000 + Math.random() * 9000)
      });
      this.alertMessage = null;
      this.applyDisbursementFilter();
    }
  }

  applyDisbursementFilter(): void {
    if (this.showAllHistory || !this.selectedLoan) {
      this.filteredDisbursements = [...this.disbursements];
    } else {
      this.filteredDisbursements = this.disbursements.filter(
        d => d.loanId.toLowerCase() === this.selectedLoan?.loanId.toLowerCase()
      );
    }
  }

  toggleHistoryView(): void {
    this.showAllHistory = !this.showAllHistory;
    this.applyDisbursementFilter();
  }

  onFormLoanChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.selectLoan(target.value);
    }
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  submitNewLoan(): void {
    if (this.newLoanForm.invalid) {
      this.newLoanForm.markAllAsTouched();
      return;
    }

    const val = this.newLoanForm.value;
    const created = this.disbursementService.createLoan({
      customerName: val.customerName,
      loanType: val.loanType,
      sanctionedAmount: Number(val.sanctionedAmount),
      interestRate: Number(val.interestRate),
      tenureMonths: Number(val.tenureMonths),
      creditScore: Number(val.creditScore)
    });

    this.isCreateModalOpen = false;
    this.selectLoan(created.loanId);
    this.alertType = 'success';
    this.alertMessage = `New loan account ${created.loanId} created successfully for ${created.customerName}!`;
  }

  submitDisbursement(): void {
    if (this.disbursementForm.invalid) {
      this.disbursementForm.markAllAsTouched();
      return;
    }

    const val = this.disbursementForm.value;
    const result = this.disbursementService.processDisbursement({
      loanId: val.loanId,
      disbursementAmount: Number(val.disbursementAmount),
      beneficiaryAccount: val.beneficiaryAccount,
      disbursementDate: val.disbursementDate,
      disbursementMode: val.disbursementMode,
      remarks: val.remarks
    });

    if (result.success) {
      this.alertType = 'success';
      this.alertMessage = result.message;
      this.lastDisbursementRecord = result.record || null;
      if (this.selectedLoan) {
        this.selectLoan(this.selectedLoan.loanId);
      }
    } else {
      this.alertType = 'error';
      this.alertMessage = result.message;
    }
  }

  formatCurrency(val: number): string {
    return '₹' + (val || 0).toLocaleString('en-IN');
  }
}
