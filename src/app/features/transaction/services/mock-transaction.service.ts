import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TransactionService } from './transaction.service';
import {
  Transaction, TransactionSummary, TransactionFilter,
  TransactionHistory, CreateTransactionPayload,
  TransactionType, TransactionStatus, Currency
} from '../models/transaction.model';
import { TRANSACTIONS_MOCK, TRANSACTION_ACCOUNT_STUBS_MOCK, TRANSACTION_CURRENCIES_MOCK } from '../../../core/mocks/transaction.mock';

@Injectable({ providedIn: 'root' })
export class MockTransactionService implements TransactionService {
  private transactionsSignal = signal<Transaction[]>([...TRANSACTIONS_MOCK]);

  readonly accountStubs  = TRANSACTION_ACCOUNT_STUBS_MOCK;
  readonly currencies    = TRANSACTION_CURRENCIES_MOCK;
  readonly transactionTypes  = Object.values(TransactionType);
  readonly transactionStatuses = Object.values(TransactionStatus);

  private wrap<T>(data: T): Observable<T> {
    return of(data).pipe(delay(450));
  }

  getTransactions(filter?: TransactionFilter): Observable<TransactionSummary[]> {
    let txns = [...this.transactionsSignal()];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      txns = txns.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.referenceNumber.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerId.toLowerCase().includes(q) ||
        t.sourceAccountNumber.toLowerCase().includes(q)
      );
    }
    if (filter?.transactionType) txns = txns.filter(t => t.type === filter.transactionType);
    if (filter?.status)          txns = txns.filter(t => t.status === filter.status);
    if (filter?.dateFrom)        txns = txns.filter(t => t.transactionDate >= filter.dateFrom!);
    if (filter?.dateTo)          txns = txns.filter(t => t.transactionDate <= filter.dateTo!);

    const summaries: TransactionSummary[] = txns.map(t => ({
      id: t.id, referenceNumber: t.referenceNumber,
      customerId: t.customerId, customerName: t.customerName,
      sourceAccountNumber: t.sourceAccountNumber,
      type: t.type, amount: t.amount, currency: t.currency,
      status: t.status, createdBy: t.createdBy,
      transactionDate: t.transactionDate
    }));
    return this.wrap(summaries);
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    return this.wrap(this.transactionsSignal().find(t => t.id === id));
  }

  getTransactionHistory(accountId?: string): Observable<TransactionHistory[]> {
    let txns = [...this.transactionsSignal()];
    if (accountId) {
      txns = txns.filter(t =>
        t.sourceAccountId === accountId || t.destinationAccountId === accountId
      );
    }
    const history: TransactionHistory[] = txns
      .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate))
      .map(t => ({
        transactionId: t.id,
        referenceNumber: t.referenceNumber,
        date: t.transactionDate,
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        status: t.status,
        accountNumber: t.sourceAccountNumber,
        description: t.description
      }));
    return this.wrap(history);
  }

  createTransaction(payload: CreateTransactionPayload): Observable<Transaction> {
    const txns = this.transactionsSignal();
    const seq  = String(txns.length + 1).padStart(4, '0');
    const now  = new Date().toISOString();

    const sourceStub = this.accountStubs.find((a: any) => a.id === payload.sourceAccountId);
    const destStub   = this.accountStubs.find((a: any) => a.id === payload.destinationAccountId);

    const newTxn: Transaction = {
      id:                    `TXN-${seq}`,
      referenceNumber:       payload.referenceNumber || `REF-${Date.now()}`,
      customerId:            sourceStub?.customerId  ?? '',
      customerName:          sourceStub?.customerName ?? '',
      sourceAccountId:       payload.sourceAccountId,
      sourceAccountNumber:   sourceStub?.accountNumber ?? '',
      destinationAccountId:  payload.destinationAccountId,
      destinationAccountNumber: destStub?.accountNumber,
      type:                  payload.type,
      amount:                payload.amount,
      currency:              payload.currency,
      status:                TransactionStatus.PENDING,
      description:           payload.description,
      createdBy:             'admin@fincore.com',
      transactionDate:       payload.transactionDate || now,
      createdAt:             now
    };

    this.transactionsSignal.update(list => [newTxn, ...list]);
    return this.wrap(newTxn);
  }
}
