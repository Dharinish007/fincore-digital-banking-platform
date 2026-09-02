import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { QualityCheckItem } from '../../../../core/models/face-match.model';

@Component({
  selector: 'app-face-quality-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './face-quality-card.component.html',
  styleUrls: ['./face-quality-card.component.scss']
})
export class FaceQualityCardComponent {
  @Input() qualityChecks: QualityCheckItem[] = [];

  getStatusClass(status: string): string {
    switch (status) {
      case 'PASS':
      case 'GOOD':
        return 'status-good';
      case 'WARNING':
        return 'status-warning';
      case 'FAIL':
        return 'status-fail';
      default:
        return 'status-good';
    }
  }
}

