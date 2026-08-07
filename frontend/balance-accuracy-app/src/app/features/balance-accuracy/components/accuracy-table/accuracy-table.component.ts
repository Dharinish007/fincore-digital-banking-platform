import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BankAccount } from '../../../../core/models/account.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-accuracy-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    StatusBadgeComponent
  ],
  templateUrl: './accuracy-table.component.html',
  styleUrls: ['./accuracy-table.component.scss']
})
export class AccuracyTableComponent implements OnChanges, AfterViewInit {
  @Input() accounts: BankAccount[] = [];

  @Output() view = new EventEmitter<BankAccount>();
  @Output() verify = new EventEmitter<BankAccount>();
  @Output() auditLog = new EventEmitter<BankAccount>();
  @Output() freeze = new EventEmitter<BankAccount>();

  public displayedColumns: string[] = [
    'accountNumber',
    'customerName',
    'branch',
    'ledgerBalance',
    'availableBalance',
    'difference',
    'status',
    'lastVerified',
    'actions'
  ];

  public dataSource = new MatTableDataSource<BankAccount>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accounts'] && this.accounts) {
      this.dataSource.data = this.accounts;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onView(account: BankAccount): void {
    this.view.emit(account);
  }

  onVerify(account: BankAccount): void {
    this.verify.emit(account);
  }

  onAuditLog(account: BankAccount): void {
    this.auditLog.emit(account);
  }

  onFreeze(account: BankAccount): void {
    this.freeze.emit(account);
  }
}
