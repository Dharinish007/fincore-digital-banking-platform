import { Component, OnInit } from '@angular/core';
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
  draft = 0;
  underReview = 0;
  approved = 0;
  rejected = 0;
  funded = 0;
  recentApplications: LoanApplication[] = [];

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.mockData.getApplications().subscribe((apps) => {
      this.applications = apps;
      this.total = apps.length;
      this.draft = apps.filter((x) => x.status === 'Draft').length;
      this.underReview = apps.filter((x) => x.status === 'Under Review').length;
      this.approved = apps.filter((x) => x.status === 'Approved').length;
      this.rejected = apps.filter((x) => x.status === 'Rejected').length;
      this.funded = apps.filter((x) => x.status === 'Funded').length;
      this.recentApplications = apps.slice(0, 5);
    });
  }
}
