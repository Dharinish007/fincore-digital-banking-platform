import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';
import { FraudRecord } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-fraud-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fraud-dashboard.component.html',
  styleUrls: ['./fraud-dashboard.component.scss']
})
export class FraudDashboardComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);

  fraudRecords: FraudRecord[] = [];

  kpis = [
    { title: 'Transactions Scanned', value: '8,421,904', sub: '100% real-time AI scanning', color: 'blue' },
    { title: 'High Risk Flagged', value: '142', sub: 'Triggered risk heuristics', color: 'amber' },
    { title: 'Blocked Instantly', value: '38', sub: 'Zero customer loss occurred', color: 'rose' },
    { title: 'Active Fraud Cases', value: '8', sub: 'Under AML investigator review', color: 'rose' },
    { title: 'Fraud Detection Rate', value: '99.94%', sub: 'False positive rate: 0.04%', color: 'emerald' }
  ];

  ngOnInit() {
    this.banking.getFraudRecords().subscribe(f => {
      this.fraudRecords = f;
    });
  }

  resolveAlert(record: FraudRecord, action: 'Cleared' | 'Blocked') {
    this.banking.resolveFraudAlert(record.fraudId, action).subscribe(() => {
      if (action === 'Blocked') {
        this.toast.error('Transaction Blocked', `Account associated with ${record.customerName} has been frozen.`);
      } else {
        this.toast.success('Alert Cleared', `False positive dismissed for TXN ${record.transactionId}`);
      }
    });
  }
}
