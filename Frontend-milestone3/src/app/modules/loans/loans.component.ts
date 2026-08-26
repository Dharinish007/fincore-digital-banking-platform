import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LoanDetail {
  id: string;
  type: string;
  principal: number; // in Rupees
  customerName: string;
  creditScore: number;
  approvalStatus: string;
  emi: number; // in Rupees
  tenureMonths: number;
  interestRate: number;
  disbursementChannel: string;
  sagaFlow: string;
  installmentsTotal: number;
  autoDebit: boolean;
  status: string;
  nextEmiDate: string;
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css'
})
export class LoansComponent {
  Math = Math;

  loansList: LoanDetail[] = [
    {
      id: 'HL-2024-1247',
      type: 'Home Loan',
      principal: 2400000, // ₹24,00,000
      customerName: 'John Smith',
      creditScore: 782,
      approvalStatus: 'Approved',
      emi: 18470, // ₹18,470
      tenureMonths: 240,
      interestRate: 8.5,
      disbursementChannel: 'NEFT / RTGS (Kafka Event)',
      sagaFlow: 'Account→Loan→Payment',
      installmentsTotal: 240,
      autoDebit: true,
      status: 'Active',
      nextEmiDate: '05-Sep-2026'
    },
    {
      id: 'CL-2025-8831',
      type: 'Car Loan',
      principal: 850000, // ₹8,50,000
      customerName: 'Ananya Verma',
      creditScore: 745,
      approvalStatus: 'Approved',
      emi: 15200, // ₹15,200
      tenureMonths: 60,
      interestRate: 9.2,
      disbursementChannel: 'IMPS Direct Transfer',
      sagaFlow: 'Account→AutoLoan→Disbursement',
      installmentsTotal: 60,
      autoDebit: true,
      status: 'Active',
      nextEmiDate: '10-Sep-2026'
    },
    {
      id: 'BL-2026-9042',
      type: 'Business Expansion Loan',
      principal: 5000000, // ₹50,00,000
      customerName: 'TechCorp Solutions',
      creditScore: 815,
      approvalStatus: 'Approved',
      emi: 98500, // ₹98,500
      tenureMonths: 72,
      interestRate: 10.5,
      disbursementChannel: 'RTGS Interbank',
      sagaFlow: 'CorpAccount→SagaHold→EscrowDisburse',
      installmentsTotal: 72,
      autoDebit: true,
      status: 'Active',
      nextEmiDate: '15-Sep-2026'
    },
    {
      id: 'PL-2026-1102',
      type: 'Personal Loan',
      principal: 300000, // ₹3,00,000
      customerName: 'Rahul Deshmukh',
      creditScore: 690,
      approvalStatus: 'Under Review',
      emi: 9100, // ₹9,100
      tenureMonths: 36,
      interestRate: 12.0,
      disbursementChannel: 'Pending Disbursal',
      sagaFlow: 'CreditCheck→Underwriting→Pending',
      installmentsTotal: 36,
      autoDebit: false,
      status: 'Pending',
      nextEmiDate: 'N/A'
    }
  ];

  loan: LoanDetail = { ...this.loansList[0] };

  // Filter state
  searchTerm: string = '';
  statusFilter: string = 'ALL';

  // Modals & Forms State
  showScheduleModal = false;
  showPrepayModal = false;
  showForecloseModal = false;
  showNewLoanModal = false;
  prepayAmount = 100000;

  // New Loan Form Model
  newCustomerName = '';
  newLoanType = 'Home Loan';
  newPrincipal = 1500000;
  newTenureMonths = 120;
  newInterestRate = 8.75;
  calculatedEmi = 18790;

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  scheduleData = Array.from({ length: 12 }, (_, i) => ({
    installmentNo: i + 1,
    dueDate: new Date(2026, 8 + i, 5).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    amount: 18470,
    principalComponent: 4500 + i * 50,
    interestComponent: 13970 - i * 50,
    status: i === 0 ? 'Upcoming' : 'Scheduled'
  }));

  get filteredLoans(): LoanDetail[] {
    return this.loansList.filter(l => {
      const matchesSearch = l.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            l.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            l.type.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'ALL' || l.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get totalDisbursedYtd(): number {
    return this.loansList.reduce((sum, l) => sum + l.principal, 240000000); // ₹24 Cr portfolio base
  }

  selectLoan(selected: LoanDetail): void {
    this.loan = selected;
    // Re-generate schedule dynamically for selected loan EMI
    this.scheduleData = Array.from({ length: 12 }, (_, i) => ({
      installmentNo: i + 1,
      dueDate: new Date(2026, 8 + i, 5).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: selected.emi,
      principalComponent: Math.round(selected.emi * 0.35 + i * 40),
      interestComponent: Math.round(selected.emi * 0.65 - i * 40),
      status: i === 0 ? 'Upcoming' : 'Scheduled'
    }));
  }

  onViewSchedule(): void {
    this.showScheduleModal = true;
  }

  onPrepay(): void {
    this.showPrepayModal = true;
  }

  onForeclose(): void {
    this.showForecloseModal = true;
  }

  openNewLoanModal(): void {
    this.showNewLoanModal = true;
    this.updateCalculatedEmi();
  }

  closeModals(): void {
    this.showScheduleModal = false;
    this.showPrepayModal = false;
    this.showForecloseModal = false;
    this.showNewLoanModal = false;
  }

  updateCalculatedEmi(): void {
    const r = this.newInterestRate / 12 / 100;
    const n = this.newTenureMonths;
    if (r > 0 && n > 0) {
      const emiVal = (this.newPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      this.calculatedEmi = Math.round(emiVal);
    }
  }

  submitPrepayment(): void {
    if (this.prepayAmount <= 0) {
      this.showToast('Please enter a valid prepayment amount.', 'danger');
      return;
    }
    this.loan.principal = Math.max(0, this.loan.principal - this.prepayAmount);
    this.showToast(`Prepayment of ₹${this.prepayAmount.toLocaleString('en-IN')} applied for Loan ${this.loan.id}. Remaining Principal: ₹${this.loan.principal.toLocaleString('en-IN')}.`, 'success');
    this.closeModals();
  }

  confirmForeclosure(): void {
    this.loan.status = 'Foreclosed & Closed';
    const found = this.loansList.find(l => l.id === this.loan.id);
    if (found) {
      found.status = 'Closed';
    }
    this.showToast(`Foreclosure confirmed for Loan ${this.loan.id}. Account closed & payoff zeroed.`, 'danger');
    this.closeModals();
  }

  submitNewLoanApplication(): void {
    if (!this.newCustomerName) {
      this.showToast('Please enter applicant customer name.', 'danger');
      return;
    }

    const newId = `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLoanObj: LoanDetail = {
      id: newId,
      type: this.newLoanType,
      principal: this.newPrincipal,
      customerName: this.newCustomerName,
      creditScore: Math.floor(680 + Math.random() * 120),
      approvalStatus: 'Approved',
      emi: this.calculatedEmi,
      tenureMonths: this.newTenureMonths,
      interestRate: this.newInterestRate,
      disbursementChannel: 'Kafka Saga Disbursement',
      sagaFlow: 'Account→Loan→Disbursement',
      installmentsTotal: this.newTenureMonths,
      autoDebit: true,
      status: 'Active',
      nextEmiDate: '05-Oct-2026'
    };

    this.loansList.unshift(newLoanObj);
    this.loan = newLoanObj;
    this.closeModals();
    this.showToast(`Loan Application ${newId} approved & disbursed! Monthly EMI: ₹${this.calculatedEmi.toLocaleString('en-IN')}`, 'success');
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 4500);
  }
}
