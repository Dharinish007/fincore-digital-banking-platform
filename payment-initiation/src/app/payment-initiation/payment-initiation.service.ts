import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Beneficiary } from './models/beneficiary.model';
import { Payment } from './models/payment.model';
import { FraudCheck } from './models/fraud-check.model';

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

  private mockBeneficiaries: Beneficiary[] = [
    {
      beneficiary_id: 101,
      customer_id: 5001,
      beneficiary_name: 'John Mathew',
      account_no: 'XXXX1234',
      ifsc_code: 'HDFC0001234',
      bank_name: 'HDFC Bank',
      beneficiary_type: 'External',
      status: 'Verified',
      created_at: '2026-01-15 10:30:00',
    },
    {
      beneficiary_id: 102,
      customer_id: 5001,
      beneficiary_name: 'ABC Enterprises',
      account_no: 'XXXX5678',
      ifsc_code: 'SBIN0005678',
      bank_name: 'State Bank of India',
      beneficiary_type: 'External',
      status: 'Verified',
      created_at: '2026-02-10 14:15:00',
    },
    {
      beneficiary_id: 103,
      customer_id: 5001,
      beneficiary_name: 'TechCorp Solutions',
      account_no: 'XXXX9101',
      ifsc_code: 'ICIC0009101',
      bank_name: 'ICICI Bank',
      beneficiary_type: 'Internal',
      status: 'Verified',
      created_at: '2026-03-01 09:00:00',
    },
    {
      beneficiary_id: 104,
      customer_id: 5001,
      beneficiary_name: 'Priya Sharma',
      account_no: 'XXXX3344',
      ifsc_code: 'UTIB0003344',
      bank_name: 'Axis Bank',
      beneficiary_type: 'External',
      status: 'Pending',
      created_at: '2026-08-18 11:20:00',
    },
    {
      beneficiary_id: 105,
      customer_id: 5001,
      beneficiary_name: 'Global Logistics Pvt Ltd',
      account_no: 'XXXX7788',
      ifsc_code: 'KKBK0007788',
      bank_name: 'Kotak Mahindra Bank',
      beneficiary_type: 'External',
      status: 'Blocked',
      created_at: '2026-05-12 16:45:00',
    },
  ];

  constructor() {}

  /**
   * Fetch available sender accounts for dropdown selection
   */
  getAccounts(): Observable<UserAccount[]> {
    return of([...this.mockAccounts]);
  }

  /**
   * Fetch all beneficiaries
   */
  getBeneficiaries(): Observable<Beneficiary[]> {
    return of([...this.mockBeneficiaries]);
  }

  /**
   * Fetch only Verified beneficiaries eligible for payment initiation
   */
  getVerifiedBeneficiaries(): Observable<Beneficiary[]> {
    const verified = this.mockBeneficiaries.filter((b) => b.status === 'Verified');
    return of(verified);
  }

  /**
   * Simulate payment initiation flow with mock delay
   */
  initiatePayment(paymentPayload: Payment): Observable<{ payment: Payment; fraudCheck: FraudCheck }> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionRef = `TXN-${dateStr}-${randomHex}`;

    const completedPayment: Payment = {
      ...paymentPayload,
      payment_id: Math.floor(Math.random() * 900000) + 100000,
      payment_status: 'Success',
      transaction_ref: transactionRef,
      initiated_at: now.toISOString().replace('T', ' ').slice(0, 19),
      updated_at: now.toISOString().replace('T', ' ').slice(0, 19),
    };

    const fraudCheckRecord: FraudCheck = {
      fraud_check_id: Math.floor(Math.random() * 900000) + 100000,
      payment_id: completedPayment.payment_id!,
      risk_score: Math.floor(Math.random() * 15), // Low risk score (0-15)
      fraud_status: 'Safe',
      rule_triggered: 'NONE',
      remarks: 'Automated real-time fraud analysis: Low Risk / Cleared',
      checked_at: completedPayment.initiated_at,
    };

    // Simulate backend asynchronous response
    return of({ payment: completedPayment, fraudCheck: fraudCheckRecord }).pipe(delay(1500));
  }
}
