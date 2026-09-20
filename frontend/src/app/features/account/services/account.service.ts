import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import {
  Account,
  AccountSummary,
  AccountFilter,
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountStatus,
  AccountStatistics
} from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiService = inject(ApiService);

  getAccounts(filter: AccountFilter = {}): Observable<AccountSummary[]> {
    let params = new HttpParams();
    if (filter.search?.trim()) params = params.set('search', filter.search.trim());
    if (filter.status) params = params.set('status', filter.status);
    if (filter.accountType) params = params.set('accountType', filter.accountType);
    if (filter.customerId !== undefined && filter.customerId !== null) {
      params = params.set('customerId', filter.customerId.toString());
    }

    return this.apiService.get<AccountSummary[]>(API_ENDPOINTS.ACCOUNTS.BASE, { params });
  }

  getAccountsByCustomerId(customerId: string | number): Observable<AccountSummary[]> {
    return this.apiService.get<AccountSummary[]>(API_ENDPOINTS.ACCOUNTS.BY_CUSTOMER(customerId));
  }

  getAccountById(id: string | number): Observable<Account> {
    return this.apiService.get<Account>(API_ENDPOINTS.ACCOUNTS.BY_ID(id));
  }

  getAccountByNumber(accountNumber: string): Observable<Account> {
    return this.apiService.get<Account>(API_ENDPOINTS.ACCOUNTS.BY_NUMBER(accountNumber));
  }

  createAccount(payload: CreateAccountRequest): Observable<Account> {
    return this.apiService.post<Account>(API_ENDPOINTS.ACCOUNTS.BASE, payload);
  }

  updateAccount(id: string | number, payload: UpdateAccountRequest): Observable<Account> {
    return this.apiService.put<Account>(API_ENDPOINTS.ACCOUNTS.BY_ID(id), payload);
  }

  updateStatus(id: string | number, status: AccountStatus | string): Observable<Account> {
    return this.apiService.patch<Account>(API_ENDPOINTS.ACCOUNTS.STATUS(id), { status });
  }

  getStatistics(): Observable<AccountStatistics> {
    return this.apiService.get<AccountStatistics>(API_ENDPOINTS.ACCOUNTS.STATISTICS);
  }
}
