import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoanProduct, LoanType } from '../../models/loan.models';

@Component({
  selector: 'app-loan-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatIconModule, MatButtonModule],
  template: `
    <div class="product-card" [class.selected]="isSelected" (click)="select.emit(product)">
      <div class="card-top">
        <div class="icon-box" [ngClass]="'icon-' + product.loanType.toLowerCase()">
          <mat-icon>{{ getProductIcon(product.loanType) }}</mat-icon>
        </div>
        <div class="rate-badge">
          <span class="rate-value">{{ product.interestRate }}%</span>
          <span class="rate-sub">APR</span>
        </div>
      </div>

      <div class="card-body">
        <h4 class="product-title">{{ product.name }}</h4>
        <p class="product-desc">{{ product.description || 'Flexible financing with competitive rates and simple repayment terms.' }}</p>

        <div class="product-features">
          <div class="feature-row">
            <span class="feature-label">Loan Limits</span>
            <span class="feature-val">{{ product.minAmount | currency:'USD':'symbol':'1.0-0' }} – {{ product.maxAmount | currency:'USD':'symbol':'1.0-0' }}</span>
          </div>
          <div class="feature-row">
            <span class="feature-label">Tenure Range</span>
            <span class="feature-val">{{ product.minTenureMonths }} to {{ product.maxTenureMonths }} Months</span>
          </div>
          @if (product.processingFeePercentage) {
            <div class="feature-row">
              <span class="feature-label">Processing Fee</span>
              <span class="feature-val">{{ product.processingFeePercentage }}%</span>
            </div>
          }
        </div>
      </div>

      <div class="card-footer">
        <button mat-stroked-button class="select-btn" [class.selected-btn]="isSelected" type="button">
          <mat-icon>{{ isSelected ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
          {{ isSelected ? 'Selected Product' : 'Select Product' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all var(--transition-fast);
      position: relative;

      &:hover {
        border-color: var(--color-primary-light);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      &.selected {
        border-color: var(--color-primary);
        background: var(--color-surface-selected, var(--color-surface));
        box-shadow: 0 0 0 1px var(--color-primary), var(--shadow-md);
      }
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .icon-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--color-primary-light);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      &.icon-home {
        background: #e0f2fe;
        color: #0284c7;
      }
      &.icon-auto {
        background: #fef3c7;
        color: #d97706;
      }
      &.icon-business {
        background: #f3e8ff;
        color: #9333ea;
      }
      &.icon-education {
        background: #dcfce7;
        color: #16a34a;
      }
    }

    .rate-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .rate-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-primary);
        line-height: 1.1;
      }
      .rate-sub {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--color-text-muted);
        text-transform: uppercase;
      }
    }

    .product-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.35rem;
    }

    .product-desc {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      line-height: 1.4;
      margin: 0 0 1rem;
      min-height: 2.3rem;
    }

    .product-features {
      border-top: 1px solid var(--color-border);
      padding-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;

      .feature-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.8125rem;

        .feature-label {
          color: var(--color-text-secondary);
        }
        .feature-val {
          font-weight: 600;
          color: var(--color-text-primary);
        }
      }
    }

    .card-footer {
      .select-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border-radius: var(--radius-md);

        &.selected-btn {
          background: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
        }
      }
    }
  `]
})
export class LoanProductCardComponent {
  @Input({ required: true }) product!: LoanProduct;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<LoanProduct>();

  getProductIcon(type: LoanType): string {
    switch (type) {
      case LoanType.HOME: return 'home';
      case LoanType.AUTO: return 'directions_car';
      case LoanType.BUSINESS: return 'business_center';
      case LoanType.EDUCATION: return 'school';
      case LoanType.PERSONAL:
      default: return 'person';
    }
  }
}
