import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoanApplication, LoanOriginationPayload } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class LoanOriginationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Submit loan origination application to backend:
   * POST /api/loan-origination
   */
  createLoanApplication(payload: LoanOriginationPayload): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(this.apiUrl, payload);
  }

  /**
   * Fetch all loan applications from backend:
   * GET /api/loan-origination
   */
  getAllLoanApplications(): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(this.apiUrl);
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
    return this.http.get<LoanApplication[]>(`${this.apiUrl}/customer/${customerId}`);
  }
}
