import { Component, inject, signal, HostListener } from '@angular/core';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly sidebarState = inject(SidebarStateService);
  private readonly authService = inject(AuthService);

  readonly platformTitle = 'FinCore';
  readonly platformSubtitle = 'Digital Banking Platform';

  readonly currentUser = this.authService.currentUser;

  /** Placeholder notification count */
  readonly notificationsCount = signal<number>(3);

  /** Controls profile dropdown visibility */
  readonly showProfileMenu = signal<boolean>(false);

  /** Delegates sidebar toggle to the state service */
  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  /** Toggles the profile dropdown */
  toggleProfileMenu(): void {
    this.showProfileMenu.update((v) => !v);
  }

  /** Close profile menu when clicking outside */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu-wrapper')) {
      this.showProfileMenu.set(false);
    }
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    const names = user.fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
