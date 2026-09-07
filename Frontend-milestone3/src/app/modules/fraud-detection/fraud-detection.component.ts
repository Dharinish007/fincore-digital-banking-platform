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

interface RiskAssessment {
  id?: number;
  customerId?: number;
  customerName?: string;
  transactionId?: number;
  riskScore: number | null;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision?: string;
  analysisSource?: string;
  amount?: number;
  transactionType?: string;
  location?: string;
  deviceType?: string;
  accountNumber?: string;
  accountType?: string;
  accountBalance?: number;
  annualIncome?: number;
  loanOutstanding?: number;
  loanCount?: number;
  previousTransactionCount?: number;
  reasons?: string;
  aiAnalysis?: string;
  transactionHistory?: string;
  assessedAt?: string;
}

interface RiskAssessmentResult {
  id?: number;
  customerId: number;
  customerName?: string;
  amount: number;
  transactionType: string;
  location: string;
  deviceType: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision: string;
  reasons: string;
  previousTransactionCount: number;
  assessedAt: string;
  annualIncome?: number;
  accountBalance?: number;
  accountType?: string;
  accountNumber?: string;
  employmentStatus?: string;
  loanOutstanding?: number;
  loanCount?: number;
  transactionPattern?: string;
  depositFrequency?: string;
  transactionHistory?: string;
  aiAnalysis?: string;
  aiModel?: string;
  analysisSource?: string;
}

interface TransactionRiskOption {
  transactionId: number;
  customerId: number | null;
  amount: number;
  transactionType?: string;
  status: string;
  createdAt: string;
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
  riskAssessments: RiskAssessment[] = [];
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

  showScanModal = false;
  showRulesModal = false;

  riskForm = {
    customerId: null as number | null,
    amount: null as number | null,
    transactionType: '',
    location: 'DATABASE_TRANSACTION',
    deviceType: 'DATABASE_RECORD',
    internationalTransaction: false,
    newDevice: false,
    failedAttempts: 0,
    unusualBehavior: false,
    annualIncome: null as number | null,
    accountBalance: null as number | null,
    accountType: '',
    accountNumber: '',
    employmentStatus: '',
    loanOutstanding: null as number | null,
    loanCount: 0,
    transactionPattern: '',
    depositFrequency: ''
  };
  assessmentResult: RiskAssessmentResult | null = null;
  riskTransactions: TransactionRiskOption[] = [];
  loadingAssessment = false;

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadRiskAssessmentResults(): void {
    this.api.get<RiskAssessment[]>('/api/risk-assessments').subscribe({
      next: assessments => {
        this.riskAssessments = this.completedAssessments(assessments);
        const latest = this.riskAssessments[0];
        if (latest) {
          this.assessmentResult = latest as RiskAssessmentResult;
        }
        this.showToast(`${this.riskAssessments.length} saved risk assessment result(s) loaded.`, 'success');
      },
      error: () => this.showToast('Saved risk assessment results could not be loaded.', 'danger')
    });
  }

  loadTransactions(): void {
    this.api.get<TransactionRiskOption[]>('/api/risk/transactions').subscribe({
      next: transactions => {
        this.riskTransactions = transactions;
        this.transactions = transactions.map(transaction => ({ id: transaction.transactionId, amount: transaction.amount }));
        if (transactions.length > 0 && !this.selectedTransactionId) {
          this.selectRiskTransaction(transactions[0]);
        }
        this.loadFraudEvents();
      },
      error: () => {
        this.showToast('The five database transactions could not be loaded.', 'danger');
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
    this.api.get<RiskAssessment[]>('/api/risk-assessments').subscribe({
      next: assessments => this.riskAssessments = this.completedAssessments(assessments),
      error: () => this.showToast('Failed to load risk assessments from backend.', 'danger')
    });
  }

  assessRisk(): void {
    const form = this.riskForm;
    if (!this.selectedTransactionId || !form.customerId || !form.amount || form.amount <= 0 || !form.transactionType || !form.location || !form.deviceType) {
      this.showToast('Select a database transaction before assessing risk.', 'danger');
      return;
    }
    this.loadingAssessment = true;
    this.api.post<RiskAssessmentResult>('/api/risk/assess', { ...form, transactionId: this.selectedTransactionId }).subscribe({
      next: result => {
        this.loadingAssessment = false;
        this.assessmentResult = result;
        this.riskAssessments = [result, ...this.completedAssessments(this.riskAssessments)];
        const severity = result.riskLevel === 'LOW' ? 'success' : 'danger';
        this.showToast(`Risk assessment saved: ${result.riskLevel} (${result.riskScore}/100).`, severity);
      },
      error: response => {
        this.loadingAssessment = false;
        this.showToast(response.error?.message || 'Risk assessment could not be saved.', 'danger');
      }
    });
  }

  selectSavedAssessment(assessment: RiskAssessment): void {
    this.assessmentResult = assessment as RiskAssessmentResult;
  }

  selectRiskTransaction(transaction: TransactionRiskOption): void {
    const changedTransaction = this.selectedTransactionId !== transaction.transactionId;
    this.riskForm.customerId = transaction.customerId;
    this.riskForm.amount = transaction.amount;
    this.riskForm.transactionType = transaction.transactionType || 'FUND_TRANSFER';
    this.selectedTransactionId = transaction.transactionId;
    if (changedTransaction) {
      this.assessmentResult = null;
      this.assessRisk();
    }
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

  get averageRiskScore(): string {
    if (this.riskAssessments.length === 0) return '0';
    const scores = this.riskAssessments
      .map(assessment => assessment.riskScore)
      .filter((score): score is number => score !== null);
    if (scores.length === 0) return '0';
    const total = scores.reduce((sum, score) => sum + score, 0);
    return (total / scores.length).toFixed(1);
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

  riskLevelBadgeClass(level?: string): string {
    if (level === 'LOW') return 'approved-badge';
    if (level === 'MEDIUM') return 'warn-badge';
    return 'danger-badge';
  }

  splitReasons(reasons?: string): string[] {
    if (!reasons) return [];
    return reasons.split('; ').map(s => s.trim()).filter(s => s.length > 0);
  }

  private completedAssessments(assessments: RiskAssessment[]): RiskAssessment[] {
    return assessments.filter(assessment =>
      assessment.id != null &&
      assessment.amount != null &&
      assessment.riskScore != null &&
      assessment.riskLevel != null
    );
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