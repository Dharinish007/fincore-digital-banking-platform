import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  LoanApplication,
  LoanOriginationPayload,
} from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class LoanOriginationService {
  private apiUrl = `${environment.apiUrl}/loan-origination`;

  constructor(private http: HttpClient) {}

  /**
   * Submit loan origination application to backend:
   * POST /api/loan-origination
   */
  createLoanApplication(
    payload: LoanOriginationPayload,
  ): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(this.apiUrl, payload);
  }

  /**
   * Fetch all loan applications from backend:
   * GET /api/loan-origination
   */
  getAllLoanApplications(): Observable<LoanApplication[]> {
    return this.http
      .get<LoanApplication[]>(this.apiUrl)
      .pipe(
        map((applications) =>
          applications.map((application) =>
            this.normalizeApplication(application),
          ),
        ),
      );
  }

  /**
   * Fetch loan by ID:
   * GET /api/loan-origination/{loanId}
   */
  getLoanApplicationById(loanId: number): Observable<LoanApplication> {
    return this.http.get<LoanApplication>(`${this.apiUrl}/${loanId}`);
  }

  /**
   * Fetch loans by Customer ID:
   * GET /api/loan-origination/customer/{customerId}
   */
  getLoansByCustomerId(customerId: number): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(
      `${this.apiUrl}/customer/${customerId}`,
    );
  }

  private normalizeApplication(application: LoanApplication): LoanApplication {
    const status = application.applicationStatus || 'Pending';
    return {
      ...application,
      id: application.id || `LO-${application.loanId}`,
      requestedAmount: application.requestedAmount || application.loanAmount,
      status,
      stage: status === 'Draft' ? 'Loan Application' : 'Application Processing',
    };
  }
}
