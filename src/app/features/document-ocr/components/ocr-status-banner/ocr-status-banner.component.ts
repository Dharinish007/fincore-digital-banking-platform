import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OcrState } from '../../../../core/models/document-ocr.model';

@Component({
  selector: 'app-ocr-status-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './ocr-status-banner.component.html',
  styleUrls: ['./ocr-status-banner.component.scss']
})
export class OcrStatusBannerComponent {
  @Input() currentState: OcrState = 'INITIAL';
  @Input() errorMessage: string | null = null;
  @Input() requestId: string | null = null;
  @Output() retry = new EventEmitter<void>();

  onRetry() {
    this.retry.emit();
  }
}
