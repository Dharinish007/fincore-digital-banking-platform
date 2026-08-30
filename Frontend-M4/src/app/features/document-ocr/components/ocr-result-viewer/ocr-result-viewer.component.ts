import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OcrExtractedData } from '../../../../core/models/document-ocr.model';

@Component({
  selector: 'app-ocr-result-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './ocr-result-viewer.component.html',
  styleUrls: ['./ocr-result-viewer.component.scss']
})
export class OcrResultViewerComponent {
  @Input() extractedData: OcrExtractedData | null = null;
  @Input() isEditing = false;

  @Output() confirmData = new EventEmitter<OcrExtractedData>();
  @Output() editToggle = new EventEmitter<boolean>();
  @Output() reprocessRequest = new EventEmitter<void>();

  onToggleEdit() {
    this.isEditing = !this.isEditing;
    this.editToggle.emit(this.isEditing);
  }

  onConfirm() {
    if (this.extractedData) {
      this.confirmData.emit(this.extractedData);
    }
  }

  onReprocess() {
    this.reprocessRequest.emit();
  }

  getConfidenceColorClass(score: number): string {
    if (score >= 95) return 'confidence-high';
    if (score >= 80) return 'confidence-medium';
    return 'confidence-low';
  }
}
