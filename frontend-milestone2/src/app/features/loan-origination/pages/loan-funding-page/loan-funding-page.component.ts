import { Component, OnInit, inject } from '@angular/core';
import { LoanOriginationService, LoanApplicationPayload } from '../../../../core/services/loan-origination.service';

@Component({
  selector: 'app-loan-funding-page',
  standalone: false,
  templateUrl: './loan-funding-page.component.html',
  styleUrls: ['./loan-funding-page.component.scss']
})
export class LoanFundingPageComponent implements OnInit {
  private loanService = inject(LoanOriginationService);

  application?: LoanApplicationPayload;
  fundingConfirmed = false;
  today = new Date().toLocaleDateString();

  ngOnInit() {
    this.loanService.getAllLoanApplications().subscribe((apps) => {
      if (apps && apps.length) {
        this.application = apps[0];
      }
    });
  }

  confirmFunding() {
    if (this.application?.loanId) {
      this.loanService.updateLoanStatus(this.application.loanId, 'Approved').subscribe(() => {
        this.fundingConfirmed = true;
      });
    } else {
      this.fundingConfirmed = true;
    }
  }

  cancel() {
    this.fundingConfirmed = false;
  }
}

