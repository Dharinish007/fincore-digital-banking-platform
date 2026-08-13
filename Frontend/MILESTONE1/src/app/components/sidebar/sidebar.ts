import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type NavTab = 'DASHBOARD' | 'ACCOUNTS' | 'BALANCE' | 'STATEMENTS' | 'SETTINGS';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay Drawer Backdrop -->
    <div 
      class="drawer-backdrop" 
      *ngIf="isDrawerOpen()" 
      (click)="closeDrawer.emit()"
    ></div>

    <!-- Slide-Out Drawer Navigation Panel -->
    <aside class="fincore-drawer" [class.drawer-open]="isDrawerOpen()">
      <div class="drawer-header">
        <button type="button" class="btn-close-drawer" (click)="closeDrawer.emit()" title="Close Navigation">
          <span>✕</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <button 
          type="button" 
          class="nav-item" 
          [class.active]="activeTab() === 'DASHBOARD'"
          (click)="selectTab('DASHBOARD')"
        >
          <span class="nav-icon">📊</span>
          <span>Dashboard</span>
        </button>

        <button 
          type="button" 
          class="nav-item" 
          [class.active]="activeTab() === 'ACCOUNTS'"
          (click)="selectTab('ACCOUNTS')"
        >
          <span class="nav-icon">🏦</span>
          <span>Accounts (Lifecycle & Graph)</span>
        </button>

        <button 
          type="button" 
          class="nav-item" 
          [class.active]="activeTab() === 'BALANCE'"
          (click)="selectTab('BALANCE')"
        >
          <span class="nav-icon">💳</span>
          <span>Balance Management</span>
        </button>

        <button 
          type="button" 
          class="nav-item" 
          [class.active]="activeTab() === 'STATEMENTS'"
          (click)="selectTab('STATEMENTS')"
        >
          <span class="nav-icon">📄</span>
          <span>Statements & PDF</span>
        </button>

        <button 
          type="button" 
          class="nav-item" 
          [class.active]="activeTab() === 'SETTINGS'"
          (click)="selectTab('SETTINGS')"
        >
          <span class="nav-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </nav>
    </aside>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 998;
    }
    .fincore-drawer {
      position: fixed;
      top: 54px;
      left: -280px;
      bottom: 0;
      width: 260px;
      background: #0d162a;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem 0.75rem;
      z-index: 999;
      box-shadow: 10px 0 30px rgba(0, 0, 0, 0.6);
      transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .fincore-drawer.drawer-open {
      left: 0;
    }
    .drawer-header {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 0.5rem;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .btn-close-drawer {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #94a3b8;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .btn-close-drawer:hover {
      color: #ffffff;
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .nav-item {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 0.88rem;
      font-weight: 600;
      text-align: left;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.2s ease;
    }
    .nav-icon {
      font-size: 1rem;
    }
    .nav-item:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
    }
    .nav-item.active {
      color: #38bdf8;
      font-weight: 700;
      background: rgba(56, 189, 248, 0.12);
      border-left: 3px solid #38bdf8;
    }
  `]
})
export class SidebarComponent {
  readonly activeTab = input<NavTab>('DASHBOARD');
  readonly isDrawerOpen = input<boolean>(false);
  readonly tabChange = output<NavTab>();
  readonly closeDrawer = output<void>();

  selectTab(tab: NavTab) {
    this.tabChange.emit(tab);
    this.closeDrawer.emit();
  }
}
