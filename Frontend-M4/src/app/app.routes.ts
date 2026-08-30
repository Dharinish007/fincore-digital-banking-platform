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
      import('./features/face-match/face-match.component').then(
        (m) => m.FaceMatchComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'document-ocr',
  },
];
