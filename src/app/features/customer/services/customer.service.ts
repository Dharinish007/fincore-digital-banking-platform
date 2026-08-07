import { Observable } from 'rxjs';
import { Customer, CustomerSummary, CustomerFilter } from '../models/customer.model';

export abstract class CustomerService {
  abstract getCustomers(filter?: CustomerFilter): Observable<CustomerSummary[]>;
  abstract getCustomerById(id: string): Observable<Customer | undefined>;
  abstract createCustomer(customer: Partial<Customer>): Observable<Customer>;
  abstract updateCustomer(id: string, customer: Partial<Customer>): Observable<Customer>;
}
