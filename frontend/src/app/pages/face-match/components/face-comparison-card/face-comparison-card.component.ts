import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  FaceMatchResult,
  FaceSourceImage,
  UploadImageState
} from '../../../../core/models/face-match.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-face-comparison-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './face-comparison-card.component.html',
  styleUrls: ['./face-comparison-card.component.scss']
})
export class FaceComparisonCardComponent implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() result!: FaceMatchResult;
  @Input() sourceImages!: FaceSourceImage;
  @Input() isProcessing = false;

  @Output() compareFaces = new EventEmitter<{ idFile: File; selfieFile: File }>();
  @Output() idFileChange = new EventEmitter<File | null>();
  @Output() selfieFileChange = new EventEmitter<File | null>();

  @ViewChild('idFileInput') idFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('selfieFileInput') selfieFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cameraVideo') cameraVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('snapshotCanvas') snapshotCanvasRef!: ElementRef<HTMLCanvasElement>;

  // ---- Camera State ----
  public isCameraOpen = false;
  public isCameraLoading = false;
  public cameraError: string | null = null;
  public capturedImageUrl: string | null = null;
  private cameraStream: MediaStream | null = null;
  private capturedBlob: Blob | null = null;

  public idState: UploadImageState = {
    file: null,
    previewUrl: null,
    fileName: null,
    fileSize: null,
    errorMessage: null
  };

  public selfieState: UploadImageState = {
    file: null,
    previewUrl: null,
    fileName: null,
    fileSize: null,
    errorMessage: null
  };

  public isIdDragging = false;
  public isSelfieDragging = false;

  private readonly allowedTypes = environment.allowedImageTypes || [
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];
  private readonly maxSizeBytes = environment.maxUploadSizeBytes || 10 * 1024 * 1024; // 10MB

  ngOnInit(): void {
    // If default demo source images exist, configure initial preview URLs
    if (this.sourceImages?.idPhotoUrl) {
      this.idState.previewUrl = this.sourceImages.idPhotoUrl;
      this.idState.fileName = 'sample_id_passport.svg';
    }
    if (this.sourceImages?.selfiePhotoUrl) {
      this.selfieState.previewUrl = this.sourceImages.selfiePhotoUrl;
      this.selfieState.fileName = 'sample_live_selfie.svg';
    }
  }

  ngOnDestroy(): void {
    this.revokeObjectUrls();
    this.stopCameraStream();
  }

  // ========================================================
  // CAMERA CAPTURE METHODS
  // ========================================================

  public openCamera(): void {
    this.isCameraOpen = true;
    this.capturedImageUrl = null;
    this.capturedBlob = null;
    this.cameraError = null;
    // Use setTimeout to let Angular render the video element first
    setTimeout(() => this.startCamera(), 80);
  }

  public async startCamera(): Promise<void> {
    this.isCameraLoading = true;
    this.cameraError = null;
    this.capturedImageUrl = null;
    this.capturedBlob = null;
    this.stopCameraStream();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      this.cameraStream = stream;
      // Wait for next tick so ViewChild resolves after *ngIf renders the video
      setTimeout(() => {
        if (this.cameraVideoRef?.nativeElement) {
          this.cameraVideoRef.nativeElement.srcObject = stream;
          this.cameraVideoRef.nativeElement.onloadedmetadata = () => {
            this.isCameraLoading = false;
            this.cdr.detectChanges();
          };
        } else {
          this.isCameraLoading = false;
        }
      }, 50);
    } catch (err: unknown) {
      this.isCameraLoading = false;
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          this.cameraError = 'Camera permission denied. Please allow camera access in your browser settings.';
        } else if (err.name === 'NotFoundError') {
          this.cameraError = 'No camera found on this device.';
        } else {
          this.cameraError = 'Could not start camera: ' + err.message;
        }
      } else {
        this.cameraError = 'An unknown error occurred while starting the camera.';
      }
    }
  }

  public captureSnapshot(): void {
    const video = this.cameraVideoRef?.nativeElement;
    const canvas = this.snapshotCanvasRef?.nativeElement;
    if (!video || !canvas) return;

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror horizontally to match front-camera UX
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

    canvas.toBlob((blob) => {
      if (!blob) return;
      this.capturedBlob = blob;
      this.capturedImageUrl = canvas.toDataURL('image/jpeg', 0.92);
      this.cdr.detectChanges();
      // Pause stream (keep active so retake works instantly)
      video.pause();
    }, 'image/jpeg', 0.92);
  }

  public retakeSnapshot(): void {
    this.capturedImageUrl = null;
    this.capturedBlob = null;
    const video = this.cameraVideoRef?.nativeElement;
    if (video && this.cameraStream) {
      video.srcObject = this.cameraStream;
      video.play().catch(() => {});
    }
  }

  public useSnapshot(): void {
    if (!this.capturedBlob) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const file = new File([this.capturedBlob], `selfie_${timestamp}.jpg`, { type: 'image/jpeg' });
    this.closeCamera();
    this.handleFile(file, 'selfie');
  }

  public closeCamera(): void {
    this.stopCameraStream();
    this.isCameraOpen = false;
    this.capturedImageUrl = null;
    this.capturedBlob = null;
    this.cameraError = null;
    this.isCameraLoading = false;
  }

  public closeCameraOnBackdrop(event: MouseEvent): void {
    // Only close when clicking the overlay backdrop, not the modal itself
    if ((event.target as HTMLElement).classList.contains('camera-modal-overlay')) {
      this.closeCamera();
    }
  }

  private stopCameraStream(): void {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    if (this.cameraVideoRef?.nativeElement) {
      this.cameraVideoRef.nativeElement.srcObject = null;
    }
  }

  /**
   * File selection handler for ID Document
   */
  public onIdFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0], 'id');
    }
  }

  /**
   * File selection handler for Selfie Capture
   */
  public onSelfieFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0], 'selfie');
    }
  }

  /**
   * Drag and drop handlers
   */
  public onIdDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isIdDragging = true;
  }

  public onIdDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isIdDragging = false;
  }

  public onIdDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isIdDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0], 'id');
    }
  }

  public onSelfieDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isSelfieDragging = true;
  }

  public onSelfieDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isSelfieDragging = false;
  }

  public onSelfieDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isSelfieDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0], 'selfie');
    }
  }

  /**
   * Validates and processes the selected file
   */
  private handleFile(file: File, type: 'id' | 'selfie'): void {
    const state = type === 'id' ? this.idState : this.selfieState;
    state.errorMessage = null;

    // 1. Empty file validation
    if (!file || file.size === 0) {
      state.errorMessage = '⚠ Selected file is empty. Please choose a valid image.';
      return;
    }

    // 2. File type validation
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isExtensionValid = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');
    const isTypeValid = this.allowedTypes.includes(fileType) || isExtensionValid;

    if (!isTypeValid) {
      state.errorMessage = '⚠ Invalid file type. Please upload JPG, JPEG, or PNG.';
      return;
    }

    // 3. File size validation
    if (file.size > this.maxSizeBytes) {
      state.errorMessage = `⚠ File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed size is 10MB.`;
      return;
    }

    // Revoke previous blob URL if exists
    if (state.previewUrl && state.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(state.previewUrl);
    }

    // Create safe Angular object URL
    const objectUrl = URL.createObjectURL(file);
    state.file = file;
    state.previewUrl = objectUrl;
    state.fileName = file.name;
    state.fileSize = this.formatFileSize(file.size);
    state.errorMessage = null;

    if (type === 'id') {
      this.idFileChange.emit(file);
    } else {
      this.selfieFileChange.emit(file);
    }
  }

  /**
   * Trigger native hidden file dialogs
   */
  public triggerIdFileInput(): void {
    if (this.idFileInput) {
      this.idFileInput.nativeElement.click();
    }
  }

  public triggerSelfieFileInput(): void {
    if (this.selfieFileInput) {
      this.selfieFileInput.nativeElement.click();
    }
  }

  /**
   * Remove selected ID Document image
   */
  public removeIdImage(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.idState.previewUrl && this.idState.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.idState.previewUrl);
    }
    this.idState = {
      file: null,
      previewUrl: null,
      fileName: null,
      fileSize: null,
      errorMessage: null
    };
    if (this.idFileInput) {
      this.idFileInput.nativeElement.value = '';
    }
    this.idFileChange.emit(null);
  }

  /**
   * Remove selected Selfie image
   */
  public removeSelfieImage(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.selfieState.previewUrl && this.selfieState.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.selfieState.previewUrl);
    }
    this.selfieState = {
      file: null,
      previewUrl: null,
      fileName: null,
      fileSize: null,
      errorMessage: null
    };
    if (this.selfieFileInput) {
      this.selfieFileInput.nativeElement.value = '';
    }
    this.selfieFileChange.emit(null);
  }

  /**
   * Formats raw bytes to human readable string
   */
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * Cleans up all object URLs
   */
  private revokeObjectUrls(): void {
    if (this.idState.previewUrl && this.idState.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.idState.previewUrl);
    }
    if (this.selfieState.previewUrl && this.selfieState.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.selfieState.previewUrl);
    }
  }

  /**
   * Check if both images are selected and ready for comparison
   */
 public get canCompare(): boolean {
  const hasId = Boolean(this.idState.file);
  const hasSelfie = Boolean(this.selfieState.file);

  const isBusy = this.isProcessing;

  return hasId && hasSelfie && !isBusy;
}

  /**
   * Trigger Compare Faces execution
   */
  public onTriggerCompare(): void {
    if (!this.canCompare) return;

    // If actual File objects were uploaded, emit them
    if (this.idState.file && this.selfieState.file) {
      this.compareFaces.emit({
        idFile: this.idState.file,
        selfieFile: this.selfieState.file
      });
    } else {
      // Fallback: If using initial/preloaded SVG samples, convert or emit synthetic files for comparison
      const dummyIdFile = this.idState.file || new File(['sample-id'], 'id_document.jpg', { type: 'image/jpeg' });
      const dummySelfieFile = this.selfieState.file || new File(['sample-selfie'], 'selfie_capture.jpg', { type: 'image/jpeg' });
      this.compareFaces.emit({
        idFile: dummyIdFile,
        selfieFile: dummySelfieFile
      });
    }
  }
}

