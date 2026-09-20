import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'BANK_STAFF' | 'LOAN_OFFICER' | 'FRAUD_OFFICER' | 'AUDITOR';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  email: string;
  phone?: string;
  customerId?: number;
  accountNumber?: string;
  lastLogin: string;
}

export const PREDEFINED_ROLES: AdminUser[] = [
  {
    id: 'cust-001',
    username: 'customer1',
    name: 'John Smith',
    role: 'CUSTOMER',
    roleTitle: 'Retail Banking Customer',
    avatar: 'JS',
    email: 'john.smith@example.com',
    phone: '+91 98765 43210',
    customerId: 1,
    accountNumber: 'ACC-8849-1001',
    lastLogin: 'Today at 09:30 AM'
  },
  {
    id: 'adm-001',
    username: 'admin1',
    name: 'Alex Vance',
    role: 'ADMIN',
    roleTitle: 'Chief Banking Administrator',
    avatar: 'AV',
    email: 'admin1@fincore.com',
    lastLogin: 'Today at 09:15 AM'
  },
  {
    id: 'stf-001',
    username: 'staff1',
    name: 'Pooja Verma',
    role: 'BANK_STAFF',
    roleTitle: 'Branch Operations Specialist',
    avatar: 'PV',
    email: 'pooja.verma@fincore.com',
    lastLogin: 'Today at 08:45 AM'
  },
  {
    id: 'loan-001',
    username: 'loan1',
    name: 'David Miller',
    role: 'LOAN_OFFICER',
    roleTitle: 'Senior Credit & Loan Officer',
    avatar: 'DM',
    email: 'david.miller@fincore.com',
    lastLogin: 'Today at 10:00 AM'
  },
  {
    id: 'frd-001',
    username: 'fraud1',
    name: 'Elena Rostova',
    role: 'FRAUD_OFFICER',
    roleTitle: 'AML & Fraud Risk Analyst',
    avatar: 'ER',
    email: 'elena.rostova@fincore.com',
    lastLogin: 'Today at 11:15 AM'
  },
  {
    id: 'aud-001',
    username: 'auditor1',
    name: 'Marcus Thorne',
    role: 'AUDITOR',
    roleTitle: 'Lead Banking Compliance Auditor',
    avatar: 'MT',
    email: 'marcus.thorne@fincore.com',
    lastLogin: 'Today at 11:45 AM'
  }
];

export const DEFAULT_PASSWORDS: Record<string, string> = {
  'customer1': 'customer123',
  'john.smith@example.com': 'customer123',
  'admin1': 'admin123',
  'admin1@fincore.com': 'admin123',
  'admin2': 'admin456',
  'admin2@fincore.com': 'admin456',
  'staff1': 'staff123',
  'staff1@fincore.com': 'staff123',
  'loan1': 'loan123',
  'loan1@fincore.com': 'loan123',
  'fraud1': 'fraud123',
  'fraud1@fincore.com': 'fraud123',
  'auditor1': 'audit123',
  'auditor1@fincore.com': 'audit123'
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

  // Role computed signals
  readonly activeRole = computed<UserRole>(() => this.currentAdmin()?.role || 'CUSTOMER');
  readonly isCustomer = computed<boolean>(() => this.currentAdmin()?.role === 'CUSTOMER');
  readonly isAdmin = computed<boolean>(() => this.currentAdmin()?.role === 'ADMIN');
  readonly isStaff = computed<boolean>(() => this.currentAdmin()?.role === 'BANK_STAFF');
  readonly isLoanOfficer = computed<boolean>(() => this.currentAdmin()?.role === 'LOAN_OFFICER');
  readonly isFraudOfficer = computed<boolean>(() => this.currentAdmin()?.role === 'FRAUD_OFFICER');
  readonly isAuditor = computed<boolean>(() => this.currentAdmin()?.role === 'AUDITOR');

  hasRole(role: UserRole | UserRole[]): boolean {
    const current = this.currentAdmin()?.role;
    if (!current) return false;
    if (Array.isArray(role)) {
      return role.includes(current);
    }
    return current === role;
  }

  getRoleBadgeColor(): string {
    const r = this.activeRole();
    switch (r) {
      case 'ADMIN': return '#8b5cf6'; // Purple
      case 'CUSTOMER': return '#0284c7'; // Blue
      case 'BANK_STAFF': return '#6366f1'; // Indigo
      case 'LOAN_OFFICER': return '#10b981'; // Emerald
      case 'FRAUD_OFFICER': return '#f59e0b'; // Amber
      case 'AUDITOR': return '#06b6d4'; // Cyan
      default: return '#3b82f6';
    }
  }

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
      if (storedPwd === password || !storedPwd) {
        this.setSession(regUser);
        return true;
      } else {
        this.authError.set('Invalid password. Please verify your credentials.');
        return false;
      }
    }

    // 2. Check predefined demo profiles
    const predefined = PREDEFINED_ROLES.find(
      u => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId || u.role.toLowerCase() === cleanId
    );

    if (predefined) {
      const expectedPwd = DEFAULT_PASSWORDS[cleanId] || DEFAULT_PASSWORDS[predefined.username] || 'admin123';
      if (expectedPwd && password === expectedPwd) {
        this.setSession(predefined);
        return true;
      } else {
        this.authError.set('Invalid password. Please check your credentials.');
        return false;
      }
    }

    // 3. Fallback: Query backend auth API
    this.http.post<any>('http://localhost:8080/api/auth/login', { username: identifier, password }).subscribe({
      next: (res) => {
        const u: AdminUser = {
          id: 'user-' + Date.now(),
          username: identifier,
          name: res?.user?.name || identifier,
          role: (res?.role || res?.user?.role || 'CUSTOMER') as UserRole,
          roleTitle: res?.user?.role || 'Banking Specialist',
          avatar: identifier.substring(0, 2).toUpperCase(),
          email: res?.user?.email || `${identifier}@fincore.com`,
          customerId: res?.user?.customerId,
          accountNumber: res?.user?.accountNumber,
          lastLogin: 'Just now'
        };
        this.setSession(u);
      },
      error: () => {
        this.authError.set('Invalid credentials. Please verify your username/email and password.');
      }
    });

    this.authError.set('User account not found. Please verify credentials or choose 1-Click Demo access.');
    return false;
  }

  register(data: {
    name: string;
    email: string;
    phone?: string;
    role?: UserRole;
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
    if (existing.some(u => u.email.toLowerCase() === cleanEmail) || PREDEFINED_ROLES.some(u => u.email.toLowerCase() === cleanEmail)) {
      this.authError.set('An account with this email address already exists. Please sign in.');
      return false;
    }

    const role: UserRole = data.role || 'CUSTOMER';
    const initials = data.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'FC';
    const newUser: AdminUser = {
      id: 'reg-' + Date.now(),
      username: cleanEmail.split('@')[0],
      name: data.name.trim(),
      role: role,
      roleTitle: role.replace('_', ' ') + ' Officer',
      avatar: initials,
      email: cleanEmail,
      phone: data.phone || '',
      customerId: role === 'CUSTOMER' ? Math.floor(100 + Math.random() * 900) : undefined,
      accountNumber: role === 'CUSTOMER' ? 'ACC-8849-' + Math.floor(1000 + Math.random() * 9000) : undefined,
      lastLogin: 'First Login'
    };

    // Save locally
    existing.push(newUser);
    localStorage.setItem('fincore_registered_users', JSON.stringify(existing));
    localStorage.setItem(`fincore_pwd_${newUser.id}`, data.password);

    // Also notify backend
    this.http.post('http://localhost:8080/api/auth/register', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: role,
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

  quickLoginRole(role: UserRole): boolean {
    const found = PREDEFINED_ROLES.find(u => u.role === role);
    if (found) {
      this.setSession(found);
      return true;
    }
    return false;
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
      console.error('Failed to parse saved session', e);
    }
    return null;
  }
}
