import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SimilarityMetric } from '../../../../core/models/face-match.model';

@Component({
  selector: 'app-similarity-analysis-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './similarity-analysis-card.component.html',
  styleUrls: ['./similarity-analysis-card.component.scss']
})
export class SimilarityAnalysisCardComponent {
  @Input() metrics: SimilarityMetric[] = [];
}

