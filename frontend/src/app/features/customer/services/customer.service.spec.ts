import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CustomerService } from './customer.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import {
  Customer,
  CustomerStatus,
  KycStatus,
  RiskLevel
} from '../models/customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch customer list', () => {
  const mockCustomers: Customer[] = [
    {
      id: 1,
      customerNumber: 'CUST-0001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      dateOfBirth: '1998-01-01',
      address: '123 Main Street',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      postalCode: '641001',
      country: 'India',
      kycStatus: KycStatus.VERIFIED,
      riskLevel: RiskLevel.LOW,
      status: CustomerStatus.ACTIVE,
      createdAt: '2026-01-01T00:00:00',
      updatedAt: '2026-01-01T00:00:00'
    }
  ];

  service.getCustomers().subscribe(data => {
    expect(data).toEqual(mockCustomers);
  });

  const req = httpMock.expectOne(req =>
    req.url.includes(API_ENDPOINTS.CUSTOMERS.BASE)
  );

  expect(req.request.method).toBe('GET');
  expect(req.request.params.get('page')).toBe('0');
  expect(req.request.params.get('size')).toBe('20');

  req.flush({
    success: true,
    message: 'Customers retrieved successfully',
    data: {
      totalPages: 1,
      totalElements: 1,
      size: 20,
      content: mockCustomers,
      number: 0,
      first: true,
      last: true,
      numberOfElements: 1,
      empty: false
    }
  });
});

});
