import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface KycRecord {
  kycId: string;
  customerName: string;
  documentType: string;
  idNumber: string;
  status: string;
  verificationDate: string;
  cibilScore: number;
}

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.css'
})
export class KycComponent {
  records: KycRecord[] = [
    { kycId: 'KYC-58392', customerName: 'John Smith', documentType: 'Aadhaar + PAN', idNumber: 'XXXX-XXXX-9021', status: 'VERIFIED', verificationDate: '2026-08-20', cibilScore: 782 },
    { kycId: 'KYC-58393', customerName: 'Ananya Verma', documentType: 'Passport', idNumber: 'Z8940192', status: 'VERIFIED', verificationDate: '2026-08-22', cibilScore: 745 },
    { kycId: 'KYC-58394', customerName: 'Rahul Deshmukh', documentType: 'PAN Card', idNumber: 'ABCDE1234F', status: 'PENDING_REVIEW', verificationDate: '2026-08-25', cibilScore: 690 },
    { kycId: 'KYC-58395', customerName: 'Vikramaditya Rao', documentType: 'Aadhaar Card', idNumber: 'XXXX-XXXX-4410', status: 'REJECTED', verificationDate: '2026-08-24', cibilScore: 580 }
  ];

  selectedRecord: KycRecord = { ...this.records[0] };

  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  selectRecord(rec: KycRecord): void {
    this.selectedRecord = rec;
  }

  approveKyc(): void {
    this.selectedRecord.status = 'VERIFIED';
    const found = this.records.find(r => r.kycId === this.selectedRecord.kycId);
    if (found) found.status = 'VERIFIED';
    this.showToast(`KYC ${this.selectedRecord.kycId} approved successfully. Customer identity verified.`, 'success');
  }

  rejectKyc(): void {
    this.selectedRecord.status = 'REJECTED';
    const found = this.records.find(r => r.kycId === this.selectedRecord.kycId);
    if (found) found.status = 'REJECTED';
    this.showToast(`KYC ${this.selectedRecord.kycId} rejected. Notice sent to applicant.`, 'danger');
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 4500);
  }
}
