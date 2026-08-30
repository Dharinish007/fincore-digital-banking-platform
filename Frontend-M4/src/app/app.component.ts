import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-header 
        [moduleTitle]="activeModuleTitle" 
        [moduleIcon]="activeModuleIcon"
        (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed">
      </app-header>
      <div class="app-body">
        <app-sidebar [collapsed]="sidebarCollapsed"></app-sidebar>
        <main class="app-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-primary);
    }

    .app-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .app-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      height: calc(100vh - 64px);
    }
  `]
})
export class AppComponent {
  title = 'frontend-m4';
  sidebarCollapsed = false;
  activeModuleTitle = 'Document OCR & KYC';
  activeModuleIcon = 'badge';
}
