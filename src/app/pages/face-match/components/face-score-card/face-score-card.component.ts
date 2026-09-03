import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FaceMatchResult } from '../../../../models/face-match.model';

@Component({
  selector: 'app-face-score-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './face-score-card.component.html',
  styleUrls: ['./face-score-card.component.scss']
})
export class FaceScoreCardComponent implements OnChanges {
  @Input() result!: FaceMatchResult;

  public circumference = 2 * Math.PI * 70; // Radius = 70 => ~439.82
  public strokeDashoffset = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] && this.result) {
      this.calculateStroke();
    }
  }

  private calculateStroke(): void {
    const score = Math.max(0, Math.min(100, this.result?.score || 0));
    const progress = score / 100;
    this.strokeDashoffset = this.circumference * (1 - progress);
  }

  get scoreColor(): string {
    if (!this.result) return '#3B82F6';
    if (this.result.status === 'PROCESSING') return '#3B82F6';
    if (this.result.score >= this.result.threshold) return '#10B981';
    if (this.result.score >= 70) return '#F59E0B';
    return '#EF4444';
  }
}
