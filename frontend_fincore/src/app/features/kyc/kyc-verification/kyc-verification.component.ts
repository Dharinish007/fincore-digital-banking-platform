import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';
import { KYCRecord, Customer } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-kyc-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './kyc-verification.component.html',
  styleUrls: ['./kyc-verification.component.scss']
})
export class KycVerificationComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);

  kycRecords: KYCRecord[] = [];
  customers: Customer[] = [];

  // Active KYC Verification Workflow state
  activeStep = 1;
  selectedDocType: 'Aadhaar' | 'PAN' | 'Passport' | 'Driving Licence' = 'PAN';
  isOcrProcessing = false;
  ocrComplete = false;

  // Face Match simulation state
  faceMatchScore = 96.8;
  isMatchingFace = false;
  faceMatchDone = true;

  // Liveness simulation state
  livenessScore = 97.2;
  blinkDetected = true;
  headMovementDetected = true;

  // Extracted OCR Data Preview
  extractedData = {
    name: 'RAHUL SHARMA',
    dob: '14/05/1988',
    docNumber: 'ABCPS1234F',
    address: 'Flat 402, Sea Green Heights, Worli, Mumbai 400018',
    confidence: 99.4
  };

  ngOnInit() {
    this.banking.getKYCRecords().subscribe(records => {
      this.kycRecords = records;
    });

    this.banking.getCustomers().subscribe(c => {
      this.customers = c;
    });
  }

  setStep(step: number) {
    this.activeStep = step;
  }

  runOcrSimulation() {
    this.isOcrProcessing = true;
    setTimeout(() => {
      this.isOcrProcessing = false;
      this.ocrComplete = true;
      this.toast.success('OCR Extraction Complete', 'Confidence: 99.4% • All fields parsed');
    }, 900);
  }

  approveVerification() {
    this.toast.success('KYC Approved', 'Biometric identity verified and stamped with cryptographic seal.');
    this.activeStep = 1;
  }

  rejectVerification() {
    this.toast.error('KYC Rejected', 'Biometric mismatch or documentation discrepancy recorded.');
    this.activeStep = 1;
  }
}
