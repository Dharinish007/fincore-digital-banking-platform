import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DashboardMetric {
  title: string;
  value: string;
  trend: string;
  subtext: string;
}

export interface SystemActivity {
  time: string;
  desc: string;
  category: 'LOAN' | 'FRAUD' | 'SETTLEMENT' | 'KYC';
  type: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  metrics: DashboardMetric[] = [
    { title: 'Total Customers', value: '12.4 Lakh', trend: '+4.2% YoY', subtext: 'Active Retail & Commercial' },
    { title: 'Total Deposits', value: '₹18,600 Cr', trend: '+6.1% YoY', subtext: 'Core Banking Ledger' },
    { title: 'Total Loan Portfolio', value: '₹8,400 Cr', trend: '+2.8% YoY', subtext: '8,47,000 Active Accounts' },
    { title: 'Fraud Prevented YTD', value: '₹1.42 Cr', trend: 'Auto-Blocked', subtext: 'AI Anomaly Engine' }
  ];

  recentActivities: SystemActivity[] = [
    { time: '02 mins ago', desc: 'Home Loan HL-2024-1247 (₹24,00,000) approved & disbursed for John Smith', category: 'LOAN', type: 'Disbursal' },
    { time: '10 mins ago', desc: 'Kafka Event: LoanDisbursedEvent published (Saga ID: SAGA-9082)', category: 'LOAN', type: 'Saga Event' },
    { time: '18 mins ago', desc: 'High risk alert TXN-FRD-9042 (₹2,40,000) flagged by Fraud Engine', category: 'FRAUD', type: 'Risk Alert' },
    { time: '25 mins ago', desc: 'Interbank batch SETTLE-2026-0820 (₹14.2 Cr) netting calculated successfully', category: 'SETTLEMENT', type: 'Netting' },
    { time: '40 mins ago', desc: 'Auto-debit processed for 1,240 active EMI accounts (₹2.29 Cr)', category: 'LOAN', type: 'Auto-Debit' },
    { time: '1 hour ago', desc: 'KYC Verification completed for Customer CUST-58392 (Aadhaar Verified)', category: 'KYC', type: 'KYC Pass' }
  ];

  filterCategory = 'ALL';

  get filteredActivities(): SystemActivity[] {
    if (this.filterCategory === 'ALL') return this.recentActivities;
    return this.recentActivities.filter(a => a.category === this.filterCategory);
  }
}
