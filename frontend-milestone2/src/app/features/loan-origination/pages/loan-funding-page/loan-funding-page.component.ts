import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../services/mock-data.service';
import { LoanApplication } from '../../models/application.model';

@Component({
  selector: 'app-loan-funding-page',
  standalone: false,
  templateUrl: './loan-funding-page.component.html',
  styleUrls: ['./loan-funding-page.component.scss']
})
export class LoanFundingPageComponent implements OnInit {
  application?: LoanApplication;
  fundingConfirmed = false;
  today = new Date().toLocaleDateString();

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.application = this.mockData.getApplicationById('LO-1002');
  }

  confirmFunding() {
    this.fundingConfirmed = true;
  }

  cancel() {
    alert('Funding process cancelled.');
  }
}
