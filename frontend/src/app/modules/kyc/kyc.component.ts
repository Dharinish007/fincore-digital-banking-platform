import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FaceDetectionService } from '../../services/face-detection.service';

export interface LivenessCustomer {
  customerId: number;
  customerName: string;
}

export interface LivenessVerification {
  id?: number;
  customerId: number;
  sessionId?: string;
  status: 'VERIFIED' | 'FAILED' | 'PENDING';
  confidenceScore: number;
  verificationMethod: string;
  failureReason?: string;
  verifiedAt?: string;
  createdAt?: string;
}

interface PasscodeVerificationResponse {
  verified: boolean;
  message: string;
  verificationId?: number;
  verificationStatus?: 'VERIFIED' | 'FAILED' | 'PENDING';
  verificationMethod?: string;
  verifiedAt?: string;
}

type VerificationStep = 'CHOOSE' | 'FACE' | 'PASSCODE' | 'COMPLETE';
type Challenge = 'BLINK' | 'TURN_HEAD' | 'SMILE';

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.css'
})
export class KycComponent implements OnInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly faceDetection = inject(FaceDetectionService);

  customerId: number | null = null;
  selectedCustomer: any | null = null;
  customerNotFound: boolean = false;

  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';
  livenessConfidence = 92;
  livenessResult: LivenessVerification | null = null;
  verificationId: number | null = null;
  livenessLoading = false;
  verificationStep: VerificationStep = 'CHOOSE';
  verificationMethod: 'FACE' | 'PASSCODE' = 'FACE';
  readonly challenges: Challenge[] = ['BLINK', 'TURN_HEAD', 'SMILE'];
  currentChallenge = 0;
  challengePassed = [false, false, false];
  challengeMessage = 'Please blink your eyes naturally.';
  verificationStarted = false;
  secondsRemaining = 10;
  passcodeInput = '';
  passcodeLoading = false;
  @ViewChild('cameraPreview') cameraPreview?: ElementRef<HTMLVideoElement>;
  cameraStream: MediaStream | null = null;
  cameraStatus: 'NOT_STARTED' | 'CONNECTED' | 'DENIED' | 'STOPPED' = 'NOT_STARTED';
  faceStatus: 'CHECKING' | 'DETECTED' | 'NOT_DETECTED' = 'CHECKING';
  private faceCheckTimer: ReturnType<typeof setInterval> | null = null;
  private challengeTimer: ReturnType<typeof setInterval> | null = null;

  customers: any[] = [];

  get allChallengesPassed(): boolean {
    return this.challengePassed.every(Boolean);
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.api.get<any[]>('/api/operations/customers').subscribe({
      next: (data) => {
        this.customers = data || [];
        if (this.customers.length > 0 && !this.customerId) {
          this.customerId = this.customers[0].id;
          this.fetchCustomerDetails(this.customerId!);
        }
      },
      error: () => {}
    });
  }

  onCustomerIdChange(): void {
    if (!this.customerId || this.customerId < 1) {
      this.selectedCustomer = null;
      this.customerNotFound = true;
      this.livenessResult = null;
      return;
    }
    this.fetchCustomerDetails(this.customerId);
  }

  fetchCustomerDetails(id: number): void {
    this.api.get<any>(`/api/operations/customers/${id}`).subscribe({
      next: (cust) => {
        if (cust && cust.id) {
          this.selectedCustomer = cust;
          this.customerNotFound = false;
          this.loadLivenessHistory();
        } else {
          this.selectedCustomer = null;
          this.customerNotFound = true;
          this.livenessResult = null;
          this.showToast(`User with Customer ID #${id} not found in database.`, 'danger');
        }
      },
      error: () => {
        this.selectedCustomer = null;
        this.customerNotFound = true;
        this.livenessResult = null;
        this.showToast(`User with Customer ID #${id} not found in database.`, 'danger');
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  chooseMethod(method: 'FACE' | 'PASSCODE'): void {
    this.stopCamera();
    this.verificationMethod = method;
    this.verificationStep = method;
    this.livenessResult = null;
    this.verificationId = null;
    this.verificationStarted = false;
    this.passcodeInput = '';
  }

  async startCamera(): Promise<boolean> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.showToast('Camera access is not supported by this browser.', 'danger');
      return false;
    }
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      this.cameraStatus = 'CONNECTED';
      this.faceStatus = 'CHECKING';
      if (this.cameraPreview) {
        this.cameraPreview.nativeElement.srcObject = this.cameraStream;
        await this.cameraPreview.nativeElement.play();
      }
      this.beginFaceCheck();
      this.showToast('Camera connected. Position one face inside the guide.', 'info');
      return true;
    } catch (error) {
      this.cameraStatus = 'DENIED';
      const reason = error instanceof DOMException && error.name === 'NotFoundError'
        ? 'No camera was found on this device.'
        : error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow access for localhost and try again.'
          : 'Camera could not be opened. Check that it is not being used by another application.';
      this.showToast(reason, 'danger');
      return false;
    }
  }

  async startVerification(): Promise<void> {
    if (!this.customerId || this.customerId < 1 || this.customerNotFound || !this.selectedCustomer) {
      this.showToast(this.customerNotFound ? `User with Customer ID #${this.customerId} not found in database.` : 'Please select a valid customer before starting verification.', 'danger');
      return;
    }
    if (this.cameraStatus !== 'CONNECTED') {
      this.showToast('Allow camera access first, then start face verification.', 'info');
      return;
    }
    this.api.post<LivenessVerification>('/api/liveness/start', {
      customerId: this.customerId,
      verificationMethod: 'LIVENESS_CHECK'
    }).subscribe({
      next: session => {
        this.verificationId = session.id ?? null;
        this.verificationStarted = true;
        this.beginChallenges();
      },
      error: (err) => {
        this.stopCamera();
        const msg = err.error?.message || 'Unable to start a liveness verification session.';
        this.showToast(msg, 'danger');
      }
    });
  }

  requestCameraAccess(): void {
    void this.startCamera();
  }

  stopCamera(): void {
    if (this.faceCheckTimer) clearInterval(this.faceCheckTimer);
    if (this.challengeTimer) clearInterval(this.challengeTimer);
    this.faceCheckTimer = null;
    this.challengeTimer = null;
    this.cameraStream?.getTracks().forEach(track => track.stop());
    this.cameraStream = null;
    if (this.cameraPreview) this.cameraPreview.nativeElement.srcObject = null;
    if (this.cameraStatus === 'CONNECTED') this.cameraStatus = 'STOPPED';
  }

  private async beginFaceCheck(): Promise<void> {
    try {
      await this.faceDetection.initialize();
    } catch {
      this.faceStatus = 'NOT_DETECTED';
      this.showToast('Face landmark model could not be loaded. Verification cannot continue.', 'danger');
      return;
    }
    this.faceCheckTimer = setInterval(() => {
      const video = this.cameraPreview?.nativeElement;
      if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      const state = this.faceDetection.detect(video);
      this.faceStatus = state.faceCount === 1 ? 'DETECTED' : 'NOT_DETECTED';
      const challenge = this.challenges[this.currentChallenge];
      const passed = challenge === 'BLINK' ? state.blink
        : challenge === 'TURN_HEAD' ? state.headTurnLeft
          : challenge === 'SMILE' ? state.smile : false;
      if (passed) this.acknowledgeChallenge();
    }, 500);
  }

  loadLivenessHistory(): void {
    if (!this.customerId || this.customerId < 1 || this.customerNotFound) return;
    this.api.get<LivenessVerification[]>(`/api/liveness/customer/${this.customerId}`).subscribe({
      next: results => this.livenessResult = results[0] ?? null,
      error: () => {}
    });
  }

  verifyLiveness(): void {
    if (!this.customerId || this.customerNotFound || !this.selectedCustomer) {
      this.showToast(`User with Customer ID #${this.customerId} not found in database.`, 'danger');
      return;
    }
    if (this.cameraStatus !== 'CONNECTED' || this.faceStatus !== 'DETECTED') {
      this.showToast('Connect the camera and position exactly one face inside the guide first.', 'danger');
      return;
    }
    if (!this.challengePassed.every(Boolean)) {
      this.showToast('Complete all three camera challenges before submitting.', 'danger');
      return;
    }
    this.livenessLoading = true;
    this.api.post<LivenessVerification>('/api/liveness/verify', {
      customerId: this.customerId,
      verificationId: this.verificationId,
      confidenceScore: this.livenessConfidence,
      verificationMethod: 'LIVENESS_CHECK',
    }).subscribe({
      next: result => {
        this.stopCamera();
        this.livenessResult = result;
        this.verificationStep = result.status === 'VERIFIED' ? 'COMPLETE' : 'FACE';
        this.livenessLoading = false;
        this.showToast(`Camera verification ${result.status.toLowerCase()}.`, result.status === 'VERIFIED' ? 'success' : 'danger');
      },
      error: (err) => {
        this.livenessLoading = false;
        const msg = err.error?.message || 'Liveness verification could not be completed.';
        this.showToast(msg, 'danger');
      }
    });
  }

  verifyPasscode(): void {
    if (!this.customerId || this.customerNotFound || !this.selectedCustomer) {
      this.showToast(`User with Customer ID #${this.customerId} not found in database.`, 'danger');
      return;
    }
    if (!/^\d{8}$/.test(this.passcodeInput)) {
      this.showToast('Enter date of birth in DDMMYYYY format (8 numeric digits, e.g. 15081995).', 'danger');
      return;
    }
    this.passcodeLoading = true;
    this.api.post<PasscodeVerificationResponse>('/api/passcode/verify', {
      customerId: this.customerId,
      verificationId: this.verificationId,
      passcode: this.passcodeInput
    }).subscribe({
      next: result => {
        this.passcodeLoading = false;
        this.passcodeInput = '';
        this.livenessResult = {
          id: result.verificationId,
          customerId: this.customerId!,
          status: result.verificationStatus ?? (result.verified ? 'VERIFIED' : 'FAILED'),
          confidenceScore: this.livenessConfidence,
          verificationMethod: 'LIVENESS_CHECK',
          verifiedAt: result.verifiedAt
        };
        this.verificationStep = result.verified ? 'COMPLETE' : 'PASSCODE';
        this.showToast(result.message, result.verified ? 'success' : 'danger');
      },
      error: response => {
        this.passcodeLoading = false;
        this.passcodeInput = '';
        this.showToast(response.error?.message || 'Date of birth verification failed. Customer not found or DOB did not match.', 'danger');
      }
    });
  }

  beginChallenges(): void {
    this.currentChallenge = 0;
    this.challengePassed = [false, false, false];
    this.secondsRemaining = 10;
    this.challengeMessage = 'Please blink your eyes naturally.';
    if (this.challengeTimer) clearInterval(this.challengeTimer);
    this.challengeTimer = setInterval(() => {
      this.secondsRemaining -= 1;
      if (this.secondsRemaining <= 0) {
        clearInterval(this.challengeTimer!);
        this.challengeTimer = null;
        this.showToast('The liveness challenge timed out. Please retry.', 'danger');
      }
    }, 1000);
  }

  acknowledgeChallenge(): void {
    if (this.currentChallenge >= this.challenges.length) return;
    this.challengePassed[this.currentChallenge] = true;
    this.currentChallenge += 1;
    this.secondsRemaining = 10;
    this.challengeMessage = this.currentChallenge === 1
      ? 'Slowly turn your head to the left.'
      : this.currentChallenge === 2
        ? 'Smile slightly into the camera.'
        : 'All facial movement challenges passed.';
    if (this.currentChallenge === this.challenges.length && this.challengeTimer) {
      clearInterval(this.challengeTimer);
      this.challengeTimer = null;
    }
  }

  retryVerification(): void {
    this.stopCamera();
    this.livenessResult = null;
    this.verificationStarted = false;
    this.verificationStep = 'CHOOSE';
    this.verificationId = null;
    this.faceDetection.reset();
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 4500);
  }
}
