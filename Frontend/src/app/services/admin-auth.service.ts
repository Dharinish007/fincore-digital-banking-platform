import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone?: string;
  lastLogin: string;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-001',
    username: 'admin1',
    name: 'Alex Vance',
    role: 'Senior Banking Auditor',
    avatar: 'AV',
    email: 'admin1@fincore.com',
    lastLogin: 'Today at 09:15 AM'
  },
  {
    id: 'adm-002',
    username: 'admin2',
    name: 'Sarah Connor',
    role: 'Compliance & Risk Director',
    avatar: 'SC',
    email: 'admin2@fincore.com',
    lastLogin: 'Today at 11:30 AM'
  }
];

const DEFAULT_PASSWORDS: Record<string, string> = {
  'admin1': 'admin123',
  'admin2': 'admin456',
  'admin1@fincore.com': 'admin123',
  'admin2@fincore.com': 'admin456'
};

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly http = inject(HttpClient);

  readonly currentAdmin = signal<AdminUser | null>(this.loadSavedSession());
  readonly isLoggedIn = signal<boolean>(this.currentAdmin() !== null);
  readonly authError = signal<string | null>(null);
  readonly authSuccess = signal<string | null>(null);

  login(identifier: string, password: string): boolean {
    const cleanId = identifier.trim().toLowerCase();
    this.authError.set(null);
    this.authSuccess.set(null);

    // 1. Check local registered users
    const registeredUsers = this.getRegisteredUsers();
    const regUser = registeredUsers.find(
      u => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );

    if (regUser) {
      const storedPwd = localStorage.getItem(`fincore_pwd_${regUser.id}`) || DEFAULT_PASSWORDS[regUser.username];
      if (storedPwd === password) {
        this.setSession(regUser);
        return true;
      } else {
        this.authError.set('Invalid password. Please verify your credentials.');
        return false;
      }
    }

    // 2. Check predefined demo admin users
    const admin = ADMIN_USERS.find(
      u => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );

    if (admin) {
      const expectedPwd = DEFAULT_PASSWORDS[cleanId] || DEFAULT_PASSWORDS[admin.username];
      if (expectedPwd && password === expectedPwd) {
        this.setSession(admin);
        return true;
      } else {
        this.authError.set('Invalid password. Please check your credentials.');
        return false;
      }
    }

    // Fallback: Check backend auth API if available
    this.http.post<any>('http://localhost:8080/api/auth/login', { username: identifier, password }).subscribe({
      next: (res) => {
        const u: AdminUser = {
          id: 'user-' + Date.now(),
          username: identifier,
          name: res?.user?.name || identifier,
          role: res?.user?.role || 'Banking Specialist',
          avatar: identifier.substring(0, 2).toUpperCase(),
          email: res?.user?.email || `${identifier}@fincore.com`,
          lastLogin: 'Just now'
        };
        this.setSession(u);
      },
      error: () => {
        this.authError.set('Invalid credentials. Please verify your username/email and password.');
      }
    });

    this.authError.set('User account not found. Please verify credentials or sign up.');
    return false;
  }

  register(data: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
    password: string;
  }): boolean {
    this.authError.set(null);
    this.authSuccess.set(null);

    if (!data.name || !data.email || !data.password) {
      this.authError.set('Please fill in all required fields.');
      return false;
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const existing = this.getRegisteredUsers();
    if (existing.some(u => u.email.toLowerCase() === cleanEmail) || ADMIN_USERS.some(u => u.email.toLowerCase() === cleanEmail)) {
      this.authError.set('An account with this email address already exists. Please sign in.');
      return false;
    }

    const initials = data.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'FC';
    const newUser: AdminUser = {
      id: 'reg-' + Date.now(),
      username: cleanEmail.split('@')[0],
      name: data.name.trim(),
      role: data.role || 'Banking Operations Officer',
      avatar: initials,
      email: cleanEmail,
      phone: data.phone || '',
      lastLogin: 'First Login'
    };

    // Save locally
    existing.push(newUser);
    localStorage.setItem('fincore_registered_users', JSON.stringify(existing));
    localStorage.setItem(`fincore_pwd_${newUser.id}`, data.password);

    // Also notify backend if online
    this.http.post('http://localhost:8080/api/auth/register', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password
    }).subscribe({
      next: () => {},
      error: () => {}
    });

    // Auto-login newly registered user
    this.setSession(newUser);
    this.authSuccess.set('Account registered successfully! Welcome to FinCore Banking.');
    return true;
  }

  quickLogin(username: 'admin1' | 'admin2'): boolean {
    const pwd = DEFAULT_PASSWORDS[username];
    return this.login(username, pwd);
  }

  logout() {
    this.currentAdmin.set(null);
    this.isLoggedIn.set(false);
    this.authError.set(null);
    this.authSuccess.set(null);
    localStorage.removeItem('fincore_active_admin');
  }

  private setSession(user: AdminUser) {
    this.currentAdmin.set(user);
    this.isLoggedIn.set(true);
    this.authError.set(null);
    localStorage.setItem('fincore_active_admin', JSON.stringify(user));
  }

  private getRegisteredUsers(): AdminUser[] {
    try {
      const saved = localStorage.getItem('fincore_registered_users');
      if (saved) {
        return JSON.parse(saved) as AdminUser[];
      }
    } catch {
      // ignore
    }
    return [];
  }

  private loadSavedSession(): AdminUser | null {
    try {
      const saved = localStorage.getItem('fincore_active_admin');
      if (saved) {
        return JSON.parse(saved) as AdminUser;
      }
    } catch (e) {
      console.error('Failed to parse saved admin session', e);
    }
    // Default to NOT logged in so users see the login/signup screen as requested
    return null;
  }
}
