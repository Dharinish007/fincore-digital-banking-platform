import { Component, OnInit, inject, signal, computed, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, switchMap, tap, catchError, of } from 'rxjs';

import { CustomerService } from '../../services/customer.service';
import { CustomerSummary, CustomerFilter, CustomerStatus, KycStatus } from '../../models/customer.model';
import { CustomerTableComponent } from '../../components/customer-table/customer-table.component';
import { CustomerFilterComponent } from '../../components/customer-filter/customer-filter.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatisticCardComponent } from '../../../../shared/components/statistic-card/statistic-card.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CustomerTableComponent,
    CustomerFilterComponent,
    PageHeaderComponent,
    StatisticCardComponent,
    HasPermissionDirective
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(CustomerFilterComponent) filterComponent?: CustomerFilterComponent;

  readonly isLoading = signal<boolean>(true);
  readonly isDeleting = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);
  readonly customers = signal<CustomerSummary[]>([]);
  readonly currentFilter = signal<CustomerFilter>({});

  // Computed Real-Time Operational Statistics
  readonly totalCustomersCount = computed(() => this.customers().length);
  readonly activeCustomersCount = computed(() => 
    this.customers().filter(c => c.status === CustomerStatus.ACTIVE).length
  );
  readonly pendingKycCount = computed(() => 
    this.customers().filter(c => c.kycStatus === KycStatus.PENDING).length
  );
  readonly inactiveCount = computed(() => 
    this.customers().filter(c => c.status === CustomerStatus.INACTIVE || c.status === CustomerStatus.SUSPENDED).length
  );

  readonly isFiltered = computed(() => {
    const f = this.currentFilter();
    return !!(f.search?.trim() || f.status || f.kycStatus);
  });

  private filter$ = new BehaviorSubject<CustomerFilter>({});

  ngOnInit(): void {
    this.filter$.pipe(
      tap(f => {
        this.currentFilter.set(f);
        this.isLoading.set(true);
        this.hasError.set(false);
      }),
      switchMap(filter =>
        this.customerService.getCustomers(filter).pipe(
          catchError(err => {
            console.error('Error fetching customers:', err);
            this.hasError.set(true);
            return of([]);
          })
        )
      )
    ).subscribe(customers => {
      this.customers.set(customers || []);
      this.isLoading.set(false);
      this.cdr.markForCheck();
    });
  }

  onFilterChanged(filter: CustomerFilter): void {
    this.filter$.next(filter);
  }

  clearFilters(): void {
    this.filterComponent?.reset();
  }

  retryFetch(): void {
    this.filter$.next(this.filter$.value);
  }

  onAddCustomer(): void {
    this.router.navigate(['/customer/new']);
  }

  onDeleteCustomer(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Deactivate Customer',
        message: 'Are you sure you want to deactivate this customer record? The customer profile will be marked as inactive.',
        confirmText: 'Deactivate Record',
        cancelText: 'Cancel',
        isDestructive: true
      },
      width: '420px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.isDeleting.set(true);
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.notificationService.success('Customer record successfully deactivated.');
          this.filter$.next(this.filter$.value);
        },
        error: err => {
          this.isDeleting.set(false);
          console.error('Error deleting customer:', err);
          this.notificationService.error('Failed to deactivate customer profile. Please try again.');
        }
      });
    });
  }
}