import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  badge?: string;
  route?: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() collapsed = false;

  public navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '' },
    {
      label: 'Accounts',
      icon: 'account_balance_wallet',
      route: 'open-account',
    },
    { label: 'Funds Transfer', icon: 'send', route: 'transfer' },
    { label: 'Loans', icon: 'credit_score' },
    { label: 'Payments', icon: 'payments' },
    { label: 'KYC', icon: 'verified_user' },
    { label: 'Audit', icon: 'history_edu' },
    {
      label: 'Balance Accuracy',
      icon: 'fact_check',
      active: true,
      badge: 'Live',
    },
    { label: 'Reports', icon: 'description' },
    { label: 'Settings', icon: 'settings' },
  ];
}
