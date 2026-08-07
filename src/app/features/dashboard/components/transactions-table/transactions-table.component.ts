import { Component, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DashboardTransaction } from '../../services/dashboard.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

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
          <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
          <td mat-cell *matCellDef="let element"> {{element.id}} </td>
        </ng-container>

        <!-- Customer/Account Column -->
        <ng-container matColumnDef="accountId">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Account </th>
          <td mat-cell *matCellDef="let element"> {{element.accountId}} </td>
        </ng-container>

        <!-- Type Column -->
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Type </th>
          <td mat-cell *matCellDef="let element"> {{element.type}} </td>
        </ng-container>

        <!-- Amount Column -->
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Amount </th>
          <td mat-cell *matCellDef="let element" 
              [ngClass]="{'text-success': element.type === 'DEPOSIT', 'text-danger': element.type === 'WITHDRAWAL'}">
            {{ element.type === 'DEPOSIT' ? '+' : (element.type === 'WITHDRAWAL' ? '-' : '') }}
            {{ element.amount | currency:element.currency }}
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
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
          <td mat-cell *matCellDef="let element"> {{element.createdAt | date:'MMM d, y, h:mm a'}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        
        <!-- Row shown when there is no matching data. -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-cell" colspan="6">No transactions found</td>
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
    
    .text-success {
      color: var(--success-dark);
      font-weight: 500;
    }
    
    .text-danger {
      color: var(--danger-dark);
      font-weight: 500;
    }
    
    .empty-cell {
      padding: var(--spacing-6);
      text-align: center;
      color: var(--text-muted);
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
  
  getStatusType(status: string): any {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'danger';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  }
}
