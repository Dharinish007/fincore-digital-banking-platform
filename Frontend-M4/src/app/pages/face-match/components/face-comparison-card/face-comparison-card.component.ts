import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
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
  @Input() result!: FaceMatchResult;
  @Input() sourceImages!: FaceSourceImage;
  @Input() isProcessing = false;

  @Output() compareFaces = new EventEmitter<{ idFile: File; selfieFile: File }>();
  @Output() idFileChange = new EventEmitter<File | null>();
  @Output() selfieFileChange = new EventEmitter<File | null>();

  @ViewChild('idFileInput') idFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('selfieFileInput') selfieFileInput!: ElementRef<HTMLInputElement>;

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
    const hasId = Boolean(this.idState.file || this.idState.previewUrl);
    const hasSelfie = Boolean(this.selfieState.file || this.selfieState.previewUrl);
    const isBusy = this.isProcessing || this.result?.status === 'PROCESSING';
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


