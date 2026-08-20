import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, tap, switchMap, catchError, of } from 'rxjs';

import { CustomerService } from '../../services/customer.service';
import { Customer, KycStatus } from '../../models/customer.model';
import { AccountService } from '../../../account/services/account.service';
import { AccountSummary } from '../../../account/models/account.model';
import { TransactionService } from '../../../transaction/services/transaction.service';
import { TransactionSummary } from '../../../transaction/models/transaction.model';

import { CustomerStatusChipComponent } from '../../components/customer-status-chip/customer-status-chip.component';
import { StatusBadgeComponent, BadgeStatus } from '../../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CardContainerComponent } from '../../../../shared/components/card-container/card-container.component';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CommonModule, 
    DatePipe, 
    CurrencyPipe,
    RouterModule, 
    MatTabsModule,
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule,
    MatTooltipModule,
    CustomerStatusChipComponent, 
    StatusBadgeComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    CardContainerComponent
  ],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);

  customer$!: Observable<Customer | undefined>;
  accounts$!: Observable<AccountSummary[]>;
  transactions$!: Observable<TransactionSummary[]>;

  hasError = false;

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(
      tap(() => this.hasError = false)
    );

    this.customer$ = id$.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of(undefined);
        return this.customerService.getCustomerById(id).pipe(
          catchError(err => {
            console.error('Error fetching customer details:', err);
            this.hasError = true;
            return of(undefined);
          })
        );
      })
    );

    this.accounts$ = id$.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of([]);
        return this.accountService.getAccountsByCustomerId(id).pipe(
          catchError(() => of([]))
        );
      })
    );

    this.transactions$ = id$.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of([]);
        return this.transactionService.getTransactionsByCustomerId(id).pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  backToCustomers(): void {
    this.router.navigate(['/customer']);
  }

  getInitials(c: Customer): string {
    const f = c.firstName ? c.firstName.charAt(0) : '';
    const l = c.lastName ? c.lastName.charAt(0) : '';
    return `${f}${l}`.toUpperCase() || 'CU';
  }

  getCustomerIdDisplay(c: Customer): string {
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
      case 'VERIFIED': return 'KYC Verified';
      case 'PENDING': return 'Pending Verification';
      case 'REJECTED': return 'KYC Rejected';
      default: return 'Unverified';
    }
  }

  getTransactionStatusBadge(status: string): BadgeStatus {
    switch ((status || '').toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED': return 'completed';
      case 'PENDING': return 'pending';
      case 'FAILED': return 'failed';
      default: return 'default';
    }
  }
}
