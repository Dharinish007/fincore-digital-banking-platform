import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-tracker',
  standalone: false,
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent {
  @Input() currentStage = 'Pre-Qualification';
  steps = [
    'Pre-Qualification',
    'Loan Application',
    'Application Processing',
    'Underwriting',
    'Quality Control',
    'Loan Funding'
  ];
}
