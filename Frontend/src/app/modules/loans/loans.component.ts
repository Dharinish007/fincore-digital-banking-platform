import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MetricsHeaderComponent } from '../../components/metrics-header/metrics-header.component';
import { LoanServicingComponent } from '../loan-servicing/loan-servicing.component';
import { EmiCalculatorComponent } from '../emi/emi-calculator.component';
import { DisbursementComponent } from '../disbursement/disbursement.component';
import { CollectionsComponent } from '../collections/collections.component';

export type LoanTab = 'SERVICING' | 'EMI' | 'DISBURSEMENT' | 'COLLECTIONS';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [
    CommonModule,
    MetricsHeaderComponent,
    LoanServicingComponent,
    EmiCalculatorComponent,
    DisbursementComponent,
    CollectionsComponent
  ],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css'
})
export class LoansComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  activeTab: LoanTab = 'SERVICING';

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['tab']) {
        this.activeTab = data['tab'] as LoanTab;
      }
    });
  }

  setTab(tab: LoanTab): void {
    this.activeTab = tab;
    if (tab === 'SERVICING') this.router.navigate(['/loans']);
    else if (tab === 'EMI') this.router.navigate(['/loans/emi']);
    else if (tab === 'DISBURSEMENT') this.router.navigate(['/loans/disbursement']);
    else if (tab === 'COLLECTIONS') this.router.navigate(['/loans/collections']);
  }
}

