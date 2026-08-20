import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Beneficiary } from '../payment-initiation/models/beneficiary.model';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaryService {
  private initialBeneficiaries: Beneficiary[] = [
    {
      beneficiary_id: 101,
      customer_id: 5001,
      beneficiary_name: 'John Mathew',
      account_no: 'XXXX1234',
      ifsc_code: 'HDFC0001234',
      bank_name: 'HDFC Bank',
      beneficiary_type: 'External',
      status: 'Verified',
      created_at: '2026-01-15 10:30:00',
    },
    {
      beneficiary_id: 102,
      customer_id: 5001,
      beneficiary_name: 'ABC Enterprises',
      account_no: 'XXXX5678',
      ifsc_code: 'SBIN0005678',
      bank_name: 'State Bank of India',
      beneficiary_type: 'External',
      status: 'Verified',
      created_at: '2026-02-10 14:15:00',
    },
    {
      beneficiary_id: 103,
      customer_id: 5001,
      beneficiary_name: 'TechCorp Solutions',
      account_no: 'XXXX9101',
      ifsc_code: 'ICIC0009101',
      bank_name: 'ICICI Bank',
      beneficiary_type: 'Internal',
      status: 'Verified',
      created_at: '2026-03-01 09:00:00',
    },
    {
      beneficiary_id: 104,
      customer_id: 5001,
      beneficiary_name: 'Priya Sharma',
      account_no: 'XXXX3344',
      ifsc_code: 'UTIB0003344',
      bank_name: 'Axis Bank',
      beneficiary_type: 'External',
      status: 'Pending',
      created_at: '2026-08-18 11:20:00',
    },
    {
      beneficiary_id: 105,
      customer_id: 5001,
      beneficiary_name: 'Global Logistics Pvt Ltd',
      account_no: 'XXXX7788',
      ifsc_code: 'KKBK0007788',
      bank_name: 'Kotak Mahindra Bank',
      beneficiary_type: 'External',
      status: 'Blocked',
      created_at: '2026-05-12 16:45:00',
    },
  ];

  private beneficiariesSubject = new BehaviorSubject<Beneficiary[]>(this.initialBeneficiaries);

  public beneficiaries$: Observable<Beneficiary[]> = this.beneficiariesSubject.asObservable();

  constructor() {}

  /**
   * Get all beneficiaries as an Observable stream
   */
  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaries$;
  }

  /**
   * Get only verified beneficiaries as an Observable stream
   */
  getVerifiedBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaries$.pipe(
      map((list) => list.filter((b) => b.status === 'Verified'))
    );
  }

  /**
   * Verify a pending beneficiary by ID
   */
  verifyBeneficiary(beneficiaryId: number): void {
    const current = this.beneficiariesSubject.getValue();
    const updated = current.map((b) =>
      b.beneficiary_id === beneficiaryId ? { ...b, status: 'Verified' as const } : b
    );
    this.beneficiariesSubject.next(updated);
  }

  /**
   * Block a beneficiary by ID
   */
  blockBeneficiary(beneficiaryId: number): void {
    const current = this.beneficiariesSubject.getValue();
    const updated = current.map((b) =>
      b.beneficiary_id === beneficiaryId ? { ...b, status: 'Blocked' as const } : b
    );
    this.beneficiariesSubject.next(updated);
  }
}
