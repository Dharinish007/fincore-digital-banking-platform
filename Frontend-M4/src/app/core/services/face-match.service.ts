import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
  tap,
  timer,
} from "rxjs";

import { environment } from "../../../environments/environment";

import {
  FaceMatchResult,
  FaceSourceImage,
  QualityCheckItem,
  SimilarityMetric,
  VerificationState,
  MatchDetailsReport,
} from "../models/face-match.model";

@Injectable({
  providedIn: "root",
})
export class FaceMatchService {
  private http = inject(HttpClient);

  // ============================================================
  // INITIAL UI STATE
  // ============================================================

  private readonly initialResult: FaceMatchResult = {
    score: 0,
    threshold: 80,
    confidence: "LOW",
    matched: false,
    status: "IDLE",

    idFaceQuality: 0,
    selfieFaceQuality: 0,

    faceDetected: false,
    blurScore: 0,
    poseScore: 0,

    facialFeatureSimilarity: 0,
    poseConsistency: 0,
    imageQualityAverage: 0,

    idFaceDetected: false,
    selfieFaceDetected: false,
    facesDetectedCount: 0,

    latencyMs: 0,
    timestamp: new Date().toISOString(),

    auditRef: "",
  };

  // ============================================================
  // DEFAULT SOURCE IMAGES
  // ============================================================

  private readonly defaultSourceImages: FaceSourceImage = {
    idPhotoUrl: "",
    selfiePhotoUrl: "",
    idDocumentType: "ID Document",
    idQuality: 0,
    selfieQuality: 0,
    idDetected: false,
    selfieDetected: false,
    captureTimestamp: new Date().toISOString(),
  };

  // ============================================================
  // SUBJECTS
  // ============================================================

  private resultSubject = new BehaviorSubject<FaceMatchResult>(
    this.initialResult,
  );

  public result$: Observable<FaceMatchResult> =
    this.resultSubject.asObservable();

  private sourceImagesSubject = new BehaviorSubject<FaceSourceImage>(
    this.defaultSourceImages,
  );

  public sourceImages$: Observable<FaceSourceImage> =
    this.sourceImagesSubject.asObservable();

  private isComparingSubject = new BehaviorSubject<boolean>(false);

  public isComparing$: Observable<boolean> =
    this.isComparingSubject.asObservable();

  // ============================================================
  // GET CURRENT RESULT
  // ============================================================

  public getCurrentResult(): FaceMatchResult {
    return this.resultSubject.value;
  }

  // ============================================================
  // UPDATE SOURCE IMAGE PREVIEWS
  // ============================================================

  public updateSourceImages(
    idUrl: string | null,
    selfieUrl: string | null,
  ): void {
    const current = this.sourceImagesSubject.value;

    this.sourceImagesSubject.next({
      ...current,

      idPhotoUrl: idUrl || "",
      selfiePhotoUrl: selfieUrl || "",

      captureTimestamp: new Date().toISOString(),
    });
  }

  // ============================================================
  // REAL FACE MATCH API
  // ANGULAR → SPRING BOOT
  // ============================================================

  public compareFaces(
    idFile: File,
    selfieFile: File,
  ): Observable<FaceMatchResult> {
    this.isComparingSubject.next(true);

    this.setVerificationState("PROCESSING");

    // ------------------------------------------------------------
    // Create multipart/form-data
    // ------------------------------------------------------------

    const formData = new FormData();

    /*
     * IMPORTANT:
     *
     * These names MUST match Spring Boot:
     *
     * @RequestParam("registeredImage")
     * @RequestParam("selfieImage")
     */

    formData.append("registeredImage", idFile, idFile.name);

    formData.append("selfieImage", selfieFile, selfieFile.name);

    // ------------------------------------------------------------
    // Spring Boot endpoint
    // ------------------------------------------------------------

    const endpointUrl = environment.faceMatchEndpoint.startsWith("http")
      ? environment.faceMatchEndpoint
      : `${environment.apiBaseUrl}${environment.faceMatchEndpoint}`;

    console.log("Face Match API URL:", endpointUrl);
    console.log("Registered Image:", idFile.name);
    console.log("Selfie Image:", selfieFile.name);

    // ------------------------------------------------------------
    // HTTP POST
    // ------------------------------------------------------------

    return this.http.post<Partial<FaceMatchResult>>(endpointUrl, formData).pipe(
      // --------------------------------------------------------
      // Convert backend response into UI model
      // --------------------------------------------------------

      map((response: any) => {
        console.log("Face Match Backend Response:", response);

        return this.normalizeResult(response);
      }),

      // --------------------------------------------------------
      // Update UI
      // --------------------------------------------------------

      tap((normalizedResult: any) => {
        this.resultSubject.next(normalizedResult);
      }),

      // --------------------------------------------------------
      // Handle API errors
      // --------------------------------------------------------

      catchError((error: HttpErrorResponse) => {
        console.error("Face Match API Error:", error);

        const errorResult = this.handleApiError(error);

        this.resultSubject.next(errorResult);

        return of(errorResult);
      }),
      finalize(() => this.isComparingSubject.next(false)),
    );
  }

  // ============================================================
  // NORMALIZE BACKEND RESPONSE
  // ============================================================

  private normalizeResult(res: Partial<FaceMatchResult>): FaceMatchResult {
    const threshold = typeof res.threshold === "number" ? res.threshold : 80;
    const score =
      typeof res.score === "number"
        ? res.score
        : typeof res.distance === "number" && threshold > 0
          ? Math.max(0, Math.min(100, (1 - res.distance / threshold) * 100))
          : typeof res.matched === "boolean" && res.matched
            ? 100
            : 0;

    const matched =
      typeof res.matched === "boolean" ? res.matched : score >= threshold;

    let status: VerificationState;

    if (res.status) {
      status = res.status;
    } else if (res.message && typeof res.distance !== "number") {
      status = "ERROR";
    } else if (matched) {
      status = "VERIFIED";
    } else if (score >= 70) {
      status = "REVIEW_REQUIRED";
    } else {
      status = "REJECTED";
    }

    // ------------------------------------------------------------
    // Confidence
    // ------------------------------------------------------------

    let confidence = res.confidence;

    if (!confidence) {
      confidence = score >= 85 ? "HIGH" : score >= 70 ? "MEDIUM" : "LOW";
    }

    // ------------------------------------------------------------
    // Return complete UI object
    // ------------------------------------------------------------

    return {
      score,

      threshold,

      confidence,

      matched,

      status,

      idFaceQuality: res.idFaceQuality ?? 0,

      selfieFaceQuality: res.selfieFaceQuality ?? 0,

      faceDetected: res.faceDetected ?? false,

      blurScore: res.blurScore ?? 0,

      poseScore: res.poseScore ?? 0,

      visibilityScore: res.visibilityScore,

      occlusionScore: res.occlusionScore,

      facialFeatureSimilarity: res.facialFeatureSimilarity ?? score,

      poseConsistency: res.poseConsistency ?? 0,

      imageQualityAverage: res.imageQualityAverage ?? 0,

      idFaceDetected: res.idFaceDetected ?? false,

      selfieFaceDetected: res.selfieFaceDetected ?? false,

      facesDetectedCount: res.facesDetectedCount ?? 0,

      latencyMs: res.latencyMs ?? 0,

      timestamp: res.timestamp || new Date().toISOString(),

      auditRef: res.auditRef || "",

      errorMessage: res.errorMessage || res.message,
      distance: res.distance,
      model: res.model,
    };
  }

  // ============================================================
  // API ERROR HANDLING
  // ============================================================

  private handleApiError(error: HttpErrorResponse): FaceMatchResult {
    let message = "Face Match Could Not Be Completed. Please try again.";

    // ------------------------------------------------------------
    // Backend unreachable
    // ------------------------------------------------------------

    if (error.status === 0) {
      message =
        "Unable to connect to Face Match backend server. " +
        "Make sure Spring Boot is running.";
    }

    // ------------------------------------------------------------
    // Bad request
    // ------------------------------------------------------------
    else if (error.status === 400) {
      message =
        error.error?.message ||
        "Invalid image request. Please upload valid ID and selfie images.";
    }

    // ------------------------------------------------------------
    // Unauthorized
    // ------------------------------------------------------------
    else if (error.status === 401) {
      message = "You are not authorized to perform face verification.";
    }

    // ------------------------------------------------------------
    // Forbidden
    // ------------------------------------------------------------
    else if (error.status === 403) {
      message = "Face verification request was forbidden.";
    }

    // ------------------------------------------------------------
    // Not found
    // ------------------------------------------------------------
    else if (error.status === 404) {
      message =
        "Face Match API endpoint was not found. " +
        "Check the Spring Boot API URL.";
    }

    // ------------------------------------------------------------
    // Payload too large
    // ------------------------------------------------------------
    else if (error.status === 413) {
      message = "Uploaded image is too large. Please upload images under 10MB.";
    }

    // ------------------------------------------------------------
    // Server error
    // ------------------------------------------------------------
    else if (error.status >= 500) {
      message =
        error.error?.message ||
        "Face Match backend encountered an internal server error.";
    }

    // ------------------------------------------------------------
    // Generic backend message
    // ------------------------------------------------------------
    else if (error.error?.message) {
      message = error.error.message;
    }

    // ------------------------------------------------------------
    // Return error result
    // ------------------------------------------------------------

    return {
      ...this.resultSubject.value,

      score: 0,

      matched: false,

      status: "ERROR",

      errorMessage: message,

      timestamp: new Date().toISOString(),
    };
  }

  // ============================================================
  // QUALITY CHECKS
  // ============================================================

  public getQualityChecks(result: FaceMatchResult): QualityCheckItem[] {
    return [
      {
        id: "id-detection",

        title: "ID Face Detection",

        status: (result.idFaceDetected ?? false) ? "PASS" : "FAIL",

        score: result.idFaceQuality ?? 0,

        summary:
          (result.idFaceDetected ?? false)
            ? "Face detected in ID document"
            : "No face found in ID document",

        details:
          (result.idFaceQuality ?? 0) >= 90
            ? "Face visibility: Excellent"
            : "Face visibility: Needs improvement",

        icon: "badge",
      },

      {
        id: "selfie-detection",

        title: "Selfie Face Detection",

        status: (result.selfieFaceDetected ?? false) ? "PASS" : "FAIL",

        score: result.selfieFaceQuality ?? 0,

        summary:
          (result.selfieFaceDetected ?? false)
            ? "Face detected in selfie"
            : "No face found in selfie",

        details:
          (result.selfieFaceQuality ?? 0) >= 90
            ? "Face visibility: Excellent"
            : "Face visibility: Needs improvement",

        icon: "face",
      },

      {
        id: "blur-sharpness",

        title: "Blur / Sharpness",

        status:
          (result.blurScore ?? 0) >= 85
            ? "GOOD"
            : (result.blurScore ?? 0) >= 70
              ? "WARNING"
              : "FAIL",

        score: result.blurScore ?? 0,

        summary:
          (result.blurScore ?? 0) >= 85
            ? "Images have good sharpness"
            : "Image sharpness needs improvement",

        details: `Sharpness index: ${result.blurScore ?? 0}%`,

        icon: "photo_camera",
      },

      {
        id: "pose-alignment",

        title: "Pose / Alignment",

        status:
          (result.poseScore ?? 0) >= 85
            ? "GOOD"
            : (result.poseScore ?? 0) >= 70
              ? "WARNING"
              : "FAIL",

        score: result.poseScore ?? 0,

        summary:
          (result.poseScore ?? 0) >= 85
            ? "Faces are properly aligned"
            : "Face angle deviation detected",

        details: `Alignment score: ${result.poseScore ?? 0}%`,

        icon: "center_focus_strong",
      },
    ];
  }

  // ============================================================
  // SIMILARITY METRICS
  // ============================================================

  public getSimilarityMetrics(result: FaceMatchResult): SimilarityMetric[] {
    return [
      {
        id: "face-sim",

        label: "Face Similarity",

        value: result.score,

        benchmark: result.threshold,

        unit: "%",

        color: "#3B82F6",
      },

      {
        id: "feature-sim",

        label: "Facial Feature Similarity",

        value: result.facialFeatureSimilarity ?? result.score,

        benchmark: 80,

        unit: "%",

        color: "#60A5FA",
      },

      {
        id: "pose-const",

        label: "Pose Consistency",

        value: result.poseConsistency ?? 0,

        benchmark: 80,

        unit: "%",

        color: "#10B981",
      },

      {
        id: "img-quality",

        label: "Image Quality",

        value: result.imageQualityAverage ?? 0,

        benchmark: 75,

        unit: "%",

        color: "#38BDF8",
      },
    ];
  }

  // ============================================================
  // MATCH DETAILS REPORT
  // ============================================================

  public getMatchDetailsReport(result: FaceMatchResult): MatchDetailsReport {
    return {
      auditRef: result.auditRef || "N/A",

      aiEngine: "Face Matching Engine",

      vectorEuclideanDistance: 0,

      cosineSimilarity: +(result.score / 100).toFixed(4),

      landmarksMatched: 0,

      totalLandmarks: 0,

      illuminationMatch: result.imageQualityAverage ?? 0,

      antiSpoofConfidence: 0,

      processingTimeMs: result.latencyMs || 0,

      decisionRule: `Score (${result.score}%) >= Threshold (${result.threshold}%)`,
    };
  }

  // ============================================================
  // VERIFICATION STATE
  // ============================================================

  public setVerificationState(state: VerificationState): void {
    const current = this.resultSubject.value;

    switch (state) {
      case "PROCESSING":
        this.resultSubject.next({
          ...current,

          status: "PROCESSING",

          errorMessage: undefined,
        });

        break;

      case "VERIFIED":
        this.resultSubject.next({
          ...current,

          status: "VERIFIED",

          matched: true,

          timestamp: new Date().toISOString(),
        });

        break;

      case "REJECTED":
        this.resultSubject.next({
          ...current,

          status: "REJECTED",

          matched: false,

          timestamp: new Date().toISOString(),
        });

        break;

      case "REVIEW_REQUIRED":
        this.resultSubject.next({
          ...current,

          status: "REVIEW_REQUIRED",

          matched: false,

          timestamp: new Date().toISOString(),
        });

        break;

      case "ERROR":
        this.resultSubject.next({
          ...current,

          score: 0,

          matched: false,

          status: "ERROR",

          errorMessage: "Face Match Could Not Be Completed.",

          timestamp: new Date().toISOString(),
        });

        break;
    }
  }

  // ============================================================
  // SIMULATED ANALYSIS
  // USE ONLY FOR UI TESTING
  // ============================================================

  public compareFacesSimulated(
    targetState: VerificationState = "VERIFIED",
  ): Observable<FaceMatchResult> {
    this.isComparingSubject.next(true);

    this.setVerificationState("PROCESSING");

    return timer(1500).pipe(
      map(() => {
        this.isComparingSubject.next(false);

        this.setVerificationState(targetState);

        return this.resultSubject.value;
      }),
    );
  }

  // ============================================================
  // RETRY / REANALYSIS
  // ============================================================

  public triggerReanalysis(targetState: VerificationState = "VERIFIED"): void {
    this.setVerificationState("PROCESSING");

    timer(1400).subscribe(() => {
      this.setVerificationState(targetState);
    });
  }
}
