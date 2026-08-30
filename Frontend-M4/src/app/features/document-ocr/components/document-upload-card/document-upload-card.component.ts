import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SupportedDocumentType } from '../../../../core/models/document-ocr.model';

@Component({
  selector: 'app-document-upload-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './document-upload-card.component.html',
  styleUrls: ['./document-upload-card.component.scss']
})
export class DocumentUploadCardComponent implements OnDestroy {
  @Input() selectedDocumentType: SupportedDocumentType = 'aadhaar';
  @Input() isProcessing = false;
  @Input() selectedFile: File | null = null;
  @Input() previewUrl: string | null = null;

  @Output() fileSelected = new EventEmitter<{ file: File; type: SupportedDocumentType }>();
  @Output() documentTypeChange = new EventEmitter<SupportedDocumentType>();
  @Output() fileRemoved = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isDragOver = false;

  onDocumentTypeSelect(type: SupportedDocumentType) {
    this.selectedDocumentType = type;
    this.documentTypeChange.emit(type);
    if (this.selectedFile) {
      this.fileSelected.emit({ file: this.selectedFile, type: this.selectedDocumentType });
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (this.isProcessing) return;

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isProcessing) {
      this.isDragOver = true;
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onFileBrowse(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }

    if (file.type.startsWith('image/')) {
      this.previewUrl = URL.createObjectURL(file);
    } else {
      this.previewUrl = null; // For PDF files
    }

    this.selectedFile = file;
    this.fileSelected.emit({ file: this.selectedFile, type: this.selectedDocumentType });
  }

  triggerFileInput() {
    if (!this.isProcessing && this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  removeFile(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (this.isProcessing) return;

    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileRemoved.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  ngOnDestroy() {
    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}
