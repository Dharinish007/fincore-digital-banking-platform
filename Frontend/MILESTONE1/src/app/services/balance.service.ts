import { Injectable, inject, signal, computed } from '@angular/core';
import { AccountService } from './account.service';
import { DeliveryStorageService } from './delivery-storage.service';
import { PendingHold } from '../models/banking.models';

export interface CurrencyRate {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number;
}

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private accountService = inject(AccountService);
  private deliveryService = inject(DeliveryStorageService);

  readonly selectedCurrency = signal<string>('USD');

  readonly supportedCurrencies: CurrencyRate[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
    { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.78 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUSD: 154.5 },
    { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateToUSD: 1.38 }
  ];

  // Calculated Active Balance Data
  readonly ledgerBalance = computed(() => this.accountService.activeAccount().balance);
  readonly availableBalance = computed(() => this.accountService.activeAccount().availableBalance);
  readonly minThreshold = computed(() => this.accountService.activeAccount().minBalanceThreshold);
  readonly overdraftLimit = computed(() => this.accountService.activeAccount().overdraftLimit);
  readonly holds = computed(() => this.accountService.activeAccount().holds || []);

  readonly pendingHoldsTotal = computed(() => {
    return this.holds()
      .filter(h => h.status === 'ACTIVE_HOLD')
      .reduce((sum, h) => sum + h.amount, 0);
  });

  readonly isLowBalance = computed(() => {
    return this.availableBalance() < this.minThreshold();
  });

  readonly isOverdrawn = computed(() => {
    return this.ledgerBalance() < 0;
  });

  readonly overdraftPenaltyFee = computed(() => {
    if (this.ledgerBalance() < 0) {
      return 35.00; // Standard $35 Overdraft Fee
    }
    return 0;
  });

  // Currency Conversion Function
  convertBalance(amountInUSD: number, targetCurrencyCode: string): string {
    const curr = this.supportedCurrencies.find(c => c.code === targetCurrencyCode) || this.supportedCurrencies[0];
    const converted = amountInUSD * curr.rateToUSD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.code
    }).format(converted);
  }

  // Reactive Deposit Operation
  deposit(amount: number, description: string = 'Cash / Check Deposit') {
    if (amount <= 0) return;
    const acc = this.accountService.activeAccount();
    const newBal = acc.balance + amount;
    this.accountService.updateAccount({
      id: acc.id,
      balance: newBal
    });

    this.deliveryService.addAuditLog(
      'BALANCE_DEPOSIT',
      `Deposited $${amount.toFixed(2)} to ${acc.name}. New ledger balance: $${newBal.toFixed(2)}`
    );
    this.deliveryService.showToast(
      'Deposit Successful',
      `$${amount.toFixed(2)} deposited into ${acc.name}. Balance updated live.`
    );
  }

  // Reactive Withdrawal Operation
  withdraw(amount: number, description: string = 'Withdrawal / Debit') {
    if (amount <= 0) return;
    const acc = this.accountService.activeAccount();

    const maxSpendable = acc.availableBalance + (acc.isOverdraftEligible ? acc.overdraftLimit : 0);
    if (amount > maxSpendable) {
      this.deliveryService.showToast(
        'Withdrawal Declined',
        `Insufficient funds. Max available limit (including overdraft) is $${maxSpendable.toFixed(2)}`,
        'warning'
      );
      return;
    }

    const newBal = acc.balance - amount;
    this.accountService.updateAccount({
      id: acc.id,
      balance: newBal
    });

    if (newBal < 0) {
      this.deliveryService.showToast(
        'Overdraft Warning',
        `Account balance is negative ($${newBal.toFixed(2)}). An overdraft fee of $35.00 applies.`,
        'warning'
      );
    } else {
      this.deliveryService.showToast(
        'Withdrawal Successful',
        `$${amount.toFixed(2)} withdrawn from ${acc.name}.`
      );
    }

    this.deliveryService.addAuditLog(
      'BALANCE_WITHDRAW',
      `Withdrew $${amount.toFixed(2)} from ${acc.name}. New balance: $${newBal.toFixed(2)}`
    );
  }

  // Add a Pending Hold
  addHold(description: string, amount: number, holdType: PendingHold['holdType']) {
    const acc = this.accountService.activeAccount();
    const newHold: PendingHold = {
      id: 'hold-' + Date.now(),
      description,
      amount,
      holdType,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 86400000).toISOString(), // 3 days
      status: 'ACTIVE_HOLD'
    };

    const updatedHolds = [...acc.holds, newHold];
    const holdsTotal = updatedHolds.filter(h => h.status === 'ACTIVE_HOLD').reduce((sum, h) => sum + h.amount, 0);

    this.accountService.updateAccount({
      id: acc.id,
      holds: updatedHolds,
      availableBalance: acc.balance - holdsTotal
    });

    this.deliveryService.showToast(
      'Pending Hold Created',
      `Placed $${amount.toFixed(2)} reserve hold on ${acc.name} for ${description}.`
    );
  }

  // Release a Pending Hold
  releaseHold(holdId: string) {
    const acc = this.accountService.activeAccount();
    const updatedHolds = acc.holds.map(h => h.id === holdId ? { ...h, status: 'RELEASED' as const } : h);
    const holdsTotal = updatedHolds.filter(h => h.status === 'ACTIVE_HOLD').reduce((sum, h) => sum + h.amount, 0);

    this.accountService.updateAccount({
      id: acc.id,
      holds: updatedHolds,
      availableBalance: acc.balance - holdsTotal
    });

    this.deliveryService.showToast(
      'Hold Released',
      `Reserved funds released. Available balance restored by hold amount.`
    );
  }
}
