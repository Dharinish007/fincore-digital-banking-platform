import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  tellerName = 'Bank Teller';
  currentMilestone = 'Milestone 2: Loan Management';
}
