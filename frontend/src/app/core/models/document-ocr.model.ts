export type OcrState = 
  | 'INITIAL'
  | 'SELECTED'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'VALIDATION_ERROR'
  | 'OCR_ERROR'
  | 'NETWORK_ERROR'
  | 'REVIEW';

export type SupportedDocumentType = 'aadhaar' | 'pan' | 'passport' | 'driving_license';

export interface DocumentUploadRequest {
  file: File;
  documentType: SupportedDocumentType;
}

export interface OcrExtractedData {
  fullName: string;
  dob: string;
  gender: string;
  documentNumber: string;
  address: string;
  issueDate: string;
  expiryDate: string;
  documentType: SupportedDocumentType;
  confidenceScore: number;
  extractedRawText?: string;
  verificationStatus: 'VERIFIED' | 'NEEDS_REVIEW' | 'REJECTED';
}

export interface OcrProcessingResult {
  success: boolean;
  requestId: string;
  timestamp: string;
  data?: OcrExtractedData;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

export interface FileValidationResult {
  valid: boolean;
  errorMessage?: string;
}
