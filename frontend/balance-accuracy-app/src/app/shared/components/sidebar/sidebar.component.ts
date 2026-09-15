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
      title: 'Core Banking',
      items: [
        { label: 'Balance Accuracy', icon: 'fact_check', route: '/balance-accuracy' },
        { label: 'Account Creation', icon: 'account_balance_wallet', route: '/accounts' },
        { label: 'Fund Transfer', icon: 'send', route: '/fund-transfer' },
        { label: 'Transaction Ledger', icon: 'receipt_long', route: '/transactions' },
      ],
    },
    {
      title: 'Payments & Transfers',
      items: [
        { label: 'Payment Initiation', icon: 'payments', route: '/payment-initiation' },
        { label: 'Payment Review', icon: 'rate_review', route: '/payment-review' },
        { label: 'Beneficiary Verification', icon: 'verified_user', route: '/beneficiary-verification' },
        { label: 'Fraud Screening', icon: 'shield', route: '/fraud-check' },
      ],
    },
    {
      title: 'Loans & Credit',
      items: [
        { label: 'Loan Origination', icon: 'assignment', route: '/loan-origination', exact: true },
        { label: 'New Loan Application', icon: 'post_add', route: '/loan-origination/loan-application' },
        { label: 'Credit Risk Check', icon: 'assessment', route: '/credit-check' },
        { label: 'EMI Calculator', icon: 'calculate', route: '/emi-calculator' },
      ],
    },
    {
      title: 'KYC & Identity Suite',
      items: [
        { label: 'Document OCR', icon: 'badge', route: '/document-ocr' },
        { label: 'Liveness Detection', icon: 'videocam', route: '/liveness-detection' },
        { label: 'Face Match Accuracy', icon: 'face', route: '/face-match' },
        { label: 'Verification Summary', icon: 'assignment_turned_in', route: '/verification-summary' },
      ],
    },
  ];

  get navItems(): NavItem[] {
    return this.sections.flatMap((s) => s.items);
  }
}
