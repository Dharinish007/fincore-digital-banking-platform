import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-credit-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="dashboard-layout">
      <app-header
        moduleTitle="Loans & Credit Risk"
        moduleIcon="assessment"
        (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed"
      ></app-header>
      <div class="main-container">
        <app-sidebar [collapsed]="sidebarCollapsed"></app-sidebar>
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-primary);
    }
    .main-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .content-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      height: calc(100vh - 64px);
    }
  `]
})
export class CreditShellComponent {
  public sidebarCollapsed = false;
}
