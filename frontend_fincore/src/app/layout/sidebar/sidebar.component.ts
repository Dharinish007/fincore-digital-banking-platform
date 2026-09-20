import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
  badgeType?: 'danger' | 'warning' | 'info' | 'success';
  children?: { label: string; route: string; icon?: string }[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Input() isMobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

  openSubmenus: { [key: string]: boolean } = {
    '/architecture': true
  };

  sections: NavSection[] = [
    {
      title: 'CORE BANKING',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
        { label: 'Customers', route: '/customers', icon: 'customers', badge: '2.4M' },
        { label: 'Accounts', route: '/accounts', icon: 'accounts', badge: '3.1M' },
        { label: 'Transactions', route: '/transactions', icon: 'transactions' },
        { label: 'Account Statement', route: '/statement', icon: 'statement' }
      ]
    },
    {
      title: 'LENDING & PAYMENTS',
      items: [
        { label: 'Loans & Lending', route: '/loans', icon: 'loans', badge: '5 Pending', badgeType: 'warning' },
        { label: 'EMI Calculator', route: '/emi-calculator', icon: 'calculator' },
        { label: 'Payments & Transfers', route: '/payments', icon: 'payments' },
        { label: 'Send Money Wizard', route: '/payments/send', icon: 'send' },
        { label: 'Beneficiaries', route: '/beneficiaries', icon: 'beneficiaries' }
      ]
    },
    {
      title: 'RISK & COMPLIANCE',
      items: [
        { label: 'KYC & Compliance', route: '/kyc', icon: 'kyc', badge: '4 Review', badgeType: 'warning' },
        { label: 'Fraud Detection', route: '/fraud', icon: 'fraud', badge: '3 Alerts', badgeType: 'danger' },
        { label: 'Risk Assessment', route: '/risk-assessment', icon: 'shield' },
        { label: 'Audit Logs', route: '/audit', icon: 'audit' },
        { label: 'Notifications', route: '/notifications', icon: 'notifications' }
      ]
    },
    {
      title: 'ENTERPRISE & PLATFORM',
      items: [
        { label: 'Users & Access (RBAC)', route: '/users', icon: 'users' },
        { label: 'Reports & Analytics', route: '/reports', icon: 'reports' },
        {
          label: 'System Architecture',
          route: '/architecture',
          icon: 'architecture',
          children: [
            { label: 'System Overview', route: '/architecture/overview' },
            { label: 'Spring Architecture', route: '/architecture/spring' },
            { label: 'Project Flow Diagram', route: '/architecture/flow' },
            { label: 'UML Class Diagram', route: '/architecture/uml' },
            { label: 'Microservices Grid', route: '/architecture/microservices' },
            { label: 'Kafka Event Bus', route: '/architecture/kafka' },
            { label: 'Redis Cache Monitor', route: '/architecture/redis' },
            { label: 'API Gateway Monitor', route: '/architecture/gateway' },
            { label: 'Security & OAuth', route: '/architecture/security' }
          ]
        },
        { label: 'Milestones & Roadmap', route: '/milestones', icon: 'milestones' },
        { label: 'Platform Settings', route: '/settings', icon: 'settings' }
      ]
    }
  ];

  toggleSubmenu(route: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.openSubmenus[route] = !this.openSubmenus[route];
  }

  isSubmenuOpen(route: string): boolean {
    return !!this.openSubmenus[route];
  }

  onCloseMobile() {
    this.closeMobile.emit();
  }
}
