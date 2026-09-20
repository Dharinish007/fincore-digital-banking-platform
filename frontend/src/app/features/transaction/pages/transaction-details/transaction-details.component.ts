import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { TransactionService } from '../../services/transaction.service';
import { Observable, switchMap, catchError, of, tap } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { TransactionStatusChipComponent } from '../../components/transaction-status-chip/transaction-status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [
    CommonModule, DatePipe, CurrencyPipe, RouterModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule,
    TransactionStatusChipComponent, EmptyStateComponent
  ],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.scss'
})
export class TransactionDetailsComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private txnService = inject(TransactionService);
  hasError = false;

  transaction$!: Observable<Transaction | undefined>;

  ngOnInit(): void {
    this.transaction$ = this.route.paramMap.pipe(
      tap(() => this.hasError = false),
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of(undefined);
        return this.txnService.getTransactionById(id).pipe(
          catchError(err => {
            console.error('Error fetching transaction details:', err);
            this.hasError = true;
            return of(undefined);
          })
        );
      })
    );
  }

  backToLedger(): void {
    this.router.navigate(['/transaction']);
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
}
