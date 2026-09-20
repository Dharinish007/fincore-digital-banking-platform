import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FraudCheck } from '../payment-initiation/models/fraud-check.model';

@Injectable({
  providedIn: 'root',
})
export class FraudCheckService {
  private apiUrl = 'http://localhost:8080/fraud-check';

  constructor(private http: HttpClient) {}

  // =========================================================
  // GET ALL FRAUD CHECKS
  // =========================================================

  getFraudChecks(): Observable<FraudCheck[]> {
    return this.http.get<FraudCheck[]>(this.apiUrl);
  }

  // =========================================================
  // GET PENDING FRAUD CHECKS
  // =========================================================

  getPendingFraudChecks(): Observable<FraudCheck[]> {
    return this.http.get<FraudCheck[]>(`${this.apiUrl}/pending`);
  }

  // =========================================================
  // GET FRAUD CHECK BY PAYMENT ID
  // =========================================================

  getFraudCheckByPaymentId(paymentId: number): Observable<FraudCheck> {
    return this.http.get<FraudCheck>(`${this.apiUrl}/payment/${paymentId}`);
  }

  // =========================================================
  // MARK SAFE
  // =========================================================

  markSafe(fraudCheckId: number, remarks?: string): Observable<FraudCheck> {
    return this.http.put<FraudCheck>(`${this.apiUrl}/${fraudCheckId}/safe`, {
      remarks: remarks || 'Manually reviewed and cleared by fraud analyst',
    });
  }

  // =========================================================
  // MARK SUSPICIOUS
  // =========================================================

  flagSuspicious(
    fraudCheckId: number,
    remarks?: string,
  ): Observable<FraudCheck> {
    return this.http.put<FraudCheck>(
      `${this.apiUrl}/${fraudCheckId}/suspicious`,
      {
        remarks: remarks || 'Flagged for manual review by risk analyst',
      },
    );
  }

  // =========================================================
  // BLOCK
  // =========================================================

  blockTransaction(
    fraudCheckId: number,
    remarks?: string,
  ): Observable<FraudCheck> {
    return this.http.put<FraudCheck>(`${this.apiUrl}/${fraudCheckId}/block`, {
      remarks: remarks || 'Transaction blocked following fraud review',
    });
  }
}
