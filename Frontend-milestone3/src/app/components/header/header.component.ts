import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  appName = 'Secure Digital Banking System';
  milestoneTitle = 'Milestone 4: Loan Management';
  userRole = 'Bank Teller';

  onLogout(): void {
    alert('Logged out from Secure Digital Banking System');
  }
}
