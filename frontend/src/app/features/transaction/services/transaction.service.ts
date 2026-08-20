import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { SpringPage } from '../../../core/models/api.model';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { Transaction, TransactionSummary, TransactionFilter, TransactionHistory, CreateTransactionPayload } from '../models/transaction.model';
import { TRANSACTION_CURRENCIES_MOCK } from '../../../core/mocks/transaction.mock';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiService = inject(ApiService);
  private readonly endpoint = API_ENDPOINTS.TRANSACTIONS.BASE;

  readonly currencies = TRANSACTION_CURRENCIES_MOCK;

  getTransactions(filter?: TransactionFilter): Observable<TransactionSummary[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.transactionType) params = params.set('type', filter.transactionType);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.dateFrom) params = params.set('startDate', filter.dateFrom);
      if (filter.dateTo) params = params.set('endDate', filter.dateTo);
      if (filter.minAmount !== undefined && filter.minAmount !== null) params = params.set('minAmount', filter.minAmount.toString());
      if (filter.maxAmount !== undefined && filter.maxAmount !== null) params = params.set('maxAmount', filter.maxAmount.toString());
    }
    return this.apiService.get<SpringPage<TransactionSummary>>(this.endpoint, { params })
      .pipe(map(page => page.content || []));
  }

  getTransactionsByCustomerId(customerId: string | number): Observable<TransactionSummary[]> {
    return this.apiService.get<SpringPage<TransactionSummary>>(`${this.endpoint}/customer/${customerId}`)
      .pipe(map(page => page.content || []));
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.apiService.get<Transaction>(`${this.endpoint}/${id}`);
  }

  getTransactionHistory(accountId?: string): Observable<TransactionHistory[]> {
    let params = new HttpParams();
    if (accountId) {
      params = params.set('accountId', accountId);
      params = params.set('accountNumber', accountId);
    }
    return this.apiService.get<SpringPage<TransactionHistory>>(`${this.endpoint}/history`, { params })
      .pipe(map(page => page.content || []));
  }

  createTransaction(payload: CreateTransactionPayload): Observable<Transaction> {
    return this.apiService.post<Transaction>(this.endpoint, payload);
  }
}
