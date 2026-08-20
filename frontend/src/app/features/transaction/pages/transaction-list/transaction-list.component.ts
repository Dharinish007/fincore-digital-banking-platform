import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, switchMap, tap, catchError, of } from 'rxjs';
import { TransactionService } from '../../services/transaction.service';
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
  private txnService = inject(TransactionService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  readonly hasError = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);
  readonly transactions = signal<TransactionSummary[]>([]);
  
  private filter$ = new BehaviorSubject<TransactionFilter>({});

  ngOnInit(): void {
    this.filter$.pipe(
      tap(() => {
        this.isLoading.set(true);
        this.hasError.set(false);
      }),
      switchMap(filter => this.txnService.getTransactions(filter).pipe(
        catchError(err => {
          console.error('Error loading transactions:', err);
          this.hasError.set(true);
          return of([]);
        })
      ))
    ).subscribe(txns => {
      this.transactions.set(txns || []);
      this.isLoading.set(false);
      this.cdr.markForCheck();
    });
  }

  onFilterChanged(filter: TransactionFilter): void {
    this.filter$.next(filter);
  }

  onCreateTransaction(): void {
    this.router.navigate(['/transaction/new']);
  }
}
