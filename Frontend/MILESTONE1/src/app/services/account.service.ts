import { Injectable, signal, computed } from '@angular/core';
import { Account, AccountStatus, OnboardingForm, KYCStatus } from '../models/banking.models';

const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-101',
    accountNumber: '1234-5678-9012',
    type: 'SAVINGS',
    name: 'FinCore Wealth Savings',
    balance: 12847.50,
    availableBalance: 12747.50,
    currency: 'USD',
    holderName: 'John Smith',
    holderSSN: '987-65-4321',
    email: 'john.smith@fincore.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, New York, NY 10001',
    ownershipStatus: 'VERIFIED_OWNER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    riskLevel: 'LOW',
    bankBranch: 'FinCore Central Tower #001',
    routingNumber: '021000089',
    openedDate: '2021-03-15',
    minBalanceThreshold: 500,
    overdraftLimit: 1000,
    isOverdraftEligible: true,
    holds: [
      {
        id: 'hold-1',
        description: 'Gas Station Fuel Pre-Authorization Hold',
        amount: 100.00,
        holdType: 'CARD_AUTHORIZATION',
        createdAt: '2026-08-02T14:30:00Z',
        expiresAt: '2026-08-05T14:30:00Z',
        status: 'ACTIVE_HOLD'
      }
    ],
    netGrowthRate: 14.8,
    history: [
      { month: 'Aug 25', balance: 8400.00, inflow: 2500, outflow: 1200 },
      { month: 'Sep 25', balance: 8900.00, inflow: 2200, outflow: 1700 },
      { month: 'Oct 25', balance: 9350.00, inflow: 2100, outflow: 1650 },
      { month: 'Nov 25', balance: 9800.00, inflow: 2400, outflow: 1950 },
      { month: 'Dec 25', balance: 11200.00, inflow: 3800, outflow: 2400 },
      { month: 'Jan 26', balance: 10500.00, inflow: 2100, outflow: 2800 },
      { month: 'Feb 26', balance: 11100.00, inflow: 2600, outflow: 2000 },
      { month: 'Mar 26', balance: 11650.00, inflow: 2450, outflow: 1900 },
      { month: 'Apr 26', balance: 11900.00, inflow: 2300, outflow: 2050 },
      { month: 'May 26', balance: 12100.00, inflow: 2500, outflow: 2300 },
      { month: 'Jun 26', balance: 12450.00, inflow: 2800, outflow: 2450 },
      { month: 'Jul 26', balance: 12847.50, inflow: 3100, outflow: 2702.5 }
    ]
  },
  {
    id: 'acc-102',
    accountNumber: '4829-1048-9821',
    type: 'CHECKING',
    name: 'Platinum Commercial Checking',
    balance: 42850.75,
    availableBalance: 42350.75,
    currency: 'USD',
    holderName: 'Alexander V. Sterling',
    holderSSN: '987-65-1122',
    email: 'a.sterling@fincore.com',
    phone: '+1 (555) 888-9900',
    address: '10 Wall Street, Suite 400, New York, NY 10005',
    ownershipStatus: 'VERIFIED_OWNER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    riskLevel: 'LOW',
    bankBranch: 'Manhattan Financial Center #042',
    routingNumber: '021000089',
    openedDate: '2019-04-12',
    minBalanceThreshold: 1000,
    overdraftLimit: 5000,
    isOverdraftEligible: true,
    holds: [
      {
        id: 'hold-2',
        description: 'Hotel Security Deposit Hold',
        amount: 500.00,
        holdType: 'SECURITY_DEPOSIT',
        createdAt: '2026-08-01T10:00:00Z',
        expiresAt: '2026-08-08T10:00:00Z',
        status: 'ACTIVE_HOLD'
      }
    ],
    netGrowthRate: 22.4,
    history: [
      { month: 'Aug 25', balance: 28000.00, inflow: 12000, outflow: 8000 },
      { month: 'Sep 25', balance: 31200.00, inflow: 14000, outflow: 10800 },
      { month: 'Oct 25', balance: 33500.00, inflow: 11000, outflow: 8700 },
      { month: 'Nov 25', balance: 35000.00, inflow: 13000, outflow: 11500 },
      { month: 'Dec 25', balance: 41000.00, inflow: 18000, outflow: 12000 },
      { month: 'Jan 26', balance: 38500.00, inflow: 10000, outflow: 12500 },
      { month: 'Feb 26', balance: 39800.00, inflow: 11500, outflow: 10200 },
      { month: 'Mar 26', balance: 40500.00, inflow: 12000, outflow: 11300 },
      { month: 'Apr 26', balance: 41200.00, inflow: 13000, outflow: 12300 },
      { month: 'May 26', balance: 41900.00, inflow: 12500, outflow: 11800 },
      { month: 'Jun 26', balance: 42200.00, inflow: 14000, outflow: 13700 },
      { month: 'Jul 26', balance: 42850.75, inflow: 15000, outflow: 14349.25 }
    ]
  },
  {
    id: 'acc-103',
    accountNumber: '8830-1924-4012',
    type: 'CHECKING',
    name: 'Corporate Payroll Reserve',
    balance: 154200.00,
    availableBalance: 154200.00,
    currency: 'USD',
    holderName: 'FinCore Enterprise LLC',
    holderSSN: '12-3456789',
    email: 'treasury@fincoreenterprise.com',
    phone: '+1 (555) 777-1234',
    address: '500 5th Ave, New York, NY 10110',
    ownershipStatus: 'VERIFIED_OWNER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    riskLevel: 'LOW',
    bankBranch: 'Corporate Banking Wing',
    routingNumber: '021000089',
    openedDate: '2022-01-10',
    minBalanceThreshold: 5000,
    overdraftLimit: 25000,
    isOverdraftEligible: true,
    holds: [],
    netGrowthRate: 18.2,
    history: [
      { month: 'Aug 25', balance: 110000.00, inflow: 60000, outflow: 45000 },
      { month: 'Sep 25', balance: 118000.00, inflow: 55000, outflow: 47000 },
      { month: 'Oct 25', balance: 124000.00, inflow: 58000, outflow: 52000 },
      { month: 'Nov 25', balance: 130000.00, inflow: 62000, outflow: 56000 },
      { month: 'Dec 25', balance: 145000.00, inflow: 75000, outflow: 60000 },
      { month: 'Jan 26', balance: 138000.00, inflow: 50000, outflow: 57000 },
      { month: 'Feb 26', balance: 142000.00, inflow: 56000, outflow: 52000 },
      { month: 'Mar 26', balance: 146000.00, inflow: 58000, outflow: 54000 },
      { month: 'Apr 26', balance: 148500.00, inflow: 60000, outflow: 57500 },
      { month: 'May 26', balance: 150000.00, inflow: 61000, outflow: 59500 },
      { month: 'Jun 26', balance: 152100.00, inflow: 63000, outflow: 60900 },
      { month: 'Jul 26', balance: 154200.00, inflow: 65000, outflow: 62900 }
    ]
  },
  {
    id: 'acc-104',
    accountNumber: '9921-4738-5510',
    type: 'JOINT',
    name: 'Sterling Family Trust',
    balance: 245900.00,
    availableBalance: 245900.00,
    currency: 'USD',
    holderName: 'Alexander & Eleanor Sterling',
    holderSSN: '987-65-9988',
    email: 'trustees@sterlingfamily.org',
    phone: '+1 (555) 444-2211',
    address: '250 Park Ave, New York, NY 10177',
    ownershipStatus: 'JOINT_OWNER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    riskLevel: 'LOW',
    bankBranch: 'Private Securities & Wealth Wing',
    routingNumber: '021000089',
    openedDate: '2023-06-30',
    minBalanceThreshold: 10000,
    overdraftLimit: 10000,
    isOverdraftEligible: true,
    holds: [],
    netGrowthRate: 8.5,
    history: [
      { month: 'Aug 25', balance: 210000.00, inflow: 25000, outflow: 15000 },
      { month: 'Sep 25', balance: 215000.00, inflow: 18000, outflow: 13000 },
      { month: 'Oct 25', balance: 220000.00, inflow: 20000, outflow: 15000 },
      { month: 'Nov 25', balance: 226000.00, inflow: 22000, outflow: 16000 },
      { month: 'Dec 25', balance: 238000.00, inflow: 30000, outflow: 18000 },
      { month: 'Jan 26', balance: 232000.00, inflow: 15000, outflow: 21000 },
      { month: 'Feb 26', balance: 236000.00, inflow: 19000, outflow: 15000 },
      { month: 'Mar 26', balance: 239000.00, inflow: 21000, outflow: 18000 },
      { month: 'Apr 26', balance: 241500.00, inflow: 20000, outflow: 17500 },
      { month: 'May 26', balance: 243000.00, inflow: 22000, outflow: 20500 },
      { month: 'Jun 26', balance: 244500.00, inflow: 21000, outflow: 19500 },
      { month: 'Jul 26', balance: 245900.00, inflow: 23000, outflow: 21600 }
    ]
  },
  {
    id: 'acc-105',
    accountNumber: '5412-7839-6634',
    type: 'CREDIT_CARD',
    name: 'FinCore Black Mastercard Line',
    balance: 3410.25,
    availableBalance: 21589.75,
    currency: 'USD',
    holderName: 'Alexander V. Sterling',
    holderSSN: '987-65-1122',
    email: 'a.sterling@fincore.com',
    phone: '+1 (555) 888-9900',
    address: '10 Wall Street, Suite 400, New York, NY 10005',
    ownershipStatus: 'VERIFIED_OWNER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    riskLevel: 'LOW',
    bankBranch: 'Cardmember Services International',
    routingNumber: '021000089',
    openedDate: '2021-01-15',
    minBalanceThreshold: 500,
    overdraftLimit: 25000,
    isOverdraftEligible: true,
    holds: [],
    netGrowthRate: -5.2,
    history: [
      { month: 'Aug 25', balance: 1200.00, inflow: 3000, outflow: 4200 },
      { month: 'Sep 25', balance: 2100.00, inflow: 2500, outflow: 3400 },
      { month: 'Oct 25', balance: 1800.00, inflow: 4000, outflow: 3700 },
      { month: 'Nov 25', balance: 2900.00, inflow: 3500, outflow: 4600 },
      { month: 'Dec 25', balance: 5400.00, inflow: 5000, outflow: 7500 },
      { month: 'Jan 26', balance: 2800.00, inflow: 6000, outflow: 3400 },
      { month: 'Feb 26', balance: 3100.00, inflow: 3000, outflow: 3300 },
      { month: 'Mar 26', balance: 2950.00, inflow: 3200, outflow: 3050 },
      { month: 'Apr 26', balance: 3200.00, inflow: 3100, outflow: 3350 },
      { month: 'May 26', balance: 3600.00, inflow: 3500, outflow: 3900 },
      { month: 'Jun 26', balance: 3150.00, inflow: 4000, outflow: 3550 },
      { month: 'Jul 26', balance: 3410.25, inflow: 3800, outflow: 4060.25 }
    ]
  },
  {
    id: 'acc-106',
    accountNumber: '3120-9481-0019',
    type: 'FIXED_DEPOSIT',
    name: '5-Year Certificate of Deposit (5.25% APY)',
    balance: 85000.00,
    availableBalance: 85000.00,
    currency: 'USD',
    holderName: 'John Smith',
    holderSSN: '987-65-4321',
    email: 'john.smith@fincore.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, New York, NY 10001',
    ownershipStatus: 'VERIFIED_OWNER',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    riskLevel: 'LOW',
    bankBranch: 'Treasury & Fixed Term Desk',
    routingNumber: '021000089',
    openedDate: '2024-02-01',
    minBalanceThreshold: 5000,
    overdraftLimit: 0,
    isOverdraftEligible: false,
    holds: [],
    netGrowthRate: 5.25,
    history: [
      { month: 'Aug 25', balance: 80800.00, inflow: 350, outflow: 0 },
      { month: 'Sep 25', balance: 81150.00, inflow: 350, outflow: 0 },
      { month: 'Oct 25', balance: 81500.00, inflow: 350, outflow: 0 },
      { month: 'Nov 25', balance: 81850.00, inflow: 350, outflow: 0 },
      { month: 'Dec 25', balance: 82200.00, inflow: 350, outflow: 0 },
      { month: 'Jan 26', balance: 82550.00, inflow: 350, outflow: 0 },
      { month: 'Feb 26', balance: 82900.00, inflow: 350, outflow: 0 },
      { month: 'Mar 26', balance: 83250.00, inflow: 350, outflow: 0 },
      { month: 'Apr 26', balance: 83600.00, inflow: 350, outflow: 0 },
      { month: 'May 26', balance: 84000.00, inflow: 400, outflow: 0 },
      { month: 'Jun 26', balance: 84500.00, inflow: 500, outflow: 0 },
      { month: 'Jul 26', balance: 85000.00, inflow: 500, outflow: 0 }
    ]
  },
  {
    id: 'acc-107',
    accountNumber: '7741-2093-8841',
    type: 'CRYPTO_CUSTODY',
    name: 'Digital Asset Custody Reserve',
    balance: 62150.00,
    availableBalance: 62150.00,
    currency: 'USD',
    holderName: 'FinCore Treasury Vault',
    holderSSN: '12-9988776',
    email: 'crypto.vault@fincore.com',
    phone: '+1 (555) 999-0011',
    address: '1 FinCore Financial Plaza, New York, NY 10004',
    ownershipStatus: 'VERIFIED_OWNER',
    status: 'PENDING_VERIFICATION',
    kycStatus: 'PENDING_REVIEW',
    riskLevel: 'MEDIUM',
    bankBranch: 'Digital Assets & Tokenization Desk',
    routingNumber: '021000089',
    openedDate: '2025-11-20',
    minBalanceThreshold: 2000,
    overdraftLimit: 0,
    isOverdraftEligible: false,
    holds: [],
    netGrowthRate: 34.1,
    history: [
      { month: 'Aug 25', balance: 35000.00, inflow: 10000, outflow: 2000 },
      { month: 'Sep 25', balance: 39000.00, inflow: 8000, outflow: 4000 },
      { month: 'Oct 25', balance: 44000.00, inflow: 9000, outflow: 4000 },
      { month: 'Nov 25', balance: 48000.00, inflow: 7000, outflow: 3000 },
      { month: 'Dec 25', balance: 59000.00, inflow: 15000, outflow: 4000 },
      { month: 'Jan 26', balance: 52000.00, inflow: 3000, outflow: 10000 },
      { month: 'Feb 26', balance: 55000.00, inflow: 6000, outflow: 3000 },
      { month: 'Mar 26', balance: 57500.00, inflow: 5000, outflow: 2500 },
      { month: 'Apr 26', balance: 58900.00, inflow: 4000, outflow: 2600 },
      { month: 'May 26', balance: 60100.00, inflow: 3000, outflow: 1800 },
      { month: 'Jun 26', balance: 61200.00, inflow: 4000, outflow: 2900 },
      { month: 'Jul 26', balance: 62150.00, inflow: 3000, outflow: 2050 }
    ]
  },
  {
    id: 'acc-108',
    accountNumber: '2019-4820-1102',
    type: 'SAVINGS',
    name: 'Dormant Legacy Account',
    balance: 4200.00,
    availableBalance: 4200.00,
    currency: 'USD',
    holderName: 'Arthur Pendelton',
    holderSSN: '987-00-1122',
    email: 'arthur.p@legacy.com',
    phone: '+1 (555) 111-2233',
    address: '14 Elm Street, Albany, NY 12207',
    ownershipStatus: 'VERIFIED_OWNER',
    status: 'DORMANT',
    kycStatus: 'VERIFIED',
    riskLevel: 'LOW',
    bankBranch: 'Upstate Regional Branch',
    routingNumber: '021000089',
    openedDate: '2018-05-10',
    minBalanceThreshold: 100,
    overdraftLimit: 0,
    isOverdraftEligible: false,
    holds: [],
    netGrowthRate: 0.1,
    history: [
      { month: 'Aug 25', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Sep 25', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Oct 25', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Nov 25', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Dec 25', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Jan 26', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Feb 26', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Mar 26', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Apr 26', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'May 26', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Jun 26', balance: 4200.00, inflow: 0, outflow: 0 },
      { month: 'Jul 26', balance: 4200.00, inflow: 0, outflow: 0 }
    ]
  }
];

const STORAGE_KEY = 'fincore_accounts_data';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  readonly accounts = signal<Account[]>(this.loadAccountsFromStorage());
  readonly activeAccountId = signal<string>('acc-101');
  readonly isDataMasked = signal<boolean>(false);

  constructor() {
    // Listen for storage changes across browser windows / admin logins
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY && event.newValue) {
          try {
            const fresh = JSON.parse(event.newValue) as Account[];
            this.accounts.set(fresh);
          } catch (e) {
            console.error('Failed to sync accounts from storage', e);
          }
        }
      });
    }
  }

  readonly activeAccount = computed(() => {
    return this.accounts().find(a => a.id === this.activeAccountId()) || this.accounts()[0];
  });

  selectAccount(id: string) {
    this.activeAccountId.set(id);
  }

  toggleDataMasking() {
    this.isDataMasked.update(v => !v);
  }

  // Inter-Account Funds Transfer
  transferFunds(fromId: string, toId: string, amount: number): { success: boolean; message: string } {
    if (amount <= 0) return { success: false, message: 'Transfer amount must be greater than $0.' };
    if (fromId === toId) return { success: false, message: 'Source and target accounts must be different.' };

    const source = this.accounts().find(a => a.id === fromId);
    const target = this.accounts().find(a => a.id === toId);

    if (!source || !target) return { success: false, message: 'Account not found.' };

    const maxTransfer = source.availableBalance + (source.isOverdraftEligible ? source.overdraftLimit : 0);
    if (amount > maxTransfer) {
      return { success: false, message: `Insufficient funds. Available limit is $${maxTransfer.toFixed(2)}` };
    }

    this.updateAccount({
      id: source.id,
      balance: source.balance - amount
    });

    this.updateAccount({
      id: target.id,
      balance: target.balance + amount
    });

    return {
      success: true,
      message: `Transferred $${amount.toFixed(2)} from ${source.name} to ${target.name}.`
    };
  }

  // Dynamic Editing & Updates (Persists across Admin sessions)
  updateAccount(updatedAccount: Partial<Account> & { id: string }) {
    this.accounts.update(list => {
      const updatedList = list.map(acc => {
        if (acc.id === updatedAccount.id) {
          const newBal = updatedAccount.balance !== undefined ? updatedAccount.balance : acc.balance;
          const holdsTotal = acc.holds.reduce((sum, h) => h.status === 'ACTIVE_HOLD' ? sum + h.amount : sum, 0);
          return {
            ...acc,
            ...updatedAccount,
            availableBalance: newBal - holdsTotal
          };
        }
        return acc;
      });
      this.saveAccountsToStorage(updatedList);
      return updatedList;
    });
  }

  updateAccountStatus(id: string, newStatus: AccountStatus) {
    this.updateAccount({ id, status: newStatus });
  }

  updateKYCStatus(id: string, kycStatus: KYCStatus) {
    this.updateAccount({ id, kycStatus });
  }

  createAccount(form: OnboardingForm): Account {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAccNo = `1234-5678-${randomSuffix}`;
    const newId = `acc-${Date.now()}`;

    const newAcc: Account = {
      id: newId,
      accountNumber: newAccNo,
      type: form.accountType,
      name: `${form.fullName}'s ${form.accountType.replace('_', ' ')}`,
      balance: form.initialDeposit,
      availableBalance: form.initialDeposit,
      currency: 'USD',
      holderName: form.fullName,
      holderSSN: form.ssn || '987-65-1234',
      email: form.email,
      phone: form.phone,
      address: form.address,
      ownershipStatus: 'VERIFIED_OWNER',
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
      riskLevel: 'LOW',
      bankBranch: 'FinCore Digital Hub',
      routingNumber: '021000089',
      openedDate: new Date().toISOString().split('T')[0],
      minBalanceThreshold: form.minBalanceThreshold || 200,
      overdraftLimit: form.overdraftOptIn ? 500 : 0,
      isOverdraftEligible: form.overdraftOptIn,
      holds: [],
      netGrowthRate: 10.0,
      history: [
        { month: 'May 26', balance: form.initialDeposit * 0.9, inflow: form.initialDeposit * 0.9, outflow: 0 },
        { month: 'Jun 26', balance: form.initialDeposit * 0.95, inflow: form.initialDeposit * 0.05, outflow: 0 },
        { month: 'Jul 26', balance: form.initialDeposit, inflow: form.initialDeposit * 0.05, outflow: 0 }
      ]
    };

    this.accounts.update(list => {
      const newList = [newAcc, ...list];
      this.saveAccountsToStorage(newList);
      return newList;
    });

    this.selectAccount(newId);
    return newAcc;
  }

  closeAccount(id: string): { success: boolean; message: string } {
    const acc = this.accounts().find(a => a.id === id);
    if (!acc) return { success: false, message: 'Account not found.' };

    const activeHolds = acc.holds.filter(h => h.status === 'ACTIVE_HOLD');
    if (activeHolds.length > 0) {
      return { success: false, message: `Cannot close account. Active pending hold of $${activeHolds[0].amount} exists.` };
    }

    if (acc.balance !== 0) {
      return { success: false, message: `Cannot close account. Remaining balance is $${acc.balance.toFixed(2)}. Please settle remaining funds first.` };
    }

    this.updateAccountStatus(id, 'CLOSED');
    return { success: true, message: `Account ${acc.accountNumber} has been successfully closed.` };
  }

  maskAccountNumber(accountNum: string, forceMask?: boolean): string {
    const shouldMask = forceMask !== undefined ? forceMask : this.isDataMasked();
    if (!shouldMask) return accountNum;
    const last4 = accountNum.slice(-4);
    return `••••-••••-${last4}`;
  }

  maskTaxId(ssn: string, forceMask?: boolean): string {
    const shouldMask = forceMask !== undefined ? forceMask : this.isDataMasked();
    if (!shouldMask) return ssn;
    const last4 = ssn.slice(-4);
    return `•••-••-${last4}`;
  }

  formatCurrency(val: number, forceMask?: boolean, currency: string = 'USD'): string {
    const shouldMask = forceMask !== undefined ? forceMask : this.isDataMasked();
    if (shouldMask) return '$•••••.••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(val);
  }

  private loadAccountsFromStorage(): Account[] {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as Account[];
        }
      }
    } catch (e) {
      console.error('Failed to read accounts from localStorage', e);
    }
    return INITIAL_ACCOUNTS;
  }

  private saveAccountsToStorage(data: Account[]) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
    }
  }
}
