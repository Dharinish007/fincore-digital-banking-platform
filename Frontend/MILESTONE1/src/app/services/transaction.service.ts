import { Injectable, signal, computed, inject } from '@angular/core';
import { Transaction, StatementFilter, DatePreset, TransactionType } from '../models/banking.models';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private accountService = inject(AccountService);

  private readonly mockTransactions: Record<string, Transaction[]> = {
    'acc-101': [
      // Current Month / Recent 2026
      { id: 'tx-1001', date: '2026-07-28', referenceId: 'TXN-984201', description: 'TechCorp Salary Direct Deposit', category: 'Income', type: 'CREDIT', amount: 6850.00, balanceAfter: 42850.75, status: 'COMPLETED', merchantName: 'TechCorp Inc Payroll' },
      { id: 'tx-1002', date: '2026-07-25', referenceId: 'TXN-984180', description: 'Wire Transfer Out to Brokerage FinCore', category: 'Investment', type: 'WIRE_TRANSFER', amount: 2500.00, balanceAfter: 36000.75, status: 'COMPLETED', merchantName: 'FinCore Securities' },
      { id: 'tx-1003', date: '2026-07-22', referenceId: 'TXN-984155', description: 'ATM Cash Withdrawal Downtown Branch', category: 'Cash', type: 'ATM_WITHDRAWAL', amount: 300.00, balanceAfter: 38500.75, status: 'COMPLETED', merchantName: 'FinCore ATM #419' },
      { id: 'tx-1004', date: '2026-07-20', referenceId: 'TXN-984120', description: 'Monthly Platinum Account Maintenance Fee', category: 'Bank Fees', type: 'FEE', amount: 15.00, balanceAfter: 38800.75, status: 'COMPLETED', merchantName: 'FinCore Bank' },
      { id: 'tx-1005', date: '2026-07-18', referenceId: 'TXN-984090', description: 'Whole Foods Market Organic Groceries', category: 'Groceries', type: 'DEBIT', amount: 184.25, balanceAfter: 38815.75, status: 'COMPLETED', merchantName: 'Whole Foods Market' },
      { id: 'tx-1006', date: '2026-07-15', referenceId: 'TXN-984050', description: 'Consolidated Edison Utility Bill Payment', category: 'Utilities', type: 'DEBIT', amount: 210.50, balanceAfter: 39000.00, status: 'COMPLETED', merchantName: 'ConEdison' },
      { id: 'tx-1007', date: '2026-07-10', referenceId: 'TXN-984011', description: 'High Yield Savings Monthly Interest Credit', category: 'Interest', type: 'INTEREST', amount: 142.30, balanceAfter: 39210.50, status: 'COMPLETED', merchantName: 'FinCore Treasury' },
      { id: 'tx-1008', date: '2026-07-05', referenceId: 'TXN-983990', description: 'Wire Transfer In from Client Global Solutions', category: 'Income', type: 'WIRE_TRANSFER', amount: 4500.00, balanceAfter: 39068.20, status: 'COMPLETED', merchantName: 'Global Solutions Corp' },
      { id: 'tx-1009', date: '2026-07-02', referenceId: 'TXN-983940', description: 'Equinox Fitness Club Monthly Membership', category: 'Health & Wellness', type: 'DEBIT', amount: 280.00, balanceAfter: 34568.20, status: 'COMPLETED', merchantName: 'Equinox NYC' },

      // June 2026
      { id: 'tx-1010', date: '2026-06-28', referenceId: 'TXN-973001', description: 'TechCorp Salary Direct Deposit', category: 'Income', type: 'CREDIT', amount: 6850.00, balanceAfter: 34848.20, status: 'COMPLETED' },
      { id: 'tx-1011', date: '2026-06-22', referenceId: 'TXN-972880', description: 'Luxury Travel Agency Flight Booking', category: 'Travel', type: 'DEBIT', amount: 1450.00, balanceAfter: 27998.20, status: 'COMPLETED' },
      { id: 'tx-1012', date: '2026-06-18', referenceId: 'TXN-972810', description: 'ATM Cash Withdrawal Airport Terminal', category: 'Cash', type: 'ATM_WITHDRAWAL', amount: 500.00, balanceAfter: 29448.20, status: 'COMPLETED' },
      { id: 'tx-1013', date: '2026-06-15', referenceId: 'TXN-972740', description: 'Wire Transfer Fee International SWIFT', category: 'Bank Fees', type: 'FEE', amount: 45.00, balanceAfter: 29948.20, status: 'COMPLETED' },
      { id: 'tx-1014', date: '2026-06-10', referenceId: 'TXN-972690', description: 'Interest Accrued Deposit', category: 'Interest', type: 'INTEREST', amount: 138.90, balanceAfter: 29993.20, status: 'COMPLETED' },

      // May 2026 - Last Financial Year / Q2 2026
      { id: 'tx-1015', date: '2026-05-28', referenceId: 'TXN-961010', description: 'TechCorp Salary Direct Deposit', category: 'Income', type: 'CREDIT', amount: 6850.00, balanceAfter: 29854.30, status: 'COMPLETED' },
      { id: 'tx-1016', date: '2026-05-20', referenceId: 'TXN-960920', description: 'State Tax Estimated Quarterly Payment', category: 'Taxes', type: 'DEBIT', amount: 3200.00, balanceAfter: 23004.30, status: 'COMPLETED' },
      { id: 'tx-1017', date: '2026-05-14', referenceId: 'TXN-960840', description: 'Wire Transfer In Consulting Retainer', category: 'Income', type: 'WIRE_TRANSFER', amount: 3500.00, balanceAfter: 26204.30, status: 'COMPLETED' },

      // Q1 2026 & Financial Year 2025-2026
      { id: 'tx-1018', date: '2026-03-31', referenceId: 'TXN-940110', description: 'Annual Wealth Advisor Fee', category: 'Bank Fees', type: 'FEE', amount: 450.00, balanceAfter: 22704.30, status: 'COMPLETED' },
      { id: 'tx-1019', date: '2026-01-15', referenceId: 'TXN-920101', description: 'New Year Bonus Direct Deposit', category: 'Income', type: 'CREDIT', amount: 12000.00, balanceAfter: 23154.30, status: 'COMPLETED' },
      { id: 'tx-1020', date: '2025-12-10', referenceId: 'TXN-910050', description: 'Year-End Dividend Investment Credit', category: 'Interest', type: 'INTEREST', amount: 840.50, balanceAfter: 11154.30, status: 'COMPLETED' }
    ],
    'acc-102': [
      { id: 'tx-2001', date: '2026-07-27', referenceId: 'SAV-849102', description: 'High Yield Monthly Compound Interest', category: 'Interest', type: 'INTEREST', amount: 508.40, balanceAfter: 128420.50, status: 'COMPLETED' },
      { id: 'tx-2002', date: '2026-07-12', referenceId: 'SAV-849050', description: 'Automatic Savings Transfer In', category: 'Transfer', type: 'CREDIT', amount: 2000.00, balanceAfter: 127912.10, status: 'COMPLETED' },
      { id: 'tx-2003', date: '2026-06-27', referenceId: 'SAV-839001', description: 'High Yield Monthly Compound Interest', category: 'Interest', type: 'INTEREST', amount: 500.20, balanceAfter: 125912.10, status: 'COMPLETED' },
      { id: 'tx-2004', date: '2026-05-15', referenceId: 'SAV-828010', description: 'Wire Transfer Out to Escrow Account', category: 'Wire', type: 'WIRE_TRANSFER', amount: 15000.00, balanceAfter: 125411.90, status: 'COMPLETED' }
    ],
    'acc-103': [
      { id: 'tx-3001', date: '2026-07-26', referenceId: 'CC-394019', description: 'Apple Store Fifth Ave - Tech Accessories', category: 'Electronics', type: 'DEBIT', amount: 849.00, balanceAfter: 3410.25, status: 'COMPLETED' },
      { id: 'tx-3002', date: '2026-07-21', referenceId: 'CC-394002', description: 'Autopay Credit Card Statement Payment', category: 'Payment', type: 'CREDIT', amount: 1200.00, balanceAfter: 2561.25, status: 'COMPLETED' },
      { id: 'tx-3003', date: '2026-07-15', referenceId: 'CC-393988', description: 'Delta Air Lines International Ticket', category: 'Travel', type: 'DEBIT', amount: 1420.50, balanceAfter: 3761.25, status: 'COMPLETED' }
    ],
    'acc-104': [
      { id: 'tx-4001', date: '2026-07-24', referenceId: 'INV-401920', description: 'Quarterly Vanguard S&P 500 ETF Dividend', category: 'Dividends', type: 'CREDIT', amount: 1850.00, balanceAfter: 245900.00, status: 'COMPLETED' },
      { id: 'tx-4002', date: '2026-07-01', referenceId: 'INV-401880', description: 'Portfolio Rebalancing Brokerage Wire In', category: 'Investment', type: 'WIRE_TRANSFER', amount: 5000.00, balanceAfter: 244050.00, status: 'COMPLETED' }
    ]
  };

  readonly filter = signal<StatementFilter>({
    accountId: 'acc-101',
    datePreset: 'CURRENT_MONTH',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    selectedTypes: ['DEBIT', 'CREDIT', 'WIRE_TRANSFER', 'ATM_WITHDRAWAL', 'FEE', 'INTEREST'],
    category: 'ALL',
    minAmount: null,
    maxAmount: null,
    searchQuery: ''
  });

  // Automatically update filter when active account changes
  constructor() {
    this.accountService.activeAccountId; // track active account
  }

  readonly currentAccountTransactions = computed(() => {
    const accId = this.accountService.activeAccountId();
    return this.mockTransactions[accId] || [];
  });

  readonly categories = computed(() => {
    const txs = this.currentAccountTransactions();
    const set = new Set<string>();
    txs.forEach(t => set.add(t.category));
    return Array.from(set).sort();
  });

  readonly filteredTransactions = computed(() => {
    const f = this.filter();
    const txs = this.currentAccountTransactions();

    return txs.filter(t => {
      // Date filter
      if (f.startDate && t.date < f.startDate) return false;
      if (f.endDate && t.date > f.endDate) return false;

      // Type filter
      if (f.selectedTypes.length > 0 && !f.selectedTypes.includes(t.type)) {
        return false;
      }

      // Category filter
      if (f.category !== 'ALL' && t.category !== f.category) {
        return false;
      }

      // Min / Max Amount
      if (f.minAmount !== null && t.amount < f.minAmount) return false;
      if (f.maxAmount !== null && t.amount > f.maxAmount) return false;

      // Search Query
      if (f.searchQuery.trim()) {
        const q = f.searchQuery.toLowerCase().trim();
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesRef = t.referenceId.toLowerCase().includes(q);
        const matchesCategory = t.category.toLowerCase().includes(q);
        const matchesMerchant = t.merchantName?.toLowerCase().includes(q) || false;
        if (!matchesDesc && !matchesRef && !matchesCategory && !matchesMerchant) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  setPreset(preset: DatePreset) {
    const today = new Date('2026-07-29'); // anchor date per problem statement metadata
    let startStr = '';
    let endStr = '2026-07-31';

    if (preset === '30_DAYS') {
      const d = new Date(today);
      d.setDate(d.getDate() - 30);
      startStr = d.toISOString().split('T')[0];
    } else if (preset === 'CURRENT_MONTH') {
      startStr = '2026-07-01';
      endStr = '2026-07-31';
    } else if (preset === 'LAST_FINANCIAL_YEAR') {
      // FY 2025-2026 or 2025
      startStr = '2025-04-01';
      endStr = '2026-03-31';
    } else if (preset === 'YEAR_TO_DATE') {
      startStr = '2026-01-01';
      endStr = '2026-07-31';
    }

    this.filter.update(f => ({
      ...f,
      datePreset: preset,
      startDate: startStr || f.startDate,
      endDate: endStr || f.endDate
    }));
  }

  setCustomDates(start: string, end: string) {
    this.filter.update(f => ({
      ...f,
      datePreset: 'CUSTOM',
      startDate: start,
      endDate: end
    }));
  }

  toggleType(type: TransactionType) {
    this.filter.update(f => {
      const exists = f.selectedTypes.includes(type);
      const newTypes = exists
        ? f.selectedTypes.filter(t => t !== type)
        : [...f.selectedTypes, type];
      return { ...f, selectedTypes: newTypes };
    });
  }

  setCategory(category: string) {
    this.filter.update(f => ({ ...f, category }));
  }

  setAmountRange(min: number | null, max: number | null) {
    this.filter.update(f => ({ ...f, minAmount: min, maxAmount: max }));
  }

  setSearchQuery(q: string) {
    this.filter.update(f => ({ ...f, searchQuery: q }));
  }

  resetFilters() {
    this.filter.set({
      accountId: this.accountService.activeAccountId(),
      datePreset: 'CURRENT_MONTH',
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      selectedTypes: ['DEBIT', 'CREDIT', 'WIRE_TRANSFER', 'ATM_WITHDRAWAL', 'FEE', 'INTEREST'],
      category: 'ALL',
      minAmount: null,
      maxAmount: null,
      searchQuery: ''
    });
  }
}
