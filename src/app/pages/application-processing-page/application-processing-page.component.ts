import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../services/mock-data.service';
import { DocumentUpload } from '../../models/document.model';
import { LoanApplication } from '../../models/application.model';

@Component({
  selector: 'app-application-processing-page',
  standalone: false,
  templateUrl: './application-processing-page.component.html',
  styleUrls: ['./application-processing-page.component.scss']
})
export class ApplicationProcessingPageComponent implements OnInit {
  application?: LoanApplication;
  documents: DocumentUpload[] = [];

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.application = this.mockData.getApplicationById('LO-1001') || this.mockData.getApplicationById('LO-1002');
    this.documents = this.mockData.getDocuments();
  }

  verifyApplication() {
    alert('Application verification workflow triggered.');
  }

  requestAdditionalInfo() {
    alert('Request additional information workflow triggered.');
  }

  sendForUnderwriting() {
    alert('Send to underwriting workflow triggered.');
  }
}
