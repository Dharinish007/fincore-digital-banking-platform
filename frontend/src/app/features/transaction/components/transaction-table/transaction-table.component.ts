import {
  AfterViewInit, ChangeDetectionStrategy, Component,
  EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransactionSummary } from '../../models/transaction.model';
import { TransactionStatusChipComponent } from '../transaction-status-chip/transaction-status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, CurrencyPipe, DatePipe,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    TransactionStatusChipComponent, EmptyStateComponent
  ],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss'
})
export class TransactionTableComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) transactions: TransactionSummary[] = [];
  @Input() isLoading = false;
  @Output() createTransaction = new EventEmitter<void>();

  displayedColumns = [
    'id', 'referenceNumber', 'customerName', 'sourceAccountNumber',
    'type', 'amount', 'currency', 'status', 'transactionDate', 'createdBy', 'actions'
  ];

  dataSource = new MatTableDataSource<TransactionSummary>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) this.dataSource.data = this.transactions;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  trackById(_: number, row: TransactionSummary): string { return row.id; }
}
