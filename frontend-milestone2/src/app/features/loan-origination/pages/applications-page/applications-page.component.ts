import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { LoanApplication } from '../../models/application.model';

@Component({
  selector: 'app-applications-page',
  standalone: false,
  templateUrl: './applications-page.component.html',
  styleUrls: ['./applications-page.component.scss']
})
export class ApplicationsPageComponent implements OnInit {
  applications: LoanApplication[] = [];
  filtered: LoanApplication[] = [];
  search = '';
  loanType = '';
  status = '';
  stage = '';
  sortField: 'applicationDate' | 'requestedAmount' = 'applicationDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Details Modal
  selectedApp: LoanApplication | null = null;

  constructor(
    private mockData: MockDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.mockData.getApplications().subscribe((apps) => {
      this.applications = apps;
      this.applyFilters();

      // Check query params if an application should be opened
      this.route.queryParams.subscribe((params) => {
        const targetId = params['select'] || params['id'];
        if (targetId) {
          const found = this.applications.find(
            (a) => a.id === targetId || String(a.loanId) === targetId
          );
          if (found) {
            this.openDetails(found);
          }
        }
      });
    });
  }

  applyFilters() {
    const term = this.search.trim().toLowerCase();
    this.filtered = this.applications
      .filter((item) => {
        if (!term) return true;
        const name = (item.fullName || `Customer #${item.customerId}`).toLowerCase();
        const id = (item.id || String(item.loanId || '')).toLowerCase();
        return name.includes(term) || id.includes(term);
      })
      .filter((item) => (this.loanType ? item.loanType === this.loanType : true))
      .filter((item) => (this.status ? item.status === this.status : true))
      .filter((item) => (this.stage ? item.stage === this.stage : true));

    this.filtered.sort((a, b) => {
      const fieldA = (this.sortField === 'applicationDate' ? a.applicationDate : (a.loanAmount || a.requestedAmount)) ?? 0;
      const fieldB = (this.sortField === 'applicationDate' ? b.applicationDate : (b.loanAmount || b.requestedAmount)) ?? 0;
      return this.sortDirection === 'asc' ? (fieldA > fieldB ? 1 : -1) : fieldA > fieldB ? -1 : 1;
    });
  }

  resetFilters() {
    this.search = '';
    this.loanType = '';
    this.status = '';
    this.stage = '';
    this.sortField = 'applicationDate';
    this.sortDirection = 'desc';
    this.applyFilters();
  }

  openDetails(app: LoanApplication) {
    this.selectedApp = app;
  }

  closeDetails() {
    this.selectedApp = null;
  }

  editDraft(app: LoanApplication) {
    this.closeDetails();
    this.router.navigate(['/loan-application'], {
      state: {
        preQualified: {
          customerId: app.customerId,
          fullName: app.fullName || `Customer #${app.customerId}`,
          mobile: app.mobile || '',
          email: app.email || '',
          loanType: app.loanType as any,
          requestedAmount: app.loanAmount || app.requestedAmount || 500000,
          employmentType: app.employmentType || 'Salaried',
          monthlyIncome: app.monthlyIncome || 50000,
          creditScore: app.creditScore || 750,
          isEligible: true
        }
      }
    });
  }

  deleteDraft(app: LoanApplication) {
    if (confirm(`Are you sure you want to delete draft application ${app.id || app.loanId}?`)) {
      if (app.id) {
        this.mockData.deleteApplication(app.id);
      }
      if (this.selectedApp?.id === app.id) {
        this.closeDetails();
      }
    }
  }

  startNewApplication() {
    this.router.navigate(['/pre-qualification']);
  }
}
