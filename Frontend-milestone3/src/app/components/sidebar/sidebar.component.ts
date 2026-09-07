import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Liveness Verification', route: '/liveness' },
    { label: 'Risk Assessment', route: '/risk' },
    { label: 'Audit Logging', route: '/audit' }
  ];
}
