import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface AccountDetail {
  accNo: string;
  name: string;
  type: string;
  balance: number; // in Rupees
  status: string;
  ifsc: string;
  branch: string;
}

@Component({
  selector: 'app-accounts-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsLedgerComponent implements OnInit {
  private readonly api = inject(ApiService);
  accounts: AccountDetail[] = [

    { accNo: 'ACC-8849-1001', name: 'John Smith', type: 'Savings Account', balance: 452100, status: 'Active', ifsc: 'FINC0001024', branch: 'Mumbai Main Branch' },
    { accNo: 'ACC-8849-1002', name: 'Sarah Jenkins', type: 'Checking Account', balance: 128505, status: 'Active', ifsc: 'FINC0001024', branch: 'Mumbai Main Branch' },
    { accNo: 'ACC-8849-1003', name: 'TechCorp LLC', type: 'Commercial Current Account', balance: 12500000, status: 'Active', ifsc: 'FINC0008801', branch: 'Bandra BKC Branch' },
    { accNo: 'ACC-8849-1004', name: 'Robert Vance', type: 'Savings Account', balance: 340000, status: 'Dormant', ifsc: 'FINC0004012', branch: 'Delhi CP Branch' }
  ];

  selectedAccount: AccountDetail = { ...this.accounts[0] };

  // Modals & UI State
  showDepositModal = false;
  showWithdrawModal = false;
  txAmount = 50000;

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  ngOnInit(): void {
    this.loadFromDatabase();
  }

  loadFromDatabase(): void {
    this.api.get<any[]>('/api/operations/accounts').subscribe({
      next: (dbAccounts) => {
        if (dbAccounts && dbAccounts.length > 0) {
          const mappedAccounts: AccountDetail[] = dbAccounts.map(dba => ({
            accNo: dba.accountNumber || `ACC-8849-00${dba.id}`,
            name: dba.customerName || 'Verified Enterprise Client',
            type: `${dba.accountType || 'SAVINGS'} Account`,
            balance: Number(dba.balance),
            status: dba.status || 'Active',
            ifsc: 'FINC0001024',
            branch: 'Mumbai Main Hub'
          }));
          this.accounts = mappedAccounts;
          this.selectedAccount = this.accounts[0];
        }
      },
      error: (err) => console.warn('Accounts ledger DB load fallback:', err)
    });
  }


  selectAccount(acc: AccountDetail): void {
    this.selectedAccount = acc;
  }

  toggleAccountFreeze(): void {
    this.selectedAccount.status = this.selectedAccount.status === 'Active' ? 'Frozen' : 'Active';
    const found = this.accounts.find(a => a.accNo === this.selectedAccount.accNo);
    if (found) found.status = this.selectedAccount.status;

    // Sync status to PostgreSQL database
    const numId = parseInt(this.selectedAccount.accNo.replace(/\D/g, ''), 10) || 1;
    this.api.post(`/api/operations/accounts/${numId}/lifecycle`, {
      status: this.selectedAccount.status
    }).subscribe({
      error: (err) => console.warn('Account freeze DB sync fallback:', err)
    });

    this.showToast(`Account ${this.selectedAccount.accNo} status changed to ${this.selectedAccount.status}.`, this.selectedAccount.status === 'Frozen' ? 'danger' : 'success');
  }

  openDeposit(): void { this.showDepositModal = true; }
  openWithdraw(): void { this.showWithdrawModal = true; }
  closeModals(): void { this.showDepositModal = false; this.showWithdrawModal = false; }

  processDeposit(): void {
    if (this.txAmount <= 0) return;
    this.selectedAccount.balance += this.txAmount;

    // Persist balance credit to PostgreSQL database
    const numId = parseInt(this.selectedAccount.accNo.replace(/\D/g, ''), 10) || 1;
    this.api.post(`/api/operations/accounts/${numId}/balance-adjustments`, {
      amount: this.txAmount,
      entryType: 'CREDIT',
      description: `Deposit to ${this.selectedAccount.accNo}`
    }).subscribe({
      error: (err) => console.warn('Deposit DB sync fallback:', err)
    });

    this.showToast(`Deposited ₹${this.txAmount.toLocaleString('en-IN')} to ${this.selectedAccount.accNo}. New Balance: ₹${this.selectedAccount.balance.toLocaleString('en-IN')}`, 'success');
    this.closeModals();
  }

  processWithdraw(): void {
    if (this.txAmount <= 0 || this.txAmount > this.selectedAccount.balance) {
      this.showToast('Invalid withdrawal amount or insufficient funds.', 'danger');
      return;
    }
    this.selectedAccount.balance -= this.txAmount;

    // Persist balance debit to PostgreSQL database
    const numId = parseInt(this.selectedAccount.accNo.replace(/\D/g, ''), 10) || 1;
    this.api.post(`/api/operations/accounts/${numId}/balance-adjustments`, {
      amount: this.txAmount,
      entryType: 'DEBIT',
      description: `Withdrawal from ${this.selectedAccount.accNo}`
    }).subscribe({
      error: (err) => console.warn('Withdraw DB sync fallback:', err)
    });

    this.showToast(`Withdrew ₹${this.txAmount.toLocaleString('en-IN')} from ${this.selectedAccount.accNo}. New Balance: ₹${this.selectedAccount.balance.toLocaleString('en-IN')}`, 'info');
    this.closeModals();
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 4500);
  }
}

