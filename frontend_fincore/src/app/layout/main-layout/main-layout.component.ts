import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastService, ToastMessage } from '../../core/services/toast.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  toggleSidebar() {
    if (window.innerWidth <= 900) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  removeToast(id: string) {
    this.toastService.remove(id);
  }
}
