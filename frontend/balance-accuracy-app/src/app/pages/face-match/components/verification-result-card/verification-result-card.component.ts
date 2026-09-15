import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FaceMatchResult } from '../../../../core/models/face-match.model';

@Component({
  selector: 'app-verification-result-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './verification-result-card.component.html',
  styleUrls: ['./verification-result-card.component.scss']
})
export class VerificationResultCardComponent {
  @Input() result!: FaceMatchResult;
  @Output() viewDetails = new EventEmitter<void>();
  @Output() continueVerification = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  onViewDetails(): void {
    this.viewDetails.emit();
  }

  onContinue(): void {
    this.continueVerification.emit();
  }

  onRetry(): void {
    this.retry.emit();
  }
}

