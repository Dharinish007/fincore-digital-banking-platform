import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Beneficiary } from './models/beneficiary.model';
import { Payment } from './models/payment.model';
import { FraudCheck } from './models/fraud-check.model';
import { BeneficiaryService } from '../services/beneficiary.service';

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

  constructor(private beneficiaryService: BeneficiaryService) {}

  /**
   * Fetch available sender accounts for dropdown selection
   */
  getAccounts(): Observable<UserAccount[]> {
    return of([...this.mockAccounts]);
  }

  /**
   * Fetch all beneficiaries dynamically from shared BeneficiaryService
   */
  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaryService.getBeneficiaries();
  }

  /**
   * Fetch only Verified beneficiaries eligible for payment initiation
   */
  getVerifiedBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaryService.getVerifiedBeneficiaries();
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
