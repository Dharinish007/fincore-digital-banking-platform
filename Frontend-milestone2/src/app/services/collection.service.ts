import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionDashboardMetrics, PaymentRequest, PaymentRecord, LoanDetails } from '../models/loan.model';
import { DisbursementService } from './disbursement.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private paymentHistory: PaymentRecord[] = [
    {
      paymentId: 'PAY2026001',
      loanId: 'LN10001',
      customerName: 'Ramya Krishnan',
      paymentAmount: 10624,
      paymentDate: '05-Aug-2026',
      paymentMode: 'UPI',
      referenceNumber: 'TXN98765',
      status: 'PAID',
      remarks: 'August EMI Payment'
    },
    {
      paymentId: 'PAY2026002',
      loanId: 'HL-2024-1247',
      customerName: 'John Smith',
      paymentAmount: 1847,
      paymentDate: '05-Jul-2026',
      paymentMode: 'Auto-Debit',
      referenceNumber: 'TXN884102',
      status: 'PAID',
      remarks: 'July EMI Auto-Debit'
    },
    {
      paymentId: 'PAY2026003',
      loanId: 'LN10003',
      customerName: 'Priya Sharma',
      paymentAmount: 10996,
      paymentDate: '05-Jul-2026',
      paymentMode: 'NEFT',
      referenceNumber: 'TXN771029',
      status: 'PAID',
      remarks: 'July EMI'
    },
    {
      paymentId: 'PAY2026004',
      loanId: 'LN10004',
      customerName: 'Alex Vance',
      paymentAmount: 12845,
      paymentDate: '05-Jul-2026',
      paymentMode: 'UPI',
      referenceNumber: 'TXN660192',
      status: 'PAID',
      remarks: 'Regular EMI payment'
    }
  ];

  private history$ = new BehaviorSubject<PaymentRecord[]>(this.paymentHistory);
  private currentLoans: LoanDetails[] = [];

  constructor(private disbursementService: DisbursementService) {
    this.disbursementService.getLoans().subscribe(loans => {
      this.currentLoans = loans;
    });
  }

  getDashboardMetrics(): CollectionDashboardMetrics {
    const totalLoans = this.currentLoans.length;
    const totalOutstanding = this.currentLoans.reduce((sum, loan) => {
      return sum + (loan.outstandingPrincipal ?? loan.disbursedAmount ?? 0);
    }, 0);

    const overdueCount = this.currentLoans.filter(l => l.status === 'OVERDUE').length;
    const emisPaid = this.paymentHistory.filter(p => p.status === 'PAID').length;
    const emisDueToday = this.currentLoans.filter(l => l.emiStatus === 'DUE' && l.status !== 'CLOSED').length;

    return {
      totalLoans,
      emisDueToday,
      emisPaid,
      overdueCount,
      totalOutstanding
    };
  }

  getPaymentHistory(): Observable<PaymentRecord[]> {
    return this.history$.asObservable();
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

  recordPayment(req: PaymentRequest): { success: boolean; message: string; record?: PaymentRecord } {
    if (!req.loanId || req.loanId.trim() === '') {
      return { success: false, message: 'Loan ID is required.' };
    }

    if (req.paymentAmount <= 0) {
      return { success: false, message: 'Payment amount must be greater than zero.' };
    }

    // Check duplicate reference ID
    const exists = this.paymentHistory.some(
      p => p.referenceNumber.toLowerCase() === req.referenceNumber.trim().toLowerCase()
    );
    if (exists && req.referenceNumber.trim() !== '') {
      return {
        success: false,
        message: `Duplicate Reference Number '${req.referenceNumber}'. This transaction has already been recorded.`
      };
    }

    // Update loan details in DisbursementService first to determine PAID vs PARTIAL
    const repaymentResult = this.disbursementService.recordLoanRepayment(req.loanId, req.paymentAmount);
    const calculatedStatus: 'PAID' | 'PARTIAL' = repaymentResult.paymentStatus || 'PAID';

    const payId = `PAY2026${String(this.paymentHistory.length + 1).padStart(3, '0')}`;
    const record: PaymentRecord = {
      paymentId: payId,
      loanId: req.loanId,
      customerName: req.customerId || 'Borrower Account',
      paymentAmount: req.paymentAmount,
      paymentDate: this.formatDisplayDate(req.paymentDate),
      paymentMode: req.paymentMode,
      referenceNumber: req.referenceNumber || `TXN${Math.floor(10000 + Math.random() * 90000)}`,
      status: calculatedStatus,
      remarks: req.remarks || 'EMI Collection recorded successfully'
    };

    this.paymentHistory.unshift(record);
    this.history$.next([...this.paymentHistory]);

    const statusText = calculatedStatus === 'PARTIAL' ? 'Partial Payment' : 'Full EMI Payment';
    return {
      success: true,
      message: `${statusText} of ₹${req.paymentAmount.toLocaleString('en-IN')} recorded successfully! Loan balance updated.`,
      record
    };
  }
}
