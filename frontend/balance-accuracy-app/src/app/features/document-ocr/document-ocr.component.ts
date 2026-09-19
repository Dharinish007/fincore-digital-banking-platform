import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { DocumentOcrService } from '../../core/services/document-ocr.service';
import { KycVerificationStateService } from '../../core/services/kyc-verification-state.service';

import {
  OcrExtractedData,
  OcrProcessingResult,
  OcrState,
  SupportedDocumentType,
} from '../../core/models/document-ocr.model';

import { DocumentUploadCardComponent } from './components/document-upload-card/document-upload-card.component';
import { OcrResultViewerComponent } from './components/ocr-result-viewer/ocr-result-viewer.component';
import { OcrStatusBannerComponent } from './components/ocr-status-banner/ocr-status-banner.component';

@Component({
  selector: 'app-document-ocr',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DocumentUploadCardComponent,
    OcrResultViewerComponent,
    OcrStatusBannerComponent,
  ],
  templateUrl: './document-ocr.component.html',
  styleUrls: ['./document-ocr.component.scss'],
})
export class DocumentOcrComponent {
  // ============================================================
  // OCR STATE
  // ============================================================

  currentState: OcrState = 'INITIAL';

  selectedDocumentType: SupportedDocumentType = 'aadhaar';

  selectedFile: File | null = null;

  previewUrl: string | null = null;

  errorMessage: string | null = null;

  requestId: string | null = null;

  extractedData: OcrExtractedData | null = null;

  constructor(
    private ocrService: DocumentOcrService,
    private kycStateService: KycVerificationStateService,
    private router: Router,
  ) {}

  // ============================================================
  // FILE SELECTED
  // ============================================================

  onFileSelected(event: { file: File; type: SupportedDocumentType }): void {
    this.selectedFile = event.file;

    this.selectedDocumentType = event.type;

    // ------------------------------------------------------------
    // Validate file
    // ------------------------------------------------------------

    const validation = this.ocrService.validateDocumentFile(this.selectedFile);

    if (!validation.valid) {
      this.currentState = 'VALIDATION_ERROR';

      this.errorMessage = validation.errorMessage || 'Invalid document file.';

      return;
    }

    // ------------------------------------------------------------
    // Valid file
    // ------------------------------------------------------------

    this.currentState = 'SELECTED';

    this.errorMessage = null;

    console.log('[DocumentOcrComponent] Document selected:', {
      name: this.selectedFile.name,
      type: this.selectedDocumentType,
      size: this.selectedFile.size,
    });
  }

  // ============================================================
  // DOCUMENT TYPE CHANGE
  // ============================================================

  onDocumentTypeChange(type: SupportedDocumentType): void {
    this.selectedDocumentType = type;
  }

  // ============================================================
  // REMOVE FILE
  // ============================================================

  onFileRemoved(): void {
    this.selectedFile = null;

    this.extractedData = null;

    this.requestId = null;

    this.previewUrl = null;

    this.errorMessage = null;

    this.currentState = 'INITIAL';
  }

  // ============================================================
  // START OCR
  // ============================================================

  startOcrProcessing(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a document first.';

      return;
    }

    this.currentState = 'PROCESSING';

    this.errorMessage = null;

    this.extractedData = null;

    console.log(
      '[DocumentOcrComponent] Starting OCR:',
      this.selectedDocumentType,
    );

    this.ocrService
      .processDocument(this.selectedFile, this.selectedDocumentType)
      .subscribe({
        // ======================================================
        // OCR RESPONSE
        // ======================================================

        next: (result: OcrProcessingResult) => {
          // ----------------------------------------------------
          // SUCCESS
          // ----------------------------------------------------

          if (result.success && result.data) {
            this.currentState = 'SUCCESS';

            this.requestId = result.requestId;

            this.extractedData = result.data;

            console.log('[DocumentOcrComponent] OCR successful:', result.data);

            console.log(
              '[DocumentOcrComponent] Current KYC state:',
              this.kycStateService.getState(),
            );

            return;
          }

          // ----------------------------------------------------
          // OCR FAILED
          // ----------------------------------------------------

          this.currentState = 'OCR_ERROR';

          this.errorMessage =
            result.error?.message || 'Failed to extract text from document.';

          console.error('[DocumentOcrComponent] OCR failed:', result.error);
        },

        // ======================================================
        // NETWORK / HTTP ERROR
        // ======================================================

        error: (err: any) => {
          console.error('[DocumentOcrComponent] API Error:', err);

          this.currentState = 'NETWORK_ERROR';

          this.errorMessage =
            'Network connection to OCR backend failed. Please try again.';
        },
      });
  }

  // ============================================================
  // CONFIRM OCR DATA
  // ============================================================

  onConfirmData(data: OcrExtractedData): void {
    console.log('[DocumentOcrComponent] Confirmed OCR data:', data);

    // ----------------------------------------------------------
    // Save customer information
    // ----------------------------------------------------------

    this.kycStateService.setOcrResult({
      score: data.confidenceScore,
      passed: data.verificationStatus === 'VERIFIED',
    });

    // ----------------------------------------------------------
    // Save OCR verification result
    // ----------------------------------------------------------

    this.kycStateService.setOcrResult({
      score: data.confidenceScore,

      passed: data.verificationStatus === 'VERIFIED',
    });

    // ----------------------------------------------------------
    // Log complete KYC state
    // ----------------------------------------------------------

    console.log(
      '[DocumentOcrComponent] OCR saved to KYC state:',
      this.kycStateService.getState(),
    );

    // ----------------------------------------------------------
    // Move to Liveness Detection
    // ----------------------------------------------------------

    this.router.navigate(['/liveness-detection']);
  }

  // ============================================================
  // RETRY OCR
  // ============================================================

  onRetry(): void {
    if (this.selectedFile) {
      this.startOcrProcessing();
    } else {
      this.currentState = 'INITIAL';

      this.errorMessage = null;
    }
  }

  // ============================================================
  // RESET WORKFLOW
  // ============================================================

  resetWorkflow(): void {
    this.onFileRemoved();

    // Optional:
    // If you want a completely fresh KYC session,
    // uncomment the following line.

    // this.kycStateService.clear();
  }
}
