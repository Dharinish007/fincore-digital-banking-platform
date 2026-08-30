import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-liveness-detection',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="card panel fade-in">
      <div class="page-header mb-4">
        <div class="page-subtitle">KYC & Identity Verification • Stage 2</div>
        <h1 class="page-title">Liveness Detection</h1>
      </div>
      
      <div class="alert info">
        <mat-icon>videocam</mat-icon>
        <div>
          <strong>Developer Assigned: Kousalya</strong>
          <div>This module workspace is reserved for Liveness Detection integration.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-4 { margin-bottom: 24px; }
  `]
})
export class LivenessDetectionComponent {}
