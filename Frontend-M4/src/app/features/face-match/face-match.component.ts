import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-face-match',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="card panel fade-in">
      <div class="page-header mb-4">
        <div class="page-subtitle">KYC & Identity Verification • Stage 3</div>
        <h1 class="page-title">Face Match Accuracy</h1>
      </div>

      <div class="alert info">
        <mat-icon>face</mat-icon>
        <div>
          <strong>Developer Assigned: Pavithra</strong>
          <div>This module workspace is reserved for Face Match Accuracy integration.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-4 { margin-bottom: 24px; }
  `]
})
export class FaceMatchComponent {}
