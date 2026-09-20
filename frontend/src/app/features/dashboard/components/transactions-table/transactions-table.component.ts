import { Component, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DashboardTransaction } from '../../services/dashboard.service';
import { StatusBadgeComponent, BadgeStatus } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard-transactions-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule,
    CurrencyPipe,
    DatePipe,
    StatusBadgeComponent
  ],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort class="w-100">
        
        <!-- Transaction ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Reference ID </th>
          <td mat-cell *matCellDef="let element">
            <span class="mono-id">{{ element.referenceId || element.reference || element.id }}</span>
          </td>
        </ng-container>

        <!-- Account Column -->
        <ng-container matColumnDef="accountId">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Account </th>
          <td mat-cell *matCellDef="let element">
            <span class="acc-text">{{ element.sourceAccountNumber || element.accountNumber || element.accountId }}</span>
          </td>
        </ng-container>

        <!-- Type Column -->
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Type </th>
          <td mat-cell *matCellDef="let element">
            <span class="type-pill" [ngClass]="'type-' + (element.type || '').toLowerCase()">
              {{ element.type }}
            </span>
          </td>
        </ng-container>

        <!-- Amount Column -->
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef mat-sort-header class="align-right"> Amount </th>
          <td mat-cell *matCellDef="let element" class="align-right">
            <span class="amount-val" 
              [class.amount-credit]="element.type === 'DEPOSIT'" 
              [class.amount-debit]="element.type === 'WITHDRAWAL' || element.type === 'PAYMENT' || element.type === 'FEE'">
              {{ element.type === 'DEPOSIT' ? '+' : (element.type === 'WITHDRAWAL' || element.type === 'PAYMENT' ? '-' : '') }}
              {{ element.amount | currency:(element.currency || 'USD'):'symbol':'1.2-2' }}
            </span>
          </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
          <td mat-cell *matCellDef="let element">
            <app-status-badge 
              [label]="element.status" 
              [status]="getStatusType(element.status)">
            </app-status-badge>
          </td>
        </ng-container>

        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Timestamp </th>
          <td mat-cell *matCellDef="let element">
            <span class="date-text">{{ element.createdAt | date:'MMM d, h:mm a' }}</span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        
        <!-- Empty Row -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-cell" colspan="6">
            <div class="empty-table-state">
              <span class="material-icons-round">receipt_long</span>
              <p>No recent transaction activity recorded.</p>
            </div>
          </td>
        </tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons aria-label="Select page of transactions"></mat-paginator>
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow-x: auto;
    }
    
    table {
      width: 100%;
    }
    
    .w-100 {
      width: 100%;
    }

    .align-right {
      text-align: right;
    }

    .mono-id {
      font-family: var(--font-family-mono);
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      background: var(--color-background-subtle);
      padding: 2px 6px;
      border-radius: var(--radius-xs);
      border: 1px solid var(--color-border);
      letter-spacing: -0.2px;
    }

    .acc-text {
      font-weight: 500;
      color: var(--color-text-primary);
      font-size: 0.8125rem;
    }

    .type-pill {
      display: inline-block;
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      background: var(--color-background-subtle);
      padding: 2px 6px;
      border-radius: var(--radius-xs);
      border: 1px solid var(--color-border);
      text-transform: uppercase;
      letter-spacing: 0.3px;

      &.type-deposit {
        color: var(--color-success-dark);
        background: var(--color-success-bg);
        border-color: var(--color-success-border);
      }

      &.type-withdrawal {
        color: var(--color-danger-dark);
        background: var(--color-danger-bg);
        border-color: var(--color-danger-border);
      }

      &.type-transfer {
        color: var(--color-primary);
        background: var(--color-primary-light);
        border-color: var(--color-primary-subtle);
      }
    }

    .amount-val {
      font-weight: 600;
      font-size: 0.875rem;
      font-variant-numeric: tabular-nums;
      color: var(--color-text-primary);
    }
    
    .amount-credit {
      color: var(--color-success);
    }
    
    .amount-debit {
      color: var(--color-text-primary);
    }

    .date-text {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      white-space: nowrap;
    }
    
    .empty-cell {
      padding: var(--spacing-6);
      text-align: center;
    }

    .empty-table-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--color-text-muted);
      font-size: 0.8125rem;

      .material-icons-round {
        font-size: 28px;
      }

      p {
        margin: 0;
      }
    }
  `]
})
export class DashboardTransactionsTableComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) transactions: DashboardTransaction[] = [];
  
  displayedColumns: string[] = ['id', 'accountId', 'type', 'amount', 'status', 'date'];
  dataSource = new MatTableDataSource<DashboardTransaction>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions'] && this.transactions) {
      this.dataSource.data = this.transactions;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  getStatusType(status: string): BadgeStatus {
    switch ((status || '').toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED': return 'completed';
      case 'PENDING': return 'pending';
      case 'FAILED': return 'failed';
      case 'CANCELLED': return 'inactive';
      default: return 'default';
    }
  }
}
