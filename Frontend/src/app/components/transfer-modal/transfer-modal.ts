import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';

@Component({
  selector: 'app-transfer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="title-group">
            <span class="icon">🔄</span>
            <div>
              <h3>INTER-ACCOUNT FUNDS TRANSFER SERVICE</h3>
              <div class="subtitle">Execute instant real-time transfers between FinCore Nexus accounts</div>
            </div>
          </div>
          <button type="button" class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <!-- Source Account Selector -->
          <div class="f-group">
            <label>From Source Account (Debit):</label>
            <select [(ngModel)]="fromAccountId" class="f-select">
              <option *ngFor="let acc of accountService.accounts()" [value]="acc.id">
                {{ acc.name }} — {{ accountService.maskAccountNumber(acc.accountNumber) }} ($ {{ acc.availableBalance.toFixed(2) }} Available)
              </option>
            </select>
          </div>

          <!-- Target Account Selector -->
          <div class="f-group">
            <label>To Destination Account (Credit):</label>
            <select [(ngModel)]="toAccountId" class="f-select">
              <option *ngFor="let acc of availableTargetAccounts()" [value]="acc.id">
                {{ acc.name }} — {{ accountService.maskAccountNumber(acc.accountNumber) }} ($ {{ acc.balance.toFixed(2) }})
              </option>
            </select>
          </div>

          <!-- Transfer Amount -->
          <div class="f-group">
            <label>Transfer Amount ($ USD):</label>
            <input 
              type="number" 
              [(ngModel)]="amount" 
              placeholder="e.g. 1000.00" 
              class="f-input highlight-input" 
              min="1" 
            />
          </div>

          <div class="f-group">
            <label>Reference Note:</label>
            <input 
              type="text" 
              [(ngModel)]="note" 
              placeholder="e.g. Internal Liquidity Transfer" 
              class="f-input" 
            />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
          <button type="button" class="btn-transfer" (click)="executeTransfer()">
            ⚡ Confirm & Transfer Funds
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      z-index: 1400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-container {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      width: 100%;
      max-width: 580px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .modal-header {
      padding: 1rem 1.5rem;
      background: #0f172a;
      border-bottom: 1px solid #1f2937;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title-group { display: flex; align-items: center; gap: 0.75rem; }
    .icon { font-size: 1.3rem; }
    .title-group h3 { font-size: 0.95rem; font-weight: 800; color: #ffffff; margin: 0; }
    .subtitle { font-size: 0.68rem; color: #94a3b8; }
    .close-btn { background: none; border: none; color: #9ca3af; font-size: 1.2rem; cursor: pointer; }

    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }
    .f-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .f-group label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; }
    .f-select, .f-input {
      background: #1f2937;
      border: 1px solid #374151;
      color: #ffffff;
      padding: 0.6rem 0.85rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }
    .highlight-input { border-color: #10b981; font-weight: 800; }

    .modal-footer {
      padding: 1rem 1.5rem;
      background: #0f172a;
      border-top: 1px solid #1f2937;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .btn-cancel {
      background: #1f2937;
      border: 1px solid #374151;
      color: #cbd5e1;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-transfer {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-weight: 800;
      font-size: 0.8rem;
      cursor: pointer;
    }
  `]
})
export class TransferModalComponent {
  accountService = inject(AccountService);
  deliveryService = inject(DeliveryStorageService);

  readonly close = output<void>();

  fromAccountId = this.accountService.activeAccountId();
  toAccountId = this.accountService.accounts()[1]?.id || 'acc-102';
  amount: number | null = 1000;
  note = 'Inter-Account Transfer';

  availableTargetAccounts() {
    return this.accountService.accounts().filter(a => a.id !== this.fromAccountId);
  }

  closeModal() {
    this.close.emit();
  }

  executeTransfer() {
    if (!this.amount || this.amount <= 0) return;
    const res = this.accountService.transferFunds(this.fromAccountId, this.toAccountId, this.amount);
    this.deliveryService.showToast(
      res.success ? 'Transfer Executed' : 'Transfer Failed',
      res.message,
      res.success ? 'success' : 'warning'
    );
    if (res.success) {
      this.closeModal();
    }
  }
}
