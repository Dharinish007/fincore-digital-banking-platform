import { Component, OnInit, inject } from '@angular/core';
import { LoanOriginationService, LoanApplicationPayload, ApplicationStatus } from '../../../../core/services/loan-origination.service';

@Component({
  selector: 'app-underwriting-page',
  standalone: false,
  templateUrl: './underwriting-page.component.html',
  styleUrls: ['./underwriting-page.component.scss']
})
export class UnderwritingPageComponent implements OnInit {
  private loanService = inject(LoanOriginationService);

  application?: LoanApplicationPayload;
  decision: ApplicationStatus = 'Approved';
  rejectionReason = '';
  submitted = false;

  ngOnInit() {
    this.loanService.getAllLoanApplications().subscribe((apps) => {
      if (apps && apps.length) {
        this.application = apps[0];
      }
    });
  }

  selectDecision(value: ApplicationStatus) {
    this.decision = value;
    this.submitted = false;
  }

  submitDecision() {
    if (this.decision === 'Rejected' && !this.rejectionReason) {
      alert('Please provide a rejection reason note.');
      return;
    }

    if (this.application?.loanId) {
      this.loanService.updateLoanStatus(this.application.loanId, this.decision).subscribe(() => {
        this.submitted = true;
        if (this.application) {
          this.application.applicationStatus = this.decision;
        }
      });
    } else {
      this.submitted = true;
    }
  }
}

