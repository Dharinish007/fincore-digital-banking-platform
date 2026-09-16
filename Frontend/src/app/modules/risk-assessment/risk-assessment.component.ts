import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface RiskAssessment {
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
  employmentStatus?: string;
  loanOutstanding?: number;
  loanCount?: number;
  previousTransactionCount?: number;
  reasons?: string;
  aiAnalysis?: string;
  transactionHistory?: string;
  assessedAt?: string;
}

export interface RiskAssessmentResult {
  id?: number;
  customerId: number;
  customerName?: string;
  transactionId?: number;
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

export interface TransactionRiskOption {
  transactionId: number;
  customerId: number | null;
  amount: number;
  transactionType?: string;
  status: string;
  createdAt: string;
}

export interface CustomerOption {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  accountNumber?: string;
}

import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-risk-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './risk-assessment.component.html',
  styleUrl: './risk-assessment.component.css'
})
export class RiskAssessmentComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly accountService = inject(AccountService);

  transactions: any[] = [];
  riskAssessments: RiskAssessment[] = [];
  riskTransactions: TransactionRiskOption[] = [];
  customers: CustomerOption[] = [];
  selectedTransactionId: number | null = null;
  assessmentResult: RiskAssessmentResult | null = null;
  loadingAssessment = false;
  loadingTransactions = false;

  // Modals & UI State
  showCreateCustomerModal = false;
  showCreateTransactionModal = false;
  showCustomAssessModal = false;
  activeTab: 'transactions' | 'history' | 'custom' = 'transactions';

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  // Assessment Form Data
  riskForm = {
    customerId: null as number | null,
    amount: null as number | null,
    transactionType: 'FUND_TRANSFER',
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
    transactionPattern: 'REGULAR',
    depositFrequency: 'MONTHLY'
  };

  // New Customer & Account Form
  newCustomer = {
    customerId: null as number | null,
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '1995-08-15',
    accountType: 'SAVINGS',
    initialBalance: 75000,
    annualIncome: 1200000,
    employmentStatus: 'SALARIED'
  };

  // New Transaction Form
  newTransaction = {
    customerId: 1,
    amount: 50000,
    type: 'FUND_TRANSFER',
    status: 'SUCCESS',
    description: 'Direct interbank settlement transfer'
  };

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.loadTransactions();
    this.loadCustomers();
    this.loadRiskAssessmentResults();
  }

  loadCustomers(): void {
    this.api.get<CustomerOption[]>('/api/operations/customers').subscribe({
      next: data => {
        this.customers = data || [];
        if (this.customers.length > 0 && !this.newTransaction.customerId) {
          this.newTransaction.customerId = this.customers[0].id;
        }
      },
      error: () => console.warn('Could not load customers')
    });
  }

  loadRiskAssessmentResults(): void {
    this.api.get<RiskAssessment[]>('/api/risk-assessments').subscribe({
      next: assessments => {
        this.riskAssessments = this.completedAssessments(assessments);
        if (!this.assessmentResult && this.riskAssessments.length > 0) {
          this.assessmentResult = this.riskAssessments[0] as RiskAssessmentResult;
        }
      },
      error: () => console.warn('Saved risk assessment results could not be loaded.')
    });
  }

  loadTransactions(): void {
    this.loadingTransactions = true;
    this.api.get<TransactionRiskOption[]>('/api/risk/transactions').subscribe({
      next: transactions => {
        this.loadingTransactions = false;
        this.riskTransactions = transactions || [];
        this.transactions = this.riskTransactions.map(t => ({ id: t.transactionId, amount: t.amount }));
        if (this.riskTransactions.length > 0 && !this.selectedTransactionId) {
          this.selectRiskTransaction(this.riskTransactions[0]);
        }
      },
      error: () => {
        this.loadingTransactions = false;
        this.showToast('Database transactions could not be loaded.', 'danger');
      }
    });
  }

  selectRiskTransaction(transaction: TransactionRiskOption): void {
    this.selectedTransactionId = transaction.transactionId;
    this.riskForm.customerId = transaction.customerId || 1;
    this.riskForm.amount = transaction.amount;
    this.riskForm.transactionType = transaction.transactionType || 'FUND_TRANSFER';
    this.riskForm.internationalTransaction = (transaction.transactionType === 'INTERNATIONAL_WIRE');
    
    // Auto calculate risk for this transaction
    this.assessRisk();
  }

  assessRisk(): void {
    const form = this.riskForm;
    if (!form.customerId || !form.amount || form.amount <= 0 || !form.transactionType) {
      this.showToast('Please specify valid transaction details before assessing risk.', 'danger');
      return;
    }
    this.loadingAssessment = true;
    this.api.post<RiskAssessmentResult>('/api/risk/assess', {
      ...form,
      transactionId: this.selectedTransactionId
    }).subscribe({
      next: result => {
        this.loadingAssessment = false;
        this.assessmentResult = result;
        this.riskAssessments = [result, ...this.completedAssessments(this.riskAssessments.filter(a => a.id !== result.id))];
        const severity = result.riskLevel === 'LOW' ? 'success' : (result.riskLevel === 'MEDIUM' ? 'info' : 'danger');
        this.showToast(`Risk Assessment Completed: ${result.decision} • Score: ${result.riskScore}/100 (${result.riskLevel})`, severity);
      },
      error: response => {
        this.loadingAssessment = false;
        this.showToast(response.error?.message || 'Risk assessment calculation failed.', 'danger');
      }
    });
  }

  createCustomerAndAccount(): void {
    const cust = this.newCustomer;
    if (!cust.fullName.trim() || !cust.email.trim() || !cust.phoneNumber.trim()) {
      this.showToast('Please enter customer full name, email and phone number.', 'danger');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const accNo = `ACC-8849-${randomSuffix}`;

    this.api.post<any>('/api/operations/customers', {
      customerId: cust.customerId || null,
      fullName: cust.fullName.trim(),
      email: cust.email.trim(),
      phoneNumber: cust.phoneNumber.trim(),
      accountNumber: accNo,
      dateOfBirth: cust.dateOfBirth || '1995-08-15'
    }).subscribe({
      next: createdCust => {
        const custId = createdCust?.id || cust.customerId || 1;
        this.api.post('/api/operations/accounts', {
          accountNumber: accNo,
          customerId: custId,
          accountType: cust.accountType,
          initialBalance: cust.initialBalance,
          status: 'ACTIVE'
        }).subscribe({
          next: () => {
            this.showToast(`Customer "${cust.fullName}" & Account ${accNo} created successfully!`, 'success');
            this.showCreateCustomerModal = false;
            this.loadCustomers();
            this.accountService.loadFromBackend();
            
            // Set as selected customer for transaction creation
            this.newTransaction.customerId = custId;
            
            // Reset form
            this.newCustomer = {
              customerId: null,
              fullName: '',
              email: '',
              phoneNumber: '',
              dateOfBirth: '1995-08-15',
              accountType: 'SAVINGS',
              initialBalance: 75000,
              annualIncome: 1200000,
              employmentStatus: 'SALARIED'
            };
          },
          error: () => this.showToast('Customer created, but account creation failed.', 'danger')
        });
      },
      error: err => this.showToast(err.error?.message || 'Failed to create customer.', 'danger')
    });
  }

  createTransaction(): void {
    const txn = this.newTransaction;
    if (!txn.customerId || !txn.amount || txn.amount <= 0) {
      this.showToast('Please select a customer and enter a positive amount.', 'danger');
      return;
    }

    const ref = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    this.api.post<any>('/api/operations/transactions', {
      customerId: txn.customerId,
      amount: txn.amount,
      type: txn.type,
      status: txn.status,
      transactionReference: ref,
      description: txn.description || `Transaction of ₹${txn.amount} (${txn.type})`
    }).subscribe({
      next: savedTxn => {
        this.showToast(`New Transaction #${savedTxn.id} (${savedTxn.transactionReference}) added to database!`, 'success');
        this.showCreateTransactionModal = false;
        
        // Refresh transactions and automatically select this newly created transaction
        this.api.get<TransactionRiskOption[]>('/api/risk/transactions').subscribe({
          next: transactions => {
            this.riskTransactions = transactions || [];
            this.transactions = this.riskTransactions.map(t => ({ id: t.transactionId, amount: t.amount }));
            const match = this.riskTransactions.find(t => t.transactionId === savedTxn.id);
            if (match) {
              this.selectRiskTransaction(match);
            } else if (this.riskTransactions.length > 0) {
              this.selectRiskTransaction(this.riskTransactions[0]);
            }
          }
        });
      },
      error: err => this.showToast(err.error?.message || 'Failed to add transaction to database.', 'danger')
    });
  }

  selectSavedAssessment(assessment: RiskAssessment): void {
    this.assessmentResult = assessment as RiskAssessmentResult;
    this.selectedTransactionId = assessment.transactionId || null;
    this.activeTab = 'transactions';
    this.showToast(`Loaded assessment result for #${assessment.id} (${assessment.customerName || 'Customer #' + assessment.customerId})`, 'info');
  }

  getCustomerName(customerId?: number | null): string {
    if (!customerId) return 'Unknown Client';
    const c = this.customers.find(item => item.id === customerId);
    return c ? c.fullName : `Customer #${customerId}`;
  }

  riskLevelBadgeClass(level?: string): string {
    if (level === 'LOW') return 'badge-low';
    if (level === 'MEDIUM') return 'badge-medium';
    if (level === 'HIGH') return 'badge-high';
    return 'badge-critical';
  }

  decisionBadgeClass(decision?: string): string {
    if (decision === 'APPROVE' || decision === 'APPROVED') return 'decision-approved';
    if (decision === 'CHALLENGE' || decision === 'UNDER_REVIEW') return 'decision-review';
    if (decision === 'FLAG' || decision === 'FLAGGED') return 'decision-flagged';
    return 'decision-blocked';
  }

  splitReasons(reasons?: string): string[] {
    if (!reasons) return ['No material risk factors detected'];
    return reasons.split('; ').map(s => s.trim()).filter(s => s.length > 0);
  }

  private completedAssessments(assessments: RiskAssessment[]): RiskAssessment[] {
    return (assessments || []).filter(assessment =>
      assessment.id != null &&
      assessment.riskScore != null
    );
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 5000);
  }
}
