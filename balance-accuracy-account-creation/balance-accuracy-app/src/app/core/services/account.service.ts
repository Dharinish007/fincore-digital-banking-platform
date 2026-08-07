import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

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
  status: 'Pending' | 'Active';
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

/**
 * Handles account origination for the Accounts section. This is
 * intentionally independent of BalanceAccuracyService — it does not
 * read from or write to the balance-accuracy ledger/audit pipeline.
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountsSubject = new BehaviorSubject<OpenedAccount[]>([]);
  public accounts$ = this.accountsSubject.asObservable();

  private sequence = 1;

  list(): Observable<OpenedAccount[]> {
    return this.accounts$;
  }

  create(request: CreateAccountRequest): Observable<OpenedAccount> {
    const seq = this.sequence++;

    const account: OpenedAccount = {
      accountNumber: `ACC-${30000000 + seq * 617}`,
      customerId: `CUST-${70000 + seq}`,
      name: request.fullname,
      email: request.email,
      mobile: request.mobile,
      branch: request.branch,
      accountType: request.accountType,
      openingBalance: request.initialDeposit,
      status: 'Pending',
      openedDate: new Date().toISOString()
    };

    return of(account).pipe(
      delay(600),
      tap(acc => this.accountsSubject.next([acc, ...this.accountsSubject.getValue()]))
    );
  }
}
