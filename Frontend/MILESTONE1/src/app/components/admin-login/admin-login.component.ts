import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-login-wrapper">
      <div class="login-card">

        <!-- Logo & Header -->
        <div class="brand-header">
          <div class="logo-shield">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
            <span class="logo-text-fc">FC</span>
          </div>
          <h1 class="brand-title">FinCore <span class="highlight">Banking</span></h1>
          <p class="brand-subtitle">Executive Administrator Portal</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="authService.authError()" class="auth-error-alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ authService.authError() }}</span>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Admin ID</label>
            <div class="input-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input 
                type="text" 
                id="username" 
                [(ngModel)]="username" 
                name="username" 
                placeholder="Enter Admin ID"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                id="password" 
                [(ngModel)]="password" 
                name="password" 
                placeholder="Enter Password"
                required
              />
              <button type="button" class="btn-toggle-eye" (click)="showPassword.set(!showPassword())">
                {{ showPassword() ? '👁️' : '🙈' }}
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit-login">
            <span>Sign In</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </form>

        <div class="card-footer">
          <span class="security-lock">🔒 FinCore FinSec 256-Bit TLS Encryption Active</span>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .admin-login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%);
      padding: 1.5rem;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .login-card {
      background: rgba(30, 41, 59, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      width: 100%;
      max-width: 440px;
      padding: 2.25rem;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.15);
      color: #f8fafc;
    }
    .brand-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-shield {
      width: 54px;
      height: 54px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      margin-bottom: 0.75rem;
      box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
      position: relative;
    }
    .logo-text-fc {
      position: absolute;
      bottom: -4px;
      right: -4px;
      background: #0f172a;
      border: 1.5px solid #3b82f6;
      color: #60a5fa;
      font-size: 0.65rem;
      font-weight: 900;
      padding: 1px 4px;
      border-radius: 6px;
    }
    .brand-title {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0 0 0.3rem 0;
      color: #ffffff;
    }
    .brand-title .highlight {
      color: #38bdf8;
    }
    .brand-subtitle {
      font-size: 0.82rem;
      color: #94a3b8;
      margin: 0;
    }
    .auth-error-alert {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      font-size: 0.78rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #cbd5e1;
      letter-spacing: 0.3px;
    }
    .input-icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon-wrapper svg {
      position: absolute;
      left: 0.85rem;
      color: #64748b;
      pointer-events: none;
    }
    .input-icon-wrapper input {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 0.75rem 2.5rem 0.75rem 2.6rem;
      border-radius: 10px;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.2s ease;
    }
    .input-icon-wrapper input:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }
    .btn-toggle-eye {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .btn-submit-login {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: none;
      padding: 0.85rem;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
      margin-top: 0.5rem;
    }
    .btn-submit-login:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
    }
    .card-footer {
      margin-top: 1.75rem;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1rem;
    }
    .security-lock {
      font-size: 0.7rem;
      color: #64748b;
    }
  `]
})
export class AdminLoginComponent {
  authService = inject(AdminAuthService);

  username = '';
  password = '';
  showPassword = signal<boolean>(false);

  onSubmit() {
    this.authService.login(this.username, this.password);
  }
}
