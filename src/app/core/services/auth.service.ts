import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserRole } from '../models/banking.models';
import { ToastService } from './toast.service';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionSubject = new BehaviorSubject<AuthSession>({
    isAuthenticated: true,
    username: 'ops_admin',
    fullName: 'Banking Administrator',
    role: 'Banking Admin',
    email: 'admin.operations@fincore.bank',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZpbmNvcmUta2V5Y2xvYWstMjAyNiJ9.eyJzdWIiOiJVU1ItT1AtMDEiLCJuYW1lIjoiQmFua2luZyBBZG1pbmlzdHJhdG9yIiwicm9sZXMiOlsib3BlcmF0aW9uc19hZG1pbiIsImJhbmtpbmdfYWRtaW4iXSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmZpbmNvcmUuYmFuay9hdXRoL3JlYWxtcy9maW5jb3JlIiwiZXhwIjoxNzk4OTk0ODAwfQ',
    expiresAt: Date.now() + 86400000,
    refreshToken: 'ref_981203948102948102948',
    authProvider: 'Keycloak'
  });

  session$ = this.sessionSubject.asObservable();

  constructor(private router: Router, private toast: ToastService) {}

  get currentSession(): AuthSession {
    return this.sessionSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.sessionSubject.value.isAuthenticated;
  }

  get userRole(): UserRole {
    return this.sessionSubject.value.role;
  }

  login(username: string, role: UserRole = 'Banking Admin'): boolean {
    this.sessionSubject.next({
      isAuthenticated: true,
      username,
      fullName: username === 'ops_admin' ? 'Banking Administrator' : username,
      role,
      email: `${username}@fincore.bank`,
      token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.fincore_keycloak_jwt_token',
      expiresAt: Date.now() + 86400000,
      refreshToken: 'ref_keycloak_' + Date.now(),
      authProvider: 'Keycloak'
    });
    this.toast.success('Authentication Successful', `Logged in via Keycloak OAuth2 as ${role}`);
    this.router.navigate(['/dashboard']);
    return true;
  }

  switchRole(role: UserRole): void {
    const curr = this.sessionSubject.value;
    this.sessionSubject.next({ ...curr, role });
    this.toast.info('Role Switched', `Active RBAC role set to: ${role}`);
  }

  logout(): void {
    this.sessionSubject.next({
      isAuthenticated: false,
      username: '',
      fullName: '',
      role: 'Customer',
      email: '',
      token: '',
      expiresAt: 0,
      refreshToken: '',
      authProvider: 'Keycloak'
    });
    this.toast.warning('Session Terminated', 'You have been safely logged out');
    this.router.navigate(['/login']);
  }
}
