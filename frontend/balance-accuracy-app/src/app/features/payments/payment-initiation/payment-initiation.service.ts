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
    const accounts: UserAccount[] = [
      {
        customer_id: 1,
        account_no: "SB10000001",
        account_type: "Savings",
        balance: 10000,
        branch_name: "",
        created_at: "",
        ifsc_code: "",
        status: "Active",
      },
      {
        customer_id: 1,
        account_no: "SB10000002",
        account_type: "Savings",
        balance: 15000,
        branch_name: "",
        created_at: "",
        ifsc_code: "",
        status: "Active",
      },
      {
        customer_id: 1,
        account_no: "SB26059294",
        account_type: "Savings",
        balance: 0,
        branch_name: "",
        created_at: "",
        ifsc_code: "",
        status: "Active",
      },
    ];

    return new Observable<UserAccount[]>((subscriber) => {
      subscriber.next(accounts);
      subscriber.complete();
    });
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

