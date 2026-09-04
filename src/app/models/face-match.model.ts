export type MatchConfidence = "LOW" | "MEDIUM" | "HIGH";
export type VerificationState =
  | "IDLE"
  | "PROCESSING"
  | "VERIFIED"
  | "REJECTED"
  | "REVIEW_REQUIRED"
  | "ERROR";
export type QualityStatus = "PASS" | "GOOD" | "WARNING" | "FAIL";

export interface FaceMatchResult {
  score: number;
  threshold: number;
  confidence: MatchConfidence;
  matched: boolean;
  status: VerificationState;
  idFaceQuality?: number;
  selfieFaceQuality?: number;
  faceDetected?: boolean;
  blurScore?: number;
  poseScore?: number;
  visibilityScore?: number;
  occlusionScore?: number;
  facialFeatureSimilarity?: number;
  poseConsistency?: number;
  imageQualityAverage?: number;
  idFaceDetected?: boolean;
  selfieFaceDetected?: boolean;
  facesDetectedCount?: number;
  latencyMs?: number;
  timestamp?: string;
  errorMessage?: string;
  auditRef?: string;
  distance?: number;
  model?: string;
}

export interface UploadImageState {
  file: File | null;
  previewUrl: string | null;
  fileName: string | null;
  fileSize: string | null;
  errorMessage: string | null;
}

export interface QualityCheckItem {
  id: string;
  title: string;
  status: QualityStatus;
  score: number;
  summary: string;
  details: string;
  icon: string;
}

export interface SimilarityMetric {
  id: string;
  label: string;
  value: number;
  benchmark?: number;
  unit?: string;
  color?: string;
}

export interface FaceSourceImage {
  idPhotoUrl: string;
  selfiePhotoUrl: string;
  idDocumentType: string;
  idQuality: number;
  selfieQuality: number;
  idDetected: boolean;
  selfieDetected: boolean;
  captureTimestamp: string;
}

export interface MatchDetailsReport {
  auditRef: string;
  aiEngine: string;
  vectorEuclideanDistance: number;
  cosineSimilarity: number;
  landmarksMatched: number;
  totalLandmarks: number;
  illuminationMatch: number;
  antiSpoofConfidence: number;
  processingTimeMs: number;
  decisionRule: string;
}
