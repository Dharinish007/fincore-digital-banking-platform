import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Observable, switchMap } from 'rxjs';
import { MockTransactionService } from '../../services/mock-transaction.service';
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
  private txnService = inject(MockTransactionService);

  transaction$!: Observable<Transaction | undefined>;

  ngOnInit(): void {
    this.transaction$ = this.route.paramMap.pipe(
      switchMap(params => this.txnService.getTransactionById(params.get('id')!))
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
}
