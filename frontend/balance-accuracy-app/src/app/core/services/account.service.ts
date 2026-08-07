import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type OpenedAccountType = 'Savings' | 'Checking' | 'Corporate' | 'Fixed Deposit' | 'Money Market';

export interface OpenedAccount {
  accountNumber: string;
  customerId: string;
  name: string;
  email: string;
  mobile: string;
  branch: string;
  accountType: OpenedAccountType;
  openingBalance: number;
  status: 'Pending' | 'Active' | 'Verified';
  openedDate: string;
}

export interface CreateAccountRequest {
  fullname: string;
  email: string;
  mobile: string;
  dob: string;
  pan: string;
  aadhaar: string;
  address: string;
  occupation: string;
  income: number;
  nomineeName: string;
  nomineeRelation: string;
  branch: string;
  accountType: OpenedAccountType;
  initialDeposit: number;
  password: string;
  confirm: string;
  terms: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;

  private accountsSubject = new BehaviorSubject<OpenedAccount[]>([]);
  public accounts$ = this.accountsSubject.asObservable();
  private sequence = 1;

  list(): Observable<OpenedAccount[]> {
    return this.accounts$;
  }

  create(request: CreateAccountRequest): Observable<OpenedAccount> {
    return this.http.post<any>(this.apiUrl, request).pipe(
      map(res => ({
        accountNumber: res.accountNumber || `ACC-${30000000 + this.sequence * 617}`,
        customerId: String(res.customerId || `CUST-${70000 + this.sequence}`),
        name: res.customerName || request.fullname,
        email: res.email || request.email,
        mobile: res.mobile || request.mobile,
        branch: res.branch || request.branch,
        accountType: (res.accountType || request.accountType) as OpenedAccountType,
        openingBalance: res.initialDeposit !== undefined ? res.initialDeposit : request.initialDeposit,
        status: (res.status || 'Active') as 'Active',
        openedDate: res.createdAt || new Date().toISOString()
      })),
      tap(acc => this.accountsSubject.next([acc, ...this.accountsSubject.getValue()])),
      catchError(() => {
        // Fallback to local creation if backend unavailable
        const seq = this.sequence++;
        const fallbackAcc: OpenedAccount = {
          accountNumber: `ACC-${30000000 + seq * 617}`,
          customerId: `CUST-${70000 + seq}`,
          name: request.fullname,
          email: request.email,
          mobile: request.mobile,
          branch: request.branch,
          accountType: request.accountType,
          openingBalance: request.initialDeposit,
          status: 'Active',
          openedDate: new Date().toISOString()
        };
        this.accountsSubject.next([fallbackAcc, ...this.accountsSubject.getValue()]);
        return of(fallbackAcc);
      })
    );
  }
}
