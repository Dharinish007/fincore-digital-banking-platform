import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  FileValidationResult, 
  OcrExtractedData, 
  OcrProcessingResult, 
  SupportedDocumentType 
} from '../models/document-ocr.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentOcrService {
  private readonly maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  constructor(private http: HttpClient) {}

  /**
   * Validate document file extension, MIME type and file size.
   */
  validateDocumentFile(file: File): FileValidationResult {
    if (!file) {
      return { valid: false, errorMessage: 'No file selected.' };
    }

    if (file.size > this.maxFileSizeBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return { 
        valid: false, 
        errorMessage: `File size (${sizeMb} MB) exceeds maximum allowed limit of 5.00 MB.` 
      };
    }

    const isValidType = this.allowedMimeTypes.includes(file.type.toLowerCase()) || 
      /\.(jpg|jpeg|png|pdf)$/i.test(file.name);

    if (!isValidType) {
      return { 
        valid: false, 
        errorMessage: 'Invalid file format. Supported formats: JPG, JPEG, PNG, PDF.' 
      };
    }

    return { valid: true };
  }

  /**
   * Submit document for OCR processing via Backend REST API or Mock Fallback.
   */
  processDocument(file: File, documentType: SupportedDocumentType): Observable<OcrProcessingResult> {
    const validation = this.validateDocumentFile(file);
    if (!validation.valid) {
      return throwError(() => new Error(validation.errorMessage || 'File validation failed'));
    }

    const formData = new FormData();
    formData.append('document', file, file.name);
    formData.append('documentType', documentType);

    const apiUrl = `${environment.apiBaseUrl}${environment.ocrApiEndpoint}`;

    return this.http.post<OcrProcessingResult>(apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        if (environment.mockFallback) {
          console.warn('[DocumentOcrService] Real backend unreachable. Using simulated OCR extraction fallback.', error);
          return this.getMockOcrResponse(file, documentType);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Generates realistic simulated OCR response for demonstration & offline test.
   */
  private getMockOcrResponse(file: File, documentType: SupportedDocumentType): Observable<OcrProcessingResult> {
    const isErrorTest = file.name.toLowerCase().includes('corrupt') || file.name.toLowerCase().includes('error');
    
    if (isErrorTest) {
      return of<OcrProcessingResult>({
        success: false,
        requestId: 'REQ-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        timestamp: new Date().toISOString(),
        error: {
          code: 'OCR_UNREADABLE',
          message: 'Unable to extract legible text from uploaded document. Please upload a clearer image.',
          details: 'Image resolution low or document obscured.'
        }
      }).pipe(delay(1200));
    }

    const mockData: Record<SupportedDocumentType, OcrExtractedData> = {
      aadhaar: {
        fullName: 'Manikandan R',
        dob: '1996-08-15',
        gender: 'Male',
        documentNumber: '5482 9102 3841',
        address: '124 Park View Avenue, Sector 4, Chennai, TN 600028',
        issueDate: '2018-05-10',
        expiryDate: 'N/A (Lifetime)',
        documentType: 'aadhaar',
        confidenceScore: 98.4,
        verificationStatus: 'VERIFIED'
      },
      pan: {
        fullName: 'Manikandan R',
        dob: '1996-08-15',
        gender: 'Male',
        documentNumber: 'ABCDE1234F',
        address: '124 Park View Avenue, Sector 4, Chennai, TN 600028',
        issueDate: '2019-02-14',
        expiryDate: 'N/A (Lifetime)',
        documentType: 'pan',
        confidenceScore: 99.1,
        verificationStatus: 'VERIFIED'
      },
      passport: {
        fullName: 'Manikandan Ramasamy',
        dob: '1996-08-15',
        gender: 'Male',
        documentNumber: 'Z8492019',
        address: '124 Park View Avenue, Sector 4, Chennai, TN 600028',
        issueDate: '2021-03-20',
        expiryDate: '2031-03-19',
        documentType: 'passport',
        confidenceScore: 96.8,
        verificationStatus: 'VERIFIED'
      },
      driving_license: {
        fullName: 'Manikandan R',
        dob: '1996-08-15',
        gender: 'Male',
        documentNumber: 'TN-07-2020-0098412',
        address: '124 Park View Avenue, Sector 4, Chennai, TN 600028',
        issueDate: '2020-07-11',
        expiryDate: '2040-07-10',
        documentType: 'driving_license',
        confidenceScore: 95.2,
        verificationStatus: 'VERIFIED'
      }
    };

    return of<OcrProcessingResult>({
      success: true,
      requestId: 'REQ-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      data: mockData[documentType] || mockData['aadhaar']
    }).pipe(delay(1500));
  }
}
