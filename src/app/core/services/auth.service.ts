import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { Router } from '@angular/router';
import { User, Role, LoginRequest, LoginResponse } from '../models/auth.models';

const MOCK_USERS = [
  {
    id: 'u-1',
    username: 'admin',
    password: 'admin123',
    fullName: 'System Administrator',
    role: Role.ADMIN,
    token: 'mock-jwt-token-admin'
  },
  {
    id: 'u-2',
    username: 'employee',
    password: 'employee123',
    fullName: 'Bank Employee',
    role: Role.EMPLOYEE,
    token: 'mock-jwt-token-employee'
  },
  {
    id: 'u-3',
    username: 'customer',
    password: 'customer123',
    fullName: 'Retail Customer',
    role: Role.CUSTOMER,
    token: 'mock-jwt-token-customer'
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'fincore_auth_session';
  
  // Reactive signals for UI updates
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(private router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const user = MOCK_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const response: LoginResponse = {
        token: user.token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role
        }
      };
      
      this.setSession(response);
      return of(response).pipe(delay(500)); // simulate network delay
    }

    return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.currentUserSignal.set(null);
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
    const role = this.getCurrentRole();
    if (!role) return false;
    
    const rolePermissions: Record<Role, string[]> = {
      [Role.ADMIN]: ['*'],
      [Role.EMPLOYEE]: ['view:dashboard', 'view:customers', 'edit:customers', 'view:accounts', 'edit:accounts', 'view:transactions', 'edit:transactions'],
      [Role.CUSTOMER]: ['view:dashboard', 'view:accounts', 'view:transactions']
    };

    const permissions = rolePermissions[role] || [];
    if (permissions.includes('*')) return true;
    
    return permissions.includes(permission);
  }

  getToken(): string | null {
    const session = localStorage.getItem(this.AUTH_KEY);
    if (session) {
      try {
        const parsed: LoginResponse = JSON.parse(session);
        return parsed.token;
      } catch {
        return null;
      }
    }
    return null;
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(response));
    this.currentUserSignal.set(response.user);
  }

  private loadUserFromStorage(): User | null {
    const session = localStorage.getItem(this.AUTH_KEY);
    if (session) {
      try {
        const parsed: LoginResponse = JSON.parse(session);
        return parsed.user;
      } catch {
        return null;
      }
    }
    return null;
  }
}
