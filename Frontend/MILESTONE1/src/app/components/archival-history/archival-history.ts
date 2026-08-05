import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryStorageService } from '../../services/delivery-storage.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-archival-history',
  imports: [CommonModule],
  template: `
    <div class="archive-card">
      <div class="archive-header">
        <div class="title-group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 8v13H3V8"/>
            <path d="M1 3h22v5H1z"/>
            <path d="M10 12h4"/>
          </svg>
          <div>
            <h3>AWS S3 CLOUD ARCHIVAL STORAGE & HISTORICAL VAULT</h3>
            <div class="subtitle">Securely stored immutable statements with SHA-256 checksum audit trail</div>
          </div>
        </div>

        <div class="cloud-status">
          <span class="pulse-green"></span>
          <span>AWS S3 Vault Status: ACTIVE (AES-256 Encrypted)</span>
        </div>
      </div>

      <!-- Archives Grid / List -->
      <div class="archive-list">
        <div *ngFor="let item of deliveryService.archives()" class="archive-item">
          <div class="item-left">
            <div class="format-badge" [ngClass]="item.format.toLowerCase()">
              {{ item.format }}
            </div>
            <div class="item-meta">
              <div class="item-title">{{ item.periodLabel }}</div>
              <div class="item-s3 font-mono">{{ item.s3BucketPath }}</div>
              <div class="item-sub font-mono">
                SHA-256: {{ item.checksum.slice(0, 16) }}... • {{ item.fileSize }} • Generated: {{ item.generatedAt | date:'short' }}
              </div>
            </div>
          </div>

          <div class="item-right">
            <span class="security-chip" *ngIf="item.isPasswordProtected">
              🔒 Encrypted
            </span>

            <button type="button" class="btn-icon" (click)="redownload(item)" title="Download file from S3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Re-download
            </button>

            <button type="button" class="btn-delete" (click)="deleteItem(item.id)" title="Delete archive">
              ✕
            </button>
          </div>
        </div>

        <div *ngIf="deliveryService.archives().length === 0" class="empty-archives">
          No archived statements currently stored in S3 vault. Generated statements will appear here automatically.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .archive-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .archive-header {
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
      color: #8b5cf6;
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
    .cloud-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.72rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .pulse-green {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }
    .archive-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .archive-item {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 0.85rem 1.15rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .item-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .format-badge {
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-weight: 800;
      font-size: 0.72rem;
      text-transform: uppercase;
    }
    .format-badge.pdf { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
    .format-badge.excel { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
    .format-badge.csv { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
    .format-badge.json { background: rgba(245, 158, 11, 0.2); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.4); }

    .item-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .item-s3 {
      font-size: 0.7rem;
      color: #60a5fa;
    }
    .item-sub {
      font-size: 0.65rem;
      color: #64748b;
    }
    .item-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .security-chip {
      font-size: 0.68rem;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #c084fc;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .btn-icon {
      background: #1e293b;
      border: 1px solid #475569;
      color: #cbd5e1;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
    }
    .btn-icon:hover {
      background: #334155;
      color: #ffffff;
    }
    .btn-delete {
      background: transparent;
      border: 1px solid #475569;
      color: #94a3b8;
      border-radius: 6px;
      padding: 0.35rem 0.6rem;
      cursor: pointer;
    }
    .btn-delete:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }
    .font-mono { font-family: monospace; }
    .empty-archives {
      text-align: center;
      padding: 2rem;
      color: #64748b;
      font-size: 0.8rem;
    }
  `]
})
export class ArchivalHistoryComponent {
  deliveryService = inject(DeliveryStorageService);
  accountService = inject(AccountService);

  redownload(item: any) {
    this.deliveryService.showToast(
      'File Streamed from S3',
      `Re-downloading ${item.periodLabel} (${item.format}) directly from cloud storage vault.`
    );
  }

  deleteItem(id: string) {
    this.deliveryService.deleteArchive(id);
  }
}
