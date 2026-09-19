import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface KycVerificationRequest {
  ocrPassed: boolean;
  livenessPassed: boolean;
  faceMatchPassed: boolean;
  auditRef: string;
}

export interface KycVerificationResponse {
  success: boolean;
  message: string;
  kycId: number;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  auditRef: string;
  verifiedAt: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class KycVerificationService {
  private readonly apiUrl = 'http://localhost:8080/api/kyc';

  constructor(private http: HttpClient) {}

  verifyKyc(
    request: KycVerificationRequest,
  ): Observable<KycVerificationResponse> {
    return this.http.post<KycVerificationResponse>(
      `${this.apiUrl}/verify`,
      request,
    );
  }
}
