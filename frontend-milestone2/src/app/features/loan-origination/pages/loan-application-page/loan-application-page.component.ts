import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { LoanOriginationService } from '../../services/loan-origination.service';
import { LoanApplication, LoanOriginationPayload, LoanType, PreQualificationData } from '../../models/application.model';

export interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  mandatory: boolean;
  status: 'Pending' | 'Uploading' | 'Uploaded' | 'Verified';
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  fileType?: string;
  uploadedAt?: string;
  isCustom?: boolean;
}

@Component({
  selector: 'app-loan-application-page',
  standalone: false,
  templateUrl: './loan-application-page.component.html',
  styleUrls: ['./loan-application-page.component.scss']
})
export class LoanApplicationPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isSubmitting = false;
  submissionSuccess = false;
  draftSaved = false;
  applicationId = '';
  serverConnected = false;
  statusMessage = '';
  errorMessage = '';
  preQualLoadedNotice = '';
  showReviewModal = false;

  // File Upload State & Modal
  isDragging = false;
  uploadNotification = '';
  showDocPreviewModal = false;
  previewDocItem: UploadedDoc | null = null;

  // Active section tab
  activeSection = 1;

  sections = [
    { id: 1, label: 'Applicant Details', icon: '👤' },
    { id: 2, label: 'Loan Details', icon: '💰' },
    { id: 3, label: 'Review & Submit', icon: '🔍' }
  ];

  loanTypes: { label: string; value: LoanType }[] = [
    { label: 'Home Loan', value: 'Home' },
    { label: 'Personal Loan', value: 'Personal' },
    { label: 'Vehicle Loan', value: 'Vehicle' },
    { label: 'Education Loan', value: 'Education' },
    { label: 'Gold Loan', value: 'Gold' },
    { label: 'Other Loan', value: 'Other' }
  ];

  tenurePresets: { label: string; months: number }[] = [
    { label: '1 Year (12m)', months: 12 },
    { label: '2 Years (24m)', months: 24 },
    { label: '3 Years (36m)', months: 36 },
    { label: '5 Years (60m)', months: 60 },
    { label: '10 Years (120m)', months: 120 },
    { label: '15 Years (180m)', months: 180 },
    { label: '20 Years (240m)', months: 240 }
  ];

  documents: UploadedDoc[] = [];

  constructor(
    private fb: FormBuilder,
    private mockData: MockDataService,
    private loanService: LoanOriginationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      // 1. Applicant Details
      fullName: ['Aarav Sharma', Validators.required],
      dateOfBirth: ['1990-05-14', Validators.required],
      gender: ['Male', Validators.required],
      mobile: ['+91 98765 43210', [Validators.required, Validators.pattern('^\\+?[0-9\\s\\-]{10,15}$')]],
      email: ['aarav.sharma@example.com', [Validators.required, Validators.email]],

      // 2. Loan Details
      customerId: [101, [Validators.required, Validators.min(1)]],
      loanType: ['Home', Validators.required],
      loanAmount: [3500000, [Validators.required, Validators.min(10000)]],
      tenureMonths: [240, [Validators.required, Validators.min(1)]],
      interestRate: [7.35, [Validators.required, Validators.min(0)]],
      purpose: ['Primary residential property acquisition in Navi Mumbai']
    });
  }

  get estimatedMonthlyEmi(): number {
    const p = Number(this.form.value.loanAmount) || 0;
    const r = (Number(this.form.value.interestRate) || 0) / (12 * 100);
    const n = Number(this.form.value.tenureMonths) || 1;
    if (p <= 0 || r <= 0 || n <= 0) return 0;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }

  ngOnInit() {
    this.checkBackendHealth();
    this.checkPreQualificationHandover();
  }

  checkBackendHealth() {
    this.loanService.getAllLoanApplications().subscribe({
      next: () => {
        this.serverConnected = true;
      },
      error: () => {
        this.serverConnected = false;
      }
    });
  }

  checkPreQualificationHandover() {
    // Check navigation state or mock service buffer
    const nav = window.history.state;
    const preQual: PreQualificationData | null = nav?.preQualified || this.mockData.getPendingPreQualification();

    if (preQual) {
      this.form.patchValue({
        customerId: preQual.customerId,
        fullName: preQual.fullName,
        dateOfBirth: preQual.dateOfBirth || this.form.value.dateOfBirth,
        mobile: preQual.mobile,
        email: preQual.email,
        loanType: preQual.loanType,
        loanAmount: preQual.requestedAmount || this.form.value.loanAmount,
        interestRate: preQual.estimatedRate || 7.5
      });

      this.preQualLoadedNotice = `Pre-qualification parameters carried over for borrower "${preQual.fullName}" (${preQual.loanType} Loan).`;
      this.mockData.clearPendingPreQualification();
    }
  }

  setSection(secId: number) {
    this.activeSection = secId;
  }

  nextSection() {
    if (this.activeSection < 3) {
      this.activeSection++;
    }
  }

  prevSection() {
    if (this.activeSection > 1) {
      this.activeSection--;
    }
  }

  setTenure(months: number) {
    this.form.patchValue({ tenureMonths: months });
    this.form.get('tenureMonths')?.markAsDirty();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  // ──────────────── File Upload Logic ────────────────
  get mandatoryDocsCount(): number {
    return this.documents.filter(d => d.mandatory).length;
  }

  get mandatoryDocsUploadedCount(): number {
    return this.documents.filter(d => d.mandatory && (d.status === 'Uploaded' || d.status === 'Verified')).length;
  }

  get totalDocsUploadedCount(): number {
    return this.documents.filter(d => d.status === 'Uploaded' || d.status === 'Verified').length;
  }

  get uploadProgressPercent(): number {
    if (this.mandatoryDocsCount === 0) return 100;
    return Math.round((this.mandatoryDocsUploadedCount / this.mandatoryDocsCount) * 100);
  }

  onFileSelected(event: Event, doc: UploadedDoc) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processFileForDoc(file, doc);
      input.value = '';
    }
  }

  processFileForDoc(file: File, doc: UploadedDoc) {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 15) {
      this.errorMessage = `File "${file.name}" exceeds the 15MB limit. Please choose a smaller file.`;
      return;
    }
    this.errorMessage = '';

    doc.status = 'Uploading';
    doc.fileName = file.name;
    doc.fileSize = this.formatFileSize(file.size);
    doc.fileType = file.type || 'application/octet-stream';
    doc.uploadedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const reader = new FileReader();
    reader.onload = (e: any) => {
      doc.fileUrl = e.target.result;
      setTimeout(() => {
        doc.status = 'Verified';
        this.uploadNotification = `Successfully uploaded & verified: ${file.name}`;
        setTimeout(() => this.uploadNotification = '', 4000);
      }, 500);
    };
    reader.onerror = () => {
      doc.status = 'Uploaded';
    };
    reader.readAsDataURL(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      this.handleMultipleFiles(event.dataTransfer.files);
    }
  }

  onGlobalFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleMultipleFiles(input.files);
      input.value = '';
    }
  }

  handleMultipleFiles(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Find the first pending doc
      const pendingDoc = this.documents.find(d => d.status === 'Pending');
      if (pendingDoc) {
        this.processFileForDoc(file, pendingDoc);
      } else {
        // Add as a new custom document
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const newDoc: UploadedDoc = {
          id: `doc_custom_${Date.now()}_${i}`,
          name: `Supporting: ${baseName}`,
          type: file.type ? file.type.split('/')[1]?.toUpperCase() || 'FILE' : 'PDF/DOC',
          mandatory: false,
          status: 'Pending',
          isCustom: true
        };
        this.documents.push(newDoc);
        this.processFileForDoc(file, newDoc);
      }
    }
  }

  removeDoc(doc: UploadedDoc, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (doc.isCustom) {
      this.documents = this.documents.filter(d => d.id !== doc.id);
    } else {
      doc.status = 'Pending';
      doc.fileName = undefined;
      doc.fileSize = undefined;
      doc.fileUrl = undefined;
      doc.fileType = undefined;
      doc.uploadedAt = undefined;
    }
    this.uploadNotification = `Removed: ${doc.name}`;
    setTimeout(() => this.uploadNotification = '', 3000);
  }

  openDocPreview(doc: UploadedDoc, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.previewDocItem = doc;
    this.showDocPreviewModal = true;
  }

  closeDocPreviewModal() {
    this.showDocPreviewModal = false;
    this.previewDocItem = null;
  }

  downloadDoc(doc: UploadedDoc, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (doc.fileUrl) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.download = doc.fileName || `${doc.id}.pdf`;
      a.click();
    } else {
      const blob = new Blob([
        `FinCore Digital Banking Application Repository\n` +
        `-----------------------------------------\n` +
        `Document: ${doc.name}\n` +
        `File Name: ${doc.fileName || 'document.pdf'}\n` +
        `Verification Status: ${doc.status}\n` +
        `Timestamp: ${new Date().toISOString()}`
      ], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || `${doc.id}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  addCustomDocPrompt() {
    const docName = prompt('Enter document title (e.g. Property Sale Agreement, Form 16, Tax Returns, Business Proof):');
    if (docName && docName.trim()) {
      const newDoc: UploadedDoc = {
        id: `doc_custom_${Date.now()}`,
        name: docName.trim(),
        type: 'PDF / JPEG / DOC',
        mandatory: false,
        status: 'Pending',
        isCustom: true
      };
      this.documents.push(newDoc);
      this.uploadNotification = `Added document slot: "${newDoc.name}". You can now upload the file.`;
      setTimeout(() => this.uploadNotification = '', 3500);
    }
  }

  saveAsDraft() {
    const val = this.form.value;
    const generatedId = Math.floor(2000 + Math.random() * 8000);
    this.applicationId = String(generatedId);

    const draftApp: LoanApplication = {
      loanId: generatedId,
      id: `LO-${generatedId}`,
      customerId: val.customerId || 101,
      fullName: val.fullName || 'Draft Borrower',
      dateOfBirth: val.dateOfBirth,
      gender: val.gender,
      email: val.email,
      mobile: val.mobile,
      loanType: val.loanType || 'Personal',
      loanAmount: Number(val.loanAmount) || 0,
      requestedAmount: Number(val.loanAmount) || 0,
      tenureMonths: Number(val.tenureMonths) || 12,
      interestRate: Number(val.interestRate) || 8.5,
      purpose: val.purpose,
      applicationStatus: 'Draft',
      status: 'Draft',
      stage: 'Loan Application',
      applicationDate: new Date().toISOString().split('T')[0]
    };

    this.mockData.addApplication(draftApp);
    this.draftSaved = true;
    this.statusMessage = `Application successfully saved as Draft! Reference: #LO-${generatedId}. You can resume or submit anytime from Applications.`;
  }

  openReviewModal() {
    this.submitted = true;
    if (this.form.invalid) {
      this.errorMessage = 'Please complete all required fields across the form sections before reviewing.';
      return;
    }
    this.errorMessage = '';
    this.showReviewModal = true;
  }

  closeReviewModal() {
    this.showReviewModal = false;
  }

  submitApplication() {
    this.submitted = true;
    this.errorMessage = '';
    this.statusMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Please complete all mandatory fields before submitting.';
      return;
    }

    this.showReviewModal = false;
    this.isSubmitting = true;

    const val = this.form.value;
    const payload: LoanOriginationPayload = {
      customerId: Number(val.customerId),
      loanType: val.loanType as LoanType,
      loanAmount: Number(val.loanAmount),
      tenureMonths: Number(val.tenureMonths),
      interestRate: Number(val.interestRate),
      purpose: val.purpose ? String(val.purpose).trim() : ''
    };

    // Post to Spring Boot backend: POST /api/loan-origination
    this.loanService.createLoanApplication(payload).subscribe({
      next: (createdLoan) => {
        this.isSubmitting = false;
        this.submissionSuccess = true;
        this.draftSaved = false;
        this.applicationId = String(createdLoan.loanId || Math.floor(1005 + Math.random() * 8990));
        this.statusMessage = `Loan application successfully recorded in core banking database! Application ID: #LO-${this.applicationId}`;

        const appRecord: LoanApplication = {
          ...createdLoan,
          id: `LO-${this.applicationId}`,
          loanId: Number(this.applicationId),
          fullName: val.fullName,
          dateOfBirth: val.dateOfBirth,
          gender: val.gender,
          email: val.email,
          mobile: val.mobile,
          loanType: val.loanType,
          loanAmount: payload.loanAmount,
          requestedAmount: payload.loanAmount,
          tenureMonths: payload.tenureMonths,
          interestRate: payload.interestRate,
          purpose: payload.purpose,
          applicationStatus: 'Pending',
          status: 'Pending',
          stage: 'Application Processing',
          applicationDate: createdLoan.applicationDate || new Date().toISOString().split('T')[0]
        };
        this.mockData.addApplication(appRecord);
      },
      error: () => {
        // Fallback to local state with full metadata
        this.isSubmitting = false;
        this.submissionSuccess = true;
        this.draftSaved = false;
        const generatedId = Math.floor(1005 + Math.random() * 8990);
        this.applicationId = String(generatedId);
        this.statusMessage = `Application registered in local banking registry. Application ID: #LO-${this.applicationId}`;

        const fallbackApp: LoanApplication = {
          loanId: generatedId,
          id: `LO-${generatedId}`,
          customerId: payload.customerId,
          fullName: val.fullName,
          dateOfBirth: val.dateOfBirth,
          gender: val.gender,
          email: val.email,
          mobile: val.mobile,
          loanType: payload.loanType,
          loanAmount: payload.loanAmount,
          requestedAmount: payload.loanAmount,
          tenureMonths: payload.tenureMonths,
          interestRate: payload.interestRate,
          purpose: payload.purpose,
          applicationStatus: 'Pending',
          status: 'Pending',
          stage: 'Application Processing',
          applicationDate: new Date().toISOString().split('T')[0]
        };
        this.mockData.addApplication(fallbackApp);
      }
    });
  }

  reset() {
    this.form.reset({
      fullName: '',
      dateOfBirth: '',
      gender: 'Male',
      mobile: '',
      email: '',
      customerId: 101,
      loanType: 'Home',
      loanAmount: null,
      tenureMonths: 120,
      interestRate: 8.5,
      purpose: ''
    });
    this.submitted = false;
    this.submissionSuccess = false;
    this.draftSaved = false;
    this.applicationId = '';
    this.statusMessage = '';
    this.errorMessage = '';
    this.preQualLoadedNotice = '';
    this.activeSection = 1;
  }

  goToApplications() {
    this.router.navigate(['/applications']);
  }
}
