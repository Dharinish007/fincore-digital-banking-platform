import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import {
  LoanProduct,
  LoanApplication,
  Loan,
  CreditAssessment,
  RepaymentSchedule,
  EmiCalculationRequest,
  EmiCalculationResponse,
  LoanStatistics,
  LoanApplicationRequest,
  ApiResponse,
  PageResponse
} from '../models/loan.models';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiService = inject(ApiService);

  /**
   * Retrieves all available loan products
   */
  getLoanProducts(status?: string, type?: string): Observable<LoanProduct[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (type) params = params.set('type', type);

    return this.apiService
      .get<ApiResponse<LoanProduct[]>>(API_ENDPOINTS.LOANS.PRODUCTS.BASE, { params })
      .pipe(map(response => response?.data || []));
  }

  /**
   * Retrieves loan product by ID
   */
  getLoanProductById(id: number | string): Observable<LoanProduct> {
    return this.apiService
      .get<ApiResponse<LoanProduct>>(API_ENDPOINTS.LOANS.PRODUCTS.BY_ID(id))
      .pipe(map(response => response.data));
  }

  /**
   * Submits a new loan application
   */
  submitApplication(request: LoanApplicationRequest): Observable<LoanApplication> {
    return this.apiService
      .post<ApiResponse<LoanApplication>>(API_ENDPOINTS.LOANS.APPLICATIONS.BASE, request)
      .pipe(map(response => response.data));
  }

  /**
   * Retrieves paginated applications list
   */
  getAllApplications(
    customerId?: number | string,
    status?: string,
    page = 0,
    size = 20
  ): Observable<LoanApplication[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (customerId !== undefined && customerId !== null) {
      params = params.set('customerId', customerId.toString());
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.apiService
      .get<ApiResponse<PageResponse<LoanApplication>>>(API_ENDPOINTS.LOANS.APPLICATIONS.BASE, { params })
      .pipe(map(response => response?.data?.content || []));
  }

  /**
   * Retrieves application by ID
   */
  getApplicationById(id: number | string): Observable<LoanApplication> {
    return this.apiService
      .get<ApiResponse<LoanApplication>>(API_ENDPOINTS.LOANS.APPLICATIONS.BY_ID(id))
      .pipe(map(response => response.data));
  }

  /**
   * Retrieves application by number (e.g. APP-XXXXXX)
   */
  getApplicationByNumber(applicationNumber: string): Observable<LoanApplication> {
    return this.apiService
      .get<ApiResponse<LoanApplication>>(API_ENDPOINTS.LOANS.APPLICATIONS.BY_NUMBER(applicationNumber))
      .pipe(map(response => response.data));
  }

  /**
   * Retrieves customer applications
   */
  getApplicationsByCustomerId(customerId: number | string): Observable<LoanApplication[]> {
    return this.apiService
      .get<ApiResponse<PageResponse<LoanApplication>>>(API_ENDPOINTS.LOANS.APPLICATIONS.BY_CUSTOMER(customerId))
      .pipe(map(response => response?.data?.content || []));
  }

  /**
   * Retrieves credit assessment report for an application
   */
  getCreditAssessment(applicationId: number | string): Observable<CreditAssessment> {
    return this.apiService
      .get<ApiResponse<CreditAssessment>>(API_ENDPOINTS.LOANS.APPLICATIONS.CREDIT_ASSESSMENT(applicationId))
      .pipe(map(response => response.data));
  }

  /**
   * Retrieves all loans
   */
  getAllLoans(
    customerId?: number | string,
    status?: string,
    page = 0,
    size = 20
  ): Observable<Loan[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (customerId !== undefined && customerId !== null) {
      params = params.set('customerId', customerId.toString());
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.apiService
      .get<ApiResponse<PageResponse<Loan>>>(API_ENDPOINTS.LOANS.BASE, { params })
      .pipe(map(response => response?.data?.content || []));
  }

  /**
   * Retrieves loan by ID
   */
  getLoanById(id: number | string): Observable<Loan> {
    return this.apiService
      .get<ApiResponse<Loan>>(API_ENDPOINTS.LOANS.BY_ID(id))
      .pipe(map(response => response.data));
  }

  /**
   * Retrieves loan by loan number
   */
  getLoanByNumber(loanNumber: string): Observable<Loan> {
    return this.apiService
      .get<ApiResponse<Loan>>(API_ENDPOINTS.LOANS.BY_NUMBER(loanNumber))
      .pipe(map(response => response.data));
  }

  /**
   * Retrieves full repayment schedule
   */
  getRepaymentSchedule(loanId: number | string): Observable<RepaymentSchedule> {
    return this.apiService
      .get<ApiResponse<RepaymentSchedule>>(API_ENDPOINTS.LOANS.REPAYMENT_SCHEDULE(loanId))
      .pipe(map(response => response.data));
  }

  /**
   * Previews EMI and amortization calculation
   */
  calculateEmi(request: EmiCalculationRequest): Observable<EmiCalculationResponse> {
    return this.apiService
      .post<ApiResponse<EmiCalculationResponse>>(API_ENDPOINTS.LOANS.CALCULATE_EMI, request)
      .pipe(map(response => response.data));
  }

  /**
   * Retrieves summary statistics for dashboard
   */
  getStatistics(): Observable<LoanStatistics> {
    return this.apiService
      .get<ApiResponse<LoanStatistics>>(API_ENDPOINTS.LOANS.STATISTICS)
      .pipe(map(response => response.data));
  }

  /**
   * Triggers credit assessment calculation
   */
  assessApplication(applicationId: number | string): Observable<CreditAssessment> {
    return this.apiService
      .post<ApiResponse<CreditAssessment>>(API_ENDPOINTS.LOANS.APPLICATIONS.CREDIT_ASSESSMENT(applicationId), {})
      .pipe(map(response => response.data));
  }

  /**
   * Underwriting approval for loan application
   */
  approveApplication(applicationId: number | string, officerNotes?: string): Observable<Loan> {
    return this.apiService
      .post<ApiResponse<Loan>>(API_ENDPOINTS.LOANS.APPLICATIONS.APPROVE(applicationId), {
        officerNotes: officerNotes || undefined
      })
      .pipe(map(response => response.data));
  }

  /**
   * Underwriting rejection for loan application
   */
  rejectApplication(applicationId: number | string, reason?: string): Observable<LoanApplication> {
    return this.apiService
      .post<ApiResponse<LoanApplication>>(API_ENDPOINTS.LOANS.APPLICATIONS.REJECT(applicationId), {
        reason: reason || 'Underwriting criteria not met'
      })
      .pipe(map(response => response.data));
  }

  /**
   * Disburses approved loan funds to customer account
   */
  disburseLoan(loanId: number | string): Observable<Loan> {
    return this.apiService
      .post<ApiResponse<Loan>>(API_ENDPOINTS.LOANS.DISBURSE(loanId), {})
      .pipe(map(response => response.data));
  }

  /**
   * Creates a new loan product (Admin)
   */
  createLoanProduct(product: Partial<LoanProduct>): Observable<LoanProduct> {
    return this.apiService
      .post<ApiResponse<LoanProduct>>(API_ENDPOINTS.LOANS.PRODUCTS.BASE, product)
      .pipe(map(response => response.data));
  }

  /**
   * Updates loan product status (Admin)
   */
  updateProductStatus(productId: number | string, status: string): Observable<LoanProduct> {
    const params = new HttpParams().set('status', status);
    return this.apiService
      .patch<ApiResponse<LoanProduct>>(API_ENDPOINTS.LOANS.PRODUCTS.STATUS(productId), {}, { params })
      .pipe(map(response => response.data));
  }
}
