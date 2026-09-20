import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RepaymentScheduleItem } from '../../models/loan.models';

@Component({
  selector: 'app-repayment-schedule-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, MatTableModule],
  template: `
    <div class="table-responsive">
      <table mat-table [dataSource]="schedule" class="schedule-table">
        <ng-container matColumnDef="installmentNumber">
          <th mat-header-cell *matHeaderCellDef>#</th>
          <td mat-cell *matCellDef="let item" class="font-medium">{{ item.installmentNumber }}</td>
        </ng-container>

        <ng-container matColumnDef="dueDate">
          <th mat-header-cell *matHeaderCellDef>Due Date</th>
          <td mat-cell *matCellDef="let item">{{ item.dueDate | date:'mediumDate' }}</td>
        </ng-container>

        <ng-container matColumnDef="beginningBalance">
          <th mat-header-cell *matHeaderCellDef>Beginning Balance</th>
          <td mat-cell *matCellDef="let item">{{ item.beginningBalance | currency:'USD':'symbol':'1.2-2' }}</td>
        </ng-container>

        <ng-container matColumnDef="emiAmount">
          <th mat-header-cell *matHeaderCellDef>EMI Payment</th>
          <td mat-cell *matCellDef="let item" class="font-semibold text-primary">{{ item.emiAmount | currency:'USD':'symbol':'1.2-2' }}</td>
        </ng-container>

        <ng-container matColumnDef="principalComponent">
          <th mat-header-cell *matHeaderCellDef>Principal</th>
          <td mat-cell *matCellDef="let item">{{ item.principalComponent | currency:'USD':'symbol':'1.2-2' }}</td>
        </ng-container>

        <ng-container matColumnDef="interestComponent">
          <th mat-header-cell *matHeaderCellDef>Interest</th>
          <td mat-cell *matCellDef="let item">{{ item.interestComponent | currency:'USD':'symbol':'1.2-2' }}</td>
        </ng-container>

        <ng-container matColumnDef="endingBalance">
          <th mat-header-cell *matHeaderCellDef>Ending Balance</th>
          <td mat-cell *matCellDef="let item" class="font-medium">{{ item.endingBalance | currency:'USD':'symbol':'1.2-2' }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .table-responsive {
      width: 100%;
      overflow-x: auto;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }

    .schedule-table {
      width: 100%;
      background: var(--color-surface);

      th {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--color-text-secondary);
        background: var(--color-background-subtle);
        border-bottom: 1px solid var(--color-border);
        padding: 0.75rem 1rem;
      }

      td {
        font-size: 0.8125rem;
        color: var(--color-text-primary);
        border-bottom: 1px solid var(--color-border);
        padding: 0.75rem 1rem;
      }

      tr:last-child td {
        border-bottom: none;
      }

      .text-primary {
        color: var(--color-primary);
      }
    }
  `]
})
export class RepaymentScheduleTableComponent {
  @Input({ required: true }) schedule: RepaymentScheduleItem[] = [];

  displayedColumns: string[] = [
    'installmentNumber',
    'dueDate',
    'beginningBalance',
    'emiAmount',
    'principalComponent',
    'interestComponent',
    'endingBalance'
  ];
}
