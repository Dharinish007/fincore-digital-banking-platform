import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  exactMatch?: boolean;
  isAction?: boolean;
}

export interface NavGroup {
  category: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly sidebarState = inject(SidebarStateService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  /** Expose collapse state to the template as a reactive signal */
  readonly isCollapsed = this.sidebarState.isCollapsed;

  get navGroups(): NavGroup[] {
    const role = this.authService.getCurrentRole();

    if (role === 'CUSTOMER') {
      return [
        {
          category: 'OVERVIEW',
          items: [
            { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', exactMatch: true }
          ]
        },
        {
          category: 'MY BANKING',
          items: [
            { label: 'My Accounts', route: '/account', icon: 'account_balance_wallet' },
            { label: 'My Transactions', route: '/transaction', icon: 'swap_horiz' },
            { label: 'My Loans', route: '/loan', icon: 'payments', exactMatch: true },
            { label: 'Apply for Loan', route: '/loan/apply', icon: 'post_add' }
          ]
        }
      ];
    }

    if (role === 'EMPLOYEE') {
      return [
        {
          category: 'OVERVIEW',
          items: [
            { label: 'Operations Dashboard', route: '/dashboard', icon: 'dashboard', exactMatch: true }
          ]
        },
        {
          category: 'LOAN OPERATIONS',
          items: [
            { label: 'Loan Underwriting', route: '/loan/review', icon: 'fact_check' },
            { label: 'Loan Portfolio', route: '/loan', icon: 'payments', exactMatch: true }
          ]
        },
        {
          category: 'BANKING OPERATIONS',
          items: [
            { label: 'Customers', route: '/customer', icon: 'people_alt' },
            { label: 'Accounts', route: '/account', icon: 'account_balance_wallet' },
            { label: 'Transactions', route: '/transaction', icon: 'swap_horiz' }
          ]
        }
      ];
    }

    // Default: ADMIN
    return [
      {
        category: 'OVERVIEW',
        items: [
          { label: 'System Dashboard', route: '/dashboard', icon: 'dashboard', exactMatch: true }
        ]
      },
      {
        category: 'LOAN MANAGEMENT',
        items: [
          { label: 'Loan Products', route: '/admin/loan-products', icon: 'inventory_2' }
        ]
      },
      {
        category: 'BANKING MANAGEMENT',
        items: [
          { label: 'Customers', route: '/customer', icon: 'people_alt' },
          { label: 'Accounts', route: '/account', icon: 'account_balance_wallet' },
          { label: 'Transactions', route: '/transaction', icon: 'swap_horiz' }
        ]
      }
    ];
  }

  toggle(): void {
    this.sidebarState.toggle();
  }

  onItemClick(item: NavItem, event: MouseEvent): void {
    if (item.isAction) {
      event.preventDefault();
      this.notificationService.info('System Settings will be available in future releases.');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
