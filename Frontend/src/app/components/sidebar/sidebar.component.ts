import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavSection {
  title: string;
  items: {
    label: string;
    route: string;
    icon: string;
    badge?: string;
  }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Executive Dashboard', route: '/dashboard', icon: '📊' },
        { label: 'Core Operations', route: '/core-dashboard', icon: '⚡' }
      ]
    },
    {
      title: 'CORE BANKING (M1)',
      items: [
        { label: 'Accounts & Lifecycle', route: '/accounts', icon: '🏦' },
        { label: 'Balance Management', route: '/balance', icon: '💰' },
        { label: 'Statements & Export', route: '/statements', icon: '📄', badge: 'PDF' }
      ]
    },
    {
      title: 'LOAN PORTAL (M2)',
      items: [
        { label: 'Loan Servicing', route: '/loans', icon: '📁' },
        { label: 'EMI Calculator', route: '/loans/emi', icon: '🧮' },
        { label: 'Loan Disbursement', route: '/loans/disbursement', icon: '💸' },
        { label: 'Collections', route: '/loans/collections', icon: '💳' }
      ]
    },
    {
      title: 'ENTERPRISE & CLEARING (M3)',
      items: [
        { label: 'Interbank Payments', route: '/payments', icon: '🔄' },
        { label: 'Settlement Engine', route: '/settlement', icon: '⚖️' },
        { label: 'Enterprise Ledger', route: '/ledger', icon: '📑' },
        { label: 'Notification Service', route: '/notifications', icon: '🔔' },
        { label: 'Fraud Detection', route: '/fraud-detection', icon: '🚨' }
      ]
    },
    {
      title: 'SECURITY & AI (M4)',
      items: [
        { label: 'Biometric Liveness', route: '/liveness', icon: '🛡️', badge: 'AI' },
        { label: 'AI Risk Assessment', route: '/risk', icon: '🧠', badge: 'AI' },
        { label: 'Audit Trail', route: '/audit', icon: '📋' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Platform Settings', route: '/settings', icon: '⚙️' }
      ]
    }
  ];
}

