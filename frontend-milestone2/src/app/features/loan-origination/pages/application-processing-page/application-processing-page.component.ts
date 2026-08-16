import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoanOriginationService, LoanApplicationPayload } from '../../../../core/services/loan-origination.service';

@Component({
  selector: 'app-application-processing-page',
  standalone: false,
  templateUrl: './application-processing-page.component.html',
  styleUrls: ['./application-processing-page.component.scss']
})
export class ApplicationProcessingPageComponent implements OnInit {
  private loanService = inject(LoanOriginationService);
  private router = inject(Router);

  application?: LoanApplicationPayload;
  actionMessage = '';

  ngOnInit() {
    this.loanService.getAllLoanApplications().subscribe((apps) => {
      if (apps && apps.length) {
        this.application = apps[0];
      }
    });
  }

  verifyApplication() {
    this.actionMessage = 'Application status verified. All eligibility criteria check out.';
  }

  requestAdditionalInfo() {
    this.actionMessage = 'Notification sent to borrower for additional income documentation details.';
  }

  sendForUnderwriting() {
    if (this.application?.loanId) {
      this.loanService.updateLoanStatus(this.application.loanId, 'Pending').subscribe(() => {
        this.router.navigateByUrl('/loan-origination/underwriting');
      });
    } else {
      this.router.navigateByUrl('/loan-origination/underwriting');
    }
  }
}

