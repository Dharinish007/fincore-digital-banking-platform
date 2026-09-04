import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { BankingService } from '../../core/services/banking.service';
import { UserRole } from '../../core/models/banking.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  auth = inject(AuthService);
  banking = inject(BankingService);

  showNotificationsDropdown = false;
  showProfileDropdown = false;
  searchQuery = '';

  availableRoles: UserRole[] = [
    'Super Admin',
    'Banking Admin',
    'Branch Manager',
    'Loan Officer',
    'KYC Officer',
    'Auditor'
  ];

  notifications$ = this.banking.getNotifications();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleNotifications() {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
    if (this.showNotificationsDropdown) {
      this.showProfileDropdown = false;
    }
  }

  toggleProfile() {
    this.showProfileDropdown = !this.showProfileDropdown;
    if (this.showProfileDropdown) {
      this.showNotificationsDropdown = false;
    }
  }

  changeRole(role: UserRole) {
    this.auth.switchRole(role);
    this.banking.setCurrentUserRole(role);
    this.showProfileDropdown = false;
  }

  logout() {
    this.auth.logout();
  }
}
