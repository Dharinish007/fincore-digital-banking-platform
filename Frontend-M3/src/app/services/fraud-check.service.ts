import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { FraudCheck } from '../payment-initiation/models/fraud-check.model';

@Injectable({
  providedIn: 'root',
})
export class FraudCheckService {
  private initialFraudChecks: FraudCheck[] = [
    {
      fraud_check_id: 5001,
      payment_id: 9001,
      risk_score: 78,
      fraud_status: 'Pending',
      rule_triggered: 'Unusual Beneficiary + High Amount',
      checked_at: '2026-08-22 09:12:00',
      customer_name: 'Rohit Malhotra',
      beneficiary_name: 'Global Logistics Pvt Ltd',
      from_account_no: 'XXXXXX1234',
      to_account_no: 'XXXX7788',
      amount: 485000,
      payment_mode: 'RTGS',
    },
    {
      fraud_check_id: 5002,
      payment_id: 9002,
      risk_score: 92,
      fraud_status: 'Pending',
      rule_triggered: 'Velocity Check Failed - Multiple Txns in 5 min',
      checked_at: '2026-08-22 09:40:00',
      customer_name: 'Ayesha Khan',
      beneficiary_name: 'TechCorp Solutions',
      from_account_no: 'XXXXXX5678',
      to_account_no: 'XXXX9101',
      amount: 950000,
      payment_mode: 'NEFT',
    },
    {
      fraud_check_id: 5003,
      payment_id: 9003,
      risk_score: 12,
      fraud_status: 'Safe',
      rule_triggered: 'NONE',
      remarks: 'Automated real-time fraud analysis: Low Risk / Cleared',
      checked_at: '2026-08-21 16:05:00',
      customer_name: 'Neha Verma',
      beneficiary_name: 'John Mathew',
      from_account_no: 'XXXXXX1234',
      to_account_no: 'XXXX1234',
      amount: 25000,
      payment_mode: 'UPI',
    },
    {
      fraud_check_id: 5004,
      payment_id: 9004,
      risk_score: 55,
      fraud_status: 'Suspicious',
      rule_triggered: 'New Beneficiary + Odd Hour Transaction',
      remarks: 'Flagged for manual review by risk analyst',
      checked_at: '2026-08-21 23:58:00',
      customer_name: 'Vikram Singh',
      beneficiary_name: 'Priya Sharma',
      from_account_no: 'XXXXXX9012',
      to_account_no: 'XXXX3344',
      amount: 150000,
      payment_mode: 'IMPS',
    },
    {
      fraud_check_id: 5005,
      payment_id: 9005,
      risk_score: 8,
      fraud_status: 'Safe',
      rule_triggered: 'NONE',
      checked_at: '2026-08-21 11:20:00',
      customer_name: 'Sanjay Patel',
      beneficiary_name: 'ABC Enterprises',
      from_account_no: 'XXXXXX5678',
      to_account_no: 'XXXX5678',
      amount: 68000,
      payment_mode: 'NEFT',
    },
    {
      fraud_check_id: 5006,
      payment_id: 9006,
      risk_score: 88,
      fraud_status: 'Blocked',
      rule_triggered: 'Sanctioned Entity Match',
      remarks: 'Transaction blocked - beneficiary matched watchlist',
      checked_at: '2026-08-20 14:33:00',
      customer_name: 'Meera Iyer',
      beneficiary_name: 'Global Logistics Pvt Ltd',
      from_account_no: 'XXXXXX1234',
      to_account_no: 'XXXX7788',
      amount: 720000,
      payment_mode: 'RTGS',
    },
    {
      fraud_check_id: 5007,
      payment_id: 9007,
      risk_score: 34,
      fraud_status: 'Pending',
      rule_triggered: 'Amount Deviation from Customer Average',
      checked_at: '2026-08-22 10:02:00',
      customer_name: 'Arjun Reddy',
      beneficiary_name: 'TechCorp Solutions',
      from_account_no: 'XXXXXX9012',
      to_account_no: 'XXXX9101',
      amount: 310000,
      payment_mode: 'IMPS',
    },
  ];

  private fraudChecksSubject = new BehaviorSubject<FraudCheck[]>(this.initialFraudChecks);

  public fraudChecks$: Observable<FraudCheck[]> = this.fraudChecksSubject.asObservable();

  constructor() {}

  /**
   * Get all fraud check records as an Observable stream
   */
  getFraudChecks(): Observable<FraudCheck[]> {
    return this.fraudChecks$;
  }

  /**
   * Get only records still awaiting a fraud decision
   */
  getPendingFraudChecks(): Observable<FraudCheck[]> {
    return this.fraudChecks$.pipe(map((list) => list.filter((f) => f.fraud_status === 'Pending')));
  }

  /**
   * Approve a transaction as Safe, clearing it for execution
   */
  markSafe(fraudCheckId: number, remarks?: string): void {
    const current = this.fraudChecksSubject.getValue();
    const updated = current.map((f) =>
      f.fraud_check_id === fraudCheckId
        ? {
            ...f,
            fraud_status: 'Safe' as const,
            remarks: remarks || 'Manually reviewed and cleared by fraud analyst',
            checked_at: this.now(),
          }
        : f
    );
    this.fraudChecksSubject.next(updated);
  }

  /**
   * Flag a transaction as Suspicious for further review (does not hard-block)
   */
  flagSuspicious(fraudCheckId: number, remarks?: string): void {
    const current = this.fraudChecksSubject.getValue();
    const updated = current.map((f) =>
      f.fraud_check_id === fraudCheckId
        ? {
            ...f,
            fraud_status: 'Suspicious' as const,
            remarks: remarks || 'Flagged for manual review by risk analyst',
            checked_at: this.now(),
          }
        : f
    );
    this.fraudChecksSubject.next(updated);
  }

  /**
   * Block a transaction outright, stopping the payment
   */
  blockTransaction(fraudCheckId: number, remarks?: string): void {
    const current = this.fraudChecksSubject.getValue();
    const updated = current.map((f) =>
      f.fraud_check_id === fraudCheckId
        ? {
            ...f,
            fraud_status: 'Blocked' as const,
            remarks: remarks || 'Transaction blocked following fraud review',
            checked_at: this.now(),
          }
        : f
    );
    this.fraudChecksSubject.next(updated);
  }

  private now(): string {
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
  }
}
