import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BankingService } from '../../core/services/banking.service';
import { Transaction, TransactionStatus } from '../../core/models/banking.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  // Filter state
  searchQuery = '';
  selectedStatus: string = 'ALL';
  selectedChannel: string = 'ALL';

  // Active chart tabs
  activeVolumeChannel: 'ALL' | 'UPI' | 'IMPS' | 'NEFT' = 'ALL';

  // KPI Metrics
  kpis = [
    {
      title: 'Total Customers',
      value: '2.4M+',
      trend: '+8.4%',
      trendUp: true,
      subtext: 'this month',
      icon: 'users',
      bgClass: 'blue'
    },
    {
      title: 'Active Accounts',
      value: '3.1M',
      trend: '+5.2%',
      trendUp: true,
      subtext: 'across 420 branches',
      icon: 'accounts',
      bgClass: 'emerald'
    },
    {
      title: 'Total Deposits',
      value: '₹18,240 Cr',
      trend: '+11.8%',
      trendUp: true,
      subtext: 'CASA Ratio: 44.2%',
      icon: 'vault',
      bgClass: 'indigo'
    },
    {
      title: 'Transactions Today',
      value: '8.4M',
      trend: '+12.7%',
      trendUp: true,
      subtext: 'Peak: 4,650 TPS',
      icon: 'transfer',
      bgClass: 'cyan'
    },
    {
      title: 'Active Loans',
      value: '745K',
      trend: '+3.1%',
      trendUp: true,
      subtext: 'NPA Ratio: 1.18%',
      icon: 'loans',
      bgClass: 'amber'
    },
    {
      title: 'Payments Today',
      value: '₹2,840 Cr',
      trend: '-2.1% fail',
      trendUp: true,
      subtext: 'Success: 99.82%',
      icon: 'payments',
      bgClass: 'emerald'
    }
  ];

  // Transaction Volume chart data points (UPI, IMPS, NEFT, Internal)
  chartData = [
    { label: '06:00', upi: 320, imps: 180, neft: 90, total: 590 },
    { label: '08:00', upi: 680, imps: 340, neft: 210, total: 1230 },
    { label: '10:00', upi: 1420, imps: 820, neft: 650, total: 2890 },
    { label: '12:00', upi: 1890, imps: 940, neft: 890, total: 3720 },
    { label: '14:00', upi: 1650, imps: 870, neft: 720, total: 3240 },
    { label: '16:00', upi: 2100, imps: 1150, neft: 980, total: 4230 },
    { label: '18:00', upi: 2450, imps: 1240, neft: 450, total: 4140 },
    { label: '20:00', upi: 1980, imps: 890, neft: 180, total: 3050 }
  ];

  ngOnInit() {
    this.banking.getTransactions().subscribe(txns => {
      this.transactions = txns;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch = !this.searchQuery ||
        t.transactionId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.referenceNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.accountNumber.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.selectedStatus === 'ALL' || t.status === this.selectedStatus;
      const matchesChannel = this.selectedChannel === 'ALL' || t.channel === this.selectedChannel;

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }

  exportData() {
    this.toast.success('Data Exported', 'Downloaded latest 500 transaction records as CSV');
  }
}
