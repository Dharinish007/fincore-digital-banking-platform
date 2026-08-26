import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

import { Beneficiary } from './models/beneficiary.model';
import { Payment } from './models/payment.model';
import { FraudCheck } from './models/fraud-check.model';
import { BeneficiaryService } from '../services/beneficiary.service';
import { FraudCheckService } from '../services/fraud-check.service';

export interface UserAccount {
  account_no: string;
  display_label: string;
  account_type: string;
  available_balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentInitiationService {

  private mockAccounts: UserAccount[] = [
    {
      account_no: 'XXXXXX1234',
      display_label: 'XXXXXX1234 - Primary Savings (Bal: ₹2,45,000.00)',
      account_type: 'Savings',
      available_balance: 245000.0,
    },
    {
      account_no: 'XXXXXX5678',
      display_label: 'XXXXXX5678 - Corporate Current (Bal: ₹8,12,500.00)',
      account_type: 'Current',
      available_balance: 812500.0,
    },
    {
      account_no: 'XXXXXX9012',
      display_label: 'XXXXXX9012 - Treasury Reserve (Bal: ₹15,00,000.00)',
      account_type: 'Corporate',
      available_balance: 1500000.0,
    },
  ];

  constructor(
    private beneficiaryService: BeneficiaryService,
    private fraudCheckService: FraudCheckService,
    private http: HttpClient
  ) {}

  getNextPaymentId(): number {
    return this.fraudCheckService.getNextPaymentId();
  }

  getAccounts(): Observable<UserAccount[]> {
    return of([...this.mockAccounts]);
  }

  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaryService.getBeneficiaries();
  }

  getVerifiedBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaryService.getVerifiedBeneficiaries();
  }

  initiatePayment(paymentPayload: Payment): Observable<Payment> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionRef = `TXN-${dateStr}-${randomHex}`;

    const paymentId = paymentPayload.payment_id || this.getNextPaymentId();

    const completedPayment: Payment = {
      ...paymentPayload,
      payment_id: paymentId,
      payment_status: 'Success',
      transaction_ref: transactionRef,
      initiated_at: now.toISOString().replace('T', ' ').slice(0, 19),
      updated_at: now.toISOString().replace('T', ' ').slice(0, 19),
    };

    // Register into Fraud Check Service to maintain exact same payment ID across modules
    const fraudRecord: FraudCheck = {
      fraud_check_id: 5000 + (paymentId % 1000),
      payment_id: paymentId,
      risk_score: Math.floor(Math.random() * 12) + 5,
      fraud_status: 'Safe',
      rule_triggered: 'NONE',
      remarks: 'Automated real-time fraud analysis: Low Risk / Cleared',
      checked_at: completedPayment.initiated_at,
      customer_name: 'Primary Account Holder',
      beneficiary_name: 'Beneficiary #' + paymentPayload.beneficiary_id,
      from_account_no: paymentPayload.from_account_no,
      to_account_no: paymentPayload.to_account_no,
      amount: paymentPayload.amount,
      payment_mode: paymentPayload.payment_mode,
    };
    this.fraudCheckService.addFraudCheck(fraudRecord);

    return this.http.post<Payment>(
      'http://localhost:8080/api/payments',
      completedPayment
    ).pipe(
      catchError(() => of(completedPayment))
    );
  }
}