import { Component, Input } from '@angular/core';
import { DocumentUpload } from '../../models/document.model';

@Component({
  selector: 'app-document-status-card',
  standalone: false,
  templateUrl: './document-status-card.component.html',
  styleUrls: ['./document-status-card.component.scss']
})
export class DocumentStatusCardComponent {
  @Input() document!: DocumentUpload;
}
