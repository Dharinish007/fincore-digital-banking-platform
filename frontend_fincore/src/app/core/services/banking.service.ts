import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
  private activeEnvironment$ = new BehaviorSubject<string>('PRODUCTION (v2.4.0) — ASIA-SOUTH-1');

  constructor() {}

  // Getters
  getCustomers(): Observable<Customer[]> {
    return this.customers$.asObservable();
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return this.customers$.pipe(
      map(customers => customers.find(c => c.customerId === id))
    );
  }

  createCustomer(data: Omit<Customer, 'customerId' | 'customerSince'>): Observable<Customer> {
    const newId = 'CUS' + Math.floor(100000 + Math.random() * 900000);
    const newCustomer: Customer = {
      ...data,
      customerId: newId,
      customerSince: new Date().toISOString().split('T')[0]
    };
    this.customers$.next([newCustomer, ...this.customers$.value]);
    this.logAudit(
      'CREATE_CUSTOMER',
      'CUSTOMER_SERVICE',
      'CUSTOMER',
      newId,
      'null',
      JSON.stringify({ name: `${newCustomer.firstName} ${newCustomer.lastName}`, email: newCustomer.email })
    );
    return of(newCustomer);
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
    const newAccId = 'ACC-' + Math.floor(100000 + Math.random() * 900000);
    const newAccount: Account = {
      ...account,
      accountId: newAccId,
      openedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.accounts$.next([newAccount, ...this.accounts$.value]);
    this.logAudit(
      'CREATE_ACCOUNT',
      'ACCOUNT_SERVICE',
      'ACCOUNT',
      newAccId,
      'null',
      JSON.stringify({ type: newAccount.accountType, customer: newAccount.customerName, balance: newAccount.balance })
    );
    return of(newAccount);
  }

  updateAccountStatus(accountId: string, status: Account['status']): Observable<boolean> {
    const list = this.accounts$.value.map(acc => {
      if (acc.accountId === accountId) {
        const prev = acc.status;
        this.logAudit(
          'UPDATE_ACCOUNT_STATUS',
          'ACCOUNT_SERVICE',
          'ACCOUNT',
          accountId,
          JSON.stringify({ status: prev }),
          JSON.stringify({ status })
        );
        return { ...acc, status, lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) };
      }
      return acc;
    });
    this.accounts$.next(list);
    return of(true);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$.asObservable();
  }

  initiateTransaction(data: Omit<Transaction, 'transactionId' | 'timestamp' | 'balanceAfter'>): Observable<Transaction> {
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
    this.logAudit(
      'EXECUTE_TRANSACTION',
      'TRANSACTION_SERVICE',
      'TRANSACTION',
      txnId,
      'null',
      JSON.stringify({ amount: newTxn.amount, type: newTxn.transactionType, channel: newTxn.channel })
    );

    return of(newTxn);
  }

  reverseTransaction(txnId: string): Observable<boolean> {
    const txns = this.transactions$.value;
    const found = txns.find(t => t.transactionId === txnId);
    if (!found) return of(false);

    found.status = 'Reversed';
    this.transactions$.next([...txns]);

    this.logAudit(
      'REVERSE_TRANSACTION',
      'TRANSACTION_SERVICE',
      'TRANSACTION',
      txnId,
      JSON.stringify({ status: 'Success' }),
      JSON.stringify({ status: 'Reversed' })
    );
    return of(true);
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
    const paymentId = 'PAY' + new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 15);
    const fraudScore = Math.floor(Math.random() * 25) + 5; // Low fraud score for valid demo
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
      fraudScore,
      settlementStatus: 'Settled',
      initiatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      remarks: data.remarks || 'Funds Transfer'
    };

    this.payments$.next([newPayment, ...this.payments$.value]);

    // Also deduct balance from source account & add to transactions
    const accounts = this.accounts$.value;
    const acc = accounts.find(a => a.accountNumber === data.sourceAccount || a.accountId === data.sourceAccount);
    if (acc) {
      acc.balance -= data.amount;
      acc.availableBalance -= data.amount;
      this.accounts$.next([...accounts]);
    }

    // Add corresponding transaction
    this.initiateTransaction({
      accountId: acc ? acc.accountId : 'ACC-101001',
      accountNumber: data.sourceAccount,
      customerId: 'CUS100234',
      customerName: 'Rahul Sharma',
      transactionType: 'Debit',
      amount: data.amount,
      currency: 'INR',
      referenceNumber: newPayment.transactionReference,
      description: `${data.paymentType} to ${data.beneficiaryName}`,
      channel: data.paymentType,
      status: 'Success',
      category: 'Transfer'
    });

    // Add notification
    this.sendNotification({
      customerId: 'CUS100234',
      customerName: 'Rahul Sharma',
      notificationType: 'Transaction',
      channel: 'Push',
      title: `Transfer Successful: ₹${data.amount.toLocaleString('en-IN')}`,
      message: `₹${data.amount.toLocaleString('en-IN')} sent to ${data.beneficiaryName} via ${data.paymentType}. Ref: ${newPayment.transactionReference}`
    });

    return of(newPayment);
  }

  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaries$.asObservable();
  }

  addBeneficiary(ben: Omit<Beneficiary, 'beneficiaryId' | 'createdDate' | 'verified'>): Observable<Beneficiary> {
    const beneficiaryId = 'BEN-' + Math.floor(100 + Math.random() * 900);
    const newBen: Beneficiary = {
      ...ben,
      beneficiaryId,
      createdDate: new Date().toISOString().split('T')[0],
      verified: true
    };
    this.beneficiaries$.next([newBen, ...this.beneficiaries$.value]);
    this.logAudit('ADD_BENEFICIARY', 'PAYMENT_SERVICE', 'BENEFICIARY', beneficiaryId, 'null', JSON.stringify({ name: newBen.beneficiaryName, bank: newBen.bankName }));
    return of(newBen);
  }

  deleteBeneficiary(id: string): Observable<boolean> {
    const list = this.beneficiaries$.value.filter(b => b.beneficiaryId !== id);
    this.beneficiaries$.next(list);
    return of(true);
  }

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
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
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
      ipAddress: '10.14.2.89',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      result: 'Success',
      integrityHash: hash
    };
    this.auditLogs$.next([newLog, ...this.auditLogs$.value]);
  }

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

  // Active Role and Environment
  getCurrentUserRole(): Observable<UserRole> {
    return this.currentUserRole$.asObservable();
  }

  setCurrentUserRole(role: UserRole): void {
    this.currentUserRole$.next(role);
  }

  getActiveEnvironment(): Observable<string> {
    return this.activeEnvironment$.asObservable();
  }

  // EMI Calculator Helper
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
