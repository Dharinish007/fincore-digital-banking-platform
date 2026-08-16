import { Component } from '@angular/core';
import { QualityChecklistItem } from '../../components/quality-checklist/quality-checklist.component';

@Component({
  selector: 'app-quality-control-page',
  standalone: false,
  templateUrl: './quality-control-page.component.html',
  styleUrls: ['./quality-control-page.component.scss']
})
export class QualityControlPageComponent {
  checklist: QualityChecklistItem[] = [
    { label: 'Applicant information verified', status: 'Passed' },
    { label: 'Documents verified', status: 'Pending' },
    { label: 'Employment information verified', status: 'Passed' },
    { label: 'Income information verified', status: 'Pending' },
    { label: 'Application complete', status: 'Pending' },
    { label: 'Underwriting completed', status: 'Passed' },
    { label: 'Required approvals completed', status: 'Pending' }
  ];
  remarks = '';
  summary = '';

  passQualityControl() {
    this.summary = 'Quality Control passed. Application is ready for next stage.';
  }

  sendBack() {
    this.summary = 'Application sent back for correction. Please review the checklist.';
  }
}
