import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { LoanApplication } from '../../models/application.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  applications: LoanApplication[] = [];
  total = 0;
  newApplications = 0;
  inProcessing = 0;
  approvedCompleted = 0;
  pendingApplications = 0;
  recentApplications: LoanApplication[] = [];

  constructor(
    private mockData: MockDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mockData.getApplications().subscribe((apps) => {
      this.applications = apps;
      this.total = apps.length;
      
      // 5 Required KPIs
      this.newApplications = apps.filter(
        (x) => x.status === 'Draft' || x.stage === 'Pre-Qualification'
      ).length;

      this.inProcessing = apps.filter(
        (x) => x.status === 'Under Review' || x.stage === 'Application Processing'
      ).length;

      this.approvedCompleted = apps.filter(
        (x) => x.status === 'Approved' || x.status === 'Funded'
      ).length;

      this.pendingApplications = apps.filter(
        (x) => x.status === 'Pending'
      ).length;

      this.recentApplications = apps.slice(0, 6);
    });
  }

  startNewApplication() {
    this.router.navigate(['/pre-qualification']);
  }

  viewApplications() {
    this.router.navigate(['/applications']);
  }

  openApplication(app: LoanApplication) {
    const id = app.id || app.loanId;
    this.router.navigate(['/applications'], { queryParams: { select: id } });
  }
}
