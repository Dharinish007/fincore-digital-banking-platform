import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';

@Component({
  selector: 'app-email-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div>
              <h3>AUTOMATED EMAIL DELIVERY & ENCRYPTION DISPATCH</h3>
              <div class="modal-subtitle">Dispatch password-protected PDF bank statements directly to client email</div>
            </div>
          </div>
          <button type="button" class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <!-- Recipient Email -->
          <div class="form-group">
            <label class="form-label">Recipient Email Address</label>
            <input 
              type="email" 
              [(ngModel)]="recipientEmail" 
              placeholder="e.g. alexander.sterling@apexwealth.com" 
              class="form-input"
            />
          </div>

          <!-- Dispatch Frequency -->
          <div class="form-group">
            <label class="form-label">Delivery Schedule & Frequency</label>
            <div class="radio-grid">
              <label class="radio-card" [class.selected]="frequency === 'INSTANT'">
                <input type="radio" name="freq" value="INSTANT" [(ngModel)]="frequency" />
                <div>
                  <div class="rc-title">Instant Single Dispatch</div>
                  <div class="rc-desc">Send current statement immediately to client email.</div>
                </div>
              </label>

              <label class="radio-card" [class.selected]="frequency === 'MONTHLY'">
                <input type="radio" name="freq" value="MONTHLY" [(ngModel)]="frequency" />
                <div>
                  <div class="rc-title">Automated Monthly Schedule</div>
                  <div class="rc-desc">Automatically dispatch statement on the 1st of every month.</div>
                </div>
              </label>

              <label class="radio-card" [class.selected]="frequency === 'QUARTERLY'">
                <input type="radio" name="freq" value="QUARTERLY" [(ngModel)]="frequency" />
                <div>
                  <div class="rc-title">Quarterly Tax Schedule</div>
                  <div class="rc-desc">Dispatch comprehensive statements every 3 months for tax filing.</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Password Protection Box -->
          <div class="encryption-box">
            <div class="box-header">
              <label class="toggle-switch">
                <input type="checkbox" [(ngModel)]="isEncrypted" />
                <span class="slider"></span>
              </label>
              <div>
                <div class="eb-title">PDF Password Encryption (FINRA/GDPR Compliance)</div>
                <div class="eb-subtitle">Encrypts the attachment with AES-256 standard password protection.</div>
              </div>
            </div>

            <div class="password-details" *ngIf="isEncrypted">
              <div class="form-group">
                <label class="form-label">Password Preset standard:</label>
                <select [(ngModel)]="passwordType" class="form-input">
                  <option value="DOB">User Date of Birth (Format: YYYYMMDD)</option>
                  <option value="PAN">SSN / Tax Identification Number (Last 6 Digits)</option>
                  <option value="CUSTOM">Custom Security Secret Key</option>
                </select>
              </div>

              <div class="password-preview-notice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>
                  The recipient will be required to enter 
                  <strong *ngIf="passwordType === 'DOB'">their Date of Birth (e.g. 19880412)</strong>
                  <strong *ngIf="passwordType === 'PAN'">SSN / Tax ID (e.g. 654321)</strong>
                  <strong *ngIf="passwordType === 'CUSTOM'">their assigned secure client key</strong>
                  to unlock the PDF document.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
          <button type="button" class="btn-dispatch" (click)="sendEmail()" [disabled]="!recipientEmail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Dispatch Encrypted Statement
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
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-container {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      width: 100%;
      max-width: 600px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .modal-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0f172a;
    }
    .modal-title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #10b981;
    }
    .modal-title-group h3 {
      font-size: 0.9rem;
      font-weight: 800;
      color: #f8fafc;
      margin: 0;
    }
    .modal-subtitle {
      font-size: 0.68rem;
      color: #94a3b8;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
    }
    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-label {
      font-size: 0.72rem;
      font-weight: 800;
      color: #cbd5e1;
      letter-spacing: 0.5px;
    }
    .form-input {
      background: #0f172a;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 0.6rem 0.85rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }
    .radio-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .radio-card {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: #0f172a;
      border: 1px solid #334155;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .radio-card.selected {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.08);
    }
    .rc-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .rc-desc {
      font-size: 0.68rem;
      color: #94a3b8;
    }
    .encryption-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1rem;
    }
    .box-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .eb-title {
      font-size: 0.8rem;
      font-weight: 800;
      color: #f8fafc;
    }
    .eb-subtitle {
      font-size: 0.68rem;
      color: #94a3b8;
    }
    .password-details {
      margin-top: 1rem;
      padding-top: 0.85rem;
      border-top: 1px solid #334155;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .password-preview-notice {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fde047;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.72rem;
    }
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 38px;
      height: 22px;
    }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: #334155;
      transition: .4s;
      border-radius: 34px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    input:checked + .slider { background-color: #10b981; }
    input:checked + .slider:before { transform: translateX(16px); }

    .modal-footer {
      padding: 1rem 1.5rem;
      background: #0f172a;
      border-top: 1px solid #334155;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .btn-cancel {
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-dispatch {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .btn-dispatch:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class EmailModalComponent {
  accountService = inject(AccountService);
  deliveryService = inject(DeliveryStorageService);

  readonly close = output<void>();

  recipientEmail = 'alexander.sterling@apexwealth.com';
  frequency: 'INSTANT' | 'MONTHLY' | 'QUARTERLY' = 'INSTANT';
  isEncrypted = true;
  passwordType = 'DOB';

  closeModal() {
    this.close.emit();
  }

  sendEmail() {
    let hint = 'User Date of Birth (YYYYMMDD)';
    if (this.passwordType === 'PAN') hint = 'SSN / Tax Identification Number';
    if (this.passwordType === 'CUSTOM') hint = 'Custom Client Secret Key';

    this.deliveryService.dispatchEmailStatement(
      this.recipientEmail,
      this.isEncrypted,
      hint
    );
    this.closeModal();
  }
}
