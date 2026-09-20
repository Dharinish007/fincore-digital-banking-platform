import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap, catchError, finalize, map } from 'rxjs';
import { Router } from '@angular/router';
import { User, Role, LoginRequest, LoginResponse } from '../models/auth.models';
import { ApiService } from './api.service';
import { StorageUtil } from '../utils/storage.util';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Reactive signals for UI updates
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<any>(API_ENDPOINTS.AUTH.LOGIN, credentials).pipe(
      map((response: any) => {
        const authData: LoginResponse = response?.data || response;
        return authData;
      }),
      tap((authData: LoginResponse) => {
        this.setSession(authData);
      })
    );
  }

  logout(): void {
    this.apiService.post(API_ENDPOINTS.AUTH.LOGOUT, {}).pipe(
      catchError(() => of(null)),
      finalize(() => this.clearSessionAndNavigate())
    ).subscribe();
  }

  clearSession(): void {
    StorageUtil.removeItem(STORAGE_KEYS.AUTH_SESSION);
    this.currentUserSignal.set(null);
  }

  private clearSessionAndNavigate(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  getCurrentRole(): Role | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;

    if (user.permissions && Array.isArray(user.permissions) && user.permissions.includes(permission)) {
      return true;
    }
    
    const rolePermissions: Record<Role, string[]> = {
      [Role.ADMIN]: ['*'],
      [Role.EMPLOYEE]: [
        'view:dashboard', 'view:customers', 'edit:customers', 'view:accounts', 'edit:accounts',
        'view:transactions', 'edit:transactions', 'view:loans', 'underwrite:loans',
        'assess:loans', 'approve:loans', 'reject:loans', 'disburse:loans',
        'LOAN_VIEW', 'LOAN_VIEW_ALL', 'LOAN_REVIEW', 'LOAN_ASSESS', 'LOAN_APPROVE', 'LOAN_REJECT', 'LOAN_DISBURSE'
      ],
      [Role.CUSTOMER]: [
        'view:dashboard', 'view:accounts', 'view:transactions',
        'apply:loans', 'view:own_loans', 'LOAN_APPLY', 'LOAN_VIEW_OWN', 'LOAN_APPLICATION_VIEW_OWN'
      ]
    };

    const permissions = rolePermissions[user.role] || [];
    if (permissions.includes('*')) return true;
    
    return permissions.includes(permission);
  }

  getToken(): string | null {
    const session = StorageUtil.getItem<LoginResponse>(STORAGE_KEYS.AUTH_SESSION);
    return session?.token || null;
  }

  private setSession(response: LoginResponse): void {
    if (response && response.token && response.user) {
      StorageUtil.setItem(STORAGE_KEYS.AUTH_SESSION, response);
      this.currentUserSignal.set(response.user);
    }
  }

  private loadUserFromStorage(): User | null {
    const session = StorageUtil.getItem<LoginResponse>(STORAGE_KEYS.AUTH_SESSION);
    return session?.user || null;
  }
}
