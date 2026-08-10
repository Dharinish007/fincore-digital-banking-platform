import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type OpenedAccountType =
  | 'Savings'
  | 'Checking'
  | 'Corporate'
  | 'Fixed Deposit'
  | 'Money Market';

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
  message?: string;
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
  accountNo?: string;
  ifscCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  // Backend account creation endpoint is at /accountCreation (root path)
  private apiUrl = `${environment.apiUrl.replace('/api', '')}/accountCreation`;

  private accountsSubject = new BehaviorSubject<OpenedAccount[]>([]);
  public accounts$ = this.accountsSubject.asObservable();
  private sequence = 1;

  list(): Observable<OpenedAccount[]> {
    return this.accounts$;
  }

  create(request: CreateAccountRequest): Observable<OpenedAccount> {
    const payload = {
      customerName: request.fullname,
      email: request.email,
      phone: request.mobile,
      accountNo: request.accountNo || undefined,
      accountType: request.accountType,
      balance: request.initialDeposit,
      status: 'Active',
      branchName: request.branch,
      ifscCode: request.ifscCode || '',
    };

    return this.http
      .post(this.apiUrl, payload, { responseType: 'text' as const })
      .pipe(
        map((raw: string) => {
          let res: any = raw;
          if (typeof raw === 'string') {
            const trimmed = raw.trim();
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
              try {
                res = JSON.parse(trimmed);
              } catch {
                res = raw;
              }
            }
          }

          if (typeof res === 'string') {
            return {
              accountNumber: request.accountNo || this.generateAccountNo(),
              customerId: `CUST-${70000 + this.sequence}`,
              name: request.fullname,
              email: request.email,
              mobile: request.mobile,
              branch: request.branch,
              accountType: request.accountType,
              openingBalance: request.initialDeposit,
              status: 'Active' as const,
              openedDate: new Date().toISOString(),
              message: res,
            } as OpenedAccount;
          }

          return {
            accountNumber:
              res.accountNo || res.accountNumber || this.generateAccountNo(),
            customerId: String(
              res.customerId || `CUST-${70000 + this.sequence}`,
            ),
            name: res.customerName || request.fullname,
            email: res.email || request.email,
            mobile: res.phone || request.mobile,
            branch: res.branchName || request.branch,
            accountType: (res.accountType ||
              request.accountType) as OpenedAccountType,
            openingBalance:
              res.balance !== undefined
                ? Number(res.balance)
                : request.initialDeposit,
            status: (res.status || 'Active') as 'Active',
            openedDate: res.createdAt || new Date().toISOString(),
            message: res.message || 'Account created successfully',
          } as OpenedAccount;
        }),
        tap((acc) =>
          this.accountsSubject.next([acc, ...this.accountsSubject.getValue()]),
        ),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  private generateAccountNo(): string {
    return `SB${Math.floor(10000000 + Math.random() * 90000000)}`;
  }
}
