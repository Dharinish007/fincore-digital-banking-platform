export type LivenessState =
  | 'INITIAL'
  | 'CAMERA_READY'
  | 'CHALLENGE_IN_PROGRESS'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'CAMERA_ERROR'
  | 'LIVENESS_FAILED'
  | 'NETWORK_ERROR';

export type LivenessChallengeType =
  | 'LOOK_STRAIGHT'
  | 'BLINK_EYES'
  | 'TURN_HEAD_LEFT'
  | 'TURN_HEAD_RIGHT';

export interface LivenessChallengeStep {
  type: LivenessChallengeType;
  label: string;
  instruction: string;
  icon: string;
  durationMs: number;
}

export interface LivenessCaptureRequest {
  capturedFrame: string; // base64 JPEG data URL
  documentNumber?: string; // links back to the Document OCR stage, if available
}

export interface LivenessResultData {
  passed: boolean;
  confidenceScore: number;
  livenessScore: number;
  capturedFrame: string;
  verificationStatus: 'VERIFIED' | 'NEEDS_REVIEW' | 'REJECTED';
}

export interface LivenessProcessingResult {
  success: boolean;
  requestId: string;
  timestamp: string;
  data?: LivenessResultData;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}
