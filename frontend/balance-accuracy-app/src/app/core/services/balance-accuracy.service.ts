import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BankAccount, AccountStatus, AccountType, PendingTransaction, HoldItem } from '../models/account.model';
import { AuditLogItem } from '../models/audit-log.model';
import { BalanceFilterCriteria } from '../models/filter.model';
import { DashboardSummary } from '../models/summary-stats.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceAccuracyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;

  private initialAccounts: BankAccount[] = this.generate100MockAccounts();
  private accountsSubject = new BehaviorSubject<BankAccount[]>(this.initialAccounts);
  public accounts$ = this.accountsSubject.asObservable();

  private auditLogsSubject = new BehaviorSubject<AuditLogItem[]>(this.generateInitialAuditLogs());
  public auditLogs$ = this.auditLogsSubject.asObservable();

  // Signal State Management
  public activeFilters = signal<BalanceFilterCriteria>({});
  public rawAccounts = signal<BankAccount[]>(this.initialAccounts);

  // Computed Signals
  public filteredAccounts = computed(() => {
    const list = this.rawAccounts();
    const f = this.activeFilters();

    return list.filter(acc => {
      if (f.status && f.status !== 'All' && acc.status !== f.status) return false;
      if (f.branch && f.branch !== 'All' && acc.branch !== f.branch) return false;
      if (f.accountType && f.accountType !== 'All' && acc.accountType !== f.accountType) return false;
      if (f.customerSearch && f.customerSearch.trim()) {
        const query = f.customerSearch.toLowerCase().trim();
        if (!acc.customerName.toLowerCase().includes(query) && !acc.customerId.toLowerCase().includes(query)) return false;
      }
      if (f.accountNumberSearch && f.accountNumberSearch.trim()) {
        const query = f.accountNumberSearch.toLowerCase().trim();
        if (!acc.accountNumber.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  });

  public summaryStats = computed<DashboardSummary>(() => {
    const list = this.rawAccounts();
    const totalAccounts = list.length;
    const totalBalanceChecked = list.reduce((sum, item) => sum + item.ledgerBalance, 0);
    const mismatchAccounts = list.filter(a => a.status === 'Mismatch').length;
    const verifiedAccounts = list.filter(a => a.status === 'Verified').length;
    const pendingAccounts = list.filter(a => a.status === 'Pending').length;
    const accuracyPercentage = totalAccounts > 0 ? Number(((verifiedAccounts / totalAccounts) * 100).toFixed(1)) : 100;

    return {
      totalAccounts,
      totalBalanceChecked,
      mismatchAccounts,
      accuracyPercentage,
      verifiedAccounts,
      pendingAccounts
    };
  });

  constructor() {
    this.fetchAccountsFromBackend();
  }

  public fetchAccountsFromBackend(): void {
    this.http.get<any[]>(`${this.apiUrl}/balance-accuracy`).pipe(
      map(data => data.map(item => ({
        id: item.id || item.accountNumber,
        accountNumber: item.accountNumber,
        customerName: item.customerName || 'Customer',
        customerId: String(item.customerId || 'CUST-101'),
        email: `${(item.customerName || 'customer').toLowerCase().replace(' ', '.')}@example.com`,
        phone: '+1 (555) 0192',
        branch: item.branch || 'Main Branch',
        accountType: (item.accountType || 'Savings') as AccountType,
        ledgerBalance: Number(item.ledgerBalance || 0),
        availableBalance: Number(item.availableBalance || 0),
        systemCalculatedBalance: Number(item.systemCalculatedBalance || 0),
        difference: Number(item.difference || 0),
        status: (item.status || 'Verified') as AccountStatus,
        lastVerified: item.lastVerified || new Date().toISOString(),
        pendingTransactions: [],
        debitHolds: [],
        creditHolds: [],
        remarks: 'Backend synchronized',
        isFrozen: item.status === 'Blocked',
        kycStatus: 'Verified' as const,
        currency: 'USD'
      }))),
      tap(backendAccounts => {
        if (backendAccounts && backendAccounts.length > 0) {
          this.rawAccounts.set(backendAccounts);
          this.accountsSubject.next(backendAccounts);
        }
      }),
      catchError(() => of([]))
    ).subscribe();
  }

  public getAccounts(): Observable<BankAccount[]> {
    return this.accounts$;
  }

  public updateFilters(criteria: BalanceFilterCriteria): void {
    this.activeFilters.set({ ...criteria });
  }

  public resetFilters(): void {
    this.activeFilters.set({});
  }

  public getAccountById(id: string): BankAccount | undefined {
    return this.rawAccounts().find(a => a.id === id || a.accountNumber === id);
  }

  public verifyAccount(accountId: string, action: 'Approve' | 'Reject', remarks: string): void {
    const current = this.rawAccounts();
    const index = current.findIndex(a => a.id === accountId || a.accountNumber === accountId);
    if (index === -1) return;

    const targetAcc = current[index];

    this.http.post<any>(`${this.apiUrl}/${targetAcc.accountNumber}/verify`, { action, remarks }).pipe(
      catchError(() => of(null))
    ).subscribe();

    const account = { ...targetAcc };
    const oldStatus = account.status;
    const oldBalance = account.ledgerBalance;

    if (action === 'Approve') {
      account.status = 'Verified';
      account.ledgerBalance = account.systemCalculatedBalance;
      account.difference = 0;
    } else {
      account.status = 'Mismatch';
    }
    account.lastVerified = new Date().toISOString();
    account.remarks = remarks;

    const updatedList = [...current];
    updatedList[index] = account;

    this.rawAccounts.set(updatedList);
    this.accountsSubject.next(updatedList);

    // Audit Log
    const newLog: AuditLogItem = {
      id: 'AUD-' + Math.floor(100000 + Math.random() * 900000),
      accountId: account.id,
      accountNumber: account.accountNumber,
      user: 'Alex Mercer',
      userRole: 'Senior Audit Lead',
      timestamp: new Date().toISOString(),
      action: action === 'Approve' ? 'Reconciliation Approved' : 'Mismatch Escalated',
      previousBalance: oldBalance,
      updatedBalance: account.ledgerBalance,
      ipAddress: '192.168.1.145',
      device: 'FinCore Terminal v4.2 / Windows 11',
      remarks: remarks || `Manual verification performed. Status updated from ${oldStatus} to ${account.status}.`
    };

    this.auditLogsSubject.next([newLog, ...this.auditLogsSubject.getValue()]);
  }

  public freezeAccount(accountId: string, reason: string): void {
    const current = this.rawAccounts();
    const index = current.findIndex(a => a.id === accountId || a.accountNumber === accountId);
    if (index === -1) return;

    const targetAcc = current[index];

    this.http.post<any>(`${this.apiUrl}/${targetAcc.accountNumber}/freeze`, { reason }).pipe(
      catchError(() => of(null))
    ).subscribe();

    const account = { ...targetAcc, isFrozen: true, frozenReason: reason, status: 'Mismatch' as AccountStatus };
    const updatedList = [...current];
    updatedList[index] = account;

    this.rawAccounts.set(updatedList);
    this.accountsSubject.next(updatedList);

    const newLog: AuditLogItem = {
      id: 'AUD-' + Math.floor(100000 + Math.random() * 900000),
      accountId: account.id,
      accountNumber: account.accountNumber,
      user: 'Alex Mercer',
      userRole: 'Senior Audit Lead',
      timestamp: new Date().toISOString(),
      action: 'Account Frozen',
      previousBalance: account.ledgerBalance,
      updatedBalance: account.ledgerBalance,
      ipAddress: '192.168.1.145',
      device: 'FinCore Terminal v4.2 / Windows 11',
      remarks: `Account frozen due to audit concern: ${reason}`
    };

    this.auditLogsSubject.next([newLog, ...this.auditLogsSubject.getValue()]);
  }

  public getAuditLogsForAccount(accountNumber: string): AuditLogItem[] {
    return this.auditLogsSubject.getValue().filter(l => l.accountNumber === accountNumber);
  }

  private generate100MockAccounts(): BankAccount[] {
    const firstNames = ['Eleanor', 'Marcus', 'Sophia', 'Alexander', 'David', 'Victoria', 'Rajesh', 'Priya'];
    const lastNames = ['Sterling', 'Vance', 'Wright', 'Miller', 'Sharma', 'Patel'];
    const branches = ['Main Branch - Downtown', 'North Avenue Branch', 'Westside Metro', 'East Commerce', 'Global Treasury'];
    const types: AccountType[] = ['Savings', 'Checking', 'Corporate', 'Fixed Deposit', 'Money Market'];
    const accounts: BankAccount[] = [];

    for (let i = 1; i <= 30; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      const customerName = `${fn} ${ln}`;
      const accountNumber = `ACC-${10000000 + i * 849}`;
      const customerId = `CUST-${50000 + i}`;
      const branch = branches[i % branches.length];
      const accountType = types[i % types.length];

      const baseBalance = Math.round((Math.random() * 250000 + 15000) * 100) / 100;
      let status: AccountStatus = 'Verified';
      let difference = 0;
      let sysCalculated = baseBalance;

      if (i % 7 === 0) {
        status = 'Mismatch';
        difference = 1200;
        sysCalculated = baseBalance - difference;
      } else if (i % 5 === 0) {
        status = 'Pending';
      }

      accounts.push({
        id: `ACC-ID-${i}`,
        accountNumber,
        customerName,
        customerId,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@fincore-example.com`,
        phone: `+1 (555) 01${(10 + i).toString().padStart(2, '0')}`,
        branch,
        accountType,
        ledgerBalance: baseBalance,
        availableBalance: baseBalance,
        systemCalculatedBalance: sysCalculated,
        difference,
        status,
        lastVerified: new Date(Date.now() - (i * 3600000)).toISOString(),
        pendingTransactions: [],
        debitHolds: [],
        creditHolds: [],
        remarks: status === 'Mismatch' ? 'Discrepancy detected between batch ledger sync and core database logs.' : 'Account balance reconciled.',
        isFrozen: false,
        kycStatus: 'Verified',
        currency: 'USD'
      });
    }

    return accounts;
  }

  private generateInitialAuditLogs(): AuditLogItem[] {
    return [
      {
        id: 'AUD-891023',
        accountId: 'ACC-ID-7',
        accountNumber: 'ACC-10005943',
        user: 'Sarah Jenkins',
        userRole: 'Lead Auditor',
        timestamp: '2026-08-05 11:20:15',
        action: 'Manual Reconciliation',
        previousBalance: 84200.00,
        updatedBalance: 83950.00,
        ipAddress: '10.240.12.88',
        device: 'FinCore Workstation / Chrome 127',
        remarks: 'Corrected debit posting delay from regional clearing house.'
      }
    ];
  }
}
