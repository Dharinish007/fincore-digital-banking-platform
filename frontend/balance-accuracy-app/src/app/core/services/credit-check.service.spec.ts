import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CreditCheckService } from './credit-check.service';

describe('CreditCheckService', () => {
  let service: CreditCheckService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreditCheckService],
    });

    service = TestBed.inject(CreditCheckService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads credit checks from the backend root endpoint', () => {
    const req = httpMock.expectOne('http://localhost:8080/credit-checks');

    expect(req.request.method).toBe('GET');

    req.flush([
      {
        creditCheckId: 1,
        customerId: 101,
        customerName: 'John Doe',
        loanId: 201,
        loanType: 'Personal',
        loanAmount: 250000,
        monthlyIncome: 60000,
        creditScore: 720,
        existingLoanCount: 1,
        creditStatus: 'Pass',
        remarks: 'Approved',
        checkedAt: '2026-08-16T10:00:00',
        message: 'Credit check retrieved successfully',
      },
    ]);

    expect(service.filteredRecords().length).toBe(1);
  });
});
