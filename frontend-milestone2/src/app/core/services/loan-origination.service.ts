import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type LoanType = 'Personal' | 'Home' | 'Vehicle' | 'Education' | 'Gold' | 'Other';
export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Draft' | 'Under Review' | 'Funded';

export interface LoanApplicationPayload {
  loanId?: number;
  customerId?: number;
  customerName?: string;
  loanType: LoanType;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  purpose?: string;
  applicationStatus?: ApplicationStatus;
  applicationDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanOriginationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/loan-origination`;

  private initialLoans: LoanApplicationPayload[] = [
    {
      loanId: 1001,
      customerId: 5001,
      customerName: 'Aditi Sharma',
      loanType: 'Home',
      loanAmount: 3100000,
      tenureMonths: 240,
      interestRate: 7.35,
      purpose: 'Home purchase',
      applicationStatus: 'Pending',
      applicationDate: '2026-08-01'
    },
    {
      loanId: 1002,
      customerId: 5002,
      customerName: 'Rohan Mehta',
      loanType: 'Personal',
      loanAmount: 2200000,
      tenureMonths: 120,
      interestRate: 8.10,
      purpose: 'Business expansion',
      applicationStatus: 'Approved',
      applicationDate: '2026-07-28'
    },
    {
      loanId: 1003,
      customerId: 5003,
      customerName: 'Sneha Patel',
      loanType: 'Vehicle',
      loanAmount: 850000,
      tenureMonths: 60,
      interestRate: 9.50,
      purpose: 'Car purchase',
      applicationStatus: 'Pending',
      applicationDate: '2026-08-05'
    }
  ];

  private localLoans$ = new BehaviorSubject<LoanApplicationPayload[]>(this.initialLoans);

  /** POST /api/loan-origination */
  createLoanApplication(data: LoanApplicationPayload): Observable<LoanApplicationPayload> {
    const internalCustomerId = Number(data.customerId) || Math.floor(5000 + Math.random() * 4000);
    const payload = {
      customerId: internalCustomerId,
      loanType: data.loanType || 'Personal',
      loanAmount: Number(data.loanAmount),
      tenureMonths: Number(data.tenureMonths || 36),
      interestRate: Number(data.interestRate || 10.5),
      purpose: data.purpose || 'Loan requirement',
      applicationStatus: data.applicationStatus || 'Pending'
    };

    return this.http.post<LoanApplicationPayload>(this.apiUrl, payload).pipe(
      tap((created) => this.addLocalRecord(created)),
      catchError(() => {
        // Fallback: create in-memory record when backend is offline
        const fallbackRecord: LoanApplicationPayload = {
          ...payload,
          loanId: 1000 + Math.floor(Math.random() * 9000),
          customerName: data.customerName || `Customer #${data.customerId}`,
          applicationDate: new Date().toISOString().slice(0, 10)
        };
        this.addLocalRecord(fallbackRecord);
        return of(fallbackRecord);
      })
    );
  }

  /** GET /api/loan-origination */
  getAllLoanApplications(): Observable<LoanApplicationPayload[]> {
    return this.http.get<LoanApplicationPayload[]>(this.apiUrl).pipe(
      map((res) => (res && res.length ? res : this.localLoans$.value)),
      tap((res) => {
        if (res && res.length) {
          this.localLoans$.next(res);
        }
      }),
      catchError(() => of(this.localLoans$.value))
    );
  }

  /** GET /api/loan-origination/{loanId} */
  getLoanApplicationById(loanId: number): Observable<LoanApplicationPayload | null> {
    return this.http.get<LoanApplicationPayload>(`${this.apiUrl}/${loanId}`).pipe(
      catchError(() => {
        const found = this.localLoans$.value.find((l) => l.loanId === Number(loanId));
        return of(found || null);
      })
    );
  }

  /** GET /api/loan-origination/customer/{customerId} */
  getLoansByCustomerId(customerId: number): Observable<LoanApplicationPayload[]> {
    return this.http.get<LoanApplicationPayload[]>(`${this.apiUrl}/customer/${customerId}`).pipe(
      catchError(() => {
        const found = this.localLoans$.value.filter((l) => l.customerId === Number(customerId));
        return of(found);
      })
    );
  }

  /** GET /api/loan-origination/status/{status} */
  getLoansByStatus(status: ApplicationStatus): Observable<LoanApplicationPayload[]> {
    return this.http.get<LoanApplicationPayload[]>(`${this.apiUrl}/status/${status}`).pipe(
      catchError(() => {
        const found = this.localLoans$.value.filter((l) => l.applicationStatus === status);
        return of(found);
      })
    );
  }

  /** PUT /api/loan-origination/{loanId}/status?status={status} */
  updateLoanStatus(loanId: number, status: ApplicationStatus): Observable<LoanApplicationPayload> {
    return this.http.put<LoanApplicationPayload>(`${this.apiUrl}/${loanId}/status?status=${status}`, {}).pipe(
      tap((updated) => this.updateLocalStatus(loanId, status)),
      catchError(() => {
        this.updateLocalStatus(loanId, status);
        const current = this.localLoans$.value.find((l) => l.loanId === Number(loanId)) || {
          loanId,
          customerId: 5001,
          loanType: 'Personal',
          loanAmount: 500000,
          tenureMonths: 36,
          interestRate: 10,
          applicationStatus: status
        };
        return of({ ...current, applicationStatus: status });
      })
    );
  }

  private addLocalRecord(record: LoanApplicationPayload): void {
    const current = this.localLoans$.value;
    const withoutExisting = current.filter((r) => r.loanId !== record.loanId);
    this.localLoans$.next([record, ...withoutExisting]);
  }

  private updateLocalStatus(loanId: number, status: ApplicationStatus): void {
    const updated = this.localLoans$.value.map((l) =>
      l.loanId === Number(loanId) ? { ...l, applicationStatus: status } : l
    );
    this.localLoans$.next(updated);
  }
}
