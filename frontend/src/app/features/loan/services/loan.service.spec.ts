import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoanService } from './loan.service';
import { ApiService } from '../../../core/services/api.service';
import { LoanType, LoanProductStatus, ApplicationStatus, LoanStatus } from '../models/loan.models';

describe('LoanService', () => {
  let service: LoanService;
  let apiServiceMock: { get: any; post: any };

  const sampleProducts = [
    {
      id: 1,
      productCode: 'PERSONAL_01',
      name: 'Personal Loan',
      loanType: LoanType.PERSONAL,
      minAmount: 1000,
      maxAmount: 50000,
      interestRate: 9.5,
      minTenureMonths: 6,
      maxTenureMonths: 60,
      status: LoanProductStatus.ACTIVE
    }
  ];

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        LoanService,
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });

    service = TestBed.inject(LoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch loan products and unwrap response data', async () => {
    apiServiceMock.get.mockReturnValue(of({
      success: true,
      message: 'Retrieved',
      data: sampleProducts
    }));

    service.getLoanProducts('ACTIVE').subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Personal Loan');
    });
  });

  it('should submit loan application payload correctly', async () => {
    const payload = {
      customerId: 1,
      accountNumber: 'ACC-1001',
      loanProductId: 1,
      requestedAmount: 10000,
      requestedTenureMonths: 12
    };

    const mockResponse = {
      id: 101,
      applicationNumber: 'APP-101',
      customerId: 1,
      accountNumber: 'ACC-1001',
      status: ApplicationStatus.SUBMITTED
    };

    apiServiceMock.post.mockReturnValue(of({
      success: true,
      message: 'Submitted',
      data: mockResponse
    }));

    service.submitApplication(payload as any).subscribe(app => {
      expect(app.id).toBe(101);
      expect(app.applicationNumber).toBe('APP-101');
      expect(app.status).toBe(ApplicationStatus.SUBMITTED);
    });
  });
});
