import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import {
  KycVerificationState,
  KycVerificationStateService,
} from '../../core/services/kyc-verification-state.service';

import {
  KycVerificationService,
  KycVerificationResponse,
} from '../../core/services/kyc-verification.service';

export interface KycSummary {
  auditRef: string;
  customerName: string;
  timestamp: Date;
  overallPassed: boolean;

  ocr: {
    score: number;
    passed: boolean;
  };

  liveness: {
    score: number;
    passed: boolean;
    confidenceScore: number;
    verificationStatus: string;
  };

  faceMatch: {
    score: number;
    passed: boolean;
  };
}

@Component({
  selector: 'app-verification-summary',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './verification-summary.component.html',
  styleUrl: './verification-summary.component.scss',
})
export class VerificationSummaryComponent {
  result$: Observable<KycSummary>;

  isApproving = false;
  isApproved = false;

  successMessage = '';
  errorMessage = '';

  verificationResponse: KycVerificationResponse | null = null;

  constructor(
    private kycStateService: KycVerificationStateService,
    private kycVerificationService: KycVerificationService,
    private router: Router,
  ) {
    this.result$ = this.kycStateService.state$.pipe(
      map((state: KycVerificationState): KycSummary => {
        const ocrPassed = state.ocr?.passed === true;

        const livenessPassed = state.liveness?.passed === true;

        const faceMatchPassed = state.faceMatch?.passed === true;

        const overallPassed = ocrPassed && livenessPassed && faceMatchPassed;

        return {
          auditRef: state.auditRef,

          customerName: state.customerName,

          timestamp: state.timestamp,

          overallPassed,

          ocr: {
            score: state.ocr?.score ?? 0,
            passed: ocrPassed,
          },

          liveness: {
            score: state.liveness?.score ?? 0,

            passed: livenessPassed,

            confidenceScore: state.liveness?.confidenceScore ?? 0,

            verificationStatus:
              state.liveness?.verificationStatus || 'NOT VERIFIED',
          },

          faceMatch: {
            score: state.faceMatch?.score ?? 0,
            passed: faceMatchPassed,
          },
        };
      }),
    );
  }

  // ==========================================================
  // VERIFY KYC
  // ==========================================================

  approveKyc(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const state = this.kycStateService.getState();

    const ocrPassed = state.ocr?.passed === true;

    const livenessPassed = state.liveness?.passed === true;

    const faceMatchPassed = state.faceMatch?.passed === true;

    // All three stages must pass
    if (!ocrPassed || !livenessPassed || !faceMatchPassed) {
      this.errorMessage =
        'KYC cannot be verified because one or more verification stages failed.';

      return;
    }

    // Prevent duplicate requests
    if (this.isApproving || this.isApproved) {
      return;
    }

    this.isApproving = true;

    // ========================================================
    // NO CUSTOMER ID
    // ========================================================

    const request = {
      ocrPassed,
      livenessPassed,
      faceMatchPassed,
      auditRef: state.auditRef,
    };

    console.log('Sending KYC verification request:', request);

    this.kycVerificationService.verifyKyc(request).subscribe({
      next: (response: KycVerificationResponse) => {
        console.log('KYC verification response:', response);

        this.isApproving = false;

        this.verificationResponse = response;

        if (response.success && response.kycStatus === 'VERIFIED') {
          this.isApproved = true;

          this.successMessage =
            response.message || 'KYC is successfully verified.';
        } else {
          this.errorMessage = response.message || 'KYC verification failed.';
        }
      },

      error: (error: any) => {
        console.error('KYC verification error:', error);

        this.isApproving = false;

        this.errorMessage =
          error?.error?.message || 'Unable to verify KYC. Please try again.';
      },
    });
  }

  // ==========================================================
  // BACK
  // ==========================================================

  backToFaceMatch(): void {
    this.router.navigate(['/face-match']);
  }

  // ==========================================================
  // NEW VERIFICATION
  // ==========================================================

  startNewVerification(): void {
    this.kycStateService.clear();

    this.router.navigate(['/document-ocr']);
  }
}
