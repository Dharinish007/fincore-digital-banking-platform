import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisbursementService } from '../../services/disbursement.service';
import { LoanDetails } from '../../models/loan.model';

@Component({
  selector: 'app-loan-servicing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-servicing.component.html',
  styleUrl: './loan-servicing.component.css'
})
export class LoanServicingComponent implements OnInit {
  @Output() viewScheduleClicked = new EventEmitter<void>();

  loans: LoanDetails[] = [];
  selectedLoan: LoanDetails | null = null;

  activeModal: 'SCHEDULE' | 'PREPAY' | 'FORECLOSE' | null = null;
  prepayAmount: number = 25000;
  actionMessage: string | null = null;

  constructor(private disbursementService: DisbursementService) {}

  ngOnInit(): void {
    this.disbursementService.getLoans().subscribe(data => {
      this.loans = data;
      if (this.selectedLoan) {
        const updated = this.loans.find(l => l.loanId === this.selectedLoan?.loanId);
        if (updated) this.selectedLoan = updated;
      } else {
        const match = this.loans.find(l => l.loanId === 'HL-2024-1247');
        this.selectedLoan = match || (this.loans.length > 0 ? this.loans[0] : null);
      }
    });
  }

  selectLoan(loanId: string): void {
    const found = this.loans.find(l => l.loanId === loanId);
    if (found) {
      this.selectedLoan = found;
      this.actionMessage = null;
    }
  }

  openSchedule(): void {
    this.viewScheduleClicked.emit();
  }

  openPrepayModal(): void {
    this.activeModal = 'PREPAY';
    this.actionMessage = null;
  }

  openForecloseModal(): void {
    this.activeModal = 'FORECLOSE';
    this.actionMessage = null;
  }

  closeModal(): void {
    this.activeModal = null;
  }

  processPrepayment(): void {
    if (!this.selectedLoan) return;
    if (this.prepayAmount <= 0) return;

    const success = this.disbursementService.prepayLoan(this.selectedLoan.loanId, this.prepayAmount);
    if (success) {
      this.actionMessage = `Prepayment of ₹${this.prepayAmount.toLocaleString('en-IN')} processed successfully! Outstanding principal updated.`;
    }
    this.activeModal = null;
  }

  processForeclosure(): void {
    if (!this.selectedLoan) return;

    const success = this.disbursementService.forecloseLoan(this.selectedLoan.loanId);
    if (success) {
      this.actionMessage = `Loan ${this.selectedLoan.loanId} has been fully FORECLOSED and closed successfully.`;
    }
    this.activeModal = null;
  }

  formatCurrency(val: number): string {
    return '₹' + (val || 0).toLocaleString('en-IN');
  }
}
