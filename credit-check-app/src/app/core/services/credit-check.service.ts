import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { LoanApplication, LoanType, ApplicationStatus } from '../models/loan-application.model';
import { CreditCheck, CreditStatus } from '../models/credit-check.model';
import { EmiCalculation, CreditCheckRecord } from '../models/emi-calculation.model';
import { CustomerLookupResult, PreviousLoanRecord, PreviousLoanStatus } from '../models/customer-lookup.model';

export interface CreditCheckFilterCriteria {
  startDate: string | null;
  endDate: string | null;
  loanType: LoanType | 'All';
  creditStatus: CreditStatus | 'All';
  applicationStatus: ApplicationStatus | 'All';
  customerSearch: string;
  loanIdSearch: string;
}

const EMPTY_FILTERS: CreditCheckFilterCriteria = {
  startDate: null,
  endDate: null,
  loanType: 'All',
  creditStatus: 'All',
  applicationStatus: 'All',
  customerSearch: '',
  loanIdSearch: '',
};

@Injectable({
  providedIn: 'root',
})
export class CreditCheckService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private rawRecords = signal<CreditCheckRecord[]>([]);
  public activeFilters = signal<CreditCheckFilterCriteria>({ ...EMPTY_FILTERS });

  public filteredRecords = computed(() => {
    const f = this.activeFilters();
    return this.rawRecords().filter((r) => {
      if (f.loanType !== 'All' && r.application.loanType !== f.loanType) return false;
      if (f.creditStatus !== 'All' && r.credit.creditStatus !== f.creditStatus) return false;
      if (f.applicationStatus !== 'All' && r.application.applicationStatus !== f.applicationStatus)
        return false;
      if (
        f.customerSearch &&
        !r.application.customerName.toLowerCase().includes(f.customerSearch.toLowerCase())
      )
        return false;
      if (f.loanIdSearch && !String(r.application.loanId).includes(f.loanIdSearch)) return false;
      if (f.startDate && r.application.applicationDate < f.startDate) return false;
      if (f.endDate && r.application.applicationDate > f.endDate) return false;
      return true;
    });
  });

  public summaryStats = computed(() => {
    const all = this.rawRecords();
    const total = all.length;
    const totalLoanAmount = all.reduce((sum, r) => sum + r.application.loanAmount, 0);
    const needsReview = all.filter((r) => r.credit.creditStatus !== 'Pass').length;
    const approved = all.filter((r) => r.application.applicationStatus === 'Approved').length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 1000) / 10 : 0;

    return { total, totalLoanAmount, needsReview, approvalRate };
  });

  constructor() {
    this.fetchRecordsFromBackend().subscribe();
  }

  /**
   * Calls GET {apiUrl}/credit-checks. This endpoint likely does not exist
   * yet on the backend (the loan_application / credit_check / emi_calculation
   * tables were only added in the WEEK-2 schema), so on error this falls
   * back to locally generated mock data purely so the dashboard has
   * something to show before that backend endpoint exists. Once the real
   * endpoint is live, the fallback can be removed.
   */
  public fetchRecordsFromBackend(): Observable<CreditCheckRecord[]> {
    return this.http.get<CreditCheckRecord[]>(`${this.apiUrl}/credit-checks`).pipe(
      map((response) => response ?? []),
      tap((records) => this.rawRecords.set(records)),
      catchError(() => {
        const mock = this.generateMockRecords();
        this.rawRecords.set(mock);
        return of(mock);
      }),
    );
  }

  /**
   * Looks up a customer by ID for the "New Credit Check" form. Attempts a
   * real backend lookup first; falls back to deriving a result from the
   * in-memory records (mock or real, whichever is currently loaded) plus a
   * deterministic previous-loan history so the demo is repeatable per
   * Customer ID.
   */
  public lookupCustomer(customerId: number): Observable<CustomerLookupResult | null> {
    return this.http.get<CustomerLookupResult>(`${this.apiUrl}/customers/${customerId}/loan-summary`).pipe(
      catchError(() => of(this.mockCustomerLookup(customerId))),
    );
  }

  private mockCustomerLookup(customerId: number): CustomerLookupResult | null {
    const record = this.rawRecords().find((r) => r.application.customerId === customerId);
    if (!record) return null;

    return {
      customerId,
      customerName: record.application.customerName,
      loanId: record.application.loanId,
      loanType: record.application.loanType,
      loanAmount: record.application.loanAmount,
      previousLoans: this.generatePreviousLoans(customerId),
    };
  }

  /** Deterministic (seeded by customerId) so the same ID always returns the same history. */
  private generatePreviousLoans(customerId: number): PreviousLoanRecord[] {
    const bucket = customerId % 5;
    if (bucket === 0) return []; // this segment of customers has no loan history

    const count = (customerId % 3) + 1;
    const loanTypes: LoanType[] = ['Personal', 'Home', 'Vehicle', 'Education', 'Gold', 'Other'];
    const loans: PreviousLoanRecord[] = [];

    for (let i = 0; i < count; i++) {
      const amount = ((customerId * (i + 3)) % 40 + 5) * 10000;
      const isOutstanding = (customerId + i) % 2 === 0;
      const outstandingAmount = isOutstanding ? Math.round(amount * 0.35) : 0;
      const status: PreviousLoanStatus =
        outstandingAmount > 0 ? 'Active' : (customerId + i) % 7 === 0 ? 'Defaulted' : 'Closed';

      loans.push({
        loanId: 8000 + customerId * 10 + i,
        loanType: loanTypes[(customerId + i) % loanTypes.length],
        amount,
        outstandingAmount,
        status,
      });
    }

    return loans;
  }

  /**
   * Saves a completed Credit Check (from the New Credit Check form) into
   * local state so it immediately shows up in the dashboard table.
   * Replace with a real POST {apiUrl}/credit-checks call once the backend
   * endpoint exists.
   */
  public addManualCreditCheck(input: {
    customerId: number;
    customerName: string;
    loanId: number;
    loanType: LoanType;
    loanAmount: number;
    monthlyIncome: number;
    creditScore: number;
    existingLoanCount: number;
    creditStatus: CreditStatus;
    remarks: string;
  }): CreditCheckRecord {
    const now = new Date().toISOString();
    const nextCreditCheckId = Math.max(2000, ...this.rawRecords().map((r) => r.credit.creditCheckId)) + 1;
    const nextEmiId = Math.max(3000, ...this.rawRecords().map((r) => r.emi.emiId)) + 1;

    const application: LoanApplication = {
      loanId: input.loanId,
      customerId: input.customerId,
      customerName: input.customerName,
      loanType: input.loanType,
      loanAmount: input.loanAmount,
      tenureMonths: 36,
      interestRate: 12,
      purpose: `${input.loanType} loan requirement`,
      applicationStatus: 'Pending',
      applicationDate: now.slice(0, 10),
    };

    const credit: CreditCheck = {
      creditCheckId: nextCreditCheckId,
      loanId: input.loanId,
      creditScore: input.creditScore,
      monthlyIncome: input.monthlyIncome,
      existingLoanCount: input.existingLoanCount,
      creditStatus: input.creditStatus,
      remarks: input.remarks,
      checkedAt: now,
    };

    const r = 12 / 100 / 12;
    const n = 36;
    const monthlyEmi = Math.round((input.loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayable = monthlyEmi * n;

    const emi: EmiCalculation = {
      emiId: nextEmiId,
      loanId: input.loanId,
      principalAmount: input.loanAmount,
      interestRate: 12,
      tenureMonths: n,
      monthlyEmi,
      totalInterest: totalPayable - input.loanAmount,
      totalPayable,
      calculatedAt: now,
    };

    const newRecord: CreditCheckRecord = { application, credit, emi };
    this.rawRecords.update((records) => {
      const withoutExisting = records.filter((rec) => rec.application.loanId !== input.loanId);
      return [newRecord, ...withoutExisting];
    });

    return newRecord;
  }

  public setFilters(filters: Partial<CreditCheckFilterCriteria>): void {
    this.activeFilters.set({ ...this.activeFilters(), ...filters });
  }

  public resetFilters(): void {
    this.activeFilters.set({ ...EMPTY_FILTERS });
  }

  /**
   * DEMO: updates local state only. Replace with a real
   * PATCH {apiUrl}/loan-applications/{loanId}/status call once the backend
   * endpoint exists.
   */
  public updateApplicationStatus(loanId: number, status: ApplicationStatus): void {
    this.rawRecords.update((records) =>
      records.map((r) =>
        r.application.loanId === loanId
          ? { ...r, application: { ...r.application, applicationStatus: status } }
          : r,
      ),
    );
  }

  public exportToCSV(filename = 'FinCore_CreditCheck_Report.csv'): void {
    const data = this.filteredRecords();
    if (!data.length) return;

    const headers = [
      'Credit Check ID', 'Loan ID', 'Customer Name', 'Credit Score', 'Monthly Income (₹)',
      'Existing Loans', 'Credit Status', 'Remarks', 'Checked At',
    ];
    const rows = data.map((r) => [
      r.credit.creditCheckId,
      `LN${r.application.loanId}`,
      `"${r.application.customerName}"`,
      r.credit.creditScore,
      r.credit.monthlyIncome,
      r.credit.existingLoanCount,
      r.credit.creditStatus,
      `"${r.credit.remarks}"`,
      r.credit.checkedAt.slice(0, 10),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportToPDF(): void {
    const data = this.filteredRecords();
    if (!data.length) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = data
      .map(
        (r) => `
      <tr>
        <td>${r.credit.creditCheckId}</td>
        <td>LN${r.application.loanId}</td>
        <td>${r.application.customerName}</td>
        <td>${r.credit.creditScore}</td>
        <td>\u20B9${r.credit.monthlyIncome.toLocaleString('en-IN')}</td>
        <td>${r.credit.existingLoanCount}</td>
        <td>${r.credit.creditStatus}</td>
        <td>${r.credit.remarks}</td>
        <td>${r.credit.checkedAt.slice(0, 10)}</td>
      </tr>`,
      )
      .join('');

    printWindow.document.write(`
      <html><head><title>FinCore Nexus - Credit Check Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        h1 { color: #123f82; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #123f82; color: #fff; }
      </style></head>
      <body>
        <h1>FinCore Nexus &mdash; Credit Check Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <thead><tr>
            <th>Credit Check ID</th><th>Loan ID</th><th>Customer Name</th><th>Credit Score</th>
            <th>Monthly Income</th><th>Existing Loans</th><th>Credit Status</th><th>Remarks</th><th>Checked At</th>
          </tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  private generateMockRecords(): CreditCheckRecord[] {
    const names = [
      'Sneha Patel', 'Rahul Mehta', 'Priya Nair', 'Marcus Chen', 'Fatima Sheikh',
      'David Okafor', 'Elena Petrova', 'Aditi Verma', 'Arjun Rao', 'Kavya Iyer',
      'John Smith', 'Meera Krishnan',
    ];
    const loanTypes: LoanType[] = ['Personal', 'Home', 'Vehicle', 'Education', 'Gold', 'Other'];
    const creditStatuses: CreditStatus[] = ['Pass', 'Review', 'Fail'];
    const appStatuses: ApplicationStatus[] = ['Pending', 'Approved', 'Rejected'];

    const records: CreditCheckRecord[] = [];

    for (let i = 0; i < 12; i++) {
      const loanId = 1000 + i;
      const loanType = loanTypes[i % loanTypes.length];
      const loanAmount = Math.round((Math.random() * 900000 + 50000) / 1000) * 1000;
      const tenureMonths = [12, 24, 36, 60, 120, 240][i % 6];
      const interestRate = Math.round((Math.random() * 8 + 7) * 100) / 100;
      const creditScore = Math.round(550 + Math.random() * 300);
      const creditStatus = creditStatuses[i % creditStatuses.length];
      const monthlyIncome = Math.round((Math.random() * 80000 + 25000) / 500) * 500;

      const application: LoanApplication = {
        loanId,
        customerId: 5000 + i,
        customerName: names[i % names.length],
        loanType,
        loanAmount,
        tenureMonths,
        interestRate,
        purpose: `${loanType} loan requirement`,
        applicationStatus: appStatuses[i % appStatuses.length],
        applicationDate: new Date(2026, 6, 1 + i).toISOString().slice(0, 10),
      };

      const credit: CreditCheck = {
        creditCheckId: 2000 + i,
        loanId,
        creditScore,
        monthlyIncome,
        existingLoanCount: i % 4,
        creditStatus,
        remarks:
          creditStatus === 'Fail'
            ? 'High existing debt-to-income ratio'
            : creditStatus === 'Review'
              ? 'Requires manual underwriting review'
              : 'Meets standard lending criteria',
        checkedAt: new Date(2026, 6, 1 + i).toISOString(),
      };

      const r = interestRate / 100 / 12;
      const n = tenureMonths;
      const monthlyEmi = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const totalPayable = monthlyEmi * n;
      const totalInterest = totalPayable - loanAmount;

      const emi: EmiCalculation = {
        emiId: 3000 + i,
        loanId,
        principalAmount: loanAmount,
        interestRate,
        tenureMonths,
        monthlyEmi,
        totalInterest,
        totalPayable,
        calculatedAt: new Date(2026, 6, 1 + i).toISOString(),
      };

      records.push({
        application,
        credit,
        emi,
      });
    }

    return records;
  }
}
