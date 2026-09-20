import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  active?: boolean;
  badge?: string;
  exact?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() collapsed = false;

  public sections: NavSection[] = [
    {
      title: 'Overview & Command',
      items: [
        { label: 'Executive Dashboard', icon: 'dashboard', route: '/dashboard' },
        { label: 'Core Dashboard', icon: 'analytics', route: '/core-dashboard' },
      ],
    },
    {
      title: 'Core Banking & Accounts',
      items: [
        { label: 'Account Lifecycle', icon: 'manage_accounts', route: '/accounts' },
        { label: 'Open New Account', icon: 'account_balance_wallet', route: '/open-account' },
        { label: 'Balance Accuracy & Drift', icon: 'fact_check', route: '/balance-accuracy' },
        { label: 'Balance Adjustments', icon: 'account_balance', route: '/balance' },
        { label: 'General Ledger', icon: 'menu_book', route: '/ledger' },
        { label: 'Statements & Exports', icon: 'receipt_long', route: '/statements' },
      ],
    },
    {
      title: 'Transactions & Transfers',
      items: [
        { label: 'Instant Transfer', icon: 'send', route: '/fund-transfer' },
        { label: 'Transactions Explorer', icon: 'swap_horiz', route: '/transactions', exact: true },
        { label: 'Transaction History', icon: 'history', route: '/transactions/history' },
      ],
    },
    {
      title: 'Payments & Settlement',
      items: [
        { label: 'Payment Initiation', icon: 'payments', route: '/payment-initiation' },
        { label: 'Payment Review Queue', icon: 'rate_review', route: '/payment-review' },
        { label: 'Beneficiary Verification', icon: 'verified_user', route: '/beneficiary-verification' },
        { label: 'Interbank Settlement', icon: 'sync_alt', route: '/settlement' },
      ],
    },
    {
      title: 'Lending & Credit Suite',
      items: [
        { label: 'Loan Servicing', icon: 'credit_card', route: '/loans', exact: true },
        { label: 'Loan Origination Pipeline', icon: 'assignment', route: '/loan-origination', exact: true },
        { label: 'New Loan Application', icon: 'post_add', route: '/loan-origination/loan-application' },
        { label: 'Credit Risk Bureau', icon: 'assessment', route: '/credit-check' },
        { label: 'EMI Amortization Calc', icon: 'calculate', route: '/emi-calculator' },
        { label: 'Disbursement Queue', icon: 'outbox', route: '/loans/disbursement' },
        { label: 'Collections & Overdue', icon: 'monetization_on', route: '/loans/collections' },
      ],
    },
    {
      title: 'Fraud & Risk Management',
      items: [
        { label: 'Real-Time Fraud Matrix', icon: 'security', route: '/fraud-detection' },
        { label: 'Payment Fraud Rules', icon: 'shield', route: '/fraud-check' },
        { label: 'Risk Assessment Engine', icon: 'trending_up', route: '/risk' },
      ],
    },
    {
      title: 'Identity & AI KYC Suite',
      items: [
        { label: 'Biometric Face Liveness', icon: 'camera_front', route: '/liveness' },
        { label: 'Document OCR Scanner', icon: 'badge', route: '/document-ocr' },
        { label: 'AI Webcam Liveness', icon: 'videocam', route: '/liveness-detection' },
        { label: 'Face Match Accuracy', icon: 'face', route: '/face-match' },
        { label: 'KYC Verification Summary', icon: 'assignment_turned_in', route: '/verification-summary' },
      ],
    },
    {
      title: 'System & Governance',
      items: [
        { label: 'Notifications Dispatch', icon: 'notifications', route: '/notifications' },
        { label: 'Immutable Audit Trail', icon: 'history_edu', route: '/audit' },
        { label: 'Platform Settings', icon: 'settings', route: '/settings' },
      ],
    },
  ];

  get navItems(): NavItem[] {
    return this.sections.flatMap((s) => s.items);
  }
}
