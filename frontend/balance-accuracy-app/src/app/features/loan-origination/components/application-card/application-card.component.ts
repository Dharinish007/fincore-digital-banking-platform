import { Component, Input } from '@angular/core';
import { LoanApplication } from '../../models/application.model';

@Component({
  selector: 'app-application-card',
  standalone: false,
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})
export class ApplicationCardComponent {
  @Input() application!: LoanApplication;
}
