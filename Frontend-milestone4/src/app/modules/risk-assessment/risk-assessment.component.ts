import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RiskAssessment } from '../../models/risk.model';

@Component({
  selector: 'app-risk-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.css']
})
export class RiskAssessmentComponent implements OnInit {
  // Input fields
  customerId: string = 'CUS1001';
  transactionId: string = 'TXN5001';
  amount: number = 50000;
  transactionType: string = 'Fund Transfer';
  accountType: string = 'Savings';
  hasPreviousHistory: boolean = true;
  isCustomerVerified: boolean = true;

  // Transaction options
  transactionTypes: string[] = [
    'Fund Transfer',
    'International Wire',
    'Bill Payment',
    'ATM Withdrawal',
    'Crypto Exchange'
  ];

  accountTypes: string[] = ['Savings', 'Current', 'Business', 'NRE / NRO'];

  // Current assessment state
  currentAssessment: RiskAssessment | null = null;
  isAssessed: boolean = false;
  isEvaluating: boolean = false;

  // Historical assessments storage
  assessmentHistory: RiskAssessment[] = [];
  showHistoryModal: boolean = false;

  ngOnInit(): void {
    // Populate mock initial assessment matching prompt example
    this.currentAssessment = {
      customerId: 'CUS1001',
      transactionId: 'TXN5001',
      amount: 50000,
      transactionType: 'Fund Transfer',
      accountType: 'Savings',
      riskScore: 25,
      riskLevel: 'LOW',
      status: 'APPROVED',
      riskFactors: [
        '✓ Verified customer identity',
        '✓ Normal transaction amount within threshold',
        '✓ Consistent transaction history'
      ],
      assessedAt: new Date().toLocaleString(),
      hasPreviousHistory: true,
      isCustomerVerified: true
    };
    this.isAssessed = true;
    this.assessmentHistory.push({ ...this.currentAssessment });
  }

  assessRisk(): void {
    this.isEvaluating = true;

    setTimeout(() => {
      let score = 15; // baseline low risk
      const factors: string[] = [];

      // Customer Verification Factor
      if (this.isCustomerVerified) {
        factors.push('✓ Verified customer identity');
      } else {
        score += 35;
        factors.push('⚠️ Unverified or incomplete customer KYC');
      }

      // Amount Rules
      if (this.amount > 500000) {
        score += 45;
        factors.push('⚠️ High amount transaction exceeding ₹5,00,000 threshold');
      } else if (this.amount > 100000) {
        score += 20;
        factors.push('⚠️ Moderate transaction size');
      } else {
        factors.push('✓ Normal transaction amount');
      }

      // Transaction Type Rules
      if (this.transactionType === 'International Wire' || this.transactionType === 'Crypto Exchange') {
        score += 30;
        factors.push('⚠️ Cross-border or high-volatility transaction type');
      } else {
        factors.push('✓ Standard domestic transfer channel');
      }

      // Account History
      if (this.hasPreviousHistory) {
        factors.push('✓ Active account with consistent transaction history');
      } else {
        score += 25;
        factors.push('⚠️ New account with no prior transaction history');
      }

      // Determine level & status
      let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      let status: 'APPROVED' | 'FLAGGED' | 'REJECTED' | 'UNDER_REVIEW' = 'APPROVED';

      if (score >= 70) {
        level = 'HIGH';
        status = 'FLAGGED';
      } else if (score >= 40) {
        level = 'MEDIUM';
        status = 'UNDER_REVIEW';
      } else {
        level = 'LOW';
        status = 'APPROVED';
      }

      this.currentAssessment = {
        customerId: this.customerId || 'CUS1001',
        transactionId: this.transactionId || ('TXN' + Math.floor(1000 + Math.random() * 9000)),
        amount: this.amount,
        transactionType: this.transactionType,
        accountType: this.accountType,
        riskScore: score,
        riskLevel: level,
        status: status,
        riskFactors: factors,
        assessedAt: new Date().toLocaleString(),
        hasPreviousHistory: this.hasPreviousHistory,
        isCustomerVerified: this.isCustomerVerified
      };

      this.assessmentHistory.unshift({ ...this.currentAssessment });
      this.isAssessed = true;
      this.isEvaluating = false;
    }, 600);
  }

  generateNewTxnId(): void {
    this.transactionId = 'TXN' + Math.floor(5000 + Math.random() * 4000);
  }

  toggleHistory(): void {
    this.showHistoryModal = !this.showHistoryModal;
  }
}
