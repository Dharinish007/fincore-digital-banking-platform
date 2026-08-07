import { Injectable, signal } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { CustomerService } from './customer.service';
import {
  Customer, CustomerSummary, CustomerFilter,
  CustomerStatus, CustomerType, KycStatus
} from '../models/customer.model';
import { CUSTOMER_BRANCHES_MOCK, CUSTOMERS_MOCK } from '../../../core/mocks/customer.mock';

@Injectable({ providedIn: 'root' })
export class MockCustomerService implements CustomerService {
  private customersSignal = signal<Customer[]>([...CUSTOMERS_MOCK]);
  readonly branches = CUSTOMER_BRANCHES_MOCK;

  private delay = <T>(data: T): Observable<T> => of(data).pipe(delay(500));

  getCustomers(filter?: CustomerFilter): Observable<CustomerSummary[]> {
    let customers = [...this.customersSignal()];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      customers = customers.filter(c =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    if (filter?.status) customers = customers.filter(c => c.status === filter.status);
    if (filter?.customerType) customers = customers.filter(c => c.customerType === filter.customerType);
    if (filter?.branch) customers = customers.filter(c => c.branch === filter.branch);

    const summaries: CustomerSummary[] = customers.map(c => ({
      id: c.id, firstName: c.firstName, lastName: c.lastName,
      email: c.email, phone: c.phone, customerType: c.customerType,
      status: c.status, branch: c.branch,
      linkedAccountsCount: c.linkedAccountsCount, createdAt: c.createdAt
    }));
    return this.delay(summaries);
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    const customer = this.customersSignal().find(c => c.id === id);
    return this.delay(customer);
  }

  createCustomer(data: Partial<Customer>): Observable<Customer> {
    const customers = this.customersSignal();
    const newId = `CUST-${String(customers.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      id: newId,
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      dateOfBirth: data.dateOfBirth ?? '',
      gender: data.gender ?? 'MALE',
      customerType: data.customerType ?? CustomerType.RETAIL,
      status: data.status ?? CustomerStatus.PENDING,
      kycStatus: KycStatus.PENDING,
      branch: data.branch ?? '',
      address: data.address ?? { street: '', city: '', state: '', postalCode: '', country: 'USA' },
      linkedAccountsCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.customersSignal.update(list => [...list, newCustomer]);
    return this.delay(newCustomer);
  }

  updateCustomer(id: string, data: Partial<Customer>): Observable<Customer> {
    const customers = this.customersSignal();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return throwError(() => new Error(`Customer ${id} not found`));
    const updated = { ...customers[index], ...data, updatedAt: new Date().toISOString() };
    this.customersSignal.update(list => list.map(c => c.id === id ? updated : c));
    return this.delay(updated);
  }
}
