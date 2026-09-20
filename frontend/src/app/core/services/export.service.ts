import { Injectable } from '@angular/core';
import { BankAccount } from '../models/account.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  public exportToCSV(
    data: BankAccount[] | Transaction[] | any[],
    filename = 'FinCore_Report.csv',
  ): void {
    if (!data || data.length === 0) return;

    // Check if data is BankAccount or Transaction
    const first = data[0];
    let headers: string[] = [];
    let rows: string[][] = [];

    if ('accountNumber' in first && 'ledgerBalance' in first) {
      // BankAccount
      headers = [
        'Account Number',
        'Customer Name',
        'Customer ID',
        'Branch',
        'Account Type',
        'Ledger Balance (₹)',
        'Available Balance (₹)',
        'System Calculated (₹)',
        'Difference (₹)',
        'Status',
        'Last Verified',
      ];
      rows = (data as BankAccount[]).map((acc) => [
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
        `"${acc.lastVerified}"`,
      ]);
    } else {
      // Transaction or generic
      headers = [
        'Transaction ID',
        'Sender Account',
        'Receiver Account',
        'Type',
        'Amount (₹)',
        'Date',
        'Reference',
        'Status',
        'Charges (₹)',
        'Description',
      ];
      rows = (data as Transaction[]).map((tx) => [
        `"${tx.id}"`,
        `"${tx.sender}"`,
        `"${tx.receiver}"`,
        `"${tx.type}"`,
        (tx.amount || 0).toFixed(2),
        `"${tx.date}"`,
        `"${tx.reference}"`,
        `"${tx.status}"`,
        (tx.charges || 0).toFixed(2),
        `"${tx.description || ''}"`,
      ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportToPDF(
    data: BankAccount[] | Transaction[] | any[],
    filename = 'FinCore_Audit_Report.pdf',
  ): void {
    if (!data || data.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const first = data[0];
    const isAccount = 'accountNumber' in first && 'ledgerBalance' in first;

    const tableHeadersHtml = isAccount
      ? `<th>Acc No.</th><th>Customer</th><th>Branch</th><th>Ledger Bal (₹)</th><th>Available Bal (₹)</th><th>Difference (₹)</th><th>Status</th>`
      : `<th>Tx ID</th><th>Sender</th><th>Receiver</th><th>Type</th><th>Amount (₹)</th><th>Status</th><th>Timestamp</th>`;

    const tableRowsHtml = isAccount
      ? (data as BankAccount[])
          .map(
            (acc) => `
          <tr>
            <td>${acc.accountNumber}</td>
            <td>${acc.customerName}</td>
            <td>${acc.branch}</td>
            <td>₹${acc.ledgerBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td>₹${acc.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td>₹${acc.difference.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="status-${acc.status}">${acc.status}</td>
          </tr>
        `,
          )
          .join('')
      : (data as Transaction[])
          .map(
            (tx) => `
          <tr>
            <td>${tx.id}</td>
            <td>${tx.sender}</td>
            <td>${tx.receiver}</td>
            <td>${tx.type}</td>
            <td>₹${(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="status-${tx.status}">${tx.status}</td>
            <td>${new Date(tx.date).toLocaleString()}</td>
          </tr>
        `,
          )
          .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>FinCore Nexus - Official Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 20px; }
          h1 { color: #0D47A1; margin-bottom: 4px; font-size: 24px; }
          .subtitle { color: #555; font-size: 14px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
          th { background: #0D47A1; color: #fff; text-transform: uppercase; font-size: 11px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .status-Verified, .status-Success { color: #059669; font-weight: bold; }
          .status-Mismatch, .status-Failed, .status-Rolled-Back { color: #dc2626; font-weight: bold; }
          .status-Pending, .status-Processing { color: #d97706; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 11px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>FinCore Digital Banking Platform</h1>
        <div class="subtitle">Official Report (${isAccount ? 'Balance Accuracy' : 'Transaction Atomicity'}) | Generated: ${new Date().toLocaleString()}</div>
        <table>
          <thead><tr>${tableHeadersHtml}</tr></thead>
          <tbody>${tableRowsHtml}</tbody>
        </table>
        <div class="footer">
          FinCore Digital Banking Platform &copy; 2026. Confidential Enterprise Audit Document.
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
