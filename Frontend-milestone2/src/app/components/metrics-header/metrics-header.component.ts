import { Component } from '@angular/core';

@Component({
  selector: 'app-metrics-header',
  standalone: true,
  templateUrl: './metrics-header.component.html',
  styleUrl: './metrics-header.component.css'
})
export class MetricsHeaderComponent {
  activeLoans = '847K';
  disbursedYtd = '₹2.4B';
  npaRatio = '2.3%';
  npaTrend = '↓ 0.4%';
}
