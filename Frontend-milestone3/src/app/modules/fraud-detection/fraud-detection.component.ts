import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface FraudAlert {
  id: string;
  customerName: string;
  riskScore: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  triggerReason: string;
  amount: number;
  timestamp: string;
  status: string;
  location?: string;
  deviceIp?: string;
}

@Component({
  selector: 'app-fraud-detection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fraud-detection.component.html',
  styleUrl: './fraud-detection.component.css'
})
export class FraudDetectionComponent implements OnInit {
  private readonly api = inject(ApiService);

  recentFraudAlerts: FraudAlert[] = [];
  transactions: any[] = [];
  selectedTransactionId: number | null = null;
  selectedAlert: FraudAlert = {
    id: 'TXN-FRD-0',
    customerName: 'No Data',
    riskScore: 0,
    threatLevel: 'LOW',
    triggerReason: 'No alerts found in database',
    amount: 0,
    timestamp: '',
    status: 'N/A'
  };

  // Search and Filter State
  searchTerm: string = '';
  selectedFilterThreat: string = 'ALL';
  
  // Toast & Modal State
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  scanCustomerName = 'Vikramaditya Rao';
  scanAmount = 250000;
  scanLocation = 'Mumbai, IN';
  scanDeviceIp = '192.168.1.88';
  scanChannel = 'IMPS / UPI Transfer';

  showScanModal = false;
  showRulesModal = false;

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.api.get<any[]>('/api/fraud/transactions').subscribe({
      next: (txns) => {
        this.transactions = txns;
        this.loadFraudEvents();
      },
      error: () => {
        this.showToast('Failed to load transactions from backend.', 'danger');
      }
    });
  }

  loadFraudEvents(): void {
    this.api.get<any[]>('/api/fraud/events').subscribe({
      next: (events) => {
        this.recentFraudAlerts = events.map(event => this.mapEventToAlert(event));
        if (this.recentFraudAlerts.length > 0) {
          this.selectedAlert = { ...this.recentFraudAlerts[0] };
        }
      },
      error: () => {
        this.showToast('Failed to load fraud events from backend.', 'danger');
      }
    });
  }

  mapEventToAlert(event: any): FraudAlert {
    const score = event.fraudScore || 0;
    let threat: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (score >= 90) threat = 'CRITICAL';
    else if (score >= 75) threat = 'HIGH';
    else if (score >= 50) threat = 'MEDIUM';

    const txn = this.transactions.find(t => t.id === event.transactionId);
    const amount = txn ? txn.amount : 0;

    return {
      id: `TXN-FRD-${event.id}`,
      customerName: event.userId === 1 ? 'Alice' : event.userId === 2 ? 'Rahul' : `User #${event.userId}`,
      riskScore: score,
      threatLevel: threat,
      triggerReason: event.reason || 'Standard transaction validation check',
      amount: amount,
      timestamp: event.createdAt ? event.createdAt.replace('T', ' ').substring(0, 19) : '',
      status: event.status,
      location: 'Mumbai, IN',
      deviceIp: '192.168.1.99'
    };
  }

  get filteredAlerts(): FraudAlert[] {
    return this.recentFraudAlerts.filter(alert => {
      const matchesSearch = alert.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            alert.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            alert.triggerReason.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesThreat = this.selectedFilterThreat === 'ALL' || alert.threatLevel === this.selectedFilterThreat;
      return matchesSearch && matchesThreat;
    });
  }

  get highRiskCount(): number {
    return this.recentFraudAlerts.filter(a => a.threatLevel === 'HIGH' || a.threatLevel === 'CRITICAL').length;
  }

  get totalProtectedAmount(): number {
    return this.recentFraudAlerts
      .filter(a => a.status === 'Account Frozen' || a.status === 'Blocked' || a.status === 'BLOCKED')
      .reduce((sum, a) => sum + a.amount, 0);
  }

  selectAlert(alertItem: FraudAlert): void {
    this.selectedAlert = alertItem;
  }

  freezeAccount(): void {
    this.selectedAlert.status = 'Account Frozen';
    const found = this.recentFraudAlerts.find(a => a.id === this.selectedAlert.id);
    if (found) {
      found.status = 'Account Frozen';
    }
    this.showToast(`Account for customer ${this.selectedAlert.customerName} has been immediately frozen via Saga command.`, 'danger');
  }

  dismissAlert(): void {
    this.selectedAlert.status = 'Dismissed (False Positive)';
    const found = this.recentFraudAlerts.find(a => a.id === this.selectedAlert.id);
    if (found) {
      found.status = 'Dismissed';
    }
    this.showToast(`Alert ${this.selectedAlert.id} marked as false positive. Status updated.`, 'info');
  }

  escalateFraud(): void {
    this.selectedAlert.status = 'Escalated (AML Level-3)';
    const found = this.recentFraudAlerts.find(a => a.id === this.selectedAlert.id);
    if (found) {
      found.status = 'Escalated (AML Level-3)';
    }
    this.showToast(`Alert ${this.selectedAlert.id} escalated to Level-3 Anti-Money Laundering (AML) Compliance Team.`, 'success');
  }

  openScanModal(): void {
    this.showScanModal = true;
    if (this.transactions.length > 0 && !this.selectedTransactionId) {
      this.selectedTransactionId = this.transactions[0].id;
    }
  }

  closeScanModal(): void {
    this.showScanModal = false;
  }

  runScanSimulator(): void {
    if (!this.selectedTransactionId) {
      this.showToast('Please select a valid transaction to scan.', 'danger');
      return;
    }

    this.api.post<any>(`/api/fraud/check/${this.selectedTransactionId}`, {}).subscribe({
      next: (result) => {
        this.closeScanModal();
        this.loadTransactions();
        this.showToast(`Live Scan complete. Risk Score: ${result.score}/100 (${result.status})`, result.status === 'BLOCKED' || result.status === 'UNDER_REVIEW' ? 'danger' : 'success');
      },
      error: () => {
        this.showToast('Failed to run backend scan. Check if transaction was already scanned or is missing.', 'danger');
      }
    });
  }

  openRulesModal(): void {
    this.showRulesModal = true;
  }

  closeRulesModal(): void {
    this.showRulesModal = false;
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 4500);
  }
}
