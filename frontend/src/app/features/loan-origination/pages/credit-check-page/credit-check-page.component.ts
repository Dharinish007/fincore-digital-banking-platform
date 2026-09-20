import { Component, OnInit } from '@angular/core';

interface CreditRecord {
  creditCheckId: number;
  loanId: string;
  customerName: string;
  creditScore: number;
  monthlyIncome: number;
  existingLoans: number;
  creditStatus: 'Pass' | 'Review' | 'Fail';
  remarks: string;
  checkedAt: string;
}

@Component({
  selector: 'app-credit-check-page',
  standalone: false,
  templateUrl: './credit-check-page.component.html',
  styleUrls: ['./credit-check-page.component.scss']
})
export class CreditCheckPageComponent implements OnInit {
  totalApplications = 12;
  totalLoanAmount = 6862000;
  needsReview = 8;
  approvalRate = 33.3;

  startDate = '';
  endDate = '';
  loanType = 'All';
  creditStatus = 'All';
  applicationStatus = 'All';
  searchCustomer = '';
  searchLoanId = '';

  allRecords: CreditRecord[] = [
    { creditCheckId: 2000, loanId: 'LN1000', customerName: 'Sneha Patel',   creditScore: 601, monthlyIncome: 44000, existingLoans: 0, creditStatus: 'Pass',   remarks: 'Meets standard lending criteria',       checkedAt: '2026-08-30' },
    { creditCheckId: 2001, loanId: 'LN1001', customerName: 'Rahul Mehta',   creditScore: 688, monthlyIncome: 90500, existingLoans: 1, creditStatus: 'Review', remarks: 'Requires manual underwriting review',    checkedAt: '2026-07-01' },
    { creditCheckId: 2002, loanId: 'LN1002', customerName: 'Priya Nair',    creditScore: 835, monthlyIncome: 38000, existingLoans: 2, creditStatus: 'Fail',   remarks: 'High existing debt-to-income ratio',   checkedAt: '2026-07-02' },
    { creditCheckId: 2003, loanId: 'LN1003', customerName: 'Marcus Chen',   creditScore: 648, monthlyIncome: 39500, existingLoans: 3, creditStatus: 'Pass',   remarks: 'Meets standard lending criteria',       checkedAt: '2026-07-03' },
    { creditCheckId: 2004, loanId: 'LN1004', customerName: 'Aisha Kumar',   creditScore: 720, monthlyIncome: 62000, existingLoans: 1, creditStatus: 'Pass',   remarks: 'Strong credit profile',                 checkedAt: '2026-07-04' },
    { creditCheckId: 2005, loanId: 'LN1005', customerName: 'David Rajan',   creditScore: 550, monthlyIncome: 28000, existingLoans: 4, creditStatus: 'Fail',   remarks: 'Credit score below threshold',          checkedAt: '2026-07-05' },
    { creditCheckId: 2006, loanId: 'LN1006', customerName: 'Meera Singh',   creditScore: 790, monthlyIncome: 85000, existingLoans: 0, creditStatus: 'Pass',   remarks: 'Excellent credit standing',             checkedAt: '2026-07-06' },
    { creditCheckId: 2007, loanId: 'LN1007', customerName: 'John Thomas',   creditScore: 660, monthlyIncome: 47000, existingLoans: 2, creditStatus: 'Review', remarks: 'Manual review needed for documentation', checkedAt: '2026-07-07' },
    { creditCheckId: 2008, loanId: 'LN1008', customerName: 'Fatima Banu',   creditScore: 710, monthlyIncome: 55000, existingLoans: 1, creditStatus: 'Pass',   remarks: 'Meets standard lending criteria',       checkedAt: '2026-07-08' },
    { creditCheckId: 2009, loanId: 'LN1009', customerName: 'Rohan Desai',   creditScore: 580, monthlyIncome: 33000, existingLoans: 3, creditStatus: 'Review', remarks: 'Borderline DTI ratio',                   checkedAt: '2026-07-09' },
    { creditCheckId: 2010, loanId: 'LN1010', customerName: 'Sunita Verma',  creditScore: 810, monthlyIncome: 92000, existingLoans: 0, creditStatus: 'Pass',   remarks: 'Strong financials – auto approved',     checkedAt: '2026-07-10' },
    { creditCheckId: 2011, loanId: 'LN1011', customerName: 'Kevin Mathew',  creditScore: 490, monthlyIncome: 21000, existingLoans: 5, creditStatus: 'Fail',   remarks: 'Multiple delinquencies detected',       checkedAt: '2026-07-11' },
  ];

  filteredRecords: CreditRecord[] = [];

  ngOnInit(): void {
    this.filteredRecords = [...this.allRecords];
  }

  onSearch(): void {
    this.filteredRecords = this.allRecords.filter(r => {
      const matchCustomer = !this.searchCustomer || r.customerName.toLowerCase().includes(this.searchCustomer.toLowerCase());
      const matchLoanId   = !this.searchLoanId   || r.loanId.toLowerCase().includes(this.searchLoanId.toLowerCase());
      const matchStatus   = this.creditStatus === 'All' || r.creditStatus === this.creditStatus;
      return matchCustomer && matchLoanId && matchStatus;
    });
  }

  onReset(): void {
    this.startDate = '';
    this.endDate = '';
    this.loanType = 'All';
    this.creditStatus = 'All';
    this.applicationStatus = 'All';
    this.searchCustomer = '';
    this.searchLoanId = '';
    this.filteredRecords = [...this.allRecords];
  }

  onRefresh(): void {
    this.filteredRecords = [...this.allRecords];
  }

  onApprove(record: CreditRecord): void {
    record.creditStatus = 'Pass';
  }

  onReject(record: CreditRecord): void {
    record.creditStatus = 'Fail';
  }

  formatIndianCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }
}
