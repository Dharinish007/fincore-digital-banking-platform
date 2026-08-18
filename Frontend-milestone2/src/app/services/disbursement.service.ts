import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoanDetails, DisbursementRequest, DisbursementRecord } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class DisbursementService {
  private loans: LoanDetails[] = [
    {
      loanId: 'LN10001',
      customerId: 'CUST101',
      customerName: 'Ramya Krishnan',
      loanType: 'Home Loan',
      sanctionedAmount: 1000000,
      disbursedAmount: 400000,
      remainingAmount: 600000,
      outstandingPrincipal: 400000,
      paidAmount: 10624,
      creditScore: 790,
      status: 'APPROVED',
      emiStatus: 'DUE',
      nextEmiDate: '05-Sep-2026',
      interestRate: 8.5,
      tenureMonths: 240,
      monthlyEmi: 8678,
      startDate: '2026-08-01',
      autoDebitEnabled: true,
      kafkaSagaStatus: 'Account -> Loan -> Payment'
    },
    {
      loanId: 'HL-2024-1247',
      customerId: 'CUST102',
      customerName: 'John Smith',
      loanType: 'Home Loan',
      sanctionedAmount: 240000,
      disbursedAmount: 240000,
      remainingAmount: 0,
      outstandingPrincipal: 238153,
      paidAmount: 1847,
      creditScore: 782,
      status: 'ACTIVE',
      emiStatus: 'DUE',
      nextEmiDate: '05-Sep-2026',
      interestRate: 8.5,
      tenureMonths: 240,
      monthlyEmi: 2083,
      startDate: '2024-07-05',
      autoDebitEnabled: true,
      kafkaSagaStatus: 'Account -> Loan -> Payment'
    },
    {
      loanId: 'LN10003',
      customerId: 'CUST103',
      customerName: 'Priya Sharma',
      loanType: 'Personal Loan',
      sanctionedAmount: 500000,
      disbursedAmount: 200000,
      remainingAmount: 300000,
      outstandingPrincipal: 200000,
      paidAmount: 10996,
      creditScore: 745,
      status: 'APPROVED',
      emiStatus: 'DUE',
      nextEmiDate: '10-Sep-2026',
      interestRate: 11.5,
      tenureMonths: 60,
      monthlyEmi: 10996,
      startDate: '2026-08-10',
      autoDebitEnabled: false,
      kafkaSagaStatus: 'Loan -> Sanction -> Verified'
    },
    {
      loanId: 'LN10004',
      customerId: 'CUST104',
      customerName: 'Alex Vance',
      loanType: 'Vehicle Loan',
      sanctionedAmount: 800000,
      disbursedAmount: 800000,
      remainingAmount: 0,
      outstandingPrincipal: 787155,
      paidAmount: 12845,
      creditScore: 812,
      status: 'ACTIVE',
      emiStatus: 'DUE',
      nextEmiDate: '15-Sep-2026',
      interestRate: 9.0,
      tenureMonths: 84,
      monthlyEmi: 12845,
      startDate: '2026-01-15',
      autoDebitEnabled: true,
      kafkaSagaStatus: 'Completed'
    },
    {
      loanId: 'LN10005',
      customerId: 'CUST105',
      customerName: 'Vijay Kumar',
      loanType: 'Personal Loan',
      sanctionedAmount: 300000,
      disbursedAmount: 300000,
      remainingAmount: 0,
      outstandingPrincipal: 285000,
      paidAmount: 0,
      creditScore: 610,
      status: 'OVERDUE',
      emiStatus: 'OVERDUE',
      nextEmiDate: '05-Jun-2026',
      interestRate: 12.0,
      tenureMonths: 36,
      monthlyEmi: 9964,
      startDate: '2025-06-05',
      autoDebitEnabled: false,
      kafkaSagaStatus: 'Delinquency Notice Sent'
    }
  ];

  private disbursements: DisbursementRecord[] = [
    {
      disbursementId: 'DISB2026001',
      loanId: 'LN10001',
      customerName: 'Ramya Krishnan',
      disbursementAmount: 400000,
      beneficiaryAccount: 'XXXX1234',
      disbursementDate: '05-Aug-2026',
      disbursementMode: 'Bank Transfer',
      status: 'SUCCESS',
      referenceNumber: 'REF839201',
      remarks: 'Initial construction tranche disbursement'
    },
    {
      disbursementId: 'DISB2026002',
      loanId: 'HL-2024-1247',
      customerName: 'John Smith',
      disbursementAmount: 240000,
      beneficiaryAccount: 'XXXX9876',
      disbursementDate: '05-Jul-2024',
      disbursementMode: 'RTGS',
      status: 'SUCCESS',
      referenceNumber: 'REF554910',
      remarks: 'Full loan amount release'
    },
    {
      disbursementId: 'DISB2026003',
      loanId: 'LN10003',
      customerName: 'Priya Sharma',
      disbursementAmount: 200000,
      beneficiaryAccount: 'XXXX4321',
      disbursementDate: '10-Aug-2026',
      disbursementMode: 'NEFT',
      status: 'SUCCESS',
      referenceNumber: 'REF992104',
      remarks: 'First installment release'
    }
  ];

  private loans$ = new BehaviorSubject<LoanDetails[]>(this.loans);
  private disbursements$ = new BehaviorSubject<DisbursementRecord[]>(this.disbursements);

  getLoans(): Observable<LoanDetails[]> {
    return this.loans$.asObservable();
  }

  getLoanById(loanId: string): LoanDetails | undefined {
    return this.loans.find(l => l.loanId.toLowerCase() === loanId.toLowerCase());
  }

  getDisbursements(): Observable<DisbursementRecord[]> {
    return this.disbursements$.asObservable();
  }

  getDisbursementsByLoanId(loanId: string): DisbursementRecord[] {
    return this.disbursements.filter(d => d.loanId.toLowerCase() === loanId.toLowerCase());
  }

  formatDisplayDate(dateInput: string): string {
    if (!dateInput) return '';
    if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(dateInput)) return dateInput;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthStr = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${monthStr}-${year}`;
  }

  calculateMonthlyEmi(p: number, rate: number, n: number): number {
    if (p <= 0 || rate <= 0 || n <= 0) return 0;
    const r = rate / 12 / 100;
    const emiFactor = Math.pow(1 + r, n);
    return Math.round((p * r * emiFactor) / (emiFactor - 1));
  }

  processDisbursement(req: DisbursementRequest): { success: boolean; message: string; record?: DisbursementRecord } {
    const loan = this.getLoanById(req.loanId);
    if (!loan) {
      return { success: false, message: `Loan ID '${req.loanId}' not found.` };
    }

    if (loan.status === 'CLOSED') {
      return { success: false, message: `Loan '${req.loanId}' is closed. No further disbursements allowed.` };
    }

    if (req.disbursementAmount <= 0) {
      return { success: false, message: 'Disbursement amount must be greater than zero.' };
    }

    if (req.disbursementAmount > loan.remainingAmount) {
      return {
        success: false,
        message: `Disbursement amount (₹${req.disbursementAmount.toLocaleString('en-IN')}) exceeds eligible remaining amount (₹${loan.remainingAmount.toLocaleString('en-IN')}).`
      };
    }

    // Process disbursement
    loan.disbursedAmount += req.disbursementAmount;
    loan.remainingAmount = Math.max(0, loan.sanctionedAmount - loan.disbursedAmount);
    loan.outstandingPrincipal = (loan.outstandingPrincipal ?? 0) + req.disbursementAmount;

    // Recalculate monthly EMI based on sanctioned amount & tenure
    loan.monthlyEmi = this.calculateMonthlyEmi(loan.sanctionedAmount, loan.interestRate, loan.tenureMonths);

    if (loan.disbursedAmount > 0) {
      loan.status = 'ACTIVE';
    }

    const newId = `DISB2026${String(this.disbursements.length + 1).padStart(3, '0')}`;
    const refNum = `REF${Math.floor(100000 + Math.random() * 900000)}`;

    const record: DisbursementRecord = {
      disbursementId: newId,
      loanId: loan.loanId,
      customerName: loan.customerName,
      disbursementAmount: req.disbursementAmount,
      beneficiaryAccount: req.beneficiaryAccount,
      disbursementDate: this.formatDisplayDate(req.disbursementDate),
      disbursementMode: req.disbursementMode,
      status: 'SUCCESS',
      referenceNumber: refNum,
      remarks: req.remarks || 'Disbursement processed successfully'
    };

    this.disbursements.unshift(record);
    this.loans$.next([...this.loans]);
    this.disbursements$.next([...this.disbursements]);

    return {
      success: true,
      message: `Disbursement of ₹${req.disbursementAmount.toLocaleString('en-IN')} released successfully!`,
      record
    };
  }

  recordLoanRepayment(loanId: string, paymentAmount: number): { success: boolean; message: string; paymentStatus: 'PAID' | 'PARTIAL' } {
    const loan = this.getLoanById(loanId);
    if (!loan) return { success: false, message: 'Loan not found', paymentStatus: 'PAID' };

    const currentOutstanding = loan.outstandingPrincipal ?? loan.disbursedAmount;
    const newOutstanding = Math.max(0, currentOutstanding - paymentAmount);
    loan.outstandingPrincipal = newOutstanding;
    loan.paidAmount = (loan.paidAmount || 0) + paymentAmount;

    // Check partial vs full EMI cycle payment
    const currentPartial = loan.partialPaidAmount || 0;
    const totalCyclePaid = currentPartial + paymentAmount;
    const requiredEmi = loan.monthlyEmi;

    let paymentStatus: 'PAID' | 'PARTIAL' = 'PAID';

    if (totalCyclePaid >= requiredEmi || newOutstanding === 0) {
      loan.emiStatus = 'PAID';
      loan.partialPaidAmount = 0;
      paymentStatus = 'PAID';

      if (loan.status === 'OVERDUE') {
        loan.status = 'ACTIVE';
      }

      // Advance next EMI date by 1 month
      const parts = loan.nextEmiDate.split('-');
      if (parts.length === 3) {
        const day = parts[0];
        const monthStr = parts[1];
        const year = parseInt(parts[2], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let monthIdx = months.indexOf(monthStr);
        if (monthIdx !== -1) {
          monthIdx = (monthIdx + 1) % 12;
          const nextYear = monthIdx === 0 ? year + 1 : year;
          loan.nextEmiDate = `${day}-${months[monthIdx]}-${nextYear}`;
        }
      }
    } else {
      loan.emiStatus = 'PARTIAL';
      loan.partialPaidAmount = totalCyclePaid;
      paymentStatus = 'PARTIAL';
    }

    if (newOutstanding === 0 && loan.disbursedAmount > 0) {
      loan.status = 'CLOSED';
    }

    this.loans$.next([...this.loans]);
    return { success: true, message: 'Repayment recorded on loan account', paymentStatus };
  }

  prepayLoan(loanId: string, amount: number): boolean {
    const loan = this.getLoanById(loanId);
    if (!loan) return false;

    const currentOut = loan.outstandingPrincipal ?? loan.disbursedAmount;
    loan.outstandingPrincipal = Math.max(0, currentOut - amount);
    if (loan.outstandingPrincipal === 0) {
      loan.status = 'CLOSED';
    }
    this.loans$.next([...this.loans]);
    return true;
  }

  forecloseLoan(loanId: string): boolean {
    const loan = this.getLoanById(loanId);
    if (!loan) return false;

    loan.outstandingPrincipal = 0;
    loan.remainingAmount = 0;
    loan.status = 'CLOSED';
    this.loans$.next([...this.loans]);
    return true;
  }

  createLoan(req: { customerName: string; loanType: string; sanctionedAmount: number; interestRate: number; tenureMonths: number; creditScore: number }): LoanDetails {
    const newId = `LN100${String(this.loans.length + 1).padStart(2, '0')}`;
    const custId = `CUST${Math.floor(100 + Math.random() * 900)}`;
    const monthlyEmi = this.calculateMonthlyEmi(req.sanctionedAmount, req.interestRate, req.tenureMonths);

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${day}-${months[today.getMonth()]}-${today.getFullYear()}`;

    const newLoan: LoanDetails = {
      loanId: newId,
      customerId: custId,
      customerName: req.customerName,
      loanType: req.loanType || 'Personal Loan',
      sanctionedAmount: req.sanctionedAmount,
      disbursedAmount: 0,
      remainingAmount: req.sanctionedAmount,
      outstandingPrincipal: 0,
      paidAmount: 0,
      creditScore: req.creditScore || 750,
      status: 'APPROVED',
      emiStatus: 'DUE',
      nextEmiDate: formattedDate,
      interestRate: req.interestRate,
      tenureMonths: req.tenureMonths,
      monthlyEmi,
      startDate: today.toISOString().split('T')[0],
      autoDebitEnabled: true,
      kafkaSagaStatus: 'Sanctioned -> Created'
    };

    this.loans.unshift(newLoan);
    this.loans$.next([...this.loans]);
    return newLoan;
  }

  checkAndUpdateOverdueStatuses(): void {
    const today = new Date();
    this.loans.forEach(loan => {
      if (loan.status === 'CLOSED') return;
      if (loan.emiStatus === 'PAID') return;

      if (loan.nextEmiDate) {
        const parts = loan.nextEmiDate.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthIdx = months.indexOf(parts[1]);
          const year = parseInt(parts[2], 10);
          if (monthIdx !== -1) {
            const emiDate = new Date(year, monthIdx, day);
            if (emiDate < today && loan.disbursedAmount > 0) {
              loan.status = 'OVERDUE';
              loan.emiStatus = 'OVERDUE';
            }
          }
        }
      }
    });
    this.loans$.next([...this.loans]);
  }
}
