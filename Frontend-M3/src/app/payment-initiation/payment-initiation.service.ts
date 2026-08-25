import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Beneficiary } from './models/beneficiary.model';
import { Payment } from './models/payment.model';
import { BeneficiaryService } from '../services/beneficiary.service';

export interface UserAccount {
  account_no: string;
  display_label: string;
  account_type: string;
  available_balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentInitiationService {

  private mockAccounts: UserAccount[] = [
    {
      account_no: 'XXXXXX1234',
      display_label: 'XXXXXX1234 - Primary Savings (Bal: ₹2,45,000.00)',
      account_type: 'Savings',
      available_balance: 245000.0,
    },
    {
      account_no: 'XXXXXX5678',
      display_label: 'XXXXXX5678 - Corporate Current (Bal: ₹8,12,500.00)',
      account_type: 'Current',
      available_balance: 812500.0,
    },
    {
      account_no: 'XXXXXX9012',
      display_label: 'XXXXXX9012 - Treasury Reserve (Bal: ₹15,00,000.00)',
      account_type: 'Corporate',
      available_balance: 1500000.0,
    },
  ];

  constructor(
    private beneficiaryService: BeneficiaryService,
    private http: HttpClient
  ) {}

  getAccounts(): Observable<UserAccount[]> {
    return of([...this.mockAccounts]);
  }

  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaryService.getBeneficiaries();
  }

  getVerifiedBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaryService.getVerifiedBeneficiaries();
  }

  initiatePayment(paymentPayload: Payment): Observable<Payment> {
    return this.http.post<Payment>(
      'http://localhost:8080/api/payments',
      paymentPayload
    );
  }
}