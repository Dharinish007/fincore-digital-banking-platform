import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard-chart-widget',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container" [style.height.px]="height">
      @if (chartData && chartData.datasets.length > 0) {
        <canvas baseChart
          [data]="chartData"
          [options]="chartOptions"
          [type]="type">
        </canvas>
      } @else {
        <div class="chart-placeholder">
          <p>No data available</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chart-placeholder {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
  `]
})
export class DashboardChartWidgetComponent implements OnInit {
  @Input({ required: true }) type: ChartType = 'bar';
  @Input({ required: true }) chartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  @Input() height = 300;
  @Input() maintainAspectRatio = false;
  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: this.maintainAspectRatio,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  ngOnInit() {
    this.chartOptions = {
      ...this.chartOptions,
      maintainAspectRatio: this.maintainAspectRatio,
    };
  }
}
