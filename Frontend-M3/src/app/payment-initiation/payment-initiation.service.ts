import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { Beneficiary } from "./models/beneficiary.model";
import { Payment } from "./models/payment.model";
import { BeneficiaryService } from "../services/beneficiary.service";

export interface UserAccount {
  customer_id: number;
  account_no: string;
  account_type: string;
  balance: number;
  branch_name: string;
  created_at: string;
  ifsc_code: string;
  status: string;
}
@Injectable({
  providedIn: "root",
})
export class PaymentInitiationService {
  private paymentApiUrl = "http://localhost:8080/api/payments";

  private accountApiUrl = "http://localhost:8080/api/accounts";

  constructor(
    private beneficiaryService: BeneficiaryService,
    private http: HttpClient,
  ) {}

  /**
   * Load beneficiaries from database
   */
  loadBeneficiaries(): void {
    this.beneficiaryService.loadBeneficiaries();
  }

  /**
   * Get accounts for customer
   */
  getAccounts(customerId: number): Observable<UserAccount[]> {
    return this.http
      .get<any[]>(`${this.accountApiUrl}/customer/${customerId}`)
      .pipe(
        map((accounts: any) =>
          accounts.map((a: any) => ({
            customer_id: a.customerId,
            account_no: a.accountNo,
            account_type: a.accountType,
            balance: a.balance,
            branch_name: a.branchName,
            created_at: a.createdAt,
            ifsc_code: a.ifscCode,
            status: a.status,
          })),
        ),
      );
  }

  /**
   * Get all beneficiaries
   */
  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaryService.getBeneficiaries();
  }

  /**
   * Get only verified beneficiaries
   */
  getVerifiedBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaryService.getVerifiedBeneficiaries();
  }

  /**
   * Send payment to backend
   */
  initiatePayment(paymentPayload: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.paymentApiUrl, paymentPayload);
  }
}
