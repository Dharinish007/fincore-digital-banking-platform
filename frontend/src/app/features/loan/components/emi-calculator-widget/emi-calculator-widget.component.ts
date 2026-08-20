import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-emi-calculator-widget',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, MatSliderModule, MatIconModule, MatButtonModule],
  template: `
    <div class="calculator-card">
      <div class="calc-header">
        <div class="calc-title-box">
          <mat-icon class="calc-icon">calculate</mat-icon>
          <div>
            <h4 class="calc-title">Loan EMI Calculator</h4>
            <p class="calc-subtitle">Estimate your monthly payment and interest</p>
          </div>
        </div>
      </div>

      <div class="calc-body">
        <!-- Amount Slider -->
        <div class="slider-group">
          <div class="slider-header">
            <span class="slider-label">Loan Amount</span>
            <span class="slider-val">{{ amount | currency:'USD':'symbol':'1.0-0' }}</span>
          </div>
          <mat-slider min="1000" max="100000" step="1000" discrete>
            <input matSliderThumb [(ngModel)]="amount" (ngModelChange)="onCalculate()">
          </mat-slider>
          <div class="range-bounds">
            <span>$1,000</span>
            <span>$100,000</span>
          </div>
        </div>

        <!-- Tenure Slider -->
        <div class="slider-group">
          <div class="slider-header">
            <span class="slider-label">Tenure (Months)</span>
            <span class="slider-val">{{ tenure }} Months</span>
          </div>
          <mat-slider min="6" max="60" step="6" discrete>
            <input matSliderThumb [(ngModel)]="tenure" (ngModelChange)="onCalculate()">
          </mat-slider>
          <div class="range-bounds">
            <span>6 Mo</span>
            <span>60 Mo</span>
          </div>
        </div>

        <!-- Interest Rate Slider -->
        <div class="slider-group">
          <div class="slider-header">
            <span class="slider-label">Interest Rate (% APR)</span>
            <span class="slider-val">{{ interestRate }}%</span>
          </div>
          <mat-slider min="4" max="25" step="0.5" discrete>
            <input matSliderThumb [(ngModel)]="interestRate" (ngModelChange)="onCalculate()">
          </mat-slider>
          <div class="range-bounds">
            <span>4.0%</span>
            <span>25.0%</span>
          </div>
        </div>

        <!-- Results Projection -->
        <div class="calc-result-box">
          <div class="monthly-emi-highlight">
            <span class="emi-label">Monthly EMI Payment</span>
            <h3 class="emi-amount">{{ monthlyEmi | currency:'USD':'symbol':'1.2-2' }}</h3>
          </div>
          
          <div class="result-details">
            <div class="detail-col">
              <span class="detail-lbl">Principal</span>
              <span class="detail-val">{{ amount | currency:'USD':'symbol':'1.0-0' }}</span>
            </div>
            <div class="detail-col">
              <span class="detail-lbl">Total Interest</span>
              <span class="detail-val text-amber">{{ totalInterest | currency:'USD':'symbol':'1.2-2' }}</span>
            </div>
            <div class="detail-col">
              <span class="detail-lbl">Total Payable</span>
              <span class="detail-val">{{ totalPayable | currency:'USD':'symbol':'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calculator-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    .calc-header {
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.75rem;
    }

    .calc-title-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .calc-icon {
        color: var(--color-primary);
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .calc-title {
        font-size: 1.05rem;
        font-weight: 600;
        margin: 0;
        color: var(--color-text-primary);
      }

      .calc-subtitle {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin: 0;
      }
    }

    .slider-group {
      margin-bottom: 1rem;

      .slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;

        .slider-label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .slider-val {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-primary);
        }
      }

      mat-slider {
        width: 100%;
      }

      .range-bounds {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: var(--color-text-muted);
      }
    }

    .calc-result-box {
      background: var(--color-background-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-top: 1.25rem;

      .monthly-emi-highlight {
        text-align: center;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px dashed var(--color-border);

        .emi-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-text-muted);
        }

        .emi-amount {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-primary);
          margin: 0.25rem 0 0;
        }
      }

      .result-details {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        text-align: center;

        .detail-col {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .detail-lbl {
            font-size: 0.7rem;
            color: var(--color-text-muted);
          }

          .detail-val {
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--color-text-primary);

            &.text-amber {
              color: #d97706;
            }
          }
        }
      }
    }
  `]
})
export class EmiCalculatorWidgetComponent implements OnInit {
  private loanService = inject(LoanService);

  amount = 15000;
  tenure = 24;
  interestRate = 9.5;

  monthlyEmi = 0;
  totalInterest = 0;
  totalPayable = 0;

  ngOnInit(): void {
    this.onCalculate();
  }

  onCalculate(): void {
    // Exact standard reducing balance formula
    const p = this.amount;
    const r = this.interestRate / 12 / 100;
    const n = this.tenure;

    if (r === 0) {
      this.monthlyEmi = p / n;
    } else {
      const pow = Math.pow(1 + r, n);
      this.monthlyEmi = (p * r * pow) / (pow - 1);
    }

    this.totalPayable = this.monthlyEmi * n;
    this.totalInterest = this.totalPayable - p;
  }
}
