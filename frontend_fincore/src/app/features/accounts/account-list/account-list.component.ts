import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankingService } from '../../../core/services/banking.service';
import { Account, AccountType, AccountStatus, Customer } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  customers: Customer[] = [];

  // Filter state
  searchQuery = '';
  selectedType: string = 'ALL';
  selectedStatus: string = 'ALL';

  // Modals
  showCreateModal = false;
  showLifecycleModal = false;
  showAdjustBalanceModal = false;
  selectedAccount?: Account;

  // Forms
  accountForm: FormGroup = this.fb.group({
    customerId: ['', Validators.required],
    accountType: ['Savings' as AccountType, Validators.required],
    initialDeposit: [25000, [Validators.required, Validators.min(1000)]],
    branchName: ['Worli Branch, Mumbai', Validators.required],
    branchCode: ['FINC0001201', Validators.required],
    ifsc: ['FINC0004592', Validators.required]
  });

  adjustForm: FormGroup = this.fb.group({
    actionType: ['Credit', Validators.required],
    amount: [10000, [Validators.required, Validators.min(100)]],
    description: ['Operations Ledger Balance Adjustment', Validators.required]
  });

  ngOnInit() {
    this.banking.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.applyFilters();
    });

    this.banking.getCustomers().subscribe(custs => {
      this.customers = custs;
      if (custs.length > 0) {
        this.accountForm.patchValue({ customerId: custs[0].customerId });
      }
    });
  }

  applyFilters() {
    this.filteredAccounts = this.accounts.filter(a => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        a.accountNumber.toLowerCase().includes(q) ||
        a.accountId.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q) ||
        a.ifsc.toLowerCase().includes(q);

      const matchesType = this.selectedType === 'ALL' || a.accountType === this.selectedType;
      const matchesStatus = this.selectedStatus === 'ALL' || a.status === this.selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  submitCreateAccount() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const val = this.accountForm.value;
    const cust = this.customers.find(c => c.customerId === val.customerId);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const newAccountData: Omit<Account, 'accountId' | 'openedDate' | 'lastUpdated'> = {
      accountNumber: `XXXX XXXX ${randomSuffix}`,
      fullAccountNumber: `10928374${randomSuffix}`,
      customerId: val.customerId,
      customerName: cust ? `${cust.firstName} ${cust.lastName}` : 'Valued Customer',
      accountType: val.accountType,
      balance: val.initialDeposit,
      availableBalance: val.initialDeposit,
      currency: 'INR',
      branchCode: val.branchCode,
      branchName: val.branchName,
      ifsc: val.ifsc,
      status: 'Active' as AccountStatus,
      interestRate: val.accountType === 'Savings' ? 4.25 : val.accountType === 'Fixed Deposit' ? 7.40 : 0
    };

    this.banking.createAccount(newAccountData).subscribe(res => {
      this.toast.success('Account Created', `Created ${res.accountType} account ${res.accountNumber}`);
      this.closeCreateModal();
    });
  }

  openLifecycle(account: Account) {
    this.selectedAccount = account;
    this.showLifecycleModal = true;
  }

  closeLifecycle() {
    this.showLifecycleModal = false;
    this.selectedAccount = undefined;
  }

  changeStatus(status: AccountStatus) {
    if (!this.selectedAccount) return;
    this.banking.updateAccountStatus(this.selectedAccount.accountId, status).subscribe(() => {
      this.toast.info('Account Lifecycle Updated', `Status changed to ${status}`);
      this.closeLifecycle();
    });
  }

  openAdjustBalance(account: Account) {
    this.selectedAccount = account;
    this.showAdjustBalanceModal = true;
  }

  closeAdjustBalance() {
    this.showAdjustBalanceModal = false;
    this.selectedAccount = undefined;
  }

  submitAdjustBalance() {
    if (!this.selectedAccount || this.adjustForm.invalid) return;

    const { actionType, amount, description } = this.adjustForm.value;

    this.banking.initiateTransaction({
      accountId: this.selectedAccount.accountId,
      accountNumber: this.selectedAccount.accountNumber,
      customerId: this.selectedAccount.customerId,
      customerName: this.selectedAccount.customerName,
      transactionType: actionType === 'Credit' ? 'Credit' : 'Debit',
      amount,
      currency: 'INR',
      referenceNumber: `ADJ-${Date.now().toString().slice(-8)}`,
      description,
      channel: 'Branch',
      status: 'Success',
      category: 'Adjustment'
    }).subscribe(() => {
      this.toast.success('Balance Updated', `${actionType} of ₹${amount.toLocaleString('en-IN')} processed`);
      this.closeAdjustBalance();
    });
  }
}
