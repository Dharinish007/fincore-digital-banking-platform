import { Component, Input } from '@angular/core';
import { LoanApplication } from '../../models/application.model';

@Component({
  selector: 'app-funding-summary-card',
  standalone: false,
  templateUrl: './funding-summary-card.component.html',
  styleUrls: ['./funding-summary-card.component.scss']
})
export class FundingSummaryCardComponent {
  @Input() application!: LoanApplication;
}
