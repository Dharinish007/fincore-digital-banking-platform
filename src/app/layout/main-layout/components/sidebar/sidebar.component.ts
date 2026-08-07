import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { AuthService } from '../../../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  exactMatch?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly sidebarState = inject(SidebarStateService);
  private readonly authService = inject(AuthService);

  /** Expose collapse state to the template as a reactive signal */
  readonly isCollapsed = this.sidebarState.isCollapsed;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',    route: '/dashboard',    icon: 'dashboard',         exactMatch: true  },
    { label: 'Customers',    route: '/customer',     icon: 'people_alt'                          },
    { label: 'Accounts',     route: '/account',      icon: 'account_balance_wallet'              },
    { label: 'Transactions', route: '/transaction',  icon: 'swap_horiz'                         }
  ];

  toggle(): void {
    this.sidebarState.toggle();
  }

  logout(): void {
    this.authService.logout();
  }
}
