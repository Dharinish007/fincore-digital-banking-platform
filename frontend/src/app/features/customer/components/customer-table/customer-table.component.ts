import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerSummary, KycStatus } from '../../models/customer.model';
import { CustomerStatusChipComponent } from '../customer-status-chip/customer-status-chip.component';
import { StatusBadgeComponent, BadgeStatus } from '../../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    DatePipe, 
    MatTableModule, 
    MatPaginatorModule,
    MatSortModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule,
    CustomerStatusChipComponent, 
    StatusBadgeComponent,
    EmptyStateComponent
  ],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.scss'
})
export class CustomerTableComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) customers: CustomerSummary[] = [];
  @Input() isLoading = false;
  @Input() isFiltered = false;
  @Output() addCustomer = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() deleteCustomer = new EventEmitter<string>();

  displayedColumns = ['customer', 'contact', 'kyc', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<CustomerSummary>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customers']) {
      this.dataSource.data = this.customers || [];
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getInitials(firstName: string, lastName: string): string {
    const f = firstName ? firstName.charAt(0) : '';
    const l = lastName ? lastName.charAt(0) : '';
    return `${f}${l}`.toUpperCase() || 'CU';
  }

  getCustomerIdDisplay(c: CustomerSummary): string {
    return c.customerNumber || `CUST-${String(c.id).padStart(4, '0')}`;
  }

  getKycBadgeStatus(kycStatus: KycStatus | string): BadgeStatus {
    switch (String(kycStatus).toUpperCase()) {
      case 'VERIFIED': return 'verified';
      case 'PENDING': return 'pending';
      case 'REJECTED': return 'failed';
      default: return 'unverified';
    }
  }

  getKycLabel(kycStatus: KycStatus | string): string {
    switch (String(kycStatus).toUpperCase()) {
      case 'VERIFIED': return 'Verified';
      case 'PENDING': return 'Pending KYC';
      case 'REJECTED': return 'Rejected';
      default: return 'Unverified';
    }
  }
}
