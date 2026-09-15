import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DocumentOcrService } from '../../core/services/document-ocr.service';
import { 
  OcrExtractedData, 
  OcrProcessingResult, 
  OcrState, 
  SupportedDocumentType 
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
    OcrStatusBannerComponent
  ],
  templateUrl: './document-ocr.component.html',
  styleUrls: ['./document-ocr.component.scss']
})
export class DocumentOcrComponent {
  currentState: OcrState = 'INITIAL';
  selectedDocumentType: SupportedDocumentType = 'aadhaar';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errorMessage: string | null = null;
  requestId: string | null = null;
  extractedData: OcrExtractedData | null = null;

  constructor(
    private ocrService: DocumentOcrService,
    private router: Router
  ) {}

  onFileSelected(event: { file: File; type: SupportedDocumentType }) {
    this.selectedFile = event.file;
    this.selectedDocumentType = event.type;
    
    // Validate file
    const validation = this.ocrService.validateDocumentFile(this.selectedFile);
    if (!validation.valid) {
      this.currentState = 'VALIDATION_ERROR';
      this.errorMessage = validation.errorMessage || 'Invalid document file.';
      return;
    }

    this.currentState = 'SELECTED';
    this.errorMessage = null;
  }

  onDocumentTypeChange(type: SupportedDocumentType) {
    this.selectedDocumentType = type;
  }

  onFileRemoved() {
    this.selectedFile = null;
    this.extractedData = null;
    this.errorMessage = null;
    this.currentState = 'INITIAL';
  }

  startOcrProcessing() {
    if (!this.selectedFile) return;

    this.currentState = 'PROCESSING';
    this.errorMessage = null;

    this.ocrService.processDocument(this.selectedFile, this.selectedDocumentType).subscribe({
      next: (result: OcrProcessingResult) => {
        if (result.success && result.data) {
          this.currentState = 'SUCCESS';
          this.requestId = result.requestId;
          this.extractedData = result.data;
        } else {
          this.currentState = 'OCR_ERROR';
          this.errorMessage = result.error?.message || 'Failed to extract text from document.';
        }
      },
      error: (err: any) => {
        console.error('[DocumentOcrComponent] API Error:', err);
        this.currentState = 'NETWORK_ERROR';
        this.errorMessage = 'Network connection to OCR backend failed. Please try again.';
      }
    });
  }

  onConfirmData(data: OcrExtractedData) {
    console.log('[DocumentOcrComponent] Confirmed extracted OCR data:', data);
    // Proceed to next KYC workflow step: Liveness Detection
    this.router.navigate(['/liveness-detection']);
  }

  onRetry() {
    if (this.selectedFile) {
      this.startOcrProcessing();
    } else {
      this.currentState = 'INITIAL';
    }
  }

  resetWorkflow() {
    this.onFileRemoved();
  }
}
