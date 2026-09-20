import { Component, inject, signal, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { BackendStatusService } from '../../../../core/services/backend-status.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly sidebarState = inject(SidebarStateService);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly backendStatusService = inject(BackendStatusService);
  private readonly notificationService = inject(NotificationService);
  public readonly breadcrumbService = inject(BreadcrumbService);
  private readonly router = inject(Router);

  @ViewChild('searchInput') searchInputElement?: ElementRef<HTMLInputElement>;

  readonly platformTitle = 'FinCore';
  readonly platformSubtitle = 'Digital Banking';

  readonly currentUser = this.authService.currentUser;
  readonly theme = this.themeService.theme;
  readonly isOnline = this.backendStatusService.isOnline;

  /** Global search term */
  searchQuery = '';

  /** Notification count */
  readonly notificationsCount = signal<number>(2);

  /** Controls profile dropdown visibility */
  readonly showProfileMenu = signal<boolean>(false);

  /** Controls notification dropdown visibility */
  readonly showNotificationsMenu = signal<boolean>(false);

  /** Global keyboard shortcut listener for Ctrl+K / Cmd+K */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchInputElement?.nativeElement.focus();
    }
  }

  /** Delegates sidebar toggle to the state service */
  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  /** Toggles the global theme */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /** Toggles the profile dropdown */
  toggleProfileMenu(): void {
    this.showProfileMenu.update((v) => !v);
    if (this.showProfileMenu()) {
      this.showNotificationsMenu.set(false);
    }
  }

  /** Toggles the notification menu */
  toggleNotificationsMenu(): void {
    this.showNotificationsMenu.update((v) => !v);
    if (this.showNotificationsMenu()) {
      this.showProfileMenu.set(false);
    }
  }

  /** Handle global search submit */
  onSearchSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const query = this.searchQuery.trim();
    if (!query) return;

    // Check if searching for a customer, account or transaction
    if (query.toLowerCase().startsWith('acc') || /^\d{6,}$/.test(query)) {
      this.router.navigate(['/account']);
    } else if (query.toLowerCase().startsWith('txn') || query.toLowerCase().startsWith('tx-')) {
      this.router.navigate(['/transaction']);
    } else {
      this.router.navigate(['/customer']);
    }

    this.notificationService.info(`Searching for "${query}" across modules...`);
  }

  /** Clear search input */
  clearSearch(): void {
    this.searchQuery = '';
  }

  /** Close profile and notification menus when clicking outside */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu-wrapper')) {
      this.showProfileMenu.set(false);
    }
    if (!target.closest('.notification-wrapper')) {
      this.showNotificationsMenu.set(false);
    }
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return 'SA';
    const names = user.fullName ? user.fullName.split(' ') : ['System', 'Admin'];
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  onMenuAction(action: string): void {
    this.showProfileMenu.set(false);
    this.notificationService.info(`${action} settings will be available in future releases.`);
  }

  dismissNotification(): void {
    this.notificationsCount.set(0);
    this.notificationService.success('All notifications marked as read.');
  }

  logout(): void {
    this.authService.logout();
  }
}
