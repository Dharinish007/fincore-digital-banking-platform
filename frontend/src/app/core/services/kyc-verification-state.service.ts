import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface KycOcrResult {
  score: number;
  passed: boolean;
}

export interface KycLivenessResult {
  score: number;
  passed: boolean;
  confidenceScore: number;
  verificationStatus: string;
}

export interface KycFaceMatchResult {
  score: number;
  passed: boolean;
}

export interface KycVerificationState {
  auditRef: string;

  // Actual Customer.customerId from backend
  customerId: number | null;

  customerName: string;

  timestamp: Date;

  ocr: KycOcrResult | null;

  liveness: KycLivenessResult | null;

  faceMatch: KycFaceMatchResult | null;
}

@Injectable({
  providedIn: 'root',
})
export class KycVerificationStateService {
  // ==========================================
  // INITIAL STATE
  // ==========================================

  private readonly initialState: KycVerificationState = {
    auditRef: '',
    customerId: null,
    customerName: '',
    timestamp: new Date(),

    ocr: null,
    liveness: null,
    faceMatch: null,
  };

  private stateSubject = new BehaviorSubject<KycVerificationState>(
    this.initialState,
  );

  state$ = this.stateSubject.asObservable();

  // ==========================================
  // GET CURRENT STATE
  // ==========================================

  getState(): KycVerificationState {
    return this.stateSubject.value;
  }

  // ==========================================
  // CUSTOMER DETAILS
  // ==========================================

  setCustomerDetails(customerId: number, customerName: string): void {
    const current = this.getState();

    this.stateSubject.next({
      ...current,

      customerId,
      customerName,

      auditRef: current.auditRef || 'KYC-' + Date.now().toString().slice(-8),

      timestamp: new Date(),
    });
  }

  // ==========================================
  // OCR
  // ==========================================

  setOcrResult(result: KycOcrResult): void {
    const current = this.getState();

    this.stateSubject.next({
      ...current,
      ocr: result,
    });
  }

  // ==========================================
  // LIVENESS
  // ==========================================

  setLivenessResult(result: KycLivenessResult): void {
    const current = this.getState();

    this.stateSubject.next({
      ...current,
      liveness: result,
    });
  }

  // ==========================================
  // FACE MATCH
  // ==========================================

  setFaceMatchResult(result: KycFaceMatchResult): void {
    const current = this.getState();

    this.stateSubject.next({
      ...current,
      faceMatch: result,
    });
  }

  // ==========================================
  // CLEAR
  // ==========================================

  clear(): void {
    this.stateSubject.next({
      ...this.initialState,

      auditRef: 'KYC-' + Date.now().toString().slice(-8),

      timestamp: new Date(),
    });
  }
}
