import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarStateService } from '../../core/services/sidebar-state.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private readonly sidebarState = inject(SidebarStateService);
  private readonly router = inject(Router);
  private routerSub?: Subscription;

  /** Expose collapse state to template for class binding */
  readonly isCollapsed = this.sidebarState.isCollapsed;

  ngOnInit(): void {
    // Automatically collapse sidebar on mobile when navigating
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        this.sidebarState.collapse();
      }
    });
  }

  /** Close sidebar overlay on mobile when backdrop is clicked */
  closeOnOverlay(): void {
    this.sidebarState.collapse();
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
