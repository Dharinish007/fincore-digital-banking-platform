import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerSummary } from '../../models/customer.model';
import { CustomerStatusChipComponent } from '../customer-status-chip/customer-status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [
    CommonModule, RouterModule, DatePipe, MatTableModule, MatPaginatorModule,
    MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule,
    CustomerStatusChipComponent, EmptyStateComponent
  ],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.scss'
})
export class CustomerTableComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) customers: CustomerSummary[] = [];
  @Input() isLoading = false;
  @Output() addCustomer = new EventEmitter<void>();

  displayedColumns = ['avatar', 'id', 'name', 'email', 'phone', 'customerType', 'status', 'branch', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<CustomerSummary>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customers']) {
      this.dataSource.data = this.customers;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(id: string): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    const index = parseInt(id.replace(/\D/g, ''), 10) % colors.length;
    return colors[index];
  }
}
