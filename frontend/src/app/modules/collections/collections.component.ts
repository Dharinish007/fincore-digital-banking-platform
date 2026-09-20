import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from '../../services/collection.service';
import { DisbursementService } from '../../services/disbursement.service';
import { CollectionDashboardMetrics, PaymentRecord, LoanDetails } from '../../models/loan.model';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit {
  metrics!: CollectionDashboardMetrics;
  loans: LoanDetails[] = [];
  selectedLoan: LoanDetails | null = null;
  paymentHistory: PaymentRecord[] = [];
  filteredHistory: PaymentRecord[] = [];
  showAllPaymentHistory: boolean = false;
  
  paymentForm!: FormGroup;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';

  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private disbursementService: DisbursementService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.refreshMetrics();

    this.disbursementService.getLoans().subscribe(data => {
      this.loans = data;
      if (this.selectedLoan) {
        const updated = this.loans.find(l => l.loanId === this.selectedLoan?.loanId);
        if (updated) this.selectLoan(this.selectedLoan.loanId);
      } else if (this.loans.length > 0) {
        this.selectLoan(this.loans[0].loanId);
      }
      this.refreshMetrics();
    });

    this.collectionService.getPaymentHistory().subscribe(data => {
      this.paymentHistory = data;
      this.applyFilter();
      this.refreshMetrics();
    });
  }

  refreshMetrics(): void {
    this.metrics = this.collectionService.getDashboardMetrics();
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.paymentForm = this.fb.group({
      loanId: ['', Validators.required],
      customerId: [''],
      paymentAmount: [0, [Validators.required, Validators.min(1)]],
      paymentDate: [today, Validators.required],
      paymentMode: ['UPI', Validators.required],
      referenceNumber: ['', [Validators.required, Validators.minLength(4)]],
      remarks: ['Monthly EMI Payment']
    });
  }

  selectLoan(loanId: string): void {
    const loan = this.disbursementService.getLoanById(loanId);
    if (loan) {
      this.selectedLoan = loan;
      const autoRef = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
      this.paymentForm.patchValue({
        loanId: loan.loanId,
        customerId: loan.customerName,
        paymentAmount: loan.monthlyEmi,
        referenceNumber: autoRef
      });
      this.alertMessage = null;
      this.applyFilter();
    }
  }

  onFormLoanChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.selectLoan(target.value);
    }
  }

  recordPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const val = this.paymentForm.value;
    const result = this.collectionService.recordPayment({
      loanId: val.loanId,
      customerId: val.customerId,
      paymentAmount: Number(val.paymentAmount),
      paymentDate: val.paymentDate,
      paymentMode: val.paymentMode,
      referenceNumber: val.referenceNumber,
      remarks: val.remarks
    });

    if (result.success) {
      this.alertType = 'success';
      this.alertMessage = result.message;
      this.refreshMetrics();

      if (this.selectedLoan) {
        this.selectLoan(this.selectedLoan.loanId);
      }

      // Reset auto reference for next payment
      const nextRef = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
      this.paymentForm.patchValue({ referenceNumber: nextRef });
    } else {
      this.alertType = 'error';
      this.alertMessage = result.message;
    }
  }

  applyFilter(): void {
    let records = [...this.paymentHistory];
    if (this.selectedLoan && !this.showAllPaymentHistory) {
      records = records.filter(p => p.loanId.toLowerCase() === this.selectedLoan?.loanId.toLowerCase());
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      records = records.filter(
        p => p.loanId.toLowerCase().includes(term) ||
             p.customerName.toLowerCase().includes(term) ||
             p.referenceNumber.toLowerCase().includes(term) ||
             p.paymentMode.toLowerCase().includes(term)
      );
    }
    this.filteredHistory = records;
  }

  togglePaymentHistoryView(): void {
    this.showAllPaymentHistory = !this.showAllPaymentHistory;
    this.applyFilter();
  }

  formatCurrency(val: number): string {
    return '₹' + (val || 0).toLocaleString('en-IN');
  }
}
