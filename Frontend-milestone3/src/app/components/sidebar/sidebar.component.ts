import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Fraud Detection', route: '/fraud-detection' },
    { label: 'Settlement Engine', route: '/settlement-engine' },
    { label: 'Notification Service', route: '/notification-service' },
    { label: 'Loans', route: '/loans' },
    { label: 'Accounts & Ledger', route: '/accounts' },
    { label: 'Payments', route: '/payments' },
    { label: 'KYC & Verification', route: '/kyc' },
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Audit Trail', route: '/audit' },
    { label: 'Settings', route: '/settings' }
  ];
}
