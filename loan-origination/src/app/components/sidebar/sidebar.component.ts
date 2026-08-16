import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Pre-Qualification', path: '/pre-qualification' },
    { label: 'New Application', path: '/loan-application' },
    { label: 'Applications', path: '/applications' },
    { label: 'Application Processing', path: '/processing' },
    { label: 'Underwriting', path: '/underwriting' },
    { label: 'Quality Control', path: '/quality-control' },
    { label: 'Loan Funding', path: '/loan-funding' }
  ];
}
