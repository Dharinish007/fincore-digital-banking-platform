import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="fincore-header">
      <div class="header-content">
        
        <!-- Left: 3-line Hamburger Drawer Button + FinCore FC Brand -->
        <div class="brand-title-area">
          <button 
            type="button" 
            class="btn-hamburger" 
            (click)="toggleDrawer.emit()" 
            title="Open Navigation Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div class="fc-brand-badge">
            <div class="fc-shield-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span class="fc-tag">FC</span>
            </div>
            <h1 class="brand-name">FinCore <span class="brand-highlight">Banking</span></h1>
          </div>
        </div>

        <!-- Right: Admin Profile, Settings & Logout -->
        <div class="header-right">
          <!-- Replaced privacy button with Settings button -->
          <button type="button" class="btn-settings-header" (click)="openSettings.emit()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Settings</span>
          </button>

          <!-- Logged In Admin Info -->
          <div class="user-menu" *ngIf="authService.currentAdmin() as admin">
            <div class="admin-avatar-badge">{{ admin.avatar }}</div>
            <div class="admin-info-text">
              <span class="user-role">{{ admin.name }}</span>
              <span class="admin-username">({{ admin.username }})</span>
            </div>
            <span class="sep">|</span>
            <button type="button" class="btn-header-logout" (click)="onLogoutClick()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  `,
  styles: [`
    .fincore-header {
      background: #09132b;
      border-bottom: 1px solid rgba(56, 189, 248, 0.2);
      color: #ffffff;
      padding: 0.6rem 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-content {
      max-width: 1500px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-title-area {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .btn-hamburger {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f8fafc;
      padding: 0.45rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .btn-hamburger:hover {
      background: rgba(56, 189, 248, 0.2);
      border-color: #38bdf8;
      color: #38bdf8;
    }
    .fc-brand-badge {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .fc-shield-logo {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      position: relative;
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
    }
    .fc-tag {
      position: absolute;
      bottom: -3px;
      right: -3px;
      font-size: 0.55rem;
      font-weight: 900;
      background: #09132b;
      color: #38bdf8;
      padding: 0 3px;
      border-radius: 3px;
      border: 1px solid #38bdf8;
    }
    .brand-name {
      font-size: 1.3rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.3px;
      margin: 0;
    }
    .brand-highlight {
      color: #38bdf8;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .btn-settings-header {
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s ease;
    }
    .btn-settings-header:hover {
      background: rgba(56, 189, 248, 0.25);
      color: #ffffff;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      background: rgba(30, 41, 59, 0.8);
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .admin-avatar-badge {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.72rem;
      font-weight: 800;
      color: #ffffff;
    }
    .admin-info-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .user-role {
      font-size: 0.8rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .admin-username {
      font-size: 0.65rem;
      color: #94a3b8;
    }
    .sep {
      color: #334155;
    }
    .btn-header-logout {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    .btn-header-logout:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
    }
  `]
})
export class HeaderComponent {
  accountService = inject(AccountService);
  deliveryService = inject(DeliveryStorageService);
  authService = inject(AdminAuthService);

  readonly toggleDrawer = output<void>();
  readonly openSettings = output<void>();
  readonly logout = output<void>();

  onLogoutClick() {
    this.authService.logout();
    this.logout.emit();
    this.deliveryService.showToast('Logged Out', 'Admin session successfully terminated.', 'info');
  }
}
