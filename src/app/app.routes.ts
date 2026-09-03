import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'face-match',
    pathMatch: 'full'
  },
  {
    path: 'face-match',
    loadComponent: () =>
      import('./pages/face-match/face-match.component').then((m) => m.FaceMatchComponent),
    title: 'Face Match Accuracy — FinCore Nexus'
  },
  {
    path: 'verification-summary',
    loadComponent: () =>
      import('./pages/verification-summary/verification-summary.component').then((m) => m.VerificationSummaryComponent),
    title: 'Verification Summary — FinCore Nexus'
  },
  {
    path: '**',
    redirectTo: 'face-match'
  }
];
