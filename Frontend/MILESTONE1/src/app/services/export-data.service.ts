import { Injectable, inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { AccountService } from './account.service';
import { TransactionService } from './transaction.service';
import { FinancialCalculationService } from './financial-calculation.service';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private calcService = inject(FinancialCalculationService);

  exportToCsv() {
    const account = this.accountService.activeAccount();
    const filter = this.transactionService.filter();
    const summary = this.calcService.summary();
    const txs = this.transactionService.filteredTransactions();
    const isMasked = this.accountService.isDataMasked();

    let csvContent = 'FINCORE BANKING - ACCOUNT STATEMENT\n';
    csvContent += `Account Name,${this.escapeCsv(account.name)}\n`;
    csvContent += `Account Number,${this.escapeCsv(this.accountService.maskAccountNumber(account.accountNumber, isMasked))}\n`;
    csvContent += `Holder Name,${this.escapeCsv(account.holderName)}\n`;
    csvContent += `Statement Period,${filter.startDate} to ${filter.endDate}\n`;
    csvContent += `Opening Balance,$${summary.openingBalance.toFixed(2)}\n`;
    csvContent += `Total Credits,$${summary.totalCredits.toFixed(2)}\n`;
    csvContent += `Total Debits,$${summary.totalDebits.toFixed(2)}\n`;
    csvContent += `Closing Balance,$${summary.closingBalance.toFixed(2)}\n\n`;

    csvContent += 'Date,Reference ID,Description,Category,Type,Amount,Running Balance,Status,Merchant\n';

    txs.forEach(t => {
      const amtStr = (t.type === 'CREDIT' || t.type === 'INTEREST' ? '' : '-') + t.amount.toFixed(2);
      const row = [
        t.date,
        t.referenceId,
        this.escapeCsv(t.description),
        t.category,
        t.type,
        amtStr,
        t.balanceAfter.toFixed(2),
        t.status,
        this.escapeCsv(t.merchantName || '')
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `FinCore_Statement_${account.accountNumber.slice(-4)}_${filter.startDate}_to_${filter.endDate}.csv`;
    this.downloadFile(blob, fileName);
  }

  exportToExcel() {
    const account = this.accountService.activeAccount();
    const filter = this.transactionService.filter();
    const summary = this.calcService.summary();
    const txs = this.transactionService.filteredTransactions();
    const isMasked = this.accountService.isDataMasked();

    const workbook = XLSX.utils.book_new();

    // Sheet 1: Statement Summary
    const summaryData = [
      ['FINCORE BANKING - OFFICIAL STATEMENT'],
      [''],
      ['Account Details'],
      ['Account Name', account.name],
      ['Account Number', this.accountService.maskAccountNumber(account.accountNumber, isMasked)],
      ['Holder Name', account.holderName],
      ['SSN / Tax ID', this.accountService.maskTaxId(account.holderSSN, isMasked)],
      ['Routing Number', account.routingNumber],
      ['Branch', account.bankBranch],
      [''],
      ['Financial Summary'],
      ['Statement Start Date', filter.startDate],
      ['Statement End Date', filter.endDate],
      ['Opening Balance', summary.openingBalance],
      ['Total Credits', summary.totalCredits],
      ['Total Debits', summary.totalDebits],
      ['Total Fees Charged', summary.totalFees],
      ['Interest Earned', summary.totalInterest],
      ['Net Cash Flow', summary.netCashflow],
      ['Closing Balance', summary.closingBalance]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Sheet 2: Transactions Ledger
    const txRows = txs.map(t => ({
      Date: t.date,
      'Reference ID': t.referenceId,
      Description: t.description,
      Category: t.category,
      Type: t.type,
      Amount: t.type === 'CREDIT' || t.type === 'INTEREST' ? t.amount : -t.amount,
      'Balance After': t.balanceAfter,
      Status: t.status,
      Merchant: t.merchantName || ''
    }));

    const txSheet = XLSX.utils.json_to_sheet(txRows);
    XLSX.utils.book_append_sheet(workbook, txSheet, 'Transactions');

    const fileName = `FinCore_Statement_${account.accountNumber.slice(-4)}_${filter.startDate}_to_${filter.endDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  exportToJson() {
    const account = this.accountService.activeAccount();
    const filter = this.transactionService.filter();
    const summary = this.calcService.summary();
    const txs = this.transactionService.filteredTransactions();
    const isMasked = this.accountService.isDataMasked();

    const payload = {
      bank: 'FinCore Banking',
      statementMetadata: {
        generatedAt: new Date().toISOString(),
        version: '2.0-digital-banking',
        format: 'JSON-Accounting-Schema-V2'
      },
      accountInfo: {
        id: account.id,
        accountNumber: this.accountService.maskAccountNumber(account.accountNumber, isMasked),
        accountType: account.type,
        currency: account.currency,
        holderName: account.holderName,
        routingNumber: account.routingNumber
      },
      period: {
        startDate: filter.startDate,
        endDate: filter.endDate
      },
      financialSummary: summary,
      transactions: txs
    };

    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const fileName = `FinCore_Statement_${account.accountNumber.slice(-4)}_${filter.startDate}_to_${filter.endDate}.json`;
    this.downloadFile(blob, fileName);
  }

  private escapeCsv(str: string): string {
    if (!str) return '""';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
