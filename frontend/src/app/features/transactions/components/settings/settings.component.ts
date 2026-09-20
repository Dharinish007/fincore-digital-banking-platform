import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public sidebarCollapsed = false;

  public settings = {
    darkMode: true,
    notifications: true,
    autoRefresh: true,
    twoFactor: true,
    language: 'en'
  };

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
