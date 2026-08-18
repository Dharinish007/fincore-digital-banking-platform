import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() activeNav = 'EMI Calculation';
  @Output() navSelect = new EventEmitter<string>();

  navItems = [
    { label: 'Loan Servicing', icon: '⚡' },
    { label: 'EMI Calculation', icon: '🧮' },
    { label: 'Disbursement', icon: '💸' },
    { label: 'Collections', icon: '💳' }
  ];

  selectNav(itemLabel: string): void {
    this.activeNav = itemLabel;
    this.navSelect.emit(itemLabel);
  }
}
