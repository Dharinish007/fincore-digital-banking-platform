import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';
import { Payment } from '../../../core/models/banking.models';

@Component({
  selector: 'app-payment-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-dashboard.component.html',
  styleUrls: ['./payment-dashboard.component.scss']
})
export class PaymentDashboardComponent implements OnInit {
  private banking = inject(BankingService);
  payments: Payment[] = [];

  ngOnInit() {
    this.banking.getPayments().subscribe(p => {
      this.payments = p;
    });
  }
}
