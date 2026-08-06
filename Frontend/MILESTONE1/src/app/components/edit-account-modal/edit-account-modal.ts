import { Component, inject, signal, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';
import { Account } from '../../models/banking.models';

@Component({
  selector: 'app-edit-account-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="title-group">
            <span class="icon">✏️</span>
            <div>
              <h3>DYNAMIC ACCOUNT & CUSTOMER DATA EDITOR</h3>
              <div class="subtitle">Modify real-time account balances, holder details, routing codes & limits</div>
            </div>
          </div>
          <button type="button" class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <div class="modal-body" *ngIf="editData">
          <div class="form-grid-2">
            <div class="f-group">
              <label>Customer Full Name</label>
              <input type="text" [(ngModel)]="editData.holderName" class="f-input" />
            </div>

            <div class="f-group">
              <label>Account Display Name</label>
              <input type="text" [(ngModel)]="editData.name" class="f-input" />
            </div>

            <div class="f-group">
              <label>SSN / Tax Identification Number</label>
              <input type="text" [(ngModel)]="editData.holderSSN" class="f-input" />
            </div>

            <div class="f-group">
              <label>Ledger Balance ($ USD)</label>
              <input type="number" [(ngModel)]="editData.balance" class="f-input highlight-input" />
            </div>

            <div class="f-group">
              <label>Email Address</label>
              <input type="email" [(ngModel)]="editData.email" class="f-input" />
            </div>

            <div class="f-group">
              <label>Phone Number</label>
              <input type="text" [(ngModel)]="editData.phone" class="f-input" />
            </div>

            <div class="f-group">
              <label>Bank Branch Name</label>
              <input type="text" [(ngModel)]="editData.bankBranch" class="f-input" />
            </div>

            <div class="f-group">
              <label>Routing Number</label>
              <input type="text" [(ngModel)]="editData.routingNumber" class="f-input font-mono" />
            </div>

            <div class="f-group">
              <label>Minimum Balance Alert Threshold ($)</label>
              <input type="number" [(ngModel)]="editData.minBalanceThreshold" class="f-input" />
            </div>

            <div class="f-group">
              <label>Overdraft Credit Limit ($)</label>
              <input type="number" [(ngModel)]="editData.overdraftLimit" class="f-input" />
            </div>
          </div>

          <div class="f-group full-width">
            <label>Mailing Address</label>
            <input type="text" [(ngModel)]="editData.address" class="f-input" />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
          <button type="button" class="btn-save" (click)="saveChanges()">
            💾 Save Dynamic Account Updates
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
      z-index: 1300;
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
      max-width: 680px;
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
    .title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .icon { font-size: 1.2rem; }
    .title-group h3 { font-size: 0.95rem; font-weight: 800; color: #ffffff; margin: 0; }
    .subtitle { font-size: 0.68rem; color: #94a3b8; }
    .close-btn { background: none; border: none; color: #9ca3af; font-size: 1.2rem; cursor: pointer; }

    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .f-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .f-group.full-width { grid-column: span 2; }
    .f-group label {
      font-size: 0.72rem;
      font-weight: 700;
      color: #9ca3af;
    }
    .f-input {
      background: #1f2937;
      border: 1px solid #374151;
      color: #ffffff;
      padding: 0.55rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
    }
    .highlight-input {
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      font-weight: 800;
    }

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
    .btn-save {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-weight: 800;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .font-mono { font-family: monospace; }
  `]
})
export class EditAccountModalComponent implements OnInit {
  accountService = inject(AccountService);
  deliveryService = inject(DeliveryStorageService);

  readonly accountId = input<string>('');
  readonly close = output<void>();

  editData: Account | null = null;

  ngOnInit() {
    const idToEdit = this.accountId() || this.accountService.activeAccountId();
    const found = this.accountService.accounts().find(a => a.id === idToEdit);
    if (found) {
      this.editData = { ...found };
    }
  }

  closeModal() {
    this.close.emit();
  }

  saveChanges() {
    if (!this.editData) return;
    this.accountService.updateAccount(this.editData);
    this.deliveryService.showToast(
      'Account Data Updated',
      `Dynamic edits saved for ${this.editData.holderName} (${this.editData.name}).`
    );
    this.closeModal();
  }
}
