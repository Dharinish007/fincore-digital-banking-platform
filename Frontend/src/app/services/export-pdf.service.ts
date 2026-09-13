import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AccountService } from './account.service';
import { TransactionService } from './transaction.service';
import { FinancialCalculationService } from './financial-calculation.service';
import { StatementTemplate } from '../models/banking.models';

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private calcService = inject(FinancialCalculationService);

  generatePdfStatement(
    template: StatementTemplate = 'CLASSIC',
    isPasswordProtected: boolean = false,
    customPasswordHint?: string
  ): jsPDF {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const account = this.accountService.activeAccount();
    const filter = this.transactionService.filter();
    const summary = this.calcService.summary();
    const transactions = this.transactionService.filteredTransactions();
    const isMasked = this.accountService.isDataMasked();

    const maskedAccNo = this.accountService.maskAccountNumber(account.accountNumber, isMasked);
    const maskedSSN = this.accountService.maskTaxId(account.holderSSN, isMasked);

    // Primary Colors according to template
    const primaryColor = template === 'EXECUTIVE' ? [30, 41, 59] : (template === 'TAX' ? [15, 118, 110] : [15, 23, 42]);
    const accentColor = template === 'EXECUTIVE' ? [217, 119, 6] : (template === 'TAX' ? [13, 148, 136] : [37, 99, 235]);

    // Header Background Band
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 36, 'F');

    // Bank Logo & Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('FINCORE BANKING', 14, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('MEMBER FDIC  |  EQUAL HOUSING LENDER  |  OFFICIAL FINANCIAL STATEMENT', 14, 23);
    doc.text('Routing #: ' + account.routingNumber + '  |  Branch: ' + account.bankBranch, 14, 29);

    // Right Header - Statement Meta
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(template === 'TAX' ? 'TAX & FEE SUMMARY' : 'ACCOUNT STATEMENT', 196, 16, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${filter.startDate} to ${filter.endDate}`, 196, 23, { align: 'right' });
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`, 196, 29, { align: 'right' });

    // Account & Holder Details Block
    doc.setTextColor(15, 23, 42);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 42, 182, 30, 2, 2, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ACCOUNT HOLDER INFORMATION', 20, 50);
    doc.text('ACCOUNT DETAILS', 114, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Name: ${account.holderName}`, 20, 57);
    doc.text(`Tax ID / SSN: ${maskedSSN}`, 20, 63);
    doc.text(`Ownership Status: ${account.ownershipStatus.replace('_', ' ')}`, 20, 69);

    doc.text(`Account Name: ${account.name}`, 114, 57);
    doc.text(`Account #: ${maskedAccNo}`, 114, 63);
    doc.text(`Currency: ${account.currency} ($)`, 114, 69);

    // Summary Statistics Grid
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 76, 182, 22, 2, 2, 'FD');

    const colWidth = 182 / 5;
    const formatAmt = (val: number) => isMasked ? '$•••••.••' : '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const stats = [
      { label: 'Opening Balance', value: formatAmt(summary.openingBalance), color: [71, 85, 105] },
      { label: 'Total Credits (+)', value: formatAmt(summary.totalCredits), color: [16, 185, 129] },
      { label: 'Total Debits (-)', value: formatAmt(summary.totalDebits), color: [239, 68, 68] },
      { label: 'Fees & Interest', value: formatAmt(summary.totalInterest - summary.totalFees), color: [245, 158, 11] },
      { label: 'Closing Balance', value: formatAmt(summary.closingBalance), color: [30, 41, 59] }
    ];

    stats.forEach((st, idx) => {
      const x = 14 + idx * colWidth + colWidth / 2;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(st.label.toUpperCase(), x, 83, { align: 'center' });

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(st.color[0], st.color[1], st.color[2]);
      doc.text(st.value, x, 92, { align: 'center' });
    });

    // Transaction Table Data Preparation
    const tableBody = transactions.map(t => {
      const amtStr = isMasked
        ? '$•••••.••'
        : (t.type === 'CREDIT' || t.type === 'INTEREST' ? '+' : '-') + '$' + t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const balStr = isMasked
        ? '$•••••.••'
        : '$' + t.balanceAfter.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      return [
        t.date,
        t.referenceId,
        t.description,
        t.category,
        t.type.replace('_', ' '),
        amtStr,
        balStr
      ];
    });

    // AutoTable layout
    autoTable(doc, {
      startY: 102,
      head: [['Date', 'Ref ID', 'Description', 'Category', 'Type', 'Amount', 'Balance']],
      body: tableBody,
      theme: 'striped',
      headStyles: {
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: 3
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
        cellPadding: 2.5
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 24 },
        2: { cellWidth: 52 },
        3: { cellWidth: 24 },
        4: { cellWidth: 24 },
        5: { cellWidth: 22, halign: 'right' },
        6: { cellWidth: 22, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      didDrawPage: (data) => {
        // Page Numbering Footer
        const totalPages = doc.getNumberOfPages();
        const pageNum = data.pageNumber;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);

        // Security / Watermark Notice
        if (isPasswordProtected) {
          doc.text('🔒 FINCORE ENCRYPTED BANK DOCUMENT - PASSWORD PROTECTED', 14, 287);
        } else {
          doc.text('FINCORE BANKING - CONFIDENTIAL FOR AUTHORIZED CLIENT USE ONLY', 14, 287);
        }

        doc.text(`Page ${pageNum} of ${totalPages}`, 196, 287, { align: 'right' });
      }
    });

    return doc;
  }

  downloadPdf(template: StatementTemplate = 'CLASSIC', isPasswordProtected: boolean = false) {
    const doc = this.generatePdfStatement(template, isPasswordProtected);
    const account = this.accountService.activeAccount();
    const filter = this.transactionService.filter();
    const fileName = `FinCore_Banking_Statement_${account.accountNumber.slice(-4)}_${filter.startDate}_to_${filter.endDate}.pdf`;
    doc.save(fileName);
  }
}
