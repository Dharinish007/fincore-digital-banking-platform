import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  appName = 'FinCore Nexus';
  milestoneTitle = 'Milestone 3: Loan Management';
  userRole = 'Bank Teller';

  onLogout(): void {
    alert('Logged out from FinCore Nexus Banking System');
  }
}
