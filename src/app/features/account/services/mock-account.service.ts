import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { AccountService } from './account.service';
import {
  Account, AccountSummary, AccountFilter,
  AccountType, AccountStatus, Currency
} from '../models/account.model';
import { ACCOUNT_BRANCHES_MOCK, ACCOUNT_CUSTOMER_STUBS_MOCK, ACCOUNTS_MOCK } from '../../../core/mocks/account.mock';

@Injectable({ providedIn: 'root' })
export class MockAccountService implements AccountService {
  private accountsSignal = signal<Account[]>([...ACCOUNTS_MOCK]);

  readonly branches = ACCOUNT_BRANCHES_MOCK;
  readonly customerStubs = ACCOUNT_CUSTOMER_STUBS_MOCK;
  readonly currencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR'];

  private wrap<T>(data: T): Observable<T> {
    return of(data).pipe(delay(500));
  }

  getAccounts(filter?: AccountFilter): Observable<AccountSummary[]> {
    let accounts = [...this.accountsSignal()];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      accounts = accounts.filter(a =>
        a.accountNumber.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q) ||
        a.customerId.toLowerCase().includes(q)
      );
    }
    if (filter?.status) accounts = accounts.filter(a => a.status === filter.status);
    if (filter?.accountType) accounts = accounts.filter(a => a.accountType === filter.accountType);
    if (filter?.branch) accounts = accounts.filter(a => a.branch === filter.branch);

    const summaries: AccountSummary[] = accounts.map(a => ({
      id: a.id, accountNumber: a.accountNumber, customerId: a.customerId,
      customerName: a.customerName, accountType: a.accountType,
      branch: a.branch, balance: a.balance, currency: a.currency,
      status: a.status, openedAt: a.openedAt
    }));
    return this.wrap(summaries);
  }

  getAccountById(id: string): Observable<Account | undefined> {
    return this.wrap(this.accountsSignal().find(a => a.id === id));
  }

  getAccountsByCustomerId(customerId: string): Observable<AccountSummary[]> {
    const results = this.accountsSignal()
      .filter(a => a.customerId === customerId)
      .map(a => ({
        id: a.id, accountNumber: a.accountNumber, customerId: a.customerId,
        customerName: a.customerName, accountType: a.accountType,
        branch: a.branch, balance: a.balance, currency: a.currency,
        status: a.status, openedAt: a.openedAt
      }));
    return this.wrap(results);
  }

  createAccount(data: Partial<Account>): Observable<Account> {
    const accounts = this.accountsSignal();
    const seq = String(accounts.length + 1).padStart(4, '0');
    const num = `FIN-${data.customerId?.split('-')[1] ?? '999'}-${seq}`;
    const now = new Date().toISOString();
    const newAccount: Account = {
      id: `ACC-${seq}`,
      accountNumber: num,
      customerId: data.customerId ?? '',
      customerName: data.customerName ?? '',
      accountType: data.accountType ?? AccountType.SAVINGS,
      branch: data.branch ?? '',
      balance: data.balance ?? 0,
      availableBalance: data.balance ?? 0,
      currency: data.currency ?? 'USD',
      status: data.status ?? AccountStatus.PENDING,
      openedAt: now,
      updatedAt: now,
      description: data.description
    };
    this.accountsSignal.update(list => [...list, newAccount]);
    return this.wrap(newAccount);
  }

  updateAccount(id: string, data: Partial<Account>): Observable<Account> {
    const accounts = this.accountsSignal();
    const index = accounts.findIndex(a => a.id === id);
    if (index === -1) return throwError(() => new Error(`Account ${id} not found`));
    const updated = { ...accounts[index], ...data, updatedAt: new Date().toISOString() };
    this.accountsSignal.update(list => list.map(a => a.id === id ? updated : a));
    return this.wrap(updated);
  }
}
