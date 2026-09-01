import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

import { FaceMatchService } from '../../services/face-match.service';
import {
  FaceMatchResult,
  FaceSourceImage,
  QualityCheckItem,
  SimilarityMetric,
  MatchDetailsReport
} from '../../models/face-match.model';

import { FaceComparisonCardComponent } from './components/face-comparison-card/face-comparison-card.component';
import { FaceScoreCardComponent } from './components/face-score-card/face-score-card.component';
import { FaceQualityCardComponent } from './components/face-quality-card/face-quality-card.component';
import { SimilarityAnalysisCardComponent } from './components/similarity-analysis-card/similarity-analysis-card.component';
import { VerificationResultCardComponent } from './components/verification-result-card/verification-result-card.component';
import { MatchDetailsModalComponent } from './components/match-details-modal/match-details-modal.component';

@Component({
  selector: 'app-face-match',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FaceComparisonCardComponent,
    FaceScoreCardComponent,
    FaceQualityCardComponent,
    SimilarityAnalysisCardComponent,
    VerificationResultCardComponent,
    MatchDetailsModalComponent
  ],
  templateUrl: './face-match.component.html',
  styleUrls: ['./face-match.component.scss']
})
export class FaceMatchComponent implements OnInit {
  private faceMatchService = inject(FaceMatchService);
  private router = inject(Router);

  public result$!: Observable<FaceMatchResult>;
  public sourceImages$!: Observable<FaceSourceImage>;
  public isComparing$!: Observable<boolean>;
  public isDetailsModalOpen = false;

  public currentIdFile: File | null = null;
  public currentSelfieFile: File | null = null;

  ngOnInit(): void {
    this.result$ = this.faceMatchService.result$;
    this.sourceImages$ = this.faceMatchService.sourceImages$;
    this.isComparing$ = this.faceMatchService.isComparing$;
  }

  onIdFileChange(file: File | null): void {
    this.currentIdFile = file;
  }

  onSelfieFileChange(file: File | null): void {
    this.currentSelfieFile = file;
  }

  onCompareFaces(payload: { idFile: File; selfieFile: File }): void {
    this.currentIdFile = payload.idFile;
    this.currentSelfieFile = payload.selfieFile;
    this.faceMatchService.compareFaces(payload.idFile, payload.selfieFile).subscribe();
  }

  getQualityChecks(result: FaceMatchResult): QualityCheckItem[] {
    return this.faceMatchService.getQualityChecks(result);
  }

  getSimilarityMetrics(result: FaceMatchResult): SimilarityMetric[] {
    return this.faceMatchService.getSimilarityMetrics(result);
  }

  getMatchDetailsReport(result: FaceMatchResult): MatchDetailsReport {
    return this.faceMatchService.getMatchDetailsReport(result);
  }

  openDetailsModal(): void {
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
  }

  onContinueVerification(): void {
    this.router.navigate(['/verification-summary']);
  }

  onRetry(): void {
    if (this.currentIdFile && this.currentSelfieFile) {
      this.faceMatchService.compareFaces(this.currentIdFile, this.currentSelfieFile).subscribe();
    } else {
      this.faceMatchService.triggerReanalysis('VERIFIED');
    }
  }
}

