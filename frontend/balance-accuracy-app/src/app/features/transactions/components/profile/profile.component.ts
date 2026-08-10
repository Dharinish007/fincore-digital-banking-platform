import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  public sidebarCollapsed = false;

  public profile = {
    name: 'Aditi Verma',
    id: 'USR-89201',
    role: 'Senior Treasury Analyst & Auditor',
    email: 'aditi.verma@fincore.com',
    phone: '+91 98765 43210',
    branch: 'Global Treasury HQ',
    accessLevel: 'Tier 1 Operational Supervisor'
  };

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
