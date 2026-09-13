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

        <!-- Brand Header -->
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
          <p class="brand-subtitle">Integrated Digital Banking & Enterprise Suite</p>
        </div>

        <!-- Auth Mode Toggle Tabs -->
        <div class="auth-tabs">
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="authMode() === 'LOGIN'"
            (click)="setMode('LOGIN')"
          >
            Sign In
          </button>
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="authMode() === 'SIGNUP'"
            (click)="setMode('SIGNUP')"
          >
            Create Account
          </button>
        </div>

        <!-- Feedback Alerts -->
        <div *ngIf="authService.authError()" class="auth-alert error-alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ authService.authError() }}</span>
        </div>

        <div *ngIf="authService.authSuccess()" class="auth-alert success-alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{{ authService.authSuccess() }}</span>
        </div>

        <!-- ================= SIGN IN FORM ================= -->
        <form *ngIf="authMode() === 'LOGIN'" (ngSubmit)="onLoginSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Username or Corporate Email</label>
            <div class="input-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input 
                type="text" 
                id="username" 
                [(ngModel)]="loginIdentifier" 
                name="loginIdentifier" 
                placeholder="e.g. admin1 or alex@fincore.com"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password">Password</label>
              <span class="hint-pwd">Demo: admin123</span>
            </div>
            <div class="input-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                id="password" 
                [(ngModel)]="loginPassword" 
                name="loginPassword" 
                placeholder="Enter password"
                required
              />
              <button type="button" class="btn-toggle-eye" (click)="showPassword.set(!showPassword())">
                {{ showPassword() ? '👁️' : '🙈' }}
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit-primary">
            <span>Sign In to Banking Console</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          <!-- 1-Click Demo Profiles -->
          <div class="quick-demo-section">
            <span class="quick-label">⚡ Quick 1-Click Demo Access:</span>
            <div class="demo-pills">
              <button type="button" class="demo-pill" (click)="authService.quickLogin('admin1')">
                <span class="pill-avatar">AV</span>
                <span class="pill-text"><strong>Alex Vance</strong> (Auditor)</span>
              </button>
              <button type="button" class="demo-pill" (click)="authService.quickLogin('admin2')">
                <span class="pill-avatar">SC</span>
                <span class="pill-text"><strong>Sarah Connor</strong> (Risk Dir.)</span>
              </button>
            </div>
          </div>
        </form>

        <!-- ================= SIGN UP FORM ================= -->
        <form *ngIf="authMode() === 'SIGNUP'" (ngSubmit)="onSignupSubmit()" class="login-form">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <div class="input-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input 
                type="text" 
                id="fullName" 
                [(ngModel)]="signupName" 
                name="signupName" 
                placeholder="e.g. Vikramaditya Rao"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="corporateEmail">Corporate Email</label>
            <div class="input-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input 
                type="email" 
                id="corporateEmail" 
                [(ngModel)]="signupEmail" 
                name="signupEmail" 
                placeholder="e.g. v.rao@fincore.com"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex: 1;">
              <label for="signupPhone">Phone Number</label>
              <input 
                type="tel" 
                id="signupPhone" 
                [(ngModel)]="signupPhone" 
                name="signupPhone" 
                placeholder="+91 98765 43210"
                class="form-input-plain"
              />
            </div>

            <div class="form-group" style="flex: 1;">
              <label for="signupRole">Department Role</label>
              <select id="signupRole" [(ngModel)]="signupRole" name="signupRole" class="form-select-plain">
                <option value="Senior Banking Officer">Banking Officer</option>
                <option value="Compliance & Risk Director">Risk & Compliance</option>
                <option value="Senior Banking Auditor">Audit Inspector</option>
                <option value="Branch Operations Specialist">Branch Operations</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="signupPassword">Create Password</label>
            <div class="input-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                [type]="showSignupPassword() ? 'text' : 'password'" 
                id="signupPassword" 
                [(ngModel)]="signupPassword" 
                name="signupPassword" 
                placeholder="Minimum 6 characters"
                required
              />
              <button type="button" class="btn-toggle-eye" (click)="showSignupPassword.set(!showSignupPassword())">
                {{ showSignupPassword() ? '👁️' : '🙈' }}
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit-primary btn-signup">
            <span>Create Account & Sign In</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
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
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      width: 100%;
      max-width: 460px;
      padding: 2.25rem;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.15);
      color: #f8fafc;
    }
    .brand-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .logo-shield {
      width: 52px;
      height: 52px;
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

    /* Tabs */
    .auth-tabs {
      display: flex;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 4px;
      margin-bottom: 1.5rem;
    }
    .tab-btn {
      flex: 1;
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
    }

    .auth-alert {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1.25rem;
    }
    .error-alert {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
    .success-alert {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #6ee7b7;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-row {
      display: flex;
      gap: 12px;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .form-group label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #cbd5e1;
      letter-spacing: 0.3px;
    }
    .hint-pwd {
      font-size: 0.72rem;
      color: #38bdf8;
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
    .input-icon-wrapper input:focus, .form-input-plain:focus, .form-select-plain:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }
    .form-input-plain, .form-select-plain {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 0.7rem 0.85rem;
      border-radius: 10px;
      font-size: 0.85rem;
      outline: none;
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
    .btn-submit-primary {
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
      margin-top: 0.25rem;
    }
    .btn-submit-primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
    }
    .btn-signup {
      background: linear-gradient(135deg, #059669, #047857);
      box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4);
    }
    .btn-signup:hover {
      background: #047857;
      box-shadow: 0 6px 20px rgba(5, 150, 105, 0.6);
    }

    /* Demo Access Pills */
    .quick-demo-section {
      margin-top: 0.75rem;
      padding-top: 1rem;
      border-top: 1px dashed rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .quick-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .demo-pills {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .demo-pill {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 6px 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      color: #cbd5e1;
      text-align: left;
      transition: all 0.15s ease;
    }
    .demo-pill:hover {
      border-color: #38bdf8;
      background: #1e293b;
      color: #ffffff;
    }
    .pill-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #2563eb;
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 800;
      display: grid;
      place-items: center;
    }
    .pill-text {
      font-size: 0.72rem;
      line-height: 1.2;
    }
    .card-footer {
      margin-top: 1.5rem;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 0.85rem;
    }
    .security-lock {
      font-size: 0.7rem;
      color: #64748b;
    }
  `]
})
export class AdminLoginComponent {
  authService = inject(AdminAuthService);

  authMode = signal<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Sign In fields
  loginIdentifier = '';
  loginPassword = '';
  showPassword = signal<boolean>(false);

  // Sign Up fields
  signupName = '';
  signupEmail = '';
  signupPhone = '';
  signupRole = 'Senior Banking Officer';
  signupPassword = '';
  showSignupPassword = signal<boolean>(false);

  setMode(mode: 'LOGIN' | 'SIGNUP') {
    this.authMode.set(mode);
    this.authService.authError.set(null);
    this.authService.authSuccess.set(null);
  }

  onLoginSubmit() {
    if (!this.loginIdentifier || !this.loginPassword) {
      this.authService.authError.set('Please enter both identifier and password.');
      return;
    }
    this.authService.login(this.loginIdentifier, this.loginPassword);
  }

  onSignupSubmit() {
    if (!this.signupName || !this.signupEmail || !this.signupPassword) {
      this.authService.authError.set('Please provide your name, email, and password.');
      return;
    }
    if (this.signupPassword.length < 6) {
      this.authService.authError.set('Password must be at least 6 characters.');
      return;
    }
    this.authService.register({
      name: this.signupName,
      email: this.signupEmail,
      phone: this.signupPhone,
      role: this.signupRole,
      password: this.signupPassword
    });
  }
}
