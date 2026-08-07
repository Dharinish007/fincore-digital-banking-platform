import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { BankAccount, AccountStatus, AccountType, PendingTransaction, HoldItem } from '../models/account.model';
import { AuditLogItem } from '../models/audit-log.model';
import { BalanceFilterCriteria } from '../models/filter.model';
import { DashboardSummary } from '../models/summary-stats.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceAccuracyService {
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

  constructor() {}

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
    return this.rawAccounts().find(a => a.id === id);
  }

  public verifyAccount(accountId: string, action: 'Approve' | 'Reject', remarks: string): void {
    const current = this.rawAccounts();
    const index = current.findIndex(a => a.id === accountId);
    if (index === -1) return;

    const account = { ...current[index] };
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

    // Record Audit Log
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

    const currentLogs = this.auditLogsSubject.getValue();
    this.auditLogsSubject.next([newLog, ...currentLogs]);
  }

  public freezeAccount(accountId: string, reason: string): void {
    const current = this.rawAccounts();
    const index = current.findIndex(a => a.id === accountId);
    if (index === -1) return;

    const account = { ...current[index], isFrozen: true, frozenReason: reason };
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

    const currentLogs = this.auditLogsSubject.getValue();
    this.auditLogsSubject.next([newLog, ...currentLogs]);
  }

  public getAuditLogsForAccount(accountNumber: string): AuditLogItem[] {
    return this.auditLogsSubject.getValue().filter(l => l.accountNumber === accountNumber);
  }

  // Private Mock Generator
  private generate100MockAccounts(): BankAccount[] {
    const firstNames = [
      'Eleanor', 'Marcus', 'Sophia', 'Alexander', 'David', 'Victoria', 'Rajesh', 'Priya',
      'Lars', 'Elena', 'Gabriel', 'Hannah', 'Julian', 'Isabella', 'Mateo', 'Nora',
      'Oliver', 'Penelope', 'Quentin', 'Rachel', 'Samuel', 'Teresa', 'Umar', 'Vivian',
      'William', 'Ximena', 'Youssef', 'Zoe', 'Arthur', 'Beatrice', 'Charles', 'Diana'
    ];
    const lastNames = [
      'Sterling', 'Vance', 'Al-Mansoor', 'Wright', 'Miller', 'Sharma', 'Patel', 'Lindqvist',
      'Rostova', 'Chen', 'Silva', 'Dubois', 'Kim', 'Kowalski', 'Gupta', 'Sorensen',
      'Nakamoto', 'Moreno', 'Novak', 'O\'Connor', 'Takahashi', 'Zhao', 'Abebe', 'Fischer'
    ];

    const branches = [
      'Main Branch - Downtown',
      'North Avenue Branch',
      'Westside Metro',
      'East Commerce',
      'Global Treasury'
    ];

    const types: AccountType[] = ['Savings', 'Checking', 'Corporate', 'Fixed Deposit', 'Money Market'];

    const accounts: BankAccount[] = [];

    for (let i = 1; i <= 100; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[(i * 3) % lastNames.length];
      const customerName = `${fn} ${ln}`;
      const accountNumber = `ACC-${10000000 + i * 849}`;
      const customerId = `CUST-${50000 + i}`;
      const branch = branches[i % branches.length];
      const accountType = types[i % types.length];

      // Base ledger balance ranging from $12,500 to $9,500,000
      const baseBalance = Math.round((Math.random() * 250000 + 15000) * 100) / 100;
      
      // Determine status distribution: ~65% Verified, ~20% Pending, ~15% Mismatch
      let status: AccountStatus = 'Verified';
      let difference = 0;
      let sysCalculated = baseBalance;

      if (i % 7 === 0 || i % 13 === 0) {
        status = 'Mismatch';
        // Delta between ledger and system calculated
        const deltaSign = i % 2 === 0 ? 1 : -1;
        const diffAmount = Math.round((Math.random() * 4500 + 250) * 100) / 100;
        difference = deltaSign * diffAmount;
        sysCalculated = Math.round((baseBalance - difference) * 100) / 100;
      } else if (i % 5 === 0) {
        status = 'Pending';
        difference = 0;
      }

      const availableBalance = Math.max(0, Math.round((baseBalance - (i % 3 === 0 ? 1200 : 0)) * 100) / 100);

      // Pending Transactions
      const pendingTx: PendingTransaction[] = [
        {
          id: `TXN-${9000 + i}-A`,
          date: '2026-08-05 14:22:10',
          description: i % 2 === 0 ? 'Interbank Wire Transfer Inbound' : 'ATM Cash Withdrawal',
          type: i % 2 === 0 ? 'Credit' : 'Debit',
          amount: Math.round((Math.random() * 1500 + 100) * 100) / 100,
          status: 'Pending'
        },
        {
          id: `TXN-${9000 + i}-B`,
          date: '2026-08-04 09:15:44',
          description: 'ACH Corporate Payroll Credit',
          type: 'Credit',
          amount: Math.round((Math.random() * 3000 + 500) * 100) / 100,
          status: 'Clearing'
        }
      ];

      // Holds
      const debitHolds: HoldItem[] = i % 4 === 0 ? [
        {
          id: `HLD-${300 + i}`,
          type: 'Debit Hold',
          amount: 1200.00,
          reason: 'Merchant Reserve Escrow Hold',
          placedBy: 'Risk Mgmt System',
          placedDate: '2026-08-01 10:00:00'
        }
      ] : [];

      const creditHolds: HoldItem[] = i % 8 === 0 ? [
        {
          id: `HLD-${400 + i}`,
          type: 'Credit Hold',
          amount: 5000.00,
          reason: 'Uncleared High Value Check Deposit',
          placedBy: 'Teller Compliance',
          placedDate: '2026-08-03 16:30:00'
        }
      ] : [];

      const lastVerifiedDate = new Date(Date.now() - (i * 3600000)).toISOString();

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
        availableBalance,
        systemCalculatedBalance: sysCalculated,
        difference,
        status,
        lastVerified: lastVerifiedDate,
        pendingTransactions: pendingTx,
        debitHolds,
        creditHolds,
        remarks: status === 'Mismatch' ? 'Discrepancy detected between batch ledger sync and core database logs.' : 'Account balance reconciled.',
        isFrozen: i === 14, // 1 account frozen initially for demonstration
        frozenReason: i === 14 ? 'High mismatch variance flagged by Automated Security Monitor.' : undefined,
        kycStatus: i % 9 === 0 ? 'Pending Review' : 'Verified',
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
      },
      {
        id: 'AUD-891024',
        accountId: 'ACC-ID-14',
        accountNumber: 'ACC-10011886',
        user: 'Automated Compliance Bot',
        userRole: 'System Process',
        timestamp: '2026-08-05 08:00:00',
        action: 'Account Frozen',
        previousBalance: 540200.50,
        updatedBalance: 540200.50,
        ipAddress: '127.0.0.1',
        device: 'Core Engine Microservice',
        remarks: 'Automatic freeze triggered due to mismatch > $1,000 threshold.'
      },
      {
        id: 'AUD-891025',
        accountId: 'ACC-ID-1',
        accountNumber: 'ACC-10000849',
        user: 'Alex Mercer',
        userRole: 'Senior Audit Lead',
        timestamp: '2026-08-04 16:45:10',
        action: 'Balance Verified',
        previousBalance: 125400.00,
        updatedBalance: 125400.00,
        ipAddress: '192.168.1.145',
        device: 'FinCore Terminal v4.2',
        remarks: 'Nightly batch ledger matched flawlessly with core ledger.'
      }
    ];
  }
}
