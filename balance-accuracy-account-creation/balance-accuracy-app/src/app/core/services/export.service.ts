import { Injectable } from '@angular/core';
import { BankAccount } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() {}

  public exportToCSV(accounts: BankAccount[], filename = 'Balance_Accuracy_Report.csv'): void {
    const headers = [
      'Account Number',
      'Customer Name',
      'Customer ID',
      'Branch',
      'Account Type',
      'Ledger Balance ($)',
      'Available Balance ($)',
      'System Calculated ($)',
      'Difference ($)',
      'Status',
      'Last Verified'
    ];

    const rows = accounts.map(acc => [
      `"${acc.accountNumber}"`,
      `"${acc.customerName}"`,
      `"${acc.customerId}"`,
      `"${acc.branch}"`,
      `"${acc.accountType}"`,
      acc.ledgerBalance.toFixed(2),
      acc.availableBalance.toFixed(2),
      acc.systemCalculatedBalance.toFixed(2),
      acc.difference.toFixed(2),
      `"${acc.status}"`,
      `"${acc.lastVerified}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportToPDF(accounts: BankAccount[], filename = 'Balance_Accuracy_Audit_Report.pdf'): void {
    // Generate styled printable HTML and trigger print dialog / save as PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>FinCore Nexus - Balance Accuracy Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 20px; }
          h1 { color: #0D47A1; margin-bottom: 4px; font-size: 24px; }
          .subtitle { color: #555; font-size: 14px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
          th { background: #0D47A1; color: #fff; text-transform: uppercase; font-size: 11px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .status-Verified { color: #059669; font-weight: bold; }
          .status-Mismatch { color: #dc2626; font-weight: bold; }
          .status-Pending { color: #d97706; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 11px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>FinCore Nexus - Balance Accuracy Module</h1>
        <div class="subtitle">Official Audit & Reconciled Balances Report | Generated: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              <th>Acc No.</th>
              <th>Customer</th>
              <th>Branch</th>
              <th>Ledger Bal ($)</th>
              <th>Available Bal ($)</th>
              <th>Difference ($)</th>
              <th>Status</th>
              <th>Last Verified</th>
            </tr>
          </thead>
          <tbody>
            ${accounts.map(acc => `
              <tr>
                <td>${acc.accountNumber}</td>
                <td>${acc.customerName}</td>
                <td>${acc.branch}</td>
                <td>$${acc.ledgerBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>$${acc.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>$${acc.difference.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td class="status-${acc.status}">${acc.status}</td>
                <td>${new Date(acc.lastVerified).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          FinCore Nexus Digital Banking Platform &copy; 2026. Confidential Enterprise Audit Document.
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
