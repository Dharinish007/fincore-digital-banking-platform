import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, BehaviorSubject, switchMap, tap } from 'rxjs';
import { MockTransactionService } from '../../services/mock-transaction.service';
import { TransactionSummary, TransactionFilter } from '../../models/transaction.model';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table.component';
import { TransactionFilterComponent } from '../../components/transaction-filter/transaction-filter.component';
import { TransactionSummaryCardComponent } from '../../components/transaction-summary-card/transaction-summary-card.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule,
    TransactionTableComponent, TransactionFilterComponent,
    TransactionSummaryCardComponent, PageHeaderComponent
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  private txnService = inject(MockTransactionService);

  isLoading    = true;
  transactions: TransactionSummary[] = [];
  private filter$ = new BehaviorSubject<TransactionFilter>({});

  ngOnInit(): void {
    this.filter$.pipe(
      tap(() => this.isLoading = true),
      switchMap(filter => this.txnService.getTransactions(filter))
    ).subscribe(txns => {
      this.transactions = txns;
      this.isLoading    = false;
    });
  }

  onFilterChanged(filter: TransactionFilter): void {
    this.filter$.next(filter);
  }
}
