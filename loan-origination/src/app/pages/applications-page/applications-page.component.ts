import { Component, OnInit } from '@angular/core';
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

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.mockData.getApplications().subscribe((apps) => {
      this.applications = apps;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filtered = this.applications
      .filter((item) =>
        this.search
          ? item.fullName.toLowerCase().includes(this.search.toLowerCase()) ||
            item.id.toLowerCase().includes(this.search.toLowerCase())
          : true
      )
      .filter((item) => (this.loanType ? item.loanType === this.loanType : true))
      .filter((item) => (this.status ? item.status === this.status : true))
      .filter((item) => (this.stage ? item.stage === this.stage : true));

    this.filtered.sort((a, b) => {
      const fieldA = this.sortField === 'applicationDate' ? a.applicationDate : a.requestedAmount;
      const fieldB = this.sortField === 'applicationDate' ? b.applicationDate : b.requestedAmount;
      return this.sortDirection === 'asc' ? (fieldA > fieldB ? 1 : -1) : fieldA > fieldB ? -1 : 1;
    });
  }

  resetFilters() {
    this.search = '';
    this.loanType = '';
    this.status = '';
    this.stage = '';
    this.applyFilters();
  }
}
