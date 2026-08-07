import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
export class MainLayoutComponent {
  private readonly sidebarState = inject(SidebarStateService);

  /** Expose collapse state to template for class binding */
  readonly isCollapsed = this.sidebarState.isCollapsed;

  /** Close sidebar overlay on mobile when backdrop is clicked */
  closeOnOverlay(): void {
    this.sidebarState.collapse();
  }
}
