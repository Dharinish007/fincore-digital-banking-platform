import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LivenessDetectionService } from '../../core/services/liveness-detection.service';

import {
  LivenessChallengeStep,
  LivenessProcessingResult,
  LivenessResultData,
  LivenessState,
} from '../../core/models/liveness-detection.model';

import { KycVerificationStateService } from '../../core/services/kyc-verification-state.service';

@Component({
  selector: 'app-liveness-detection',

  standalone: true,

  imports: [CommonModule, MatIconModule, MatProgressBarModule],

  templateUrl: './liveness-detection.component.html',

  styleUrls: ['./liveness-detection.component.scss'],
})
export class LivenessDetectionComponent implements OnDestroy {
  @ViewChild('videoEl')
  videoEl?: ElementRef<HTMLVideoElement>;

  @ViewChild('captureCanvas')
  captureCanvas?: ElementRef<HTMLCanvasElement>;

  // =========================================================
  // COMPONENT STATE
  // =========================================================

  currentState: LivenessState = 'INITIAL';

  errorMessage: string | null = null;

  requestId: string | null = null;

  resultData: LivenessResultData | null = null;

  currentStepIndex = 0;

  readonly challengeSteps: LivenessChallengeStep[];

  // =========================================================
  // PRIVATE VARIABLES
  // =========================================================

  private mediaStream: MediaStream | null = null;

  private stepTimer: ReturnType<typeof setTimeout> | null = null;

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private livenessService: LivenessDetectionService,

    /*
     * Shared KYC state service.
     *
     * This stores the liveness result so that it is
     * available after navigating to the Face Match page
     * and finally to the Verification Summary page.
     */
    private kycStateService: KycVerificationStateService,

    private router: Router,
  ) {
    this.challengeSteps = this.livenessService.challengeSteps;
  }

  // =========================================================
  // CURRENT CHALLENGE STEP
  // =========================================================

  get currentStep(): LivenessChallengeStep | undefined {
    return this.challengeSteps[this.currentStepIndex];
  }

  // =========================================================
  // START CAMERA
  // =========================================================

  async startCamera(): Promise<void> {
    this.errorMessage = null;

    this.currentState = 'CAMERA_READY';

    // Defer until the <video> element is rendered
    setTimeout(async () => {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',

            width: {
              ideal: 640,
            },

            height: {
              ideal: 480,
            },
          },

          audio: false,
        });

        if (this.videoEl) {
          this.videoEl.nativeElement.srcObject = this.mediaStream;
        }
      } catch (err) {
        console.error('[LivenessDetectionComponent] Camera access error:', err);

        this.currentState = 'CAMERA_ERROR';

        this.errorMessage =
          'Camera access was denied or is unavailable. Please allow camera permissions and try again.';
      }
    });
  }

  // =========================================================
  // BEGIN CHALLENGE
  // =========================================================

  beginChallenge(): void {
    this.currentState = 'CHALLENGE_IN_PROGRESS';

    this.currentStepIndex = 0;

    this.runNextChallengeStep();
  }

  // =========================================================
  // RUN NEXT CHALLENGE STEP
  // =========================================================

  private runNextChallengeStep(): void {
    if (this.currentStepIndex >= this.challengeSteps.length) {
      this.finishCaptureAndVerify();

      return;
    }

    const step = this.challengeSteps[this.currentStepIndex];

    this.stepTimer = setTimeout(() => {
      this.currentStepIndex++;

      this.runNextChallengeStep();
    }, step.durationMs);
  }

  // =========================================================
  // CAPTURE AND VERIFY
  // =========================================================

  private finishCaptureAndVerify(): void {
    const frame = this.captureFrame();

    this.stopCameraStream();

    if (!frame) {
      this.currentState = 'CAMERA_ERROR';

      this.errorMessage =
        'Could not capture a frame from the camera. Please try again.';

      return;
    }

    this.currentState = 'PROCESSING';

    this.errorMessage = null;

    this.livenessService
      .verifyLiveness({
        capturedFrame: frame,
      })
      .subscribe({
        next: (result: LivenessProcessingResult) => {
          this.requestId = result.requestId;

          if (result.success && result.data) {
            this.resultData = {
              ...result.data,

              /*
               * Backend currently returns capturedFrame
               * as null, so use the frame captured by Angular.
               */
              capturedFrame: result.data.capturedFrame || frame,
            };

            this.currentState = 'SUCCESS';

            console.log(
              '[LivenessDetectionComponent] REAL liveness verification successful:',
              this.resultData,
            );
          } else {
            this.currentState = 'LIVENESS_FAILED';

            this.errorMessage =
              result.error?.message ||
              'Liveness could not be confirmed from the captured frames.';
          }
        },

        error: (err: any) => {
          console.error('[LivenessDetectionComponent] API Error:', err);

          this.currentState = 'NETWORK_ERROR';

          this.errorMessage =
            'Network connection to the liveness verification backend failed. Please try again.';
        },
      });
  }

  // =========================================================
  // CAPTURE FRAME
  // =========================================================

  private captureFrame(): string | null {
    const video = this.videoEl?.nativeElement;

    const canvas = this.captureCanvas?.nativeElement;

    if (!video || !canvas) {
      return null;
    }

    canvas.width = video.videoWidth || 640;

    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    /*
     * Mirror the frame back to natural orientation
     * for the backend.
     */

    ctx.translate(canvas.width, 0);

    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.85);
  }

  // =========================================================
  // CANCEL CAMERA
  // =========================================================

  cancelCamera(): void {
    this.stopCameraStream();

    this.currentState = 'INITIAL';
  }

  // =========================================================
  // RETRY
  // =========================================================

  onRetry(): void {
    this.resultData = null;

    this.errorMessage = null;

    this.currentStepIndex = 0;

    this.currentState = 'INITIAL';
  }

  // =========================================================
  // CONFIRM LIVENESS
  // =========================================================

  onConfirmLiveness(): void {
    console.log(
      '[LivenessDetectionComponent] Liveness confirmed:',
      this.resultData,
    );

    // Make sure a result exists
    if (!this.resultData) {
      this.errorMessage = 'Liveness result is not available.';

      return;
    }

    // =======================================================
    // SAVE LIVENESS RESULT TO SHARED KYC STATE
    // =======================================================

    this.kycStateService.setLivenessResult({
      /*
       * Backend gives livenessScore as a decimal.
       *
       * Example:
       * 0.94 -> 94%
       */

      score: this.resultData.livenessScore * 100,

      /*
       * Whether liveness verification passed.
       */

      passed: this.resultData.passed,

      /*
       * Confidence score from backend.
       */

      confidenceScore: this.resultData.confidenceScore,

      /*
       * Verification status from backend.
       */

      verificationStatus: this.resultData.verificationStatus,
    });

    // =======================================================
    // DEBUG
    // =======================================================

    console.log(
      '[LivenessDetectionComponent] Liveness result saved to KYC state:',
      this.kycStateService.getState(),
    );

    // =======================================================
    // GO TO FACE MATCH
    // =======================================================

    this.router.navigate(['/face-match']);
  }

  // =========================================================
  // STOP CAMERA
  // =========================================================

  private stopCameraStream(): void {
    if (this.stepTimer) {
      clearTimeout(this.stepTimer);

      this.stepTimer = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });

      this.mediaStream = null;
    }
  }

  // =========================================================
  // COMPONENT DESTROY
  // =========================================================

  ngOnDestroy(): void {
    this.stopCameraStream();
  }
}