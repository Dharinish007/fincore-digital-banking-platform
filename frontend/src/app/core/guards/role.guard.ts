import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.models';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: Role[] = route.data['roles'] || [];
  const currentRole = authService.getCurrentRole();

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  if (expectedRoles.length > 0 && currentRole && !expectedRoles.includes(currentRole)) {
    return router.parseUrl('/403');
  }

  return true;
};
