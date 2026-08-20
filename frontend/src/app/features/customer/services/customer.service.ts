import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

import {
  Customer,
  CustomerFilter,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  KycStatus,
  CustomerStatistics
} from '../models/customer.model';

interface CustomerPage {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Customer[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface CustomerListResponse {
  success: boolean;
  message: string;
  data: CustomerPage;
  timestamp: string;
}

interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiService = inject(ApiService);

  getCustomers(filter: CustomerFilter = {}): Observable<Customer[]> {
    let params = new HttpParams()
      .set('page', '0')
      .set('size', '20');

    if (filter.search?.trim()) {
      return this.searchCustomers(filter.search.trim());
    }

    if (filter.kycStatus) {
      return this.getCustomersByKycStatus(filter.kycStatus);
    }

    return this.apiService
      .get<CustomerListResponse>(
        API_ENDPOINTS.CUSTOMERS.BASE,
        { params }
      )
      .pipe(
        map(response => response.data.content)
      );
  }

  searchCustomers(name: string): Observable<Customer[]> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', '0')
      .set('size', '20');

    return this.apiService
      .get<CustomerListResponse>(
        API_ENDPOINTS.CUSTOMERS.SEARCH,
        { params }
      )
      .pipe(
        map(response => response.data.content)
      );
  }

  getCustomersByKycStatus(
    kycStatus: KycStatus
  ): Observable<Customer[]> {

    const params = new HttpParams()
      .set('page', '0')
      .set('size', '20');

    return this.apiService
      .get<CustomerListResponse>(
        API_ENDPOINTS.CUSTOMERS.BY_KYC_STATUS(kycStatus),
        { params }
      )
      .pipe(
        map(response => response.data.content)
      );
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.apiService
      .get<CustomerResponse>(
        API_ENDPOINTS.CUSTOMERS.BY_ID(id)
      )
      .pipe(
        map(response => response.data)
      );
  }

  getCustomerByNumber(customerNumber: string): Observable<Customer> {
    return this.apiService
      .get<CustomerResponse>(
        API_ENDPOINTS.CUSTOMERS.BY_NUMBER(customerNumber)
      )
      .pipe(
        map(response => response.data)
      );
  }

  createCustomer(
    customer: CreateCustomerRequest
  ): Observable<Customer> {

    return this.apiService
      .post<CustomerResponse>(
        API_ENDPOINTS.CUSTOMERS.BASE,
        customer
      )
      .pipe(
        map(response => response.data)
      );
  }

  updateCustomer(
    id: string,
    customer: UpdateCustomerRequest
  ): Observable<Customer> {

    return this.apiService
      .put<CustomerResponse>(
        API_ENDPOINTS.CUSTOMERS.BY_ID(id),
        customer
      )
      .pipe(
        map(response => response.data)
      );
  }

  updateKycStatus(
    id: string,
    kycStatus: KycStatus
  ): Observable<Customer> {

    return this.apiService
      .patch<CustomerResponse>(
        API_ENDPOINTS.CUSTOMERS.KYC_STATUS(id),
        { kycStatus }
      )
      .pipe(
        map(response => response.data)
      );
  }

  getStatistics(): Observable<CustomerStatistics> {
    return this.apiService
      .get<CustomerStatistics>(
        API_ENDPOINTS.CUSTOMERS.STATISTICS
      );
  }

  deleteCustomer(id: string): Observable<void> {
    return this.apiService
      .delete<void>(
        API_ENDPOINTS.CUSTOMERS.BY_ID(id)
      );
  }
}