import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FaceMatchResult, MatchDetailsReport } from '../../../../core/models/face-match.model';

@Component({
  selector: 'app-match-details-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './match-details-modal.component.html',
  styleUrls: ['./match-details-modal.component.scss']
})
export class MatchDetailsModalComponent {
  @Input() result!: FaceMatchResult;
  @Input() report!: MatchDetailsReport;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}

