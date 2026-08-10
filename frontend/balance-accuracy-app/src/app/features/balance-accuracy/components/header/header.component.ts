import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatBadgeModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() moduleTitle = 'Balance Accuracy';
  @Input() moduleIcon = 'fact_check';
  @Output() toggleSidebar = new EventEmitter<void>();

  public unreadNotifications = 3;
  public currentUser = {
    name: 'Alex Mercer',
    role: 'Senior Audit Lead',
    avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Mercer&background=0D47A1&color=fff&bold=true'
  };

  onToggle(): void {
    this.toggleSidebar.emit();
  }
}
