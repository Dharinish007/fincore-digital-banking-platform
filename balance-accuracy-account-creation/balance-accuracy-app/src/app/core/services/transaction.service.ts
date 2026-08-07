import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  private rawTransactions = signal<Transaction[]>([]);
  private pendingTx = signal<Transaction | null>(null);

  // Filters State
  public filterCriteria = signal<TransactionFilterCriteria>({});

  // BehaviorSubject for compatibility
  private tx$ = new BehaviorSubject<Transaction[]>([]);

  // Computed Filtered List
  public filteredTransactions = computed(() => {
    const list = this.rawTransactions();
    const filters = this.filterCriteria();

    return list.filter(tx => {
      // Search query filter
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

      // Status filter
      if (filters.status && filters.status !== 'ALL') {
        if (tx.status.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // Type filter
      if (filters.type && filters.type !== 'ALL') {
        if (tx.type.toLowerCase() !== filters.type.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  });

  // Computed Summary Stats
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
    this.seedMockTransactions();
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
        id: 'TX100983',
        sender: '100084920192',
        senderName: 'Aditi Verma',
        receiver: '500019283746',
        receiverName: 'HDFC Home Loans',
        type: 'Withdraw',
        amount: 42500.00,
        date: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        reference: 'REF892021',
        status: 'Success',
        charges: 5.00,
        description: 'Monthly home loan EMI auto-debit'
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
      },
      {
        id: 'TX100985',
        sender: '100084920192',
        senderName: 'Aditi Verma',
        receiver: '600049281726',
        receiverName: 'Zomato Enterprise',
        type: 'Transfer',
        amount: 1240.00,
        date: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
        reference: 'REF892023',
        status: 'Success',
        charges: 2.00,
        description: 'Corporate catering reimbursement'
      },
      {
        id: 'TX100986',
        sender: '700019283746',
        senderName: 'Siddharth Mehta',
        receiver: '100084920192',
        receiverName: 'Aditi Verma',
        type: 'Transfer',
        amount: 50000.00,
        date: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
        reference: 'REF892024',
        status: 'Rolled Back',
        failureReason: 'TWO_PHASE_COMMIT_ABORT: Receiver ledger update timed out after Phase 1 commit lock',
        charges: 0.00,
        description: 'Inter-bank peer transfer'
      },
      {
        id: 'TX100987',
        sender: '100084920192',
        senderName: 'Aditi Verma',
        receiver: '800039281726',
        receiverName: 'Tata Power Electricity',
        type: 'Withdraw',
        amount: 3420.00,
        date: new Date(Date.now() - 1000 * 60 * 4320).toISOString(),
        reference: 'REF892025',
        status: 'Success',
        charges: 0.00,
        description: 'Utility bill payment'
      },
      {
        id: 'TX100988',
        sender: '900019283746',
        senderName: 'Priya Nair',
        receiver: '100084920192',
        receiverName: 'Aditi Verma',
        type: 'Deposit',
        amount: 20000.00,
        date: new Date(Date.now() - 1000 * 60 * 5760).toISOString(),
        reference: 'REF892026',
        status: 'Success',
        charges: 0.00,
        description: 'Consulting fee deposit'
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

    // Unshift to list with Processing status
    const currentList = this.rawTransactions();
    this.rawTransactions.set([updatedPending, ...currentList]);
    this.tx$.next(this.rawTransactions());

    // Simulate Two-Phase Commit Atomic Execution
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15; // 85% success rate
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
    }, 2500);

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
