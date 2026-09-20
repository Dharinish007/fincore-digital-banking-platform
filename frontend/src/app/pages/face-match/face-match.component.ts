import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { FaceMatchService } from '../../core/services/face-match.service';

import {
  FaceMatchResult,
  FaceSourceImage,
} from '../../core/models/face-match.model';

import { FaceComparisonCardComponent } from './components/face-comparison-card/face-comparison-card.component';

@Component({
  selector: 'app-face-match',
  standalone: true,
  imports: [CommonModule, MatIconModule, FaceComparisonCardComponent],
  templateUrl: './face-match.component.html',
  styleUrls: ['./face-match.component.scss'],
})
export class FaceMatchComponent implements OnInit {
  private faceMatchService = inject(FaceMatchService);

  private router = inject(Router);

  // ============================================================
  // OBSERVABLES
  // ============================================================

  public result$!: Observable<FaceMatchResult>;

  public sourceImages$!: Observable<FaceSourceImage>;

  public isComparing$!: Observable<boolean>;

  // ============================================================
  // CURRENT FILES
  // ============================================================

  public currentIdFile: File | null = null;

  public currentSelfieFile: File | null = null;

  // ============================================================
  // INITIALIZATION
  // ============================================================

  ngOnInit(): void {
    this.result$ = this.faceMatchService.result$;

    this.sourceImages$ = this.faceMatchService.sourceImages$;

    this.isComparing$ = this.faceMatchService.isComparing$;
  }

  // ============================================================
  // ID FILE CHANGE
  // ============================================================

  onIdFileChange(file: File | null): void {
    this.currentIdFile = file;
  }

  // ============================================================
  // SELFIE FILE CHANGE
  // ============================================================

  onSelfieFileChange(file: File | null): void {
    this.currentSelfieFile = file;
  }

  // ============================================================
  // COMPARE FACES
  // ============================================================

  onCompareFaces(payload: { idFile: File; selfieFile: File }): void {
    this.currentIdFile = payload.idFile;

    this.currentSelfieFile = payload.selfieFile;

    console.log('[FaceMatchComponent] Starting face verification...');

    this.faceMatchService
      .compareFaces(payload.idFile, payload.selfieFile)
      .subscribe({
        next: (result: FaceMatchResult) => {
          console.log('[FaceMatchComponent] Face match result:', result);

          // ====================================================
          // SUCCESSFUL FACE MATCH
          // ====================================================

          if (result.matched && result.status === 'VERIFIED') {
            console.log('[FaceMatchComponent] Face verification passed.');

            // --------------------------------------------------
            // Navigate to Verification Summary
            // --------------------------------------------------

            this.router.navigate(['/verification-summary']);

            return;
          }

          // ====================================================
          // FACE MATCH FAILED / REVIEW
          // ====================================================

          console.log(
            '[FaceMatchComponent] Face verification did not pass:',
            result.status,
          );
        },

        // ======================================================
        // API ERROR
        // ======================================================

        error: (error: any) => {
          console.error('[FaceMatchComponent] Face verification error:', error);
        },
      });
  }

  // ============================================================
  // RETRY
  // ============================================================

  onRetry(): void {
    if (this.currentIdFile && this.currentSelfieFile) {
      console.log('[FaceMatchComponent] Retrying face verification...');

      this.faceMatchService
        .compareFaces(this.currentIdFile, this.currentSelfieFile)
        .subscribe({
          next: (result: FaceMatchResult) => {
            console.log('[FaceMatchComponent] Retry result:', result);

            if (result.matched && result.status === 'VERIFIED') {
              this.router.navigate(['/verification-summary']);
            }
          },

          error: (error: any) => {
            console.error('[FaceMatchComponent] Retry error:', error);
          },
        });
    } else {
      console.log(
        '[FaceMatchComponent] No files available. Triggering reanalysis.',
      );

      this.faceMatchService.triggerReanalysis('VERIFIED');
    }
  }
}
