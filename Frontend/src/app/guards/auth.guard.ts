import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService, UserRole } from '../services/admin-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  return false;
};

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AdminAuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      return false;
    }

    const currentRole = auth.activeRole();
    if (allowedRoles.includes(currentRole) || currentRole === 'ADMIN') {
      return true;
    }

    // Role unauthorized for this route -> redirect to default dashboard
    router.navigate(['/dashboard']);
    return false;
  };
};
