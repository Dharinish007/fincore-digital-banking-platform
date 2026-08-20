import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { TransactionService } from '../../services/transaction.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { TransactionHistory } from '../../models/transaction.model';
import { TransactionStatusChipComponent } from '../../components/transaction-status-chip/transaction-status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule, DatePipe, CurrencyPipe, RouterModule,
    MatButtonModule, MatIconModule,
    TransactionStatusChipComponent, EmptyStateComponent, PageHeaderComponent
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent implements OnInit {
  private txnService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  hasError = false;
  isLoading = false;

  history$!: Observable<TransactionHistory[]>;

  ngOnInit(): void {
    this.history$ = this.route.paramMap.pipe(
      tap(() => {
        this.isLoading = true;
        this.hasError = false;
      }),
      switchMap(params => {
        const accountId = params.get('accountId');
        return this.txnService.getTransactionHistory(accountId ?? undefined).pipe(
          catchError(err => {
            console.error('Error loading history:', err);
            this.hasError = true;
            return of([]);
          })
        );
      }),
      tap(() => this.isLoading = false)
    );
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      DEPOSIT:    'arrow_downward',
      WITHDRAWAL: 'arrow_upward',
      TRANSFER:   'swap_horiz',
      PAYMENT:    'payments',
      FEE:        'price_check'
    };
    return icons[type] ?? 'receipt';
  }

  isCredit(type: string): boolean {
    return type === 'DEPOSIT';
  }

  isDebit(type: string): boolean {
    return ['WITHDRAWAL', 'PAYMENT', 'FEE'].includes(type);
  }

  onCreateTransaction(): void {
    this.router.navigate(['/transaction/new']);
  }
}
