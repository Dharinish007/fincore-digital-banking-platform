import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type LoanType =
  | 'Personal'
  | 'Home'
  | 'Vehicle'
  | 'Education'
  | 'Gold'
  | 'Other';

export type ApplicationStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Draft'
  | 'Under Review'
  | 'Funded';

export interface LoanApplicationPayload {
  loanId?: number;

  // Customer / Applicant
  customerId?: number;
  fullName?: string;
  customerName?: string;
  dateOfBirth?: string;
  gender?: string;
  mobile?: string;
  email?: string;

  // Address
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // Employment
  employmentType?: string;
  employerName?: string;
  jobTitle?: string;
  workExperience?: string;

  // Income
  monthlyIncome?: number;
  otherIncome?: number;

  // Loan
  loanType: LoanType;
  loanAmount: number;
  requestedAmount?: number;
  tenureMonths: number;
  interestRate: number;
  purpose?: string;

  // Application
  applicationStatus?: ApplicationStatus;
  applicationDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoanOriginationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/loan-origination`;

  private initialLoans: LoanApplicationPayload[] = [
    {
      loanId: 1001,
      customerId: 2001,
      customerName: 'Aditi Sharma',
      fullName: 'Aditi Sharma',
      loanType: 'Home',
      loanAmount: 3100000,
      requestedAmount: 3100000,
      tenureMonths: 240,
      interestRate: 7.35,
      purpose: 'Home purchase',
      applicationStatus: 'Pending',
      applicationDate: '2026-08-01',
    },

    {
      loanId: 1002,
      customerId: 2002,
      customerName: 'Rohan Mehta',
      fullName: 'Rohan Mehta',
      loanType: 'Personal',
      loanAmount: 2200000,
      requestedAmount: 2200000,
      tenureMonths: 120,
      interestRate: 8.1,
      purpose: 'Business expansion',
      applicationStatus: 'Approved',
      applicationDate: '2026-07-28',
    },

    {
      loanId: 1003,
      customerId: 2003,
      customerName: 'Sneha Patel',
      fullName: 'Sneha Patel',
      loanType: 'Vehicle',
      loanAmount: 850000,
      requestedAmount: 850000,
      tenureMonths: 60,
      interestRate: 9.5,
      purpose: 'Car purchase',
      applicationStatus: 'Pending',
      applicationDate: '2026-08-05',
    },
  ];

  private localLoans$ = new BehaviorSubject<LoanApplicationPayload[]>(
    this.initialLoans,
  );

  // =====================================================
  // CREATE LOAN APPLICATION
  // POST /api/loan-origination
  // =====================================================

  createLoanApplication(
    data: LoanApplicationPayload,
  ): Observable<LoanApplicationPayload> {
    const payload = {
      customerId: data.customerId,

      fullName: data.fullName,
      customerName: data.customerName || data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      mobile: data.mobile,
      email: data.email,

      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,

      employmentType: data.employmentType,
      employerName: data.employerName,
      jobTitle: data.jobTitle,
      workExperience: data.workExperience,

      monthlyIncome: data.monthlyIncome,
      otherIncome: data.otherIncome,

      loanType: data.loanType,
      loanAmount: Number(data.loanAmount),
      requestedAmount: Number(data.requestedAmount ?? data.loanAmount),
      tenureMonths: Number(data.tenureMonths),
      interestRate: Number(data.interestRate),
      purpose: data.purpose || '',
      applicationStatus: data.applicationStatus || 'Pending',
    };

    console.log('POST Loan Application:', payload);

    return this.http.post<LoanApplicationPayload>(this.apiUrl, payload).pipe(
      tap((created) => {
        this.addLocalRecord(created);
      }),
    );
  }

  // =====================================================
  // GET ALL LOAN APPLICATIONS
  // GET /api/loan-origination
  // =====================================================

  getAllLoanApplications(): Observable<LoanApplicationPayload[]> {
    return this.http.get<LoanApplicationPayload[]>(this.apiUrl).pipe(
      tap((res) => {
        if (res && res.length) {
          this.localLoans$.next(res);
        }
      }),

      catchError((error) => {
        console.error('Failed to get loan applications:', error);

        return of(this.localLoans$.value);
      }),
    );
  }

  // =====================================================
  // GET LOAN BY ID
  // GET /api/loan-origination/{loanId}
  // =====================================================

  getLoanApplicationById(
    loanId: number,
  ): Observable<LoanApplicationPayload | null> {
    return this.http
      .get<LoanApplicationPayload>(`${this.apiUrl}/${loanId}`)
      .pipe(
        catchError((error) => {
          console.error('Failed to get loan:', error);

          const found = this.localLoans$.value.find(
            (loan) => loan.loanId === Number(loanId),
          );

          return of(found || null);
        }),
      );
  }

  // =====================================================
  // GET LOANS BY CUSTOMER ID
  // GET /api/loan-origination/customer/{customerId}
  // =====================================================

  getLoansByCustomerId(
    customerId: number,
  ): Observable<LoanApplicationPayload[]> {
    return this.http
      .get<LoanApplicationPayload[]>(`${this.apiUrl}/customer/${customerId}`)
      .pipe(
        catchError((error) => {
          console.error('Failed to get customer loans:', error);

          const found = this.localLoans$.value.filter(
            (loan) => loan.customerId === Number(customerId),
          );

          return of(found);
        }),
      );
  }

  // =====================================================
  // GET LOANS BY STATUS
  // GET /api/loan-origination/status/{status}
  // =====================================================

  getLoansByStatus(
    status: ApplicationStatus,
  ): Observable<LoanApplicationPayload[]> {
    return this.http
      .get<
        LoanApplicationPayload[]
      >(`${this.apiUrl}/status/${encodeURIComponent(status)}`)
      .pipe(
        catchError((error) => {
          console.error('Failed to get loans by status:', error);

          const found = this.localLoans$.value.filter(
            (loan) => loan.applicationStatus === status,
          );

          return of(found);
        }),
      );
  }

  // =====================================================
  // UPDATE LOAN STATUS
  // PUT /api/loan-origination/{loanId}/status
  // =====================================================

  updateLoanStatus(
    loanId: number,
    status: ApplicationStatus,
  ): Observable<LoanApplicationPayload> {
    return this.http
      .put<LoanApplicationPayload>(
        `${this.apiUrl}/${loanId}/status?status=${encodeURIComponent(status)}`,
        {},
      )
      .pipe(
        tap((updated) => {
          this.updateLocalStatus(loanId, status);
        }),

        catchError((error) => {
          console.error('Failed to update loan status:', error);

          throw error;
        }),
      );
  }

  // =====================================================
  // LOCAL CACHE
  // =====================================================

  private addLocalRecord(record: LoanApplicationPayload): void {
    const current = this.localLoans$.value;

    const withoutExisting = current.filter((r) => r.loanId !== record.loanId);

    this.localLoans$.next([record, ...withoutExisting]);
  }

  private updateLocalStatus(loanId: number, status: ApplicationStatus): void {
    const updated = this.localLoans$.value.map((loan) =>
      loan.loanId === Number(loanId)
        ? {
            ...loan,
            applicationStatus: status,
          }
        : loan,
    );

    this.localLoans$.next(updated);
  }
}
