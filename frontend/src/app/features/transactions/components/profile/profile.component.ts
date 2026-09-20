import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  public profile = {
    name: 'Aditi Verma',
    id: 'USR-89201',
    role: 'Senior Treasury Analyst & Auditor',
    email: 'aditi.verma@fincore.com',
    phone: '+91 98765 43210',
    branch: 'Global Treasury HQ',
    accessLevel: 'Tier 1 Operational Supervisor'
  };
}
