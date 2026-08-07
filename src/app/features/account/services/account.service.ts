import { Observable } from 'rxjs';
import { Account, AccountSummary, AccountFilter } from '../models/account.model';

export abstract class AccountService {
  abstract getAccounts(filter?: AccountFilter): Observable<AccountSummary[]>;
  abstract getAccountById(id: string): Observable<Account | undefined>;
  abstract getAccountsByCustomerId(customerId: string): Observable<AccountSummary[]>;
  abstract createAccount(account: Partial<Account>): Observable<Account>;
  abstract updateAccount(id: string, data: Partial<Account>): Observable<Account>;
}
