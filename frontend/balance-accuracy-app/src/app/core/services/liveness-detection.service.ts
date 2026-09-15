import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { Observable, of, throwError } from "rxjs";

import { catchError, delay } from "rxjs/operators";

import { environment } from "../../../environments/environment";

import {
  LivenessCaptureRequest,
  LivenessChallengeStep,
  LivenessProcessingResult,
  LivenessResultData,
} from "../models/liveness-detection.model";

@Injectable({
  providedIn: "root",
})
export class LivenessDetectionService {
  /**
   * Liveness challenge sequence.
   *
   * NOTE:
   * These currently control the UI challenge timing.
   * The actual backend currently verifies the captured
   * final frame using DeepFace anti-spoofing.
   */
  readonly challengeSteps: LivenessChallengeStep[] = [
    {
      type: "LOOK_STRAIGHT",
      label: "Look Straight",
      instruction: "Look straight into the camera",
      icon: "face",
      durationMs: 2000,
    },

    {
      type: "BLINK_EYES",
      label: "Blink",
      instruction: "Blink your eyes naturally",
      icon: "visibility",
      durationMs: 2000,
    },

    {
      type: "TURN_HEAD_LEFT",
      label: "Turn Left",
      instruction: "Slowly turn your head to the left",
      icon: "rotate_left",
      durationMs: 2000,
    },

    {
      type: "TURN_HEAD_RIGHT",
      label: "Turn Right",
      instruction: "Slowly turn your head to the right",
      icon: "rotate_right",
      durationMs: 2000,
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   * Send captured liveness frame to Spring Boot.
   *
   * Angular:
   * Base64 image
   *      ↓
   * Blob
   *      ↓
   * FormData
   *      ↓
   * Spring Boot
   *      ↓
   * FastAPI
   *      ↓
   * DeepFace
   */
  verifyLiveness(
    request: LivenessCaptureRequest,
  ): Observable<LivenessProcessingResult> {
    const apiUrl = `${environment.apiBaseUrl}${environment.livenessApiEndpoint}`;

    console.log("[LivenessDetectionService] API URL:", apiUrl);

    // --------------------------------------------------
    // Check captured frame
    // --------------------------------------------------

    if (!request.capturedFrame) {
      console.error("[LivenessDetectionService] No captured frame.");

      return throwError(
        () =>
          new Error("No captured frame available for liveness verification."),
      );
    }

    // --------------------------------------------------
    // Convert Base64 → Blob
    // --------------------------------------------------

    let imageBlob: Blob;

    try {
      imageBlob = this.base64ToBlob(request.capturedFrame, "image/jpeg");
    } catch (error) {
      console.error(
        "[LivenessDetectionService] Failed to convert Base64 image:",
        error,
      );

      return throwError(() => new Error("Invalid captured image data."));
    }

    console.log("[LivenessDetectionService] Image blob created:", {
      size: imageBlob.size,
      type: imageBlob.type,
    });

    // --------------------------------------------------
    // Create multipart/form-data
    // --------------------------------------------------

    const formData = new FormData();

    /**
     * IMPORTANT:
     *
     * Spring Boot expects:
     *
     * @RequestParam("image")
     * MultipartFile image
     *
     * Therefore this MUST be:
     *
     * formData.append("image", ...)
     */
    formData.append("image", imageBlob, "liveness.jpg");

    console.log("[LivenessDetectionService] FormData prepared.");

    // --------------------------------------------------
    // Send request to Spring Boot
    // --------------------------------------------------

    return this.http.post<LivenessProcessingResult>(apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("[LivenessDetectionService] Backend request failed.");

        console.error("[LivenessDetectionService] Status:", error.status);

        console.error(
          "[LivenessDetectionService] Status Text:",
          error.statusText,
        );

        console.error("[LivenessDetectionService] URL:", error.url);

        console.error("[LivenessDetectionService] Error:", error.error);

        /**
         * Do NOT use mock fallback here.
         *
         * During integration testing we want to see
         * the real backend error.
         */
        return throwError(() => error);
      }),
    );
  }

  /**
   * Convert Base64 image data to Blob.
   *
   * This implementation intentionally creates an
   * ArrayBuffer first.
   *
   * This fixes the TypeScript error:
   *
   * Uint8Array<ArrayBufferLike>
   * is not assignable to
   * BlobPart
   *
   * because Blob receives a normal ArrayBuffer.
   */
  private base64ToBlob(
    base64Data: string,
    mimeType: string = "image/jpeg",
  ): Blob {
    // --------------------------------------------------
    // Validate input
    // --------------------------------------------------

    if (!base64Data) {
      throw new Error("Base64 image data is empty.");
    }

    // --------------------------------------------------
    // Remove data URL prefix
    //
    // Example:
    //
    // data:image/jpeg;base64,/9j/4AAQ...
    //
    // becomes:
    //
    // /9j/4AAQ...
    // --------------------------------------------------

    const commaIndex = base64Data.indexOf(",");

    const base64String =
      commaIndex >= 0 ? base64Data.substring(commaIndex + 1) : base64Data;

    if (!base64String) {
      throw new Error("Invalid Base64 image data.");
    }

    // --------------------------------------------------
    // Decode Base64
    // --------------------------------------------------

    const byteCharacters = atob(base64String);

    // --------------------------------------------------
    // IMPORTANT FIX
    //
    // Explicitly create a normal ArrayBuffer.
    // --------------------------------------------------

    const buffer = new ArrayBuffer(byteCharacters.length);

    const bytes = new Uint8Array(buffer);

    // --------------------------------------------------
    // Copy binary data into ArrayBuffer
    // --------------------------------------------------

    for (let i = 0; i < byteCharacters.length; i++) {
      bytes[i] = byteCharacters.charCodeAt(i);
    }

    // --------------------------------------------------
    // Create Blob from ArrayBuffer
    // --------------------------------------------------

    return new Blob([buffer], {
      type: mimeType,
    });
  }

  /**
   * Mock liveness response.
   *
   * Kept for offline/demo purposes.
   *
   * NOTE:
   * verifyLiveness() does NOT call this method.
   */
  private getMockLivenessResponse(
    request: LivenessCaptureRequest,
  ): Observable<LivenessProcessingResult> {
    // --------------------------------------------------
    // No frame
    // --------------------------------------------------

    if (!request.capturedFrame) {
      return of<LivenessProcessingResult>({
        success: false,

        requestId: this.generateRequestId(),

        timestamp: new Date().toISOString(),

        error: {
          code: "LIVENESS_NO_FRAME",

          message:
            "No frame was captured from the camera during the challenge sequence.",

          details: "Camera stream may have been interrupted before capture.",
        },
      }).pipe(delay(1200));
    }

    // --------------------------------------------------
    // Generate mock scores
    // --------------------------------------------------

    const confidenceScore = Number((92 + Math.random() * 7).toFixed(1));

    const livenessScore = Number((90 + Math.random() * 9).toFixed(1));

    // --------------------------------------------------
    // Mock result
    // --------------------------------------------------

    const resultData: LivenessResultData = {
      passed: true,

      confidenceScore: confidenceScore,

      livenessScore: livenessScore,

      capturedFrame: request.capturedFrame,

      verificationStatus: "VERIFIED",
    };

    return of<LivenessProcessingResult>({
      success: true,

      requestId: this.generateRequestId(),

      timestamp: new Date().toISOString(),

      data: resultData,
    }).pipe(delay(1800));
  }

  /**
   * Generate request ID for mock responses.
   */
  private generateRequestId(): string {
    return "REQ-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  }
}
