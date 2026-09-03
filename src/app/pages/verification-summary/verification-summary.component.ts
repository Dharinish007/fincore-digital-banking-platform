import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FaceMatchService } from '../../services/face-match.service';
import { Observable } from 'rxjs';
import { FaceMatchResult } from '../../models/face-match.model';

@Component({
  selector: 'app-verification-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './verification-summary.component.html',
  styleUrls: ['./verification-summary.component.scss']
})
export class VerificationSummaryComponent {
  private faceMatchService = inject(FaceMatchService);
  private router = inject(Router);

  public result$: Observable<FaceMatchResult> = this.faceMatchService.result$;
  public isApproved = false;

  public kycStages = [
    { title: 'Facial Quality & Landmarks', subtitle: 'Face Detection, Sharpness & Alignment', status: 'PASSED', icon: 'center_focus_strong', score: '98.5%' },
    { title: 'Face Match Accuracy', subtitle: 'ID Face vs Live Selfie Bio-Matcher', status: 'PASSED', icon: 'face_retouching_natural', score: '94.7%' }
  ];

  approveKyc(): void {
    this.isApproved = true;
  }

  backToFaceMatch(): void {
    this.router.navigate(['/face-match']);
  }
}
