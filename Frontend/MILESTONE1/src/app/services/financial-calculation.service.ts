import { Injectable, computed, inject } from '@angular/core';
import { FinancialSummary, Transaction } from '../models/banking.models';
import { TransactionService } from './transaction.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialCalculationService {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);

  readonly summary = computed<FinancialSummary>(() => {
    const filter = this.transactionService.filter();
    const account = this.accountService.activeAccount();
    const allAccountTxs = this.transactionService.currentAccountTransactions();
    const filteredTxs = this.transactionService.filteredTransactions();

    // 1. Calculate Opening Balance:
    // Sort transactions by date ascending
    const sortedAsc = [...allAccountTxs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Find transactions prior to filter.startDate
    const txsBeforePeriod = sortedAsc.filter(t => filter.startDate && t.date < filter.startDate);
    
    let openingBalance = account.balance;
    if (txsBeforePeriod.length > 0) {
      // The last transaction before period has balanceAfter
      openingBalance = txsBeforePeriod[txsBeforePeriod.length - 1].balanceAfter;
    } else if (sortedAsc.length > 0) {
      // If there are transactions during or after, work backwards from current balance
      let currentBal = account.balance;
      const txsFromPeriodOnwards = sortedAsc.filter(t => filter.startDate && t.date >= filter.startDate);
      // reverse iterate to undo changes
      for (let i = txsFromPeriodOnwards.length - 1; i >= 0; i--) {
        const t = txsFromPeriodOnwards[i];
        if (t.type === 'CREDIT' || t.type === 'INTEREST') {
          currentBal -= t.amount;
        } else {
          currentBal += t.amount;
        }
      }
      openingBalance = Math.max(0, currentBal);
    }

    // 2. Aggregate Credits, Debits, Fees, Interest
    let totalCredits = 0;
    let totalDebits = 0;
    let totalFees = 0;
    let totalInterest = 0;
    let creditCount = 0;
    let debitCount = 0;

    const categoryMap: Record<string, number> = {};

    filteredTxs.forEach(t => {
      const isIncoming = t.type === 'CREDIT' || t.type === 'INTEREST';
      if (isIncoming) {
        totalCredits += t.amount;
        creditCount++;
      } else {
        totalDebits += t.amount;
        debitCount++;
      }

      if (t.type === 'FEE') {
        totalFees += t.amount;
      }
      if (t.type === 'INTEREST') {
        totalInterest += t.amount;
      }

      // Category breakdown
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const netCashflow = totalCredits - totalDebits;
    const closingBalance = openingBalance + totalCredits - totalDebits;

    // 3. Compute Category Breakdown List with percentages & colors
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];
    const totalVolume = totalCredits + totalDebits || 1;
    
    const categoryBreakdown = Object.keys(categoryMap).map((cat, idx) => {
      const amt = categoryMap[cat];
      const pct = Math.round((amt / totalVolume) * 100);
      return {
        category: cat,
        amount: amt,
        percentage: pct,
        color: colors[idx % colors.length]
      };
    }).sort((a, b) => b.amount - a.amount);

    // 4. Average Daily Balance estimate
    const daysInPeriod = 30;
    const averageDailyBalance = (openingBalance + closingBalance) / 2;

    return {
      openingBalance,
      totalCredits,
      totalDebits,
      netCashflow,
      totalFees,
      totalInterest,
      closingBalance,
      creditCount,
      debitCount,
      totalTransactionsCount: filteredTxs.length,
      averageDailyBalance,
      categoryBreakdown
    };
  });
}
