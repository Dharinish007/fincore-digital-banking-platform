import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
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

  selectAccount(acc: AccountDetail): void {
    this.selectedAccount = acc;
  }

  toggleAccountFreeze(): void {
    this.selectedAccount.status = this.selectedAccount.status === 'Active' ? 'Frozen' : 'Active';
    const found = this.accounts.find(a => a.accNo === this.selectedAccount.accNo);
    if (found) found.status = this.selectedAccount.status;
    this.showToast(`Account ${this.selectedAccount.accNo} status changed to ${this.selectedAccount.status}.`, this.selectedAccount.status === 'Frozen' ? 'danger' : 'success');
  }

  openDeposit(): void { this.showDepositModal = true; }
  openWithdraw(): void { this.showWithdrawModal = true; }
  closeModals(): void { this.showDepositModal = false; this.showWithdrawModal = false; }

  processDeposit(): void {
    if (this.txAmount <= 0) return;
    this.selectedAccount.balance += this.txAmount;
    this.showToast(`Deposited ₹${this.txAmount.toLocaleString('en-IN')} to ${this.selectedAccount.accNo}. New Balance: ₹${this.selectedAccount.balance.toLocaleString('en-IN')}`, 'success');
    this.closeModals();
  }

  processWithdraw(): void {
    if (this.txAmount <= 0 || this.txAmount > this.selectedAccount.balance) {
      this.showToast('Invalid withdrawal amount or insufficient funds.', 'danger');
      return;
    }
    this.selectedAccount.balance -= this.txAmount;
    this.showToast(`Withdrew ₹${this.txAmount.toLocaleString('en-IN')} from ${this.selectedAccount.accNo}. New Balance: ₹${this.selectedAccount.balance.toLocaleString('en-IN')}`, 'info');
    this.closeModals();
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 4500);
  }
}
