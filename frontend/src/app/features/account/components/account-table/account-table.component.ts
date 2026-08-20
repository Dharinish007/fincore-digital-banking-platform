import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountSummary } from '../../models/account.model';
import { AccountStatusChipComponent } from '../account-status-chip/account-status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-table',
  standalone: true,
  imports: [
    CommonModule, RouterModule, CurrencyPipe, DatePipe,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    AccountStatusChipComponent, EmptyStateComponent
  ],
  templateUrl: './account-table.component.html',
  styleUrl: './account-table.component.scss'
})
export class AccountTableComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) accounts: AccountSummary[] = [];
  @Input() isLoading = false;
  @Output() openAccount = new EventEmitter<void>();

  displayedColumns = ['accountNumber', 'customerName', 'accountType', 'branch', 'balance', 'currency', 'status', 'openedAt', 'actions'];
  dataSource = new MatTableDataSource<AccountSummary>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accounts']) this.dataSource.data = this.accounts;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
