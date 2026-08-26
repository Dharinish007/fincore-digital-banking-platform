import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

export interface PaymentReviewData {
  payment_id: string;
  from_account_no: string;
  beneficiary_name: string;
  to_account_no: string;
  amount: number | string;
  payment_type: string;
  payment_mode: string;
  remarks: string;
  payment_status: 'Pending';
}

@Component({
  selector: 'app-payment-review',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './payment-review.component.html',
  styleUrls: ['./payment-review.component.scss'],
})
export class PaymentReviewComponent implements OnInit {
  sidebarCollapsed = false;

  // Static review data with default sample values matching the specified example
  reviewData: PaymentReviewData = {
    payment_id: 'PAY-9002',
    from_account_no: 'XXXX1234',
    beneficiary_name: 'TechCorp Solutions',
    to_account_no: 'XXXX5678',
    amount: 950000,
    payment_type: 'Vendor Payment',
    payment_mode: 'NEFT',
    remarks: 'Monthly payment',
    payment_status: 'Pending',
  };

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state && nav.extras.state['payment']) {
      const p = nav.extras.state['payment'];
      this.reviewData = {
        payment_id: p.payment_id ? (String(p.payment_id).startsWith('PAY-') ? p.payment_id : `PAY-${p.payment_id}`) : 'PAY-9002',
        from_account_no: p.from_account_no || 'XXXX1234',
        beneficiary_name: p.beneficiary_name || 'TechCorp Solutions',
        to_account_no: p.to_account_no || 'XXXX5678',
        amount: p.amount ?? 950000,
        payment_type: p.payment_type || 'Vendor Payment',
        payment_mode: p.payment_mode || 'NEFT',
        remarks: p.description || p.remarks || 'Monthly payment',
        payment_status: 'Pending',
      };
    }
  }

  ngOnInit(): void {
    if (typeof history !== 'undefined' && history.state && history.state.payment) {
      const p = history.state.payment;
      this.reviewData = {
        payment_id: p.payment_id ? (String(p.payment_id).startsWith('PAY-') ? p.payment_id : `PAY-${p.payment_id}`) : 'PAY-9002',
        from_account_no: p.from_account_no || 'XXXX1234',
        beneficiary_name: p.beneficiary_name || 'TechCorp Solutions',
        to_account_no: p.to_account_no || 'XXXX5678',
        amount: p.amount ?? 950000,
        payment_type: p.payment_type || 'Vendor Payment',
        payment_mode: p.payment_mode || 'NEFT',
        remarks: p.description || p.remarks || 'Monthly payment',
        payment_status: 'Pending',
      };
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
