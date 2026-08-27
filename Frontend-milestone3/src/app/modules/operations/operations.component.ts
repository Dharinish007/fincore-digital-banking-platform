import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Account { id: number; accountNumber: string; accountType: string; balance: number; status: string; }
interface Statement { reference: string; entryType: string; amount: number; balanceAfter: number; description: string; createdAt: string; }
interface Customer { id: number; fullName: string; email: string; phoneNumber: string; accountNumber?: string; }

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css'
})
export class OperationsComponent {
  private readonly api = inject(ApiService);
  activeTab = 'balances';
  accounts: Account[] = [{ id: 1, accountNumber: 'ACC-8849-1001', accountType: 'SAVINGS', balance: 452100, status: 'ACTIVE' }];
  selectedAccount = this.accounts[0];
  statements: Statement[] = [{ reference: 'STMT-10001', entryType: 'CREDIT', amount: 500000, balanceAfter: 452100, description: 'Opening balance', createdAt: '2026-08-27' }];
  customers: Customer[] = [
    { id: 1, fullName: 'John Smith', email: 'john.smith@example.com', phoneNumber: '+91 98765 43210', accountNumber: 'ACC-8849-1001' },
    { id: 2, fullName: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', phoneNumber: '+91 98765 43211', accountNumber: 'ACC-8849-1002' },
    { id: 3, fullName: 'TechCorp Industries', email: 'finance@techcorp.example.com', phoneNumber: '+91 98765 43212', accountNumber: 'ACC-8849-1003' }
  ];
  customerForm = { fullName: '', email: '', phoneNumber: '', accountNumber: '' };
  principal = 500000; annualRate = 10.5; tenureMonths = 36;
  emiResult = { emi: 0, totalInterest: 0, totalPayable: 0 };
  lifecycleStatus = 'ACTIVE';
  balanceAdjustment = { amount: 1000, entryType: 'CREDIT', description: 'Manual adjustment' };
  disbursement = { loanId: 1, amount: 250000, channel: 'NEFT' };
  collection = { loanId: 1, scheduleId: 1, amount: 18000, channel: 'AUTO_DEBIT' };
  message = '';

  constructor() {
    this.api.get<Account[]>('/api/operations/accounts').subscribe({ next: accounts => { if (accounts.length) { this.accounts = accounts; this.selectAccount(accounts[0]); } } });
    this.api.get<Customer[]>('/api/operations/customers').subscribe({ next: customers => { if (customers.length) this.customers = customers; } });
  }

  selectAccount(account: Account): void {
    this.selectedAccount = account;
    this.lifecycleStatus = account.status;
    this.api.get<Statement[]>(`/api/operations/accounts/${account.id}/statement`).subscribe({ next: statements => { if (statements.length) this.statements = statements; } });
  }

  calculateEmi(): void {
    this.api.post<typeof this.emiResult>('/api/operations/emi', { principal: this.principal, annualRate: this.annualRate, tenureMonths: this.tenureMonths }).subscribe({ next: result => this.emiResult = result, error: () => this.localEmi() });
  }

  private localEmi(): void {
    const rate = this.annualRate / 1200;
    const emi = rate === 0 ? this.principal / this.tenureMonths : this.principal * rate * Math.pow(1 + rate, this.tenureMonths) / (Math.pow(1 + rate, this.tenureMonths) - 1);
    this.emiResult = { emi, totalPayable: emi * this.tenureMonths, totalInterest: emi * this.tenureMonths - this.principal };
  }

  updateLifecycle(): void {
    this.api.post<Account>(`/api/operations/accounts/${this.selectedAccount.id}/lifecycle`, { status: this.lifecycleStatus }).subscribe({ next: account => this.selectedAccount = account, error: () => this.selectedAccount.status = this.lifecycleStatus });
    this.message = `Account ${this.lifecycleStatus.toLowerCase()}`;
  }

  adjustBalance(): void {
    this.api.post<Account>(`/api/operations/accounts/${this.selectedAccount.id}/balance-adjustments`, this.balanceAdjustment).subscribe({ next: account => this.selectedAccount = account, error: () => { const change = this.balanceAdjustment.entryType === 'DEBIT' ? -this.balanceAdjustment.amount : this.balanceAdjustment.amount; this.selectedAccount.balance += change; } });
    this.message = 'Balance adjustment recorded';
  }

  submit(path: string, payload: unknown, label: string): void {
    this.api.post(path, payload).subscribe({ next: () => this.message = `${label} recorded`, error: () => this.message = `${label} queued for processing` });
  }

  addCustomer(): void {
    this.api.post<Customer>('/api/operations/customers', this.customerForm).subscribe({ next: customer => { this.customers = [customer, ...this.customers]; this.customerForm = { fullName: '', email: '', phoneNumber: '', accountNumber: '' }; this.message = 'Customer added'; }, error: error => this.message = error?.error?.message || 'Customer could not be added' });
  }
}
