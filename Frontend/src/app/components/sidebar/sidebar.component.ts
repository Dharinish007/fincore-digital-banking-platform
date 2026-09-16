import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService, UserRole } from '../../services/admin-auth.service';

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
  readonly authService = inject(AdminAuthService);

  readonly navSections = computed<NavSection[]>(() => {
    const role: UserRole = this.authService.activeRole();

    switch (role) {
      case 'CUSTOMER':
        return [
          {
            title: 'MY DASHBOARD',
            items: [
              { label: 'Customer Dashboard', route: '/dashboard', icon: '👤' }
            ]
          },
          {
            title: 'MY BANKING',
            items: [
              { label: 'My Accounts', route: '/accounts', icon: '🏦' },
              { label: 'Balance & Transfer', route: '/balance', icon: '💰' },
              { label: 'Certified Statements', route: '/statements', icon: '📄', badge: 'PDF' },
              { label: 'Pay Loan EMI', route: '/payments', icon: '💳' }
            ]
          },
          {
            title: 'LOAN SERVICES',
            items: [
              { label: 'My Loans & Schedule', route: '/loans', icon: '📁' },
              { label: 'EMI Calculator', route: '/loans/emi', icon: '🧮' }
            ]
          },
          {
            title: 'SECURITY & KYC',
            items: [
              { label: 'Biometric Liveness', route: '/liveness', icon: '🛡️', badge: 'AI' }
            ]
          },
          {
            title: 'ALERTS',
            items: [
              { label: 'My Notifications', route: '/notifications', icon: '🔔' }
            ]
          }
        ];

      case 'BANK_STAFF':
        return [
          {
            title: 'OPERATIONS',
            items: [
              { label: 'Staff Dashboard', route: '/dashboard', icon: '⚡' },
              { label: 'Core Operations', route: '/core-dashboard', icon: '📊' }
            ]
          },
          {
            title: 'CUSTOMER OPERATIONS',
            items: [
              { label: 'Accounts & Lifecycle', route: '/accounts', icon: '🏦' },
              { label: 'Balance & Adjustments', route: '/balance', icon: '💰' },
              { label: 'Certified Statements', route: '/statements', icon: '📄', badge: 'PDF' },
              { label: 'Counter Transfers', route: '/payments', icon: '🔄' },
              { label: 'Enterprise Ledger', route: '/ledger', icon: '📑' }
            ]
          },
          {
            title: 'LOANS & COLLECTIONS',
            items: [
              { label: 'Loan Inquiries', route: '/loans', icon: '📁' },
              { label: 'EMI Calculator', route: '/loans/emi', icon: '🧮' },
              { label: 'Record Collections', route: '/loans/collections', icon: '💳' }
            ]
          },
          {
            title: 'COMPLIANCE & LOGS',
            items: [
              { label: 'Customer Notifications', route: '/notifications', icon: '🔔' },
              { label: 'Biometric Verification', route: '/liveness', icon: '🛡️', badge: 'AI' },
              { label: 'Audit Trail (View)', route: '/audit', icon: '📋' }
            ]
          }
        ];

      case 'LOAN_OFFICER':
        return [
          {
            title: 'LOAN DESK',
            items: [
              { label: 'Loan Officer Dashboard', route: '/dashboard', icon: '📈' }
            ]
          },
          {
            title: 'CREDIT & UNDERWRITING',
            items: [
              { label: 'Loan Review & Approval', route: '/loans', icon: '📁' },
              { label: 'EMI Calculator & Schedule', route: '/loans/emi', icon: '🧮' },
              { label: 'Disbursement Engine', route: '/loans/disbursement', icon: '💸' },
              { label: 'Collections Recovery', route: '/loans/collections', icon: '💳' }
            ]
          },
          {
            title: 'RISK & EVALUATION',
            items: [
              { label: 'Applicant Risk Engine', route: '/risk', icon: '🧠', badge: 'AI' }
            ]
          },
          {
            title: 'COMMUNICATION',
            items: [
              { label: 'Notifications', route: '/notifications', icon: '🔔' }
            ]
          }
        ];

      case 'FRAUD_OFFICER':
        return [
          {
            title: 'FRAUD COMMAND',
            items: [
              { label: 'Fraud Dashboard', route: '/dashboard', icon: '🚨' }
            ]
          },
          {
            title: 'INVESTIGATION & AML',
            items: [
              { label: 'Anomaly Detection', route: '/fraud-detection', icon: '🚨', badge: 'ALERT' },
              { label: 'AI Risk Engine', route: '/risk', icon: '🧠', badge: 'AI' },
              { label: 'Settlement Releases', route: '/settlement', icon: '⚖️' },
              { label: 'Security Audit Trail', route: '/audit', icon: '📋' }
            ]
          },
          {
            title: 'ALERTS',
            items: [
              { label: 'Security Notifications', route: '/notifications', icon: '🔔' }
            ]
          }
        ];

      case 'AUDITOR':
        return [
          {
            title: 'COMPLIANCE DESK',
            items: [
              { label: 'Auditor Dashboard (Read-Only)', route: '/dashboard', icon: '🛡️' }
            ]
          },
          {
            title: 'AUDIT & COMPLIANCE',
            items: [
              { label: 'Full System Audit Trail', route: '/audit', icon: '📋' },
              { label: 'Certified Statements', route: '/statements', icon: '📄', badge: 'PDF' },
              { label: 'Enterprise Ledger', route: '/ledger', icon: '📑' },
              { label: 'Risk Assessments', route: '/risk', icon: '🧠', badge: 'AI' },
              { label: 'Fraud Incidents', route: '/fraud-detection', icon: '🚨' },
              { label: 'Settlement Clearing', route: '/settlement', icon: '⚖️' },
              { label: 'Loan Portfolio Records', route: '/loans', icon: '📁' }
            ]
          }
        ];

      case 'ADMIN':
      default:
        return [
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
  });
}
