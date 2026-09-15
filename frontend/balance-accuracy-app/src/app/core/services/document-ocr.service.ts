import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, from, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { createWorker } from "tesseract.js";
import { environment } from "../../../environments/environment";
import {
  FileValidationResult,
  OcrExtractedData,
  OcrProcessingResult,
  SupportedDocumentType,
} from "../models/document-ocr.model";

@Injectable({
  providedIn: "root",
})
export class DocumentOcrService {
  private readonly maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB
  private readonly allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  constructor(private http: HttpClient) {}

  /**
   * Validate document file extension, MIME type and file size.
   */
  validateDocumentFile(file: File): FileValidationResult {
    if (!file) {
      return { valid: false, errorMessage: "No file selected." };
    }

    if (file.size > this.maxFileSizeBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        errorMessage: `File size (${sizeMb} MB) exceeds maximum allowed limit of 5.00 MB.`,
      };
    }

    const isValidType =
      this.allowedMimeTypes.includes(file.type.toLowerCase()) ||
      /\.(jpg|jpeg|png|pdf)$/i.test(file.name);

    if (!isValidType) {
      return {
        valid: false,
        errorMessage:
          "Invalid file format. Supported formats: JPG, JPEG, PNG, PDF.",
      };
    }

    return { valid: true };
  }

  /**
   * Process uploaded document using REAL Tesseract WebAssembly OCR engine or Backend REST API.
   * NO HARDCODED OR PREDEFINED IDENTITY DATA IS RETURNED.
   */
  processDocument(
    file: File,
    documentType: SupportedDocumentType,
  ): Observable<OcrProcessingResult> {
    const validation = this.validateDocumentFile(file);
    if (!validation.valid) {
      return throwError(
        () => new Error(validation.errorMessage || "File validation failed"),
      );
    }

    // Check for PDF file format
    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      return of<OcrProcessingResult>({
        success: false,
        requestId:
          "REQ-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        timestamp: new Date().toISOString(),
        error: {
          code: "PDF_CONVERSION_REQUIRED",
          message:
            "Client-side Wasm OCR requires image formats (JPG, JPEG, PNG). Please convert or save your document as an image file before uploading.",
          details: "PDF binary rendering step is required for raster OCR.",
        },
      });
    }

    // Attempt backend call ONLY if backend mode is explicitly active
    if (!environment.mockFallback) {
      const formData = new FormData();
      formData.append("document", file, file.name);
      formData.append("documentType", documentType);

      const apiUrl = environment.ocrApiEndpoint.startsWith("http")
        ? environment.ocrApiEndpoint
        : `${environment.apiBaseUrl}${environment.ocrApiEndpoint}`;
      return this.http.post<BackendOcrResponse>(apiUrl, formData).pipe(
        map((response) => this.toProcessingResult(response, documentType)),
        catchError((error: HttpErrorResponse) => {
          console.error("[DocumentOcrService] Backend REST API Error:", error);
          return of<OcrProcessingResult>({
            success: false,
            requestId:
              "REQ-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
            timestamp: new Date().toISOString(),
            error: {
              code: "BACKEND_UNAVAILABLE",
              message:
                "OCR Backend endpoint unreachable. Please verify network connectivity and server status.",
              details: error.message,
            },
          });
        }),
      );
    }

    // Real client-side OCR extraction using Tesseract.js WebAssembly engine
    return from(this.performRealClientSideOcr(file, documentType)).pipe(
      catchError((err: any) => {
        console.error("[DocumentOcrService] Client OCR Error:", err);
        return of<OcrProcessingResult>({
          success: false,
          requestId:
            "REQ-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
          timestamp: new Date().toISOString(),
          error: {
            code: "OCR_UNREADABLE",
            message:
              "Failed to process document image pixels. Please upload a clear image.",
            details: err?.message || "Text recognition engine failure.",
          },
        });
      }),
    );
  }

  private toProcessingResult(
    response: BackendOcrResponse,
    requestedDocumentType: SupportedDocumentType,
  ): OcrProcessingResult {
    const documentType = this.normalizeDocumentType(
      response.documentType,
      requestedDocumentType,
    );

    if (!response.success) {
      return {
        success: false,
        requestId: response.requestId || this.createRequestId(),
        timestamp: response.timestamp || new Date().toISOString(),
        error: {
          code: "OCR_PROCESSING_FAILED",
          message: response.message || "Failed to extract text from document.",
        },
      };
    }

    return {
      success: true,
      requestId: response.requestId || this.createRequestId(),
      timestamp: response.timestamp || new Date().toISOString(),
      data: {
        fullName: response.fullName || "",
        dob: response.dob || "",
        gender: response.gender || "",
        documentNumber: response.documentNumber || "",
        address: response.address || "",
        issueDate: response.issueDate || "",
        expiryDate: response.expiryDate || "",
        documentType,
        confidenceScore: response.confidenceScore || 0,
        extractedRawText: response.extractedRawText || "",
        verificationStatus: response.verificationStatus || "NEEDS_REVIEW",
      },
    };
  }

  private normalizeDocumentType(
    value: string | undefined,
    fallback: SupportedDocumentType,
  ): SupportedDocumentType {
    const normalized = value?.toLowerCase().replace(/[- ]/g, "_");
    return normalized === "aadhaar" ||
      normalized === "pan" ||
      normalized === "passport" ||
      normalized === "driving_license"
      ? normalized
      : fallback;
  }

  private createRequestId(): string {
    return "REQ-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  }

  /**
   * Performs REAL optical character recognition on actual uploaded document file using Tesseract.js.
   * Uses HTML Canvas image preprocessing to improve OCR accuracy.
   */
  private async performRealClientSideOcr(
    file: File,
    documentType: SupportedDocumentType,
  ): Promise<OcrProcessingResult> {
    const requestId =
      "REQ-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    let worker: any = null;
    try {
      // Preprocess image on Canvas for optimal OCR legibility
      const processedImageSource = await this.preprocessImage(file);

      // Initialize Tesseract worker
      try {
        worker = await createWorker("eng");
      } catch (workerErr) {
        console.warn(
          "[DocumentOcrService] Default worker init failed, attempting fallback CDN config:",
          workerErr,
        );
        worker = await createWorker("eng", 1, {
          workerPath:
            "https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js",
          corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0",
          logger: (m) =>
            console.log(
              "[Tesseract.js]",
              m.status,
              m.progress ? Math.round(m.progress * 100) + "%" : "",
            ),
        });
      }

      const { data } = await worker.recognize(processedImageSource);
      await worker.terminate();
      worker = null;

      const rawText = data.text || "";
      const confidenceScore = Math.round(data.confidence || 0);

      // Verify readable text was extracted
      if (!rawText.trim() || confidenceScore < 5) {
        return {
          success: false,
          requestId,
          timestamp,
          error: {
            code: "OCR_LOW_CONFIDENCE",
            message:
              "Unable to extract legible text from uploaded file. Please ensure the document is clear, well-lit, and unblurred.",
            details: `Raw text length: ${rawText.length}, Confidence: ${confidenceScore}%`,
          },
        };
      }

      // Parse real document fields from actual OCR text
      const extractedFields = this.parseDocumentFields(
        rawText,
        documentType,
        confidenceScore,
      );

      if (!extractedFields.documentNumber && !extractedFields.fullName) {
        return {
          success: false,
          requestId,
          timestamp,
          error: {
            code: "OCR_FIELD_NOT_FOUND",
            message: `Could not detect a valid ${documentType.toUpperCase()} document number or holder name in the uploaded image. Please ensure the document is aligned and legible.`,
            details: `Extracted raw text snippet: ${rawText.substring(0, 150)}...`,
          },
        };
      }

      return {
        success: true,
        requestId,
        timestamp,
        data: extractedFields,
      };
    } catch (err: any) {
      if (worker) {
        try {
          await worker.terminate();
        } catch (_) {}
      }
      throw err;
    }
  }

  /**
   * Browser Canvas Preprocessing: Grayscale & Contrast enhancement to boost OCR detection.
   */
  private preprocessImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(url);
            return;
          }

          // Scale canvas to ideal width (~1500px) for Tesseract recognition
          let targetWidth = img.width;
          let targetHeight = img.height;
          if (img.width < 1200) {
            const factor = 1500 / img.width;
            targetWidth = 1500;
            targetHeight = Math.round(img.height * factor);
          } else if (img.width > 2500) {
            const factor = 2000 / img.width;
            targetWidth = 2000;
            targetHeight = Math.round(img.height * factor);
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Image processing: Grayscale & Contrast boost
          const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          const pixels = imgData.data;

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            // Luminance formula for grayscale
            let gray = 0.299 * r + 0.587 * g + 0.114 * b;

            // Contrast enhancement (factor = 1.2)
            gray = (gray - 128) * 1.2 + 128;
            gray = Math.min(255, Math.max(0, gray));

            pixels[i] = gray;
            pixels[i + 1] = gray;
            pixels[i + 2] = gray;
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.95));
        } catch (e) {
          console.warn("[DocumentOcrService] Canvas preprocessing skipped:", e);
          resolve(url);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(url);
      };

      img.src = url;
    });
  }

  /**
   * Parses raw extracted OCR text lines to detect real document fields.
   */
  private parseDocumentFields(
    rawText: string,
    documentType: SupportedDocumentType,
    confidence: number,
  ): OcrExtractedData {
    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const textUpper = rawText.toUpperCase();

    let fullName = "";
    let documentNumber = "";
    let dob = "";
    let gender = "";
    let address = "";
    let issueDate = "N/A";
    let expiryDate = "N/A (Lifetime)";

    // Date Pattern Regex (DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY)
    const dateRegex =
      /\b(0[1-9]|[12][0-9]|3[01])[\/\.-](0[1-9]|1[012])[\/\.-](19|20)\d\d\b/;
    const dateMatch = rawText.match(dateRegex);
    if (dateMatch) {
      dob = dateMatch[0].replace(/[\.-]/g, "/");
    }

    // Gender Detection
    if (/\b(MALE|MEN)\b/i.test(rawText)) {
      gender = "Male";
    } else if (/\b(FEMALE|WOMEN)\b/i.test(rawText)) {
      gender = "Female";
    } else if (/\b(TRANSGENDER)\b/i.test(rawText)) {
      gender = "Transgender";
    }

    if (documentType === "pan") {
      // PAN Number Regex: Standard 10-character alphanumeric: 5 uppercase letters, 4 digits, 1 uppercase letter
      // Sanitize space between characters that OCR might introduce
      const cleanUpperNoSpaces = textUpper.replace(
        /([A-Z0-9])\s+([A-Z0-9])/g,
        "$1$2",
      );
      const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
      const panMatch =
        textUpper.match(panRegex) || cleanUpperNoSpaces.match(panRegex);

      if (panMatch) {
        documentNumber = panMatch[0];
      }

      // PAN Card Line Parsing for Name
      const ignoreWords = [
        "INCOME",
        "TAX",
        "GOVT",
        "GOVERNMENT",
        "INDIA",
        "DEPARTMENT",
        "PERMANENT",
        "ACCOUNT",
        "CARD",
        "SIGNATURE",
        "FATHER",
        "NAME",
        "NUMBER",
        "DOB",
        "DATE",
      ];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toUpperCase();

        // Skip header lines or lines containing PAN / DOB
        if (ignoreWords.some((w) => line.includes(w))) continue;
        if (panMatch && line.includes(panMatch[0])) continue;
        if (dateMatch && line.includes(dateMatch[0])) continue;

        // Candidate line for Name (only letters and spaces, length 3 to 40)
        if (!fullName && /^[A-Z\s]{3,40}$/.test(line)) {
          fullName = this.capitalizeWords(line);
        }
      }
    } else if (documentType === "aadhaar") {
      // Aadhaar Number Regex: 12 digits (often grouped 4 4 4)
      const aadhaarRegex = /\b[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\b/;
      const aadhaarMatch = rawText.match(aadhaarRegex);
      if (aadhaarMatch) {
        documentNumber = aadhaarMatch[0];
      }

      // Aadhaar YOB fallback if DOB full date not matched
      if (!dob) {
        const yobMatch =
          rawText.match(/Year of Birth\s*:?\s*(\d{4})/i) ||
          rawText.match(/\b(19|20)\d\d\b/);
        if (yobMatch) {
          dob = yobMatch[0];
        }
      }

      // Address line matching
      const addressStartIndex = lines.findIndex((l) =>
        /Address|S\/O|W\/O|D\/O|C\/O/i.test(l),
      );
      if (addressStartIndex !== -1) {
        address = lines
          .slice(addressStartIndex, addressStartIndex + 3)
          .join(", ");
      }
    } else if (documentType === "passport") {
      // Passport Number Regex: 1 letter followed by 7 digits
      const passportRegex = /\b[A-Z][0-9]{7}\b/;
      const passportMatch = textUpper.match(passportRegex);
      if (passportMatch) {
        documentNumber = passportMatch[0];
      }
    } else if (documentType === "driving_license") {
      // DL Number Regex: State code + numbers
      const dlRegex = /\b[A-Z]{2}[- ]?\d{2}[- ]?\d{4,11}\b/;
      const dlMatch = textUpper.match(dlRegex);
      if (dlMatch) {
        documentNumber = dlMatch[0];
      }
    }

    // General fallback for Full Name if document-specific rules didn't catch it
    if (!fullName) {
      for (const line of lines) {
        const upper = line.toUpperCase();
        if (
          /^[A-Z\s]{4,40}$/.test(upper) &&
          !upper.includes("GOVT") &&
          !upper.includes("INDIA") &&
          !upper.includes("DEPARTMENT") &&
          !upper.includes("INCOME") &&
          !upper.includes("TAX") &&
          !upper.includes("LICENCE") &&
          !upper.includes("PASSPORT") &&
          !upper.includes("DRIVING") &&
          !upper.includes("REPUBLIC")
        ) {
          fullName = this.capitalizeWords(upper);
          break;
        }
      }
    }

    // Address fallback
    if (!address) {
      const addressLines = lines.filter((l) =>
        /\b(ROAD|STREET|AVENUE|NAGAR|SECTOR|DISTRICT|CITY|STATE|PIN|CHENNAI|MUMBAI|DELHI|BANGALORE|HYDERABAD|KOLKATA)\b/i.test(
          l,
        ),
      );
      if (addressLines.length > 0) {
        address = addressLines.join(", ");
      }
    }

    const verificationStatus =
      documentNumber && fullName ? "VERIFIED" : "NEEDS_REVIEW";

    return {
      fullName: fullName || "Not Detected (Please Edit)",
      dob: dob || "Not Detected",
      gender: gender || "Not Specified",
      documentNumber: documentNumber || "Not Detected (Please Edit)",
      address: address || "Address details not clearly visible",
      issueDate,
      expiryDate,
      documentType,
      confidenceScore: confidence,
      extractedRawText: rawText,
      verificationStatus,
    };
  }

  private capitalizeWords(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

interface BackendOcrResponse {
  success: boolean;
  requestId?: string;
  timestamp?: string;
  documentType?: string;
  fullName?: string;
  dob?: string;
  gender?: string;
  documentNumber?: string;
  address?: string;
  issueDate?: string;
  expiryDate?: string;
  confidenceScore?: number;
  extractedRawText?: string;
  verificationStatus?: "VERIFIED" | "NEEDS_REVIEW" | "REJECTED";
  message?: string;
}
