import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Customer,
  Account,
  Transaction,
  Loan,
  Payment,
  Beneficiary,
  KYCRecord,
  FraudRecord,
  AuditLog,
  NotificationItem,
  AppUser,
  MicroserviceHealth,
  KafkaTopicEvent,
  UserRole
} from '../models/banking.models';
import {
  MOCK_CUSTOMERS,
  MOCK_ACCOUNTS,
  MOCK_TRANSACTIONS,
  MOCK_LOANS,
  MOCK_PAYMENTS,
  MOCK_BENEFICIARIES,
  MOCK_KYC_RECORDS,
  MOCK_FRAUD_RECORDS,
  MOCK_AUDIT_LOGS,
  MOCK_NOTIFICATIONS,
  MOCK_USERS,
  MOCK_MICROSERVICES,
  MOCK_KAFKA_EVENTS
} from '../mock/banking-mock-data';

@Injectable({
  providedIn: 'root'
})
export class BankingService {
  private apiUrl = environment.apiUrl;

  private customers$ = new BehaviorSubject<Customer[]>(MOCK_CUSTOMERS);
  private accounts$ = new BehaviorSubject<Account[]>(MOCK_ACCOUNTS);
  private transactions$ = new BehaviorSubject<Transaction[]>(MOCK_TRANSACTIONS);
  private loans$ = new BehaviorSubject<Loan[]>(MOCK_LOANS);
  private payments$ = new BehaviorSubject<Payment[]>(MOCK_PAYMENTS);
  private beneficiaries$ = new BehaviorSubject<Beneficiary[]>(MOCK_BENEFICIARIES);
  private kycRecords$ = new BehaviorSubject<KYCRecord[]>(MOCK_KYC_RECORDS);
  private fraudRecords$ = new BehaviorSubject<FraudRecord[]>(MOCK_FRAUD_RECORDS);
  private auditLogs$ = new BehaviorSubject<AuditLog[]>(MOCK_AUDIT_LOGS);
  private notifications$ = new BehaviorSubject<NotificationItem[]>(MOCK_NOTIFICATIONS);
  private users$ = new BehaviorSubject<AppUser[]>(MOCK_USERS);
  private microservices$ = new BehaviorSubject<MicroserviceHealth[]>(MOCK_MICROSERVICES);
  private kafkaEvents$ = new BehaviorSubject<KafkaTopicEvent[]>(MOCK_KAFKA_EVENTS);

  // Active user / role state
  private currentUserRole$ = new BehaviorSubject<UserRole>('Banking Admin');
  private activeEnvironment$ = new BehaviorSubject<string>('CORE BANKING (Team A) — http://localhost:8080');

  constructor(private http: HttpClient) {
    this.refreshAllData();
  }

  refreshAllData(): void {
    this.fetchCustomers();
    this.fetchAccounts();
    this.fetchTransactions();
    this.fetchLoans();
    this.fetchBeneficiaries();
    this.fetchPayments();
  }

  // ==========================================
  // CUSTOMERS
  // ==========================================

  fetchCustomers(): void {
    this.http.get<any>(`${this.apiUrl}/api/v1/customers`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      const list = res?.data?.content || res?.data || res;
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(c => this.mapCustomer(c));
        this.customers$.next(mapped);
      }
    });
  }

  getCustomers(): Observable<Customer[]> {
    return this.customers$.asObservable();
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return this.customers$.pipe(
      map(customers => customers.find(c => c.customerId === id || c.customerId === `CUST-${id}`))
    );
  }

  createCustomer(data: Omit<Customer, 'customerId' | 'customerSince'>): Observable<Customer> {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country
    };

    return this.http.post<any>(`${this.apiUrl}/api/v1/customers`, payload).pipe(
      map(res => {
        const c = res?.data || res;
        const newCustomer = this.mapCustomer(c);
        this.customers$.next([newCustomer, ...this.customers$.value]);
        this.logAudit(
          'CREATE_CUSTOMER',
          'CUSTOMER_SERVICE',
          'CUSTOMER',
          newCustomer.customerId,
          'null',
          JSON.stringify({ name: `${newCustomer.firstName} ${newCustomer.lastName}`, email: newCustomer.email })
        );
        return newCustomer;
      }),
      catchError(() => {
        // Graceful fallback for offline mode
        const newId = 'CUST-' + Math.floor(1000 + Math.random() * 9000);
        const fallbackCustomer: Customer = {
          ...data,
          customerId: newId,
          customerSince: new Date().toISOString().split('T')[0]
        };
        this.customers$.next([fallbackCustomer, ...this.customers$.value]);
        return of(fallbackCustomer);
      })
    );
  }

  private mapCustomer(c: any): Customer {
    const custNum = c.customerNumber || (c.id ? `CUST-${c.id}` : 'CUST-1001');
    return {
      customerId: custNum,
      firstName: c.firstName || 'Customer',
      lastName: c.lastName || '',
      dateOfBirth: c.dateOfBirth ? String(c.dateOfBirth) : '1990-01-15',
      gender: c.gender || 'Male',
      email: c.email || `${c.firstName || 'user'}.${c.lastName || 'fincore'}@fincore.bank`.toLowerCase(),
      phone: c.phoneNumber || c.phone || '9876543210',
      pan: c.pan || 'ABCDE1234F',
      aadhaarRef: c.aadhaarRef || `XXXX-XXXX-${c.id || 1001}`,
      address: c.address || '100 Wall Street',
      city: c.city || 'Mumbai',
      state: c.state || 'Maharashtra',
      postalCode: c.postalCode || '400001',
      country: c.country || 'India',
      employmentType: c.employmentType || 'Salaried',
      annualIncome: c.annualIncome || 1200000,
      kycStatus: c.kycStatus === 'VERIFIED' ? 'Verified' : c.kycStatus === 'PENDING' ? 'Pending' : c.kycStatus === 'REJECTED' ? 'Rejected' : (c.kycStatus || 'Verified'),
      riskScore: c.riskLevel === 'LOW' ? 15 : c.riskLevel === 'HIGH' ? 80 : 40,
      riskCategory: c.riskLevel === 'LOW' ? 'Low' : c.riskLevel === 'HIGH' ? 'High' : c.riskLevel === 'CRITICAL' ? 'Critical' : 'Medium',
      customerSince: c.createdAt ? String(c.createdAt).substring(0, 10) : '2026-01-15',
      status: c.status === 'ACTIVE' ? 'Active' : c.status === 'BLOCKED' ? 'Blocked' : 'Active'
    };
  }

  // ==========================================
  // ACCOUNTS
  // ==========================================

  fetchAccounts(): void {
    this.http.get<any>(`${this.apiUrl}/api/v1/accounts`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      const list = Array.isArray(res) ? res : (res?.data?.content || res?.data || []);
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(a => this.mapAccount(a));
        this.accounts$.next(mapped);
      }
    });
  }

  getAccounts(): Observable<Account[]> {
    return this.accounts$.asObservable();
  }

  getAccountById(id: string): Observable<Account | undefined> {
    return this.accounts$.pipe(
      map(accounts => accounts.find(a => a.accountId === id || a.accountNumber.includes(id)))
    );
  }

  createAccount(account: Omit<Account, 'accountId' | 'openedDate' | 'lastUpdated'>): Observable<Account> {
    const rawCustId = String(account.customerId).replace(/\D/g, '') || '1';
    const numCustId = parseInt(rawCustId, 10) || 1;

    const payload = {
      customerId: numCustId,
      accountType: account.accountType ? account.accountType.toUpperCase() : 'SAVINGS',
      initialBalance: account.balance || 10000
    };

    return this.http.post<any>(`${this.apiUrl}/api/v1/accounts`, payload).pipe(
      map(res => {
        const a = res?.data || res;
        const newAccount = this.mapAccount(a);
        this.accounts$.next([newAccount, ...this.accounts$.value]);
        this.logAudit(
          'CREATE_ACCOUNT',
          'ACCOUNT_SERVICE',
          'ACCOUNT',
          newAccount.accountId,
          'null',
          JSON.stringify({ type: newAccount.accountType, customer: newAccount.customerName, balance: newAccount.balance })
        );
        return newAccount;
      }),
      catchError(() => {
        const newAccId = 'ACC-' + Math.floor(100000 + Math.random() * 900000);
        const fallbackAccount: Account = {
          ...account,
          accountId: newAccId,
          openedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        this.accounts$.next([fallbackAccount, ...this.accounts$.value]);
        return of(fallbackAccount);
      })
    );
  }

  updateAccountStatus(accountId: string, status: Account['status']): Observable<boolean> {
    const cleanId = String(accountId).replace(/\D/g, '') || '1';
    const mappedStatus = status.toUpperCase();

    return this.http.patch<any>(`${this.apiUrl}/api/v1/accounts/${cleanId}/status`, { status: mappedStatus }).pipe(
      map(() => {
        const list = this.accounts$.value.map(acc => {
          if (acc.accountId === accountId || acc.accountId === cleanId) {
            return { ...acc, status, lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) };
          }
          return acc;
        });
        this.accounts$.next(list);
        this.logAudit('UPDATE_ACCOUNT_STATUS', 'ACCOUNT_SERVICE', 'ACCOUNT', accountId, 'status_change', status);
        return true;
      }),
      catchError(() => {
        const list = this.accounts$.value.map(acc => {
          if (acc.accountId === accountId) {
            return { ...acc, status, lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) };
          }
          return acc;
        });
        this.accounts$.next(list);
        return of(true);
      })
    );
  }

  private mapAccount(a: any): Account {
    const accNum = a.accountNumber || `ACC-${a.accountId || a.id || 101001}`;
    const rawId = String(a.accountId || a.id || accNum);
    return {
      accountId: rawId,
      accountNumber: accNum,
      fullAccountNumber: accNum,
      customerId: a.customerId ? (String(a.customerId).startsWith('CUST') ? String(a.customerId) : `CUST-${a.customerId}`) : 'CUST-1001',
      customerName: a.customerName || (a.customerId === 1 ? 'John Doe' : a.customerId === 2 ? 'Ravana Kumar' : 'Valued Customer'),
      accountType: a.accountType ? (a.accountType.charAt(0).toUpperCase() + a.accountType.slice(1).toLowerCase()) : 'Savings',
      balance: Number(a.balance || 0),
      availableBalance: Number(a.balance || 0),
      currency: 'INR',
      branchCode: 'FINC0001201',
      branchName: 'Nariman Point, Mumbai',
      ifsc: 'FINC0004592',
      status: a.status === 'ACTIVE' ? 'Active' : a.status === 'DORMANT' ? 'Dormant' : a.status === 'FROZEN' ? 'Frozen' : 'Active',
      openedDate: a.createdAt ? String(a.createdAt).substring(0, 10) : '2026-01-01',
      lastUpdated: a.createdAt ? String(a.createdAt).replace('T', ' ').substring(0, 19) : '2026-09-04 10:00:00',
      interestRate: 4.25
    };
  }

  // ==========================================
  // TRANSACTIONS
  // ==========================================

  fetchTransactions(): void {
    this.http.get<any>(`${this.apiUrl}/api/v1/transactions`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      const list = res?.content || res?.data?.content || res?.data || res;
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(t => this.mapTransaction(t));
        this.transactions$.next(mapped);
      }
    });
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$.asObservable();
  }

  initiateTransaction(data: Omit<Transaction, 'transactionId' | 'timestamp' | 'balanceAfter'>): Observable<Transaction> {
    const payload = {
      sourceAccountId: data.accountNumber || data.accountId,
      type: data.transactionType.toUpperCase(),
      amount: data.amount,
      description: data.description || `${data.transactionType} Transaction`,
      referenceNumber: `TXN${Date.now()}`
    };

    return this.http.post<any>(`${this.apiUrl}/api/v1/transactions`, payload).pipe(
      map(res => {
        const t = res?.data || res;
        const newTxn = this.mapTransaction(t);
        this.transactions$.next([newTxn, ...this.transactions$.value]);
        this.fetchAccounts(); // Update account balances
        this.logAudit('EXECUTE_TRANSACTION', 'TRANSACTION_SERVICE', 'TRANSACTION', newTxn.transactionId, 'null', JSON.stringify({ amount: newTxn.amount, type: newTxn.transactionType }));
        return newTxn;
      }),
      catchError(() => {
        // Fallback local update
        const txnId = 'TXN' + new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 15);
        const accounts = this.accounts$.value;
        const targetAccount = accounts.find(a => a.accountId === data.accountId || a.accountNumber === data.accountNumber);

        let newBal = targetAccount ? targetAccount.balance : 500000;
        if (data.transactionType === 'Debit' || data.transactionType === 'Withdrawal') {
          newBal -= data.amount;
        } else if (data.transactionType === 'Credit' || data.transactionType === 'Deposit') {
          newBal += data.amount;
        }

        if (targetAccount) {
          targetAccount.balance = newBal;
          targetAccount.availableBalance = newBal;
          this.accounts$.next([...accounts]);
        }

        const newTxn: Transaction = {
          ...data,
          transactionId: txnId,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          balanceAfter: newBal
        };

        this.transactions$.next([newTxn, ...this.transactions$.value]);
        return of(newTxn);
      })
    );
  }

  reverseTransaction(txnId: string): Observable<boolean> {
    const txns = this.transactions$.value;
    const found = txns.find(t => t.transactionId === txnId);
    if (!found) return of(false);

    found.status = 'Reversed';
    this.transactions$.next([...txns]);

    this.logAudit('REVERSE_TRANSACTION', 'TRANSACTION_SERVICE', 'TRANSACTION', txnId, 'Success', 'Reversed');
    return of(true);
  }

  private mapTransaction(t: any): Transaction {
    const txType = (t.type === 'DEPOSIT' || t.type === 'Credit') ? 'Credit' : (t.type === 'WITHDRAWAL' || t.type === 'Debit') ? 'Debit' : 'Transfer';
    return {
      transactionId: t.referenceId || (t.id ? `TXN-${t.id}` : `TXN${Date.now()}`),
      accountId: t.accountNumber || 'ACC-101001',
      accountNumber: t.accountNumber || 'ACC-101001',
      customerId: 'CUST-1001',
      customerName: 'FinCore Client',
      transactionType: txType,
      amount: Number(t.amount || 0),
      currency: t.currency || 'INR',
      referenceNumber: t.referenceId || `REF-${t.id || 1}`,
      description: t.remarks || t.description || 'Core Banking Transaction',
      channel: 'Net Banking',
      status: t.status === 'SUCCESS' ? 'Success' : t.status === 'FAILED' ? 'Failed' : 'Pending',
      timestamp: t.createdAt ? String(t.createdAt).replace('T', ' ').substring(0, 19) : '2026-09-04 10:00:00',
      balanceAfter: Number(t.balanceAfter || 0),
      category: 'Transfer'
    };
  }

  // ==========================================
  // LOANS
  // ==========================================

  fetchLoans(): void {
    this.http.get<any>(`${this.apiUrl}/api/v1/loans`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      const list = res?.data?.content || res?.data || res?.content || res;
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(l => this.mapLoan(l));
        this.loans$.next(mapped);
      }
    });
  }

  getLoans(): Observable<Loan[]> {
    return this.loans$.asObservable();
  }

  applyLoan(loan: Omit<Loan, 'loanId' | 'applicationDate' | 'isNPA' | 'repaidAmount'>): Observable<Loan> {
    const loanId = 'LN' + Math.floor(1000000 + Math.random() * 9000000);
    const newLoan: Loan = {
      ...loan,
      loanId,
      applicationDate: new Date().toISOString().split('T')[0],
      isNPA: false,
      repaidAmount: 0
    };
    this.loans$.next([newLoan, ...this.loans$.value]);
    this.logAudit('APPLY_LOAN', 'LOAN_SERVICE', 'LOAN', loanId, 'null', JSON.stringify({ type: newLoan.loanType, principal: newLoan.principalAmount }));
    return of(newLoan);
  }

  updateLoanStatus(loanId: string, status: Loan['status']): Observable<boolean> {
    const loans = this.loans$.value.map(l => {
      if (l.loanId === loanId) {
        return {
          ...l,
          status,
          isNPA: status === 'NPA',
          disbursementDate: status === 'Disbursed' ? new Date().toISOString().split('T')[0] : l.disbursementDate
        };
      }
      return l;
    });
    this.loans$.next(loans);
    this.logAudit('UPDATE_LOAN_STATUS', 'LOAN_SERVICE', 'LOAN', loanId, 'status_change', JSON.stringify({ status }));
    return of(true);
  }

  private mapLoan(l: any): Loan {
    return {
      loanId: l.loanNumber || `LN${l.id || 100001}`,
      customerId: l.customerId ? `CUST-${l.customerId}` : 'CUST-1001',
      customerName: l.customerName || 'John Doe',
      loanType: (l.loanType || 'Personal Loan') as any,
      principalAmount: Number(l.principalAmount || l.amount || 250000),
      interestRate: Number(l.interestRate || 10.5),
      tenureMonths: Number(l.tenureMonths || 36),
      emiAmount: Number(l.emiAmount || 8120),
      outstandingAmount: Number(l.outstandingAmount || l.principalAmount || 250000),
      creditScore: Number(l.creditScore || 750),
      applicationDate: l.createdAt ? String(l.createdAt).substring(0, 10) : '2026-02-01',
      disbursementDate: l.disbursementDate ? String(l.disbursementDate).substring(0, 10) : undefined,
      status: (l.status || 'Approved') as any,
      isNPA: l.status === 'NPA',
      repaidAmount: Number(l.repaidAmount || 0)
    };
  }

  // ==========================================
  // BENEFICIARIES
  // ==========================================

  fetchBeneficiaries(): void {
    this.http.get<any>(`${this.apiUrl}/api/v1/beneficiaries`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      const list = Array.isArray(res) ? res : (res?.data || []);
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(b => this.mapBeneficiary(b));
        this.beneficiaries$.next(mapped);
      }
    });
  }

  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaries$.asObservable();
  }

  addBeneficiary(ben: Omit<Beneficiary, 'beneficiaryId' | 'createdDate' | 'verified'>): Observable<Beneficiary> {
    const payload = {
      customerId: 1,
      beneficiaryName: ben.beneficiaryName,
      accountNumber: ben.accountNumber,
      ifscCode: (ben as any).ifscCode || (ben as any).ifsc,
      bankName: ben.bankName,
      status: 'ACTIVE'
    };

    return this.http.post<any>(`${this.apiUrl}/api/v1/beneficiaries`, payload).pipe(
      map(res => {
        const b = res?.data || res;
        const newBen = this.mapBeneficiary(b);
        this.beneficiaries$.next([newBen, ...this.beneficiaries$.value]);
        this.logAudit('ADD_BENEFICIARY', 'PAYMENT_SERVICE', 'BENEFICIARY', newBen.beneficiaryId, 'null', JSON.stringify({ name: newBen.beneficiaryName, bank: newBen.bankName }));
        return newBen;
      }),
      catchError(() => {
        const beneficiaryId = 'BEN-' + Math.floor(100 + Math.random() * 900);
        const fallbackBen: Beneficiary = {
          ...ben,
          beneficiaryId,
          ifsc: (ben as any).ifscCode || (ben as any).ifsc || 'HDFC0001234',
          paymentType: 'All',
          status: 'Active',
          createdDate: new Date().toISOString().split('T')[0],
          verified: true
        };
        this.beneficiaries$.next([fallbackBen, ...this.beneficiaries$.value]);
        return of(fallbackBen);
      })
    );
  }

  deleteBeneficiary(id: string): Observable<boolean> {
    const numId = id.replace(/\D/g, '') || id;
    return this.http.delete(`${this.apiUrl}/api/v1/beneficiaries/${numId}`).pipe(
      map(() => {
        const list = this.beneficiaries$.value.filter(b => b.beneficiaryId !== id);
        this.beneficiaries$.next(list);
        return true;
      }),
      catchError(() => {
        const list = this.beneficiaries$.value.filter(b => b.beneficiaryId !== id);
        this.beneficiaries$.next(list);
        return of(true);
      })
    );
  }

  private mapBeneficiary(b: any): Beneficiary {
    return {
      beneficiaryId: `BEN-${b.beneficiaryId || b.id || Math.floor(100 + Math.random() * 900)}`,
      customerId: `CUST-${b.customerId || 1}`,
      beneficiaryName: b.beneficiaryName,
      accountNumber: b.accountNumber,
      ifsc: b.ifscCode || b.ifsc || 'HDFC0001234',
      bankName: b.bankName || 'HDFC Bank',
      paymentType: 'All',
      verified: b.status === 'ACTIVE',
      createdDate: '2026-08-01',
      status: b.status === 'ACTIVE' ? 'Active' : 'Inactive'
    };
  }

  // ==========================================
  // PAYMENTS
  // ==========================================

  fetchPayments(): void {
    this.http.get<any>(`${this.apiUrl}/api/v1/payments`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      const list = Array.isArray(res) ? res : (res?.data || []);
      if (Array.isArray(list) && list.length > 0) {
        const mapped = list.map(p => this.mapPayment(p));
        this.payments$.next(mapped);
      }
    });
  }

  getPayments(): Observable<Payment[]> {
    return this.payments$.asObservable();
  }

  initiatePayment(data: {
    sourceAccount: string;
    beneficiaryId: string;
    beneficiaryName: string;
    beneficiaryAccount: string;
    paymentType: 'UPI' | 'IMPS' | 'NEFT';
    amount: number;
    remarks?: string;
  }): Observable<Payment> {
    const benId = parseInt(data.beneficiaryId.replace(/\D/g, '') || '1', 10);
    const payload = {
      customerId: 1,
      beneficiaryId: benId,
      amount: data.amount,
      paymentMode: data.paymentType,
      remarks: data.remarks || 'Funds Transfer'
    };

    return this.http.post<any>(`${this.apiUrl}/api/v1/payments`, payload).pipe(
      map(res => {
        const p = res?.data || res;
        const newPayment = this.mapPayment(p);
        this.payments$.next([newPayment, ...this.payments$.value]);
        this.fetchAccounts();
        this.fetchTransactions();
        return newPayment;
      }),
      catchError(() => {
        const paymentId = 'PAY' + new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 15);
        const newPayment: Payment = {
          paymentId,
          customerId: 'CUS100234',
          sourceAccount: data.sourceAccount,
          beneficiaryId: data.beneficiaryId,
          beneficiaryName: data.beneficiaryName,
          beneficiaryAccount: data.beneficiaryAccount,
          paymentType: data.paymentType,
          amount: data.amount,
          transactionReference: `${data.paymentType}-FINC-${Math.floor(100000000 + Math.random() * 900000000)}`,
          status: 'Success',
          fraudScore: 12,
          settlementStatus: 'Settled',
          initiatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          remarks: data.remarks || 'Funds Transfer'
        };
        this.payments$.next([newPayment, ...this.payments$.value]);
        return of(newPayment);
      })
    );
  }

  private mapPayment(p: any): Payment {
    const rawStatus = (p.status || '').toUpperCase();
    const status: Payment['status'] = rawStatus === 'SUCCESS' ? 'Success' : rawStatus === 'FAILED' ? 'Failed' : rawStatus === 'PROCESSING' ? 'Processing' : 'Initiated';
    return {
      paymentId: p.paymentReference || `PAY-${p.id || Date.now()}`,
      customerId: `CUST-${p.customerId || 1}`,
      sourceAccount: '109283748291',
      beneficiaryId: `BEN-${p.beneficiaryId || 1}`,
      beneficiaryName: 'Beneficiary Payee',
      beneficiaryAccount: '987654321098',
      paymentType: p.paymentMode || 'UPI',
      amount: Number(p.amount || 0),
      transactionReference: p.paymentReference || `PAY-FINC-${p.id || 101}`,
      status,
      fraudScore: 10,
      settlementStatus: rawStatus === 'SUCCESS' ? 'Settled' : 'Pending',
      initiatedAt: p.createdAt ? String(p.createdAt).replace('T', ' ').substring(0, 19) : '2026-09-04 10:00:00',
      completedAt: p.updatedAt ? String(p.updatedAt).replace('T', ' ').substring(0, 19) : '2026-09-04 10:00:01',
      remarks: p.remarks || 'Funds Transfer'
    };
  }

  // ==========================================
  // KYC
  // ==========================================

  getKYCRecords(): Observable<KYCRecord[]> {
    return this.kycRecords$.asObservable();
  }

  submitKYC(record: Omit<KYCRecord, 'kycId'>): Observable<KYCRecord> {
    const kycId = 'KYC-' + Math.floor(100000 + Math.random() * 900000);
    const newRec: KYCRecord = { ...record, kycId };
    this.kycRecords$.next([newRec, ...this.kycRecords$.value]);
    this.logAudit('SUBMIT_KYC', 'KYC_SERVICE', 'KYC', kycId, 'null', JSON.stringify({ customer: newRec.customerName, doc: newRec.documentType }));
    return of(newRec);
  }

  updateKYCStatus(kycId: string, status: KYCRecord['verificationStatus']): Observable<boolean> {
    const records = this.kycRecords$.value.map(k => {
      if (k.kycId === kycId) {
        return {
          ...k,
          verificationStatus: status,
          verifiedAt: status === 'Verified' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : k.verifiedAt
        };
      }
      return k;
    });
    this.kycRecords$.next(records);
    return of(true);
  }

  // ==========================================
  // FRAUD & AUDIT
  // ==========================================

  getFraudRecords(): Observable<FraudRecord[]> {
    return this.fraudRecords$.asObservable();
  }

  resolveFraudAlert(fraudId: string, action: 'Cleared' | 'Blocked'): Observable<boolean> {
    const list = this.fraudRecords$.value.map(f => {
      if (f.fraudId === fraudId) {
        return { ...f, status: action };
      }
      return f;
    });
    this.fraudRecords$.next(list);
    this.logAudit('RESOLVE_FRAUD_ALERT', 'FRAUD_ENGINE', 'FRAUD', fraudId, 'Flagged', action);
    return of(true);
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.auditLogs$.asObservable();
  }

  logAudit(action: string, module: string, entityType: string, entityId: string, prev: string, next: string): void {
    const auditId = 'AUD-' + Math.floor(10000000 + Math.random() * 90000000);
    // Real audit trail will be provided by Team D in the next integration step.
    // Fake random hexadecimal generation removed to maintain integrity.
    const newLog: AuditLog = {
      auditId,
      userId: 'USR-OP-01',
      userName: 'Operations Admin',
      action,
      module,
      entityType,
      entityId,
      previousValue: prev,
      newValue: next,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      result: 'Success',
      integrityHash: 'PENDING_TEAM_D_INTEGRATION'
    };
    this.auditLogs$.next([newLog, ...this.auditLogs$.value]);
  }

  // ==========================================
  // NOTIFICATIONS, USERS, HEALTH
  // ==========================================

  getNotifications(): Observable<NotificationItem[]> {
    return this.notifications$.asObservable();
  }

  sendNotification(notif: Omit<NotificationItem, 'notificationId' | 'status' | 'createdAt' | 'deliveredAt'>): void {
    const id = 'NOTIF-' + Math.floor(100 + Math.random() * 900);
    const item: NotificationItem = {
      ...notif,
      notificationId: id,
      status: 'Delivered',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      deliveredAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.notifications$.next([item, ...this.notifications$.value]);
  }

  markNotificationAsRead(id: string): void {
    const list = this.notifications$.value.map(n => n.notificationId === id ? { ...n, status: 'Read' as const } : n);
    this.notifications$.next(list);
  }

  getUsers(): Observable<AppUser[]> {
    return this.users$.asObservable();
  }

  updateUserRole(userId: string, role: UserRole): Observable<boolean> {
    const users = this.users$.value.map(u => u.userId === userId ? { ...u, role } : u);
    this.users$.next(users);
    this.logAudit('UPDATE_USER_ROLE', 'IAM_SERVICE', 'USER', userId, 'ROLE_CHANGE', JSON.stringify({ role }));
    return of(true);
  }

  getMicroservices(): Observable<MicroserviceHealth[]> {
    return this.microservices$.asObservable();
  }

  getKafkaEvents(): Observable<KafkaTopicEvent[]> {
    return this.kafkaEvents$.asObservable();
  }

  getCurrentUserRole(): Observable<UserRole> {
    return this.currentUserRole$.asObservable();
  }

  setCurrentUserRole(role: UserRole): void {
    this.currentUserRole$.next(role);
  }

  getActiveEnvironment(): Observable<string> {
    return this.activeEnvironment$.asObservable();
  }

  calculateEMI(principal: number, annualInterestRate: number, tenureMonths: number): {
    emi: number;
    totalInterest: number;
    totalPayment: number;
  } {
    const monthlyRate = annualInterestRate / 12 / 100;
    if (monthlyRate === 0) {
      const emi = principal / tenureMonths;
      return { emi: Math.round(emi), totalInterest: 0, totalPayment: principal };
    }
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  }
}
