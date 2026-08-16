import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  badge?: string;
  route?: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() collapsed = false;

  public navItems: NavItem[] = [
    {
      label: 'Credit Check',
      icon: 'credit_score',
      route: '/credit-check',
      exact: true,
    },
    {
      label: 'New Credit Check',
      icon: 'fact_check',
      route: '/credit-check/new',
      exact: true,
    },
  ];
}
