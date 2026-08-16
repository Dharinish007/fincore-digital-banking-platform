import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../services/mock-data.service';
import { LoanApplication } from '../../models/application.model';

@Component({
  selector: 'app-underwriting-page',
  standalone: false,
  templateUrl: './underwriting-page.component.html',
  styleUrls: ['./underwriting-page.component.scss']
})
export class UnderwritingPageComponent implements OnInit {
  application?: LoanApplication;
  decision: 'Approve' | 'Reject' | 'Request More Information' | '' = '';
  rejectionReason = '';
  submitted = false;

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.application = this.mockData.getApplicationById('LO-1002');
  }

  selectDecision(value: 'Approve' | 'Reject' | 'Request More Information') {
    this.decision = value;
    this.submitted = false;
  }

  submitDecision() {
    if (this.decision === 'Reject' && !this.rejectionReason) {
      alert('Please provide a rejection reason.');
      return;
    }
    this.submitted = true;
  }
}
