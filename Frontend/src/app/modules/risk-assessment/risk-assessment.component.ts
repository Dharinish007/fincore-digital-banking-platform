import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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
  selector: 'app-risk-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './risk-assessment.component.html',
  styleUrl: './risk-assessment.component.css'
})
export class RiskAssessmentComponent implements OnInit {
  private readonly api = inject(ApiService);

  transactions: any[] = [];
  riskAssessments: RiskAssessment[] = [];
  selectedTransactionId: number | null = null;

  // Toast & Modal State
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

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
      },
      error: () => {
        this.showToast('The five database transactions could not be loaded.', 'danger');
      }
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

  get averageRiskScore(): string {
    if (this.riskAssessments.length === 0) return '0';
    const scores = this.riskAssessments
      .map(assessment => assessment.riskScore)
      .filter((score): score is number => score !== null);
    if (scores.length === 0) return '0';
    const total = scores.reduce((sum, score) => sum + score, 0);
    return (total / scores.length).toFixed(1);
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
