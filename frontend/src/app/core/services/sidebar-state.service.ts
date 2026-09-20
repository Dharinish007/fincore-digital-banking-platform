import { Injectable, signal, computed } from '@angular/core';

/**
 * SidebarStateService
 *
 * Lightweight signal-based service that manages the collapsed/expanded
 * state of the main navigation sidebar. Consumed by:
 *   - SidebarComponent  (toggle button, CSS class binding)
 *   - NavbarComponent   (hamburger button)
 *   - MainLayoutComponent (margin-left compensation)
 */
@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  /** Internal writable signal — private to enforce API surface */
  private readonly _isCollapsed = signal<boolean>(false);

  /** Public read-only view of collapse state */
  readonly isCollapsed = this._isCollapsed.asReadonly();

  /** Derived: effective sidebar pixel width as a CSS value */
  readonly sidebarWidth = computed(() =>
    this._isCollapsed() ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'
  );

  /** Toggle between collapsed and expanded */
  toggle(): void {
    this._isCollapsed.update((v) => !v);
  }

  /** Explicitly collapse the sidebar */
  collapse(): void {
    this._isCollapsed.set(true);
  }

  /** Explicitly expand the sidebar */
  expand(): void {
    this._isCollapsed.set(false);
  }
}
