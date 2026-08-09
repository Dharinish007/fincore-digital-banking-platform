import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  BankAccount,
  AccountStatus,
  AccountType,
  PendingTransaction,
  HoldItem,
} from '../models/account.model';
import { AuditLogItem } from '../models/audit-log.model';
import { BalanceFilterCriteria } from '../models/filter.model';
import { DashboardSummary } from '../models/summary-stats.model';

@Injectable({
  providedIn: 'root',
})
export class BalanceAccuracyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/balance-accuracy`;

  private accountsSubject = new BehaviorSubject<BankAccount[]>([]);
  public accounts$ = this.accountsSubject.asObservable();

  private auditLogsSubject = new BehaviorSubject<AuditLogItem[]>(
    this.generateInitialAuditLogs(),
  );
  public auditLogs$ = this.auditLogsSubject.asObservable();

  // Signal State Management
  public activeFilters = signal<BalanceFilterCriteria>({});
  public rawAccounts = signal<BankAccount[]>([]);

  // Computed Signals
  public filteredAccounts = computed(() => {
    const list = this.rawAccounts();
    const f = this.activeFilters();

    return list.filter((acc) => {
      if (f.status && f.status !== 'All' && acc.status !== f.status)
        return false;
      if (f.branch && f.branch !== 'All' && acc.branch !== f.branch)
        return false;
      if (
        f.accountType &&
        f.accountType !== 'All' &&
        acc.accountType !== f.accountType
      )
        return false;
      if (f.customerSearch && f.customerSearch.trim()) {
        const query = f.customerSearch.toLowerCase().trim();
        if (
          !acc.customerName.toLowerCase().includes(query) &&
          !acc.customerId.toLowerCase().includes(query)
        )
          return false;
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
    const totalBalanceChecked = list.reduce(
      (sum, item) => sum + item.ledgerBalance,
      0,
    );
    const mismatchAccounts = list.filter((a) => a.status === 'Mismatch').length;
    const verifiedAccounts = list.filter((a) => a.status === 'Verified').length;
    const pendingAccounts = list.filter((a) => a.status === 'Pending').length;
    const accuracyPercentage =
      totalAccounts > 0
        ? Number(((verifiedAccounts / totalAccounts) * 100).toFixed(1))
        : 100;

    return {
      totalAccounts,
      totalBalanceChecked,
      mismatchAccounts,
      accuracyPercentage,
      verifiedAccounts,
      pendingAccounts,
    };
  });

  constructor() {
    this.fetchAccountsFromBackend().subscribe();
  }

  public fetchAccountsFromBackend(): Observable<BankAccount[]> {
    return this.http
      .get<BankAccount[]>(`${this.apiUrl}/accounts`)
      .pipe(
        map((response) =>
          response.map((item) => ({
            ...item,
            id: item.id || item.accountNumber || '',
            ledgerBalance: Number(item.ledgerBalance || 0),
            availableBalance: Number(item.availableBalance || 0),
            systemCalculatedBalance: Number(item.systemCalculatedBalance || 0),
            difference: Number(item.difference || 0),
            balanceAccurate: Boolean(item.balanceAccurate),
            pendingTransactions: item.pendingTransactions || [],
            debitHolds: item.debitHolds || [],
            creditHolds: item.creditHolds || [],
            accountStatus: item.accountStatus || item.status || '',
            isActive: Boolean(item.isActive),
          })),
        ),
        tap((accounts) => {
          this.rawAccounts.set(accounts);
          this.accountsSubject.next(accounts);
        }),
        catchError(() => {
          this.rawAccounts.set([]);
          this.accountsSubject.next([]);
          return of([]);
        }),
      );
  }

  public refreshBalanceAccuracy(
    accountNumber: string,
  ): Observable<BankAccount> {
    const current = this.rawAccounts();
    const targetAccount = current.find(
      (a) => a.accountNumber === accountNumber || a.id === accountNumber,
    );

    if (!targetAccount) {
      return of(current[0]);
    }

    return this.http
      .get<{
        accountNo: string;
        actualBalance: number;
        expectedBalance: number;
        balanceAccurate: boolean;
      }>(`${this.apiUrl}/${accountNumber}`)
      .pipe(
        map((response) => {
          const updatedAccount = { ...targetAccount };
          updatedAccount.ledgerBalance = Number(response.actualBalance);
          updatedAccount.availableBalance = Number(response.actualBalance);
          updatedAccount.systemCalculatedBalance = Number(
            response.expectedBalance,
          );
          updatedAccount.difference = Number(
            (
              updatedAccount.ledgerBalance -
              updatedAccount.systemCalculatedBalance
            ).toFixed(2),
          );
          updatedAccount.balanceAccurate = Boolean(response.balanceAccurate);
          updatedAccount.status = response.balanceAccurate
            ? ('Verified' as AccountStatus)
            : ('Mismatch' as AccountStatus);
          updatedAccount.lastVerified = new Date().toISOString();
          updatedAccount.remarks = response.balanceAccurate
            ? 'Backend reconciliation confirmed the ledger balance.'
            : 'Backend calculation found a discrepancy in ledger balance.';

          const updatedList = [...current];
          updatedList[current.indexOf(targetAccount)] = updatedAccount;
          this.rawAccounts.set(updatedList);
          this.accountsSubject.next(updatedList);
          return updatedAccount;
        }),
        catchError(() => of(targetAccount)),
      );
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
    return this.rawAccounts().find(
      (a) => a.id === id || a.accountNumber === id,
    );
  }

  public verifyAccount(
    accountId: string,
    action: 'Approve' | 'Reject',
    remarks: string,
  ): void {
    const current = this.rawAccounts();
    const index = current.findIndex(
      (a) => a.id === accountId || a.accountNumber === accountId,
    );
    if (index === -1) return;

    const targetAcc = current[index];

    // Backend verify endpoint is not available for this frontend-only integration.
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
      action:
        action === 'Approve' ? 'Reconciliation Approved' : 'Mismatch Escalated',
      previousBalance: oldBalance,
      updatedBalance: account.ledgerBalance,
      ipAddress: '192.168.1.145',
      device: 'FinCore Terminal v4.2 / Windows 11',
      remarks:
        remarks ||
        `Manual verification performed. Status updated from ${oldStatus} to ${account.status}.`,
    };

    this.auditLogsSubject.next([newLog, ...this.auditLogsSubject.getValue()]);
  }

  public freezeAccount(accountId: string, reason: string): void {
    const current = this.rawAccounts();
    const index = current.findIndex(
      (a) => a.id === accountId || a.accountNumber === accountId,
    );
    if (index === -1) return;

    const targetAcc = current[index];

    // Backend freeze endpoint is not available for this frontend-only integration.
    const account = {
      ...targetAcc,
      isFrozen: true,
      frozenReason: reason,
      status: 'Mismatch' as AccountStatus,
    };
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
      remarks: `Account frozen due to audit concern: ${reason}`,
    };

    this.auditLogsSubject.next([newLog, ...this.auditLogsSubject.getValue()]);
  }

  public getAuditLogsForAccount(accountNumber: string): AuditLogItem[] {
    return this.auditLogsSubject
      .getValue()
      .filter((l) => l.accountNumber === accountNumber);
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
        previousBalance: 84200.0,
        updatedBalance: 83950.0,
        ipAddress: '10.240.12.88',
        device: 'FinCore Workstation / Chrome 127',
        remarks: 'Corrected debit posting delay from regional clearing house.',
      },
    ];
  }
}
