import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, map } from "rxjs";

import { Beneficiary } from "../payment-initiation/models/beneficiary.model";

@Injectable({
  providedIn: "root",
})
export class BeneficiaryService {
  private apiUrl = "http://localhost:8080/beneficiary-verification";

  // Starts empty because data comes from DB
  private beneficiariesSubject = new BehaviorSubject<Beneficiary[]>([]);

  public beneficiaries$: Observable<Beneficiary[]> =
    this.beneficiariesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load beneficiaries from Spring Boot backend
   */
  loadBeneficiaries(): void {
    console.log("Loading beneficiaries from backend...");

    this.http.get<any[]>(`${this.apiUrl}/getList`).subscribe({
      next: (data) => {
        console.log("Raw beneficiary data from backend:", data);

        const beneficiaries: Beneficiary[] = data.map((b) => ({
          beneficiary_id: b.beneficiary_id ?? b.beneficiaryId,
          customer_id: b.customer_id ?? b.customerId,
          beneficiary_name: b.name ?? b.beneficiary_name,
          account_no: b.AccountNumber ?? b.accountNumber ?? b.accountNo,
          ifsc_code: b.ifsc ?? b.ifscCode,
          bank_name: b.Bank ?? b.bankName,
          beneficiary_type: b.beneficiary_type ?? b.beneficiaryType,
          status: b.status,
          created_at: b.created_at ?? b.createdAt,
        }));

        console.log("Beneficiaries converted for Angular:", beneficiaries);

        this.beneficiariesSubject.next(beneficiaries);
      },

      error: (error) => {
        console.error("Error loading beneficiaries:", error);

        this.beneficiariesSubject.next([]);
      },
    });
  }

  /**
   * Get all beneficiaries
   */
  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaries$;
  }

  /**
   * Get only verified beneficiaries
   */
  getVerifiedBeneficiaries(): Observable<Beneficiary[]> {
    return this.beneficiaries$.pipe(
      map((list) => list.filter((b) => b.status === "Verified")),
    );
  }

  /**
   * Verify beneficiary
   */
  verifyBeneficiary(beneficiaryId: number): void {
    const current = this.beneficiariesSubject.getValue();

    const beneficiary = current.find((b) => b.beneficiary_id === beneficiaryId);

    if (!beneficiary) {
      console.error("Beneficiary not found:", beneficiaryId);

      return;
    }

    const request = {
      beneficiary_id: beneficiary.beneficiary_id,

      name: beneficiary.beneficiary_name,

      AccountNumber: beneficiary.account_no,

      ifsc: beneficiary.ifsc_code,

      Bank: beneficiary.bank_name,

      beneficiary_type: beneficiary.beneficiary_type,

      status: "Verified",
    };

    console.log("Verify request:", request);

    this.http.put(`${this.apiUrl}/updateDetails`, request).subscribe({
      next: (response) => {
        console.log("Beneficiary verified:", response);

        // Reload from database
        this.loadBeneficiaries();
      },

      error: (error) => {
        console.error("Error verifying beneficiary:", error);
      },
    });
  }

  /**
   * Block beneficiary
   */
  blockBeneficiary(beneficiaryId: number): void {
    const current = this.beneficiariesSubject.getValue();

    const beneficiary = current.find((b) => b.beneficiary_id === beneficiaryId);

    if (!beneficiary) {
      console.error("Beneficiary not found:", beneficiaryId);

      return;
    }

    const request = {
      beneficiary_id: beneficiary.beneficiary_id,

      name: beneficiary.beneficiary_name,

      AccountNumber: beneficiary.account_no,

      ifsc: beneficiary.ifsc_code,

      Bank: beneficiary.bank_name,

      beneficiary_type: beneficiary.beneficiary_type,

      status: "Blocked",
    };

    console.log("Block request:", request);

    this.http.put(`${this.apiUrl}/updateDetails`, request).subscribe({
      next: (response) => {
        console.log("Beneficiary blocked:", response);

        // Reload latest data from DB
        this.loadBeneficiaries();
      },

      error: (error) => {
        console.error("Error blocking beneficiary:", error);
      },
    });
  }
}
