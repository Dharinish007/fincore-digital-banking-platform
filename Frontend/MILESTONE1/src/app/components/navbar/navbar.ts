import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  template: `
    <header class="navbar-header">
      <div class="navbar-container">
        <!-- Brand Logo & Title -->
        <div class="brand-group">
          <div class="logo-shield">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
          <div class="brand-text">
            <div class="brand-name">
              FINCORE <span class="brand-highlight">BANKING</span>
            </div>
            <div class="brand-tagline">DIGITAL STATEMENT MANAGEMENT ENGINE</div>
          </div>
        </div>

        <!-- Middle: Account Switcher & Ownership Guard -->
        <div class="account-selector-wrapper">
          <label class="select-label">ACTIVE ACCOUNT:</label>
          <select 
            [value]="accountService.activeAccountId()" 
            (change)="onAccountChange($event)"
            class="account-dropdown"
          >
            <option *ngFor="let acc of accountService.accounts()" [value]="acc.id">
              {{ acc.name }} — {{ accountService.maskAccountNumber(acc.accountNumber) }} ({{ accountService.formatCurrency(acc.balance) }})
            </option>
          </select>

          <!-- Security Badge -->
          <div class="ownership-badge" [class.joint]="accountService.activeAccount().ownershipStatus === 'JOINT_OWNER'">
            <span class="pulse-dot"></span>
            <span class="badge-text">
              {{ accountService.activeAccount().ownershipStatus === 'VERIFIED_OWNER' ? 'VERIFIED PRIMARY OWNER' : 'JOINT ACCOUNT - AUTHORIZED' }}
            </span>
          </div>
        </div>

        <!-- Right: Privacy / Data Masking Toggle & User Profile -->
        <div class="user-controls">
          <!-- Privacy Mode Toggle -->
          <button 
            type="button" 
            class="privacy-toggle-btn"
            [class.active]="accountService.isDataMasked()"
            (click)="togglePrivacyMode()"
            title="Toggle Sensitive Data Masking (Account numbers, SSN, balances)"
          >
            <svg *ngIf="!accountService.isDataMasked()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg *ngIf="accountService.isDataMasked()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <span>{{ accountService.isDataMasked() ? 'DATA MASKED' : 'PRIVACY MODE' }}</span>
          </button>

          <!-- User Avatar -->
          <div class="user-profile">
            <div class="avatar-circle">AS</div>
            <div class="profile-info">
              <div class="profile-name">A. Sterling</div>
              <div class="profile-role">PREMIER CLIENT</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: sticky;
      top: 0;
      z-index: 100;
      color: #f8fafc;
      padding: 0.75rem 1.5rem;
    }
    .navbar-container {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .logo-shield {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
    }
    .brand-name {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #ffffff;
    }
    .brand-highlight {
      color: #60a5fa;
    }
    .brand-tagline {
      font-size: 0.65rem;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 1px;
    }
    .account-selector-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(30, 41, 59, 0.7);
      padding: 0.4rem 0.85rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .select-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.5px;
    }
    .account-dropdown {
      background: #0f172a;
      color: #f8fafc;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 0.45rem 0.75rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      outline: none;
    }
    .ownership-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
      font-size: 0.68rem;
      font-weight: 700;
    }
    .ownership-badge.joint {
      background: rgba(245, 158, 11, 0.15);
      border-color: rgba(245, 158, 11, 0.3);
      color: #fbbf24;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background-color: currentColor;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
    }
    .user-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .privacy-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .privacy-toggle-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .privacy-toggle-btn.active {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .avatar-circle {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 800;
      color: #ffffff;
    }
    .profile-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .profile-role {
      font-size: 0.65rem;
      color: #94a3b8;
      font-weight: 600;
    }
    @media (max-width: 900px) {
      .navbar-container {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class NavbarComponent {
  accountService = inject(AccountService);
  deliveryService = inject(DeliveryStorageService);

  onAccountChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.accountService.selectAccount(select.value);
    const acc = this.accountService.activeAccount();
    this.deliveryService.addAuditLog(
      'AUTH_CHECK',
      `Switched active account to ${acc.name}. Authorization verified.`
    );
  }

  togglePrivacyMode() {
    this.accountService.toggleDataMasking();
    const isMasked = this.accountService.isDataMasked();
    this.deliveryService.addAuditLog(
      'DATA_MASK_TOGGLE',
      `Data Masking ${isMasked ? 'enabled' : 'disabled'} by client.`
    );
  }
}
