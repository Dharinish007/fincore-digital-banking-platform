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
              { label: 'Instant Fund Transfer', route: '/fund-transfer', icon: '💸' },
              { label: 'Transaction Explorer', route: '/transactions', icon: '🔄' },
              { label: 'Payment Initiation', route: '/payment-initiation', icon: '💳' },
              { label: 'Balance & Adjustments', route: '/balance', icon: '💰' },
              { label: 'Certified Statements', route: '/statements', icon: '📄', badge: 'PDF' }
            ]
          },
          {
            title: 'LOAN SERVICES',
            items: [
              { label: 'My Loans & Servicing', route: '/loans', icon: '📁' },
              { label: 'New Loan Application', route: '/loan-origination/loan-application', icon: '📝' },
              { label: 'Pre-Qualification', route: '/pre-qualification', icon: '✨' },
              { label: 'Credit Risk Bureau', route: '/credit-check', icon: '📊' },
              { label: 'EMI Calculator', route: '/emi-calculator', icon: '🧮' }
            ]
          },
          {
            title: 'SECURITY & KYC',
            items: [
              { label: 'Biometric Face Liveness', route: '/liveness', icon: '🛡️', badge: 'AI' },
              { label: 'Document OCR Scanner', route: '/document-ocr', icon: '🪪', badge: 'AI' },
              { label: 'AI Webcam Liveness', route: '/liveness-detection', icon: '📹' },
              { label: 'Face Match Accuracy', route: '/face-match', icon: '🧑' },
              { label: 'KYC Verification Summary', route: '/verification-summary', icon: '✅' }
            ]
          },
          {
            title: 'ALERTS & SETTINGS',
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
              { label: 'Open New Account', route: '/open-account', icon: '➕' },
              { label: 'Balance Accuracy & Drift', route: '/balance-accuracy', icon: '⚖️' },
              { label: 'Balance Adjustments', route: '/balance', icon: '💰' },
              { label: 'Fund Transfer Desk', route: '/fund-transfer', icon: '💸' },
              { label: 'Transaction Explorer', route: '/transactions', icon: '🔄' },
              { label: 'Beneficiary Verification', route: '/beneficiary-verification', icon: '🤝' },
              { label: 'Payment Review Queue', route: '/payment-review', icon: '🔍' },
              { label: 'Certified Statements', route: '/statements', icon: '📄', badge: 'PDF' },
              { label: 'Enterprise Ledger', route: '/ledger', icon: '📑' }
            ]
          },
          {
            title: 'LOANS & COLLECTIONS',
            items: [
              { label: 'Loan Inquiries', route: '/loans', icon: '📁' },
              { label: 'Loan Origination Pipeline', route: '/loan-origination', icon: '📋' },
              { label: 'Credit Risk Bureau', route: '/credit-check', icon: '📊' },
              { label: 'EMI Calculator', route: '/emi-calculator', icon: '🧮' },
              { label: 'Record Collections', route: '/loans/collections', icon: '💳' }
            ]
          },
          {
            title: 'COMPLIANCE & LOGS',
            items: [
              { label: 'Document OCR Scanner', route: '/document-ocr', icon: '🪪' },
              { label: 'KYC Verification Audit', route: '/verification-summary', icon: '✅' },
              { label: 'Customer Notifications', route: '/notifications', icon: '🔔' },
              { label: 'Audit Trail (View)', route: '/audit', icon: '📋' }
            ]
          }
        ];

      case 'LOAN_OFFICER':
        return [
          {
            title: 'LOAN DESK',
            items: [
              { label: 'Loan Officer Dashboard', route: '/dashboard', icon: '📈' },
              { label: 'Origination Pipeline', route: '/loan-origination', icon: '📋' },
              { label: 'Loan Applications', route: '/applications', icon: '📝' }
            ]
          },
          {
            title: 'CREDIT & UNDERWRITING',
            items: [
              { label: 'Loan Servicing Desk', route: '/loans', icon: '📁' },
              { label: 'Credit Bureau Check', route: '/credit-check', icon: '📊' },
              { label: 'EMI Calculator & Amortization', route: '/emi-calculator', icon: '🧮' },
              { label: 'Disbursement Engine', route: '/loans/disbursement', icon: '💸' },
              { label: 'Collections Recovery', route: '/loans/collections', icon: '💳' }
            ]
          },
          {
            title: 'RISK & EVALUATION',
            items: [
              { label: 'Applicant Risk Engine', route: '/risk', icon: '🧠', badge: 'AI' },
              { label: 'KYC Verification Status', route: '/verification-summary', icon: '✅' }
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
              { label: 'Fraud Dashboard', route: '/dashboard', icon: '🚨' },
              { label: 'Transaction Anomaly Matrix', route: '/fraud-detection', icon: '🚨', badge: 'ALERT' },
              { label: 'Payment Fraud Rules', route: '/fraud-check', icon: '🛡️' }
            ]
          },
          {
            title: 'INVESTIGATION & AML',
            items: [
              { label: 'AI Risk Engine', route: '/risk', icon: '🧠', badge: 'AI' },
              { label: 'Face Match Accuracy', route: '/face-match', icon: '🧑' },
              { label: 'AI Liveness Detection', route: '/liveness-detection', icon: '📹' },
              { label: 'KYC Verification Audit', route: '/verification-summary', icon: '✅' },
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
              { label: 'Auditor Dashboard (Read-Only)', route: '/dashboard', icon: '🛡️' },
              { label: 'Balance Accuracy & Drift', route: '/balance-accuracy', icon: '⚖️' },
              { label: 'Transaction Explorer', route: '/transactions', icon: '🔄' },
              { label: 'Full System Audit Trail', route: '/audit', icon: '📋' }
            ]
          },
          {
            title: 'AUDIT & COMPLIANCE',
            items: [
              { label: 'Certified Statements', route: '/statements', icon: '📄', badge: 'PDF' },
              { label: 'Enterprise Ledger', route: '/ledger', icon: '📑' },
              { label: 'Risk Assessments', route: '/risk', icon: '🧠', badge: 'AI' },
              { label: 'Fraud Incidents', route: '/fraud-detection', icon: '🚨' },
              { label: 'KYC Verification Summary', route: '/verification-summary', icon: '✅' },
              { label: 'Settlement Clearing', route: '/settlement', icon: '⚖️' },
              { label: 'Loan Portfolio Records', route: '/loans', icon: '📁' }
            ]
          }
        ];

      case 'ADMIN':
      default:
        return [
          {
            title: 'OVERVIEW & COMMAND',
            items: [
              { label: 'Executive Dashboard', route: '/dashboard', icon: '📊' },
              { label: 'Core Operations', route: '/core-dashboard', icon: '⚡' }
            ]
          },
          {
            title: 'CORE BANKING (M1)',
            items: [
              { label: 'Accounts & Lifecycle', route: '/accounts', icon: '🏦' },
              { label: 'Open New Account', route: '/open-account', icon: '➕' },
              { label: 'Balance Accuracy & Drift', route: '/balance-accuracy', icon: '⚖️' },
              { label: 'Balance Management', route: '/balance', icon: '💰' },
              { label: 'Instant Fund Transfer', route: '/fund-transfer', icon: '💸' },
              { label: 'Transactions Explorer', route: '/transactions', icon: '🔄' },
              { label: 'Statements & Export', route: '/statements', icon: '📄', badge: 'PDF' },
              { label: 'Enterprise Ledger', route: '/ledger', icon: '📑' }
            ]
          },
          {
            title: 'LOAN PORTAL (M2)',
            items: [
              { label: 'Loan Servicing', route: '/loans', icon: '📁' },
              { label: 'Origination Pipeline', route: '/loan-origination', icon: '📋' },
              { label: 'Credit Risk Bureau', route: '/credit-check', icon: '📊' },
              { label: 'EMI Calculator', route: '/emi-calculator', icon: '🧮' },
              { label: 'Loan Disbursement', route: '/loans/disbursement', icon: '💸' },
              { label: 'Collections & Overdue', route: '/loans/collections', icon: '💳' }
            ]
          },
          {
            title: 'PAYMENTS & CLEARING (M3)',
            items: [
              { label: 'Payment Initiation', route: '/payment-initiation', icon: '💳' },
              { label: 'Payment Review Queue', route: '/payment-review', icon: '🔍' },
              { label: 'Beneficiary Verification', route: '/beneficiary-verification', icon: '🤝' },
              { label: 'Interbank Payments', route: '/payments', icon: '🔄' },
              { label: 'Settlement Engine', route: '/settlement', icon: '⚖️' },
              { label: 'Notification Service', route: '/notifications', icon: '🔔' },
              { label: 'Real-Time Fraud Matrix', route: '/fraud-detection', icon: '🚨' },
              { label: 'Payment Fraud Rules', route: '/fraud-check', icon: '🛡️' }
            ]
          },
          {
            title: 'SECURITY & AI KYC (M4)',
            items: [
              { label: 'Biometric Face Liveness', route: '/liveness', icon: '🛡️', badge: 'AI' },
              { label: 'Document OCR Scanner', route: '/document-ocr', icon: '🪪', badge: 'AI' },
              { label: 'AI Webcam Liveness', route: '/liveness-detection', icon: '📹' },
              { label: 'Face Match Accuracy', route: '/face-match', icon: '🧑' },
              { label: 'KYC Verification Summary', route: '/verification-summary', icon: '✅' },
              { label: 'AI Risk Assessment', route: '/risk', icon: '🧠', badge: 'AI' },
              { label: 'System Audit Trail', route: '/audit', icon: '📋' }
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
