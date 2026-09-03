import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
  badgeClass?: string;
  stageNumber?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() collapsed = false;

  public kycNavItems: NavItem[] = [
    {
      label: 'Face Match Accuracy',
      route: '/face-match',
      icon: 'face_retouching_natural',
      badge: 'Active',
      badgeClass: 'badge-active',
      stageNumber: '01'
    },
    {
      label: 'Verification Decision',
      route: '/verification-summary',
      icon: 'fact_check',
      badge: 'Next',
      badgeClass: 'badge-next',
      stageNumber: '02'
    }
  ];
}
