import { Routes } from '@angular/router';

export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./authentication.component').then((m) => m.AuthenticationComponent)
  }
];
