import { Injectable, signal } from '@angular/core';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
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

const ADMIN_PASSWORDS: Record<string, string> = {
  'admin1': 'admin123',
  'admin2': 'admin456'
};

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  readonly currentAdmin = signal<AdminUser | null>(this.loadSavedSession());
  readonly isLoggedIn = signal<boolean>(this.currentAdmin() !== null);
  readonly authError = signal<string | null>(null);

  login(username: string, password: string): boolean {
    const cleanUser = username.trim().toLowerCase();
    const expectedPassword = ADMIN_PASSWORDS[cleanUser];

    if (!expectedPassword || password !== expectedPassword) {
      this.authError.set('Invalid Admin ID or Password. Please verify credentials.');
      return false;
    }

    const admin = ADMIN_USERS.find(u => u.username === cleanUser);
    if (!admin) {
      this.authError.set('Admin user profile not found.');
      return false;
    }

    this.currentAdmin.set(admin);
    this.isLoggedIn.set(true);
    this.authError.set(null);
    localStorage.setItem('fincore_active_admin', JSON.stringify(admin));
    return true;
  }

  quickLogin(username: 'admin1' | 'admin2'): boolean {
    const pwd = ADMIN_PASSWORDS[username];
    return this.login(username, pwd);
  }

  logout() {
    this.currentAdmin.set(null);
    this.isLoggedIn.set(false);
    this.authError.set(null);
    localStorage.removeItem('fincore_active_admin');
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
    return ADMIN_USERS[0]; // Default logged in as Admin 1
  }
}
