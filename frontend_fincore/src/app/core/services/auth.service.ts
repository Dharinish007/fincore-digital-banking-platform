import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserRole } from '../models/banking.models';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

export interface AuthSession {
  isAuthenticated: boolean;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  token: string;
  expiresAt: number;
  refreshToken: string;
  authProvider: 'Keycloak' | 'OAuth2' | 'Internal';
}

export interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    user: {
      id: number;
      username: string;
      fullName: string;
      email: string;
      role: string;
      customerId?: number;
      employeeId?: number;
      permissions?: string[];
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionSubject = new BehaviorSubject<AuthSession>(this.loadStoredSession());
  session$ = this.sessionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  private emptySession(): AuthSession {
    return {
      isAuthenticated: false,
      username: '',
      fullName: '',
      role: 'Customer',
      email: '',
      token: '',
      expiresAt: 0,
      refreshToken: '',
      authProvider: 'Internal'
    };
  }

  private loadStoredSession(): AuthSession {
    try {
      const stored = localStorage.getItem('fincore_auth_session');
      const token = localStorage.getItem('fincore_auth_token');
      if (stored && token) {
        const session: AuthSession = JSON.parse(stored);
        if (session.expiresAt && session.expiresAt > Date.now()) {
          session.isAuthenticated = true;
          session.token = token;
          return session;
        }
      }
    } catch {
      // Ignore parse failure and return unauthenticated
    }
    return this.emptySession();
  }

  get currentSession(): AuthSession {
    return this.sessionSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.sessionSubject.value.isAuthenticated && !!this.token;
  }

  get userRole(): UserRole {
    return this.sessionSubject.value.role;
  }

  get token(): string {
    return this.sessionSubject.value.token || localStorage.getItem('fincore_auth_token') || '';
  }

  login(username: string, password: string, requestedRole?: UserRole): Observable<BackendLoginResponse> {
    const loginUrl = `${environment.apiUrl}/api/v1/auth/login`;

    return this.http.post<BackendLoginResponse>(loginUrl, { username, password }).pipe(
      tap(res => {
        if (res && res.data && res.data.token) {
          const user = res.data.user;
          const mappedRole = this.mapBackendRole(user.role, requestedRole);
          const session: AuthSession = {
            isAuthenticated: true,
            username: user.username,
            fullName: user.fullName || user.username,
            role: mappedRole,
            email: user.email || `${user.username}@fincore.bank`,
            token: res.data.token,
            expiresAt: Date.now() + (res.data.expiresIn || 86400000),
            refreshToken: '',
            authProvider: 'Internal'
          };

          localStorage.setItem('fincore_auth_token', session.token);
          localStorage.setItem('fincore_auth_session', JSON.stringify(session));

          this.sessionSubject.next(session);
          this.toast.success('Authentication Successful', `Welcome back, ${session.fullName}! (${session.role})`);
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(err => {
        const errorMsg = err.error?.message || err.message || 'Invalid username or password';
        this.toast.error('Authentication Failed', errorMsg);
        return throwError(() => err);
      })
    );
  }

  switchRole(role: UserRole): void {
    const curr = this.sessionSubject.value;
    const updated = { ...curr, role };
    this.sessionSubject.next(updated);
    try {
      localStorage.setItem('fincore_auth_session', JSON.stringify(updated));
    } catch {}
    this.toast.info('Role Switched', `Active RBAC role set to: ${role}`);
  }

  logout(): void {
    localStorage.removeItem('fincore_auth_token');
    localStorage.removeItem('fincore_auth_session');
    this.sessionSubject.next(this.emptySession());
    this.toast.warning('Session Terminated', 'You have been safely logged out');
    this.router.navigate(['/login']);
  }

  private mapBackendRole(backendRole: string, requestedRole?: UserRole): UserRole {
    if (requestedRole) return requestedRole;
    switch (backendRole?.toUpperCase()) {
      case 'ADMIN':
        return 'Banking Admin';
      case 'EMPLOYEE':
        return 'Loan Officer';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return 'Banking Admin';
    }
  }
}
