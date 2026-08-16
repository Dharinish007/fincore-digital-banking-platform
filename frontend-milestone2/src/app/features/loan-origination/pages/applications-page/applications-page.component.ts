import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoanOriginationService, LoanApplicationPayload } from '../../../../core/services/loan-origination.service';

@Component({
  selector: 'app-applications-page',
  standalone: false,
  templateUrl: './applications-page.component.html',
  styleUrls: ['./applications-page.component.scss']
})
export class ApplicationsPageComponent implements OnInit {
  private loanService = inject(LoanOriginationService);
  private router = inject(Router);

  applications: LoanApplicationPayload[] = [];
  filtered: LoanApplicationPayload[] = [];
  search = '';
  loanType = '';
  status = '';

  ngOnInit() {
    this.loanService.getAllLoanApplications().subscribe((apps) => {
      this.applications = apps || [];
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filtered = this.applications
      .filter((item) =>
        this.search
          ? (item.customerName || '').toLowerCase().includes(this.search.toLowerCase()) ||
            String(item.customerId).includes(this.search) ||
            String(item.loanId).includes(this.search)
          : true
      )
      .filter((item) => (this.loanType ? item.loanType === this.loanType : true))
      .filter((item) => (this.status ? item.applicationStatus === this.status : true));
  }

  resetFilters() {
    this.search = '';
    this.loanType = '';
    this.status = '';
    this.applyFilters();
  }

  viewApplication(app: LoanApplicationPayload) {
    this.router.navigateByUrl('/loan-origination/processing');
  }
}

