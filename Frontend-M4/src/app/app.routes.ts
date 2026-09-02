import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'document-ocr',
    pathMatch: 'full',
  },
  {
    path: 'document-ocr',
    loadComponent: () =>
      import('./features/document-ocr/document-ocr.component').then(
        (m) => m.DocumentOcrComponent
      ),
  },
  {
    path: 'liveness-detection',
    loadComponent: () =>
      import('./features/liveness-detection/liveness-detection.component').then(
        (m) => m.LivenessDetectionComponent
      ),
  },
  {
    path: 'face-match',
    loadComponent: () =>
      import('./pages/face-match/face-match.component').then(
        (m) => m.FaceMatchComponent
      ),
  },
  {
    path: 'verification-summary',
    loadComponent: () =>
      import('./pages/verification-summary/verification-summary.component').then(
        (m) => m.VerificationSummaryComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'document-ocr',
  },
];

