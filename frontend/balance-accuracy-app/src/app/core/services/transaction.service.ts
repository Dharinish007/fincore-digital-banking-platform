import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Transaction,
  TransactionFilterCriteria,
  TransactionStatus,
  TransactionSummaryStats
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  private rawTransactions = signal<Transaction[]>([]);
  private pendingTx = signal<Transaction | null>(null);

  public filterCriteria = signal<TransactionFilterCriteria>({});
  private tx$ = new BehaviorSubject<Transaction[]>([]);

  public filteredTransactions = computed(() => {
    const list = this.rawTransactions();
    const filters = this.filterCriteria();

    return list.filter(tx => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchId = tx.id.toLowerCase().includes(q);
        const matchSender = tx.sender.toLowerCase().includes(q);
        const matchReceiver = tx.receiver.toLowerCase().includes(q);
        const matchRef = tx.reference.toLowerCase().includes(q);
        const matchType = tx.type.toLowerCase().includes(q);
        if (!matchId && !matchSender && !matchReceiver && !matchRef && !matchType) {
          return false;
        }
      }

      if (filters.status && filters.status !== 'ALL') {
        if (tx.status.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }

      if (filters.type && filters.type !== 'ALL') {
        if (tx.type.toLowerCase() !== filters.type.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  });

  public summaryStats = computed<TransactionSummaryStats>(() => {
    const list = this.rawTransactions();
    const total = list.length;
    const success = list.filter(t => t.status === 'Success').length;
    const failed = list.filter(t => t.status === 'Failed' || t.status === 'Rolled Back').length;
    const pending = list.filter(t => t.status === 'Pending' || t.status === 'Processing').length;
    const amount = list.reduce((acc, curr) => acc + (curr.status === 'Success' ? curr.amount : 0), 0);

    const todayStr = new Date().toDateString();
    const todayCount = list.filter(t => new Date(t.date).toDateString() === todayStr).length;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 100;

    return {
      total,
      success,
      failed,
      pending,
      amount,
      todayCount,
      successRate
    };
  });

  constructor() {
    this.fetchTransactionsFromBackend();
  }

  public fetchTransactionsFromBackend(): void {
    this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        id: item.id || `TX${Math.floor(100000 + Math.random() * 900000)}`,
        sender: item.sender || '100084920192',
        senderName: item.senderName || 'Aditi Verma',
        receiver: item.receiver || '400092817261',
        receiverName: item.receiverName || 'Apex Logistics Ltd',
        type: item.type || 'Transfer',
        amount: Number(item.amount || 0),
        date: item.date || new Date().toISOString(),
        reference: item.reference || `REF${Math.floor(100000 + Math.random() * 900000)}`,
        status: item.status || 'Success',
        charges: Number(item.charges || 0),
        failureReason: item.failureReason,
        description: item.description
      }))),
      tap(backendList => {
        if (backendList && backendList.length > 0) {
          this.rawTransactions.set(backendList);
          this.tx$.next(backendList);
        } else {
          this.seedMockTransactions();
        }
      }),
      catchError(() => {
        this.seedMockTransactions();
        return of([]);
      })
    ).subscribe();
  }

  private seedMockTransactions(): void {
    const mockList: Transaction[] = [
      {
        id: 'TX100981',
        sender: '100084920192',
        senderName: 'Aditi Verma',
        receiver: '400092817261',
        receiverName: 'Apex Logistics Ltd',
        type: 'Transfer',
        amount: 24500.00,
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        reference: 'REF892019',
        status: 'Success',
        charges: 15.00,
        description: 'Vendor payment for Q3 software license renewal'
      },
      {
        id: 'TX100982',
        sender: '200039102938',
        senderName: 'Rahul Sharma',
        receiver: '100084920192',
        receiverName: 'Aditi Verma',
        type: 'Deposit',
        amount: 150000.00,
        date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        reference: 'REF892020',
        status: 'Success',
        charges: 0.00,
        description: 'Salary credit for July 2026'
      },
      {
        id: 'TX100984',
        sender: '300091827364',
        senderName: 'Global Tech Corp',
        receiver: '100084920192',
        receiverName: 'Aditi Verma',
        type: 'Transfer',
        amount: 8750.50,
        date: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
        reference: 'REF892022',
        status: 'Failed',
        failureReason: 'INSUFFICIENT_FUNDS_ATOMIC_ROLLBACK: Debit account locked due to concurrent transaction lock',
        charges: 0.00,
        description: 'Quarterly dividend payout'
      }
    ];

    this.rawTransactions.set(mockList);
    this.tx$.next(mockList);
  }

  public list(): Observable<Transaction[]> {
    return this.tx$.asObservable();
  }

  public getTransactions(): Transaction[] {
    return this.rawTransactions();
  }

  public getById(id: string): Transaction | undefined {
    if (!id) return undefined;
    const found = this.rawTransactions().find(t => t.id === id || t.reference === id);
    if (found) return found;

    const pending = this.pendingTx();
    if (pending && (pending.id === id || pending.reference === id)) {
      return pending;
    }
    return undefined;
  }

  public getTransactionById(id: string): Transaction | undefined {
    return this.getById(id);
  }

  public getPending(): Transaction | null {
    return this.pendingTx();
  }

  public setPending(tx: Transaction | null): void {
    this.pendingTx.set(tx);
  }

  public updateFilters(criteria: TransactionFilterCriteria): void {
    this.filterCriteria.set({ ...this.filterCriteria(), ...criteria });
  }

  public resetFilters(): void {
    this.filterCriteria.set({});
  }

  public confirm(tx: Transaction): Observable<Transaction> {
    const generatedId = 'TX' + Math.floor(100000 + Math.random() * 900000);
    const updatedPending: Transaction = {
      ...tx,
      id: generatedId,
      status: 'Processing',
      date: new Date().toISOString()
    };

    this.pendingTx.set(updatedPending);

    const currentList = this.rawTransactions();
    this.rawTransactions.set([updatedPending, ...currentList]);
    this.tx$.next(this.rawTransactions());

    // Connect to backend REST endpoint /api/transactions/transfer
    this.http.post<any>(`${this.apiUrl}/transfer`, tx).pipe(
      catchError(() => of(null))
    ).subscribe();

    // Two-Phase Commit visual simulation
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15;
      const finalStatus: TransactionStatus = isSuccess ? 'Success' : 'Failed';
      const failureReason = isSuccess
        ? undefined
        : 'ATOMIC_TRANSACTION_FAILURE: Receiver ledger rejected debit during Phase-2 commit verification.';

      const updatedList = this.rawTransactions().map(t => {
        if (t.id === generatedId || t.reference === tx.reference) {
          return {
            ...t,
            status: finalStatus,
            failureReason
          };
        }
        return t;
      });

      this.rawTransactions.set(updatedList);
      this.tx$.next(updatedList);

      this.pendingTx.set({
        ...updatedPending,
        status: finalStatus,
        failureReason
      });
    }, 2200);

    return of(updatedPending);
  }

  public updateTransactionStatus(id: string, status: TransactionStatus, failureReason?: string): void {
    const list = this.rawTransactions().map(t => {
      if (t.id === id || t.reference === id) {
        return { ...t, status, failureReason };
      }
      return t;
    });

    this.rawTransactions.set(list);
    this.tx$.next(list);

    const pending = this.pendingTx();
    if (pending && (pending.id === id || pending.reference === id)) {
      this.pendingTx.set({ ...pending, status, failureReason });
    }
  }

  public retryTransaction(tx: Transaction): Observable<Transaction> {
    return this.confirm({
      ...tx,
      status: 'Pending',
      failureReason: undefined
    });
  }
}
