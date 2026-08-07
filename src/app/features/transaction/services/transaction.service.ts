import { Observable } from 'rxjs';
import {
  Transaction, TransactionSummary, TransactionFilter,
  TransactionHistory, CreateTransactionPayload
} from '../models/transaction.model';

export abstract class TransactionService {
  abstract getTransactions(filter?: TransactionFilter): Observable<TransactionSummary[]>;
  abstract getTransactionById(id: string): Observable<Transaction | undefined>;
  abstract getTransactionHistory(accountId?: string): Observable<TransactionHistory[]>;
  abstract createTransaction(payload: CreateTransactionPayload): Observable<Transaction>;
}
