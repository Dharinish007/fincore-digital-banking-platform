import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivenessChallenge, LivenessVerification } from '../../models/liveness.model';

@Component({
  selector: 'app-liveness-detection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liveness-detection.component.html',
  styleUrls: ['./liveness-detection.component.css']
})
export class LivenessDetectionComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  customerId: string = 'CUS1001';
  verificationId: string = 'VER-' + Math.floor(100000 + Math.random() * 900000);
  cameraActive: boolean = false;
  cameraError: string = '';
  mediaStream: MediaStream | null = null;

  verificationStatus: 'IDLE' | 'VERIFYING' | 'SUCCESS' | 'FAILED' = 'IDLE';
  currentChallengeIndex: number = 0;
  livenessScore: number = 0;
  verificationTime: string = '';
  failureReason: string = '';

  challenges: LivenessChallenge[] = [
    { id: 'blink', label: 'Blink', instruction: 'Please blink your eyes naturally', completed: false, active: false },
    { id: 'turn_head', label: 'Turn head', instruction: 'Slowly turn your head to the left', completed: false, active: false },
    { id: 'smile', label: 'Smile / facial movement', instruction: 'Smile slightly into the camera', completed: false, active: false }
  ];

  isSimulating: boolean = false;
  simTimer: any = null;

  ngOnInit(): void {
    this.resetVerification();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    if (this.simTimer) clearInterval(this.simTimer);
  }

  async startCamera(): Promise<void> {
    this.cameraError = '';
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = this.mediaStream;
        }
        this.cameraActive = true;
      } else {
        this.cameraError = 'Webcam access not supported in this browser. Simulated mode will be used.';
        this.cameraActive = true;
      }
    } catch (err: any) {
      this.cameraError = 'Camera access denied or unavailable. Using simulated camera feed.';
      this.cameraActive = true;
    }
  }

  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.cameraActive = false;
  }

  startVerification(): void {
    if (this.isSimulating) return;
    this.resetVerificationState();
    this.verificationStatus = 'VERIFYING';
    this.isSimulating = true;
    this.currentChallengeIndex = 0;
    this.activateChallenge(0);

    // Progress through challenges step-by-step
    let stepCount = 0;
    this.simTimer = setInterval(() => {
      stepCount++;
      if (this.currentChallengeIndex < this.challenges.length) {
        this.challenges[this.currentChallengeIndex].completed = true;
        this.challenges[this.currentChallengeIndex].active = false;
        this.currentChallengeIndex++;

        if (this.currentChallengeIndex < this.challenges.length) {
          this.activateChallenge(this.currentChallengeIndex);
        } else {
          // Finished challenges
          clearInterval(this.simTimer);
          this.completeVerification();
        }
      }
    }, 1800);
  }

  activateChallenge(index: number): void {
    this.challenges.forEach((ch, idx) => ch.active = idx === index);
  }

  completeVerification(): void {
    this.isSimulating = false;
    const pass = Math.random() > 0.15; // 85% success rate demo
    if (pass) {
      this.livenessScore = Math.floor(Math.random() * 10) + 90; // 90-99%
      this.verificationStatus = 'SUCCESS';
      this.failureReason = '';
    } else {
      this.livenessScore = Math.floor(Math.random() * 30) + 40; // 40-69%
      this.verificationStatus = 'FAILED';
      this.failureReason = 'Spoof detected: Insufficient facial micro-movement during turn head challenge.';
    }
    this.verificationTime = new Date().toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  retryVerification(): void {
    this.verificationId = 'VER-' + Math.floor(100000 + Math.random() * 900000);
    this.resetVerification();
    this.startVerification();
  }

  resetVerification(): void {
    if (this.simTimer) clearInterval(this.simTimer);
    this.isSimulating = false;
    this.verificationStatus = 'IDLE';
    this.livenessScore = 0;
    this.verificationTime = '';
    this.failureReason = '';
    this.resetVerificationState();
  }

  resetVerificationState(): void {
    this.challenges.forEach(ch => {
      ch.completed = false;
      ch.active = false;
    });
    this.currentChallengeIndex = 0;
  }

  get currentChallenge(): LivenessChallenge | null {
    if (this.verificationStatus === 'VERIFYING' && this.currentChallengeIndex < this.challenges.length) {
      return this.challenges[this.currentChallengeIndex];
    }
    return null;
  }
}
