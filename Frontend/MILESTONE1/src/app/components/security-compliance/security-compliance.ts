import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { DeliveryStorageService } from '../../services/delivery-storage.service';

@Component({
  selector: 'app-security-compliance',
  imports: [CommonModule],
  template: `
    <div class="compliance-card">
      <div class="compliance-header">
        <div class="title-group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <div>
            <h3>SECURITY, PRIVACY & COMPLIANCE GOVERNANCE LAYER</h3>
            <div class="subtitle">Enforces account ownership validation, PII masking & audit logging</div>
          </div>
        </div>

        <div class="badge-shield">
          <span>SOC2 TYPE II COMPLIANT</span>
        </div>
      </div>

      <!-- Grid of 3 Compliance Pillars -->
      <div class="pillars-grid">
        <!-- 1. Ownership & Authorization Guard -->
        <div class="pillar-box">
          <div class="pillar-head">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <polyline points="17 11 19 13 23 9"/>
            </svg>
            <span>1. ACCOUNT OWNERSHIP GUARD</span>
          </div>
          <div class="pillar-body">
            <div class="status-row">
              <span>Active User:</span>
              <strong>Alexander V. Sterling</strong>
            </div>
            <div class="status-row">
              <span>Account Status:</span>
              <strong class="text-emerald">VERIFIED PRIMARY OWNER</strong>
            </div>
            <div class="status-row">
              <span>Session Authorization:</span>
              <strong class="text-blue">Multi-Factor Token Active</strong>
            </div>
            <div class="guard-note">
              ✓ Verified account ownership prior to statement generation. Prevents cross-account data leaks.
            </div>
          </div>
        </div>

        <!-- 2. Data Masking & PII Obfuscation -->
        <div class="pillar-box">
          <div class="pillar-head">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <span>2. DATA MASKING & PII PRIVACY</span>
          </div>
          <div class="pillar-body">
            <div class="status-row">
              <span>Masking Mode:</span>
              <strong [class.text-emerald]="accountService.isDataMasked()" [class.text-amber]="!accountService.isDataMasked()">
                {{ accountService.isDataMasked() ? 'ACTIVE (PRIVACY ON)' : 'UNMASKED (CLIENT VIEW)' }}
              </strong>
            </div>
            <div class="status-row">
              <span>Masked Account #:</span>
              <strong class="font-mono">{{ accountService.maskAccountNumber(accountService.activeAccount().accountNumber, true) }}</strong>
            </div>
            <div class="status-row">
              <span>Masked Tax ID:</span>
              <strong class="font-mono">{{ accountService.maskTaxId(accountService.activeAccount().holderSSN, true) }}</strong>
            </div>
            <div class="guard-note">
              ✓ Automatically masks sensitive account numbers, SSN/Tax IDs, and transaction amounts.
            </div>
          </div>
        </div>

        <!-- 3. PDF Password Protection -->
        <div class="pillar-box">
          <div class="pillar-head">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>3. AES-256 PDF ENCRYPTION</span>
          </div>
          <div class="pillar-body">
            <div class="status-row">
              <span>PDF Security Engine:</span>
              <strong class="text-emerald">Standard Password Encrypted</strong>
            </div>
            <div class="status-row">
              <span>Default Key Preset:</span>
              <strong>User Date of Birth (YYYYMMDD)</strong>
            </div>
            <div class="status-row">
              <span>Download Encryption:</span>
              <strong class="text-blue">Optional Client Encryption</strong>
            </div>
            <div class="guard-note">
              ✓ Protects exported PDF files against unauthorized opening via encrypted password barrier.
            </div>
          </div>
        </div>
      </div>

      <!-- Real-Time Audit Log Table -->
      <div class="audit-section">
        <div class="audit-header">
          <span>SECURITY AUDIT TRAIL LOGS</span>
          <span class="log-count">{{ deliveryService.auditLogs().length }} Recorded Events</span>
        </div>

        <table class="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event Type</th>
              <th>Target Account</th>
              <th>IP Address</th>
              <th>Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of deliveryService.auditLogs()">
              <td class="font-mono text-dim">{{ log.timestamp }}</td>
              <td><span class="event-tag">{{ log.eventType }}</span></td>
              <td class="font-mono">{{ log.accountNumberMasked }}</td>
              <td class="font-mono text-dim">{{ log.userIP }}</td>
              <td>{{ log.details }}</td>
              <td>
                <span class="status-pass">✓ {{ log.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .compliance-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .compliance-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #10b981;
    }
    .title-group h3 {
      font-size: 0.88rem;
      font-weight: 800;
      color: #f8fafc;
      margin: 0;
    }
    .subtitle {
      font-size: 0.68rem;
      color: #94a3b8;
    }
    .badge-shield {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .pillar-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1rem;
    }
    .pillar-head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.72rem;
      font-weight: 800;
      color: #60a5fa;
      margin-bottom: 0.85rem;
      padding-bottom: 0.4rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .pillar-body {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .status-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .status-row strong { color: #f1f5f9; }
    .guard-note {
      font-size: 0.65rem;
      color: #64748b;
      margin-top: 0.5rem;
      line-height: 1.4;
    }
    .text-emerald { color: #34d399; }
    .text-blue { color: #60a5fa; }
    .text-amber { color: #fbbf24; }

    .audit-section {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1rem;
    }
    .audit-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      font-weight: 800;
      color: #cbd5e1;
      margin-bottom: 0.75rem;
    }
    .log-count {
      color: #64748b;
    }
    .audit-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.75rem;
    }
    .audit-table th {
      background: #1e293b;
      color: #94a3b8;
      padding: 0.5rem 0.75rem;
      text-align: left;
      font-size: 0.68rem;
    }
    .audit-table td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
    }
    .font-mono { font-family: monospace; }
    .text-dim { color: #64748b; }
    .event-tag {
      background: rgba(59, 130, 246, 0.15);
      color: #93c5fd;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 700;
    }
    .status-pass {
      color: #34d399;
      font-weight: 700;
    }

    @media (max-width: 1000px) {
      .pillars-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SecurityComplianceComponent {
  accountService = inject(AccountService);
  deliveryService = inject(DeliveryStorageService);
}
