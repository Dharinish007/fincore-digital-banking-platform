import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  LivenessCaptureRequest,
  LivenessChallengeStep,
  LivenessProcessingResult,
  LivenessResultData
} from '../models/liveness-detection.model';

@Injectable({
  providedIn: 'root'
})
export class LivenessDetectionService {
  /**
   * The randomized challenge sequence the user is asked to perform on camera.
   * Order is fixed here for now; randomize with sort(() => Math.random() - 0.5)
   * once the anti-spoofing backend expects randomized challenge order.
   */
  readonly challengeSteps: LivenessChallengeStep[] = [
    {
      type: 'LOOK_STRAIGHT',
      label: 'Look Straight',
      instruction: 'Look straight into the camera',
      icon: 'face',
      durationMs: 2000
    },
    {
      type: 'BLINK_EYES',
      label: 'Blink',
      instruction: 'Blink your eyes naturally',
      icon: 'visibility',
      durationMs: 2000
    },
    {
      type: 'TURN_HEAD_LEFT',
      label: 'Turn Left',
      instruction: 'Slowly turn your head to the left',
      icon: 'rotate_left',
      durationMs: 2000
    },
    {
      type: 'TURN_HEAD_RIGHT',
      label: 'Turn Right',
      instruction: 'Slowly turn your head to the right',
      icon: 'rotate_right',
      durationMs: 2000
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Submit the captured frame for liveness verification via Backend REST API
   * or Mock Fallback, consistent with DocumentOcrService's pattern.
   */
  verifyLiveness(request: LivenessCaptureRequest): Observable<LivenessProcessingResult> {
    const apiUrl = `${environment.apiBaseUrl}${environment.livenessApiEndpoint}`;

    return this.http.post<LivenessProcessingResult>(apiUrl, request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (environment.mockFallback) {
          console.warn('[LivenessDetectionService] Real backend unreachable. Using simulated liveness verification fallback.', error);
          return this.getMockLivenessResponse(request);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Generates a realistic simulated liveness response for demonstration & offline test,
   * mirroring DocumentOcrService.getMockOcrResponse.
   */
  private getMockLivenessResponse(request: LivenessCaptureRequest): Observable<LivenessProcessingResult> {
    if (!request.capturedFrame) {
      return of<LivenessProcessingResult>({
        success: false,
        requestId: this.generateRequestId(),
        timestamp: new Date().toISOString(),
        error: {
          code: 'LIVENESS_NO_FRAME',
          message: 'No frame was captured from the camera during the challenge sequence.',
          details: 'Camera stream may have been interrupted before capture.'
        }
      }).pipe(delay(1200));
    }

    const confidenceScore = Number((92 + Math.random() * 7).toFixed(1)); // 92.0 - 99.0
    const livenessScore = Number((90 + Math.random() * 9).toFixed(1));

    const resultData: LivenessResultData = {
      passed: true,
      confidenceScore,
      livenessScore,
      capturedFrame: request.capturedFrame,
      verificationStatus: 'VERIFIED'
    };

    return of<LivenessProcessingResult>({
      success: true,
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      data: resultData
    }).pipe(delay(1800));
  }

  private generateRequestId(): string {
    return 'REQ-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  }
}
