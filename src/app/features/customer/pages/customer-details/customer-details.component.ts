import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, switchMap } from 'rxjs';
import { MockCustomerService } from '../../services/mock-customer.service';
import { Customer } from '../../models/customer.model';
import { CustomerStatusChipComponent } from '../../components/customer-status-chip/customer-status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CommonModule, DatePipe, RouterModule, MatButtonModule, MatIconModule,
    MatDividerModule, CustomerStatusChipComponent, EmptyStateComponent
  ],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private customerService = inject(MockCustomerService);

  customer$!: Observable<Customer | undefined>;

  ngOnInit(): void {
    this.customer$ = this.route.paramMap.pipe(
      switchMap(params => this.customerService.getCustomerById(params.get('id')!))
    );
  }

  getInitials(c: Customer): string {
    return `${c.firstName.charAt(0)}${c.lastName.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(id: string): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    const index = parseInt(id.replace(/\D/g, ''), 10) % colors.length;
    return colors[index];
  }
}
