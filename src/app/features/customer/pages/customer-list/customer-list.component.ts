import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, BehaviorSubject, switchMap, tap } from 'rxjs';
import { MockCustomerService } from '../../services/mock-customer.service';
import { CustomerSummary, CustomerFilter } from '../../models/customer.model';
import { CustomerTableComponent } from '../../components/customer-table/customer-table.component';
import { CustomerFilterComponent } from '../../components/customer-filter/customer-filter.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    CustomerTableComponent,
    CustomerFilterComponent,
    PageHeaderComponent,
    HasPermissionDirective
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  private customerService = inject(MockCustomerService);

  branches = this.customerService.branches;
  isLoading = true;
  customers$!: Observable<CustomerSummary[]>;
  private filter$ = new BehaviorSubject<CustomerFilter>({});

  ngOnInit(): void {
    this.customers$ = this.filter$.pipe(
      tap(() => this.isLoading = true),
      switchMap(filter => this.customerService.getCustomers(filter)),
      tap(() => this.isLoading = false)
    );
  }

  onFilterChanged(filter: CustomerFilter): void {
    this.filter$.next(filter);
  }
}
