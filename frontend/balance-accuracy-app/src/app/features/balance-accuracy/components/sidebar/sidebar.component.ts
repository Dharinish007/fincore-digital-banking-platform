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
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() collapsed = false;

  public navItems: NavItem[] = [
    { label: 'Balance Accuracy', icon: 'fact_check', route: '/', exact: true, badge: 'Live' },
    { label: 'Open Account', icon: 'account_balance_wallet', route: '/accounts' },
    { label: 'Transactions', icon: 'swap_horiz', route: '/transactions', exact: true, badge: 'Atomic' },
    { label: 'Initiate Transfer', icon: 'send', route: '/transactions/initiate' },
    { label: 'Transaction History', icon: 'receipt_long', route: '/transactions/history' },
    { label: 'Reports', icon: 'description', route: '/reports' },
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Support', icon: 'help_outline', route: '/support' }
  ];
}
