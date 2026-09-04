import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';
import { Customer } from '../../../core/models/banking.models';

@Component({
  selector: 'app-risk-assessment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss']
})
export class RiskAssessmentComponent implements OnInit {
  private banking = inject(BankingService);
  customers: Customer[] = [];

  riskFactors = [
    { title: 'KYC & Identity Verification', weight: '25%', status: 'Passed', score: 94, desc: 'Aadhaar e-KYC & NSDL PAN verified with biometric facial match.' },
    { title: 'Transaction Velocity & Outflows', weight: '20%', status: 'Normal', score: 88, desc: 'Transaction frequency conforms to standard salaried customer profile.' },
    { title: 'Geographic & IP Anomaly Risk', weight: '20%', status: 'Low Risk', score: 92, desc: 'Access localized to verified domestic residential ISP subnets.' },
    { title: 'Account Vintage & Activity', weight: '15%', status: 'Matured', score: 95, desc: 'Account active > 24 months with regular monthly credit inflows.' },
    { title: 'Credit Bureau & Default History', weight: '10%', status: 'Clean', score: 85, desc: 'CIBIL score > 750, zero write-offs or 30+ DPD overdue remarks.' },
    { title: 'PEP & Sanctions Screening', weight: '10%', status: 'Clean', score: 99, desc: 'Zero match across OFAC, UN and domestic watchlists.' }
  ];

  ngOnInit() {
    this.banking.getCustomers().subscribe(c => {
      this.customers = c;
    });
  }
}
