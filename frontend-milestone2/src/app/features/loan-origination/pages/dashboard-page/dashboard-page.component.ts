import { Component, OnInit, inject } from '@angular/core';
import { LoanOriginationService, LoanApplicationPayload } from '../../../../core/services/loan-origination.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  private loanService = inject(LoanOriginationService);

  applications: LoanApplicationPayload[] = [];
  total = 0;
  pending = 0;
  approved = 0;
  rejected = 0;
  recentApplications: LoanApplicationPayload[] = [];

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loanService.getAllLoanApplications().subscribe((apps) => {
      this.applications = apps || [];
      this.total = this.applications.length;
      this.pending = this.applications.filter((x) => x.applicationStatus === 'Pending').length;
      this.approved = this.applications.filter((x) => x.applicationStatus === 'Approved').length;
      this.rejected = this.applications.filter((x) => x.applicationStatus === 'Rejected').length;
      this.recentApplications = this.applications.slice(0, 5);
    });
  }
}

