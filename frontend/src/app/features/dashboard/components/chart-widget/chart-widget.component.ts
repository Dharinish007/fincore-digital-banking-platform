import { Component, Input, OnInit, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ThemeService, ThemeMode } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-dashboard-chart-widget',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container" [style.height.px]="height">
      @if (chartData && chartData.datasets && chartData.datasets.length > 0) {
        <canvas baseChart
          [data]="chartData"
          [options]="chartOptions"
          [type]="type">
        </canvas>
      } @else {
        <div class="chart-placeholder">
          <p>No activity data available for the selected period.</p>
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
      color: var(--color-text-muted);
      font-size: 0.875rem;
      text-align: center;
      padding: var(--spacing-6);
    }
  `]
})
export class DashboardChartWidgetComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input({ required: true }) type: ChartType = 'line';
  @Input({ required: true }) chartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  @Input() height = 300;
  @Input() maintainAspectRatio = false;

  private themeService = inject(ThemeService);

  chartOptions: ChartConfiguration['options'] = this.buildChartOptions(this.themeService.theme());

  constructor() {
    // Dynamically react to theme changes
    effect(() => {
      const currentTheme = this.themeService.theme();
      this.chartOptions = this.buildChartOptions(currentTheme);
      this.chart?.update();
    });
  }

  ngOnInit() {
    this.chartOptions = this.buildChartOptions(this.themeService.theme());
  }

  private buildChartOptions(theme: ThemeMode): ChartConfiguration['options'] {
    const isDark = theme === 'dark';

    return {
      responsive: true,
      maintainAspectRatio: this.maintainAspectRatio,
      color: isDark ? '#94A3B8' : '#64748B',
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { 
            color: isDark ? '#F1F5F9' : '#0F172A', 
            font: { family: 'Inter, sans-serif', size: 12, weight: 500 },
            usePointStyle: true,
            boxWidth: 8,
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#182234' : '#0F172A',
          titleColor: '#FFFFFF',
          bodyColor: isDark ? '#94A3B8' : '#F8FAFC',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
          borderWidth: isDark ? 1 : 0,
          padding: 10,
          cornerRadius: 6,
          titleFont: { family: 'Inter, sans-serif', size: 12, weight: 600 },
          bodyFont: { family: 'Inter, sans-serif', size: 12 },
          displayColors: true,
          boxPadding: 4
        }
      },
      scales: {
        x: { 
          ticks: { color: isDark ? '#64748B' : '#64748B', font: { family: 'Inter, sans-serif', size: 11 } },
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9' },
          border: { display: false }
        },
        y: { 
          ticks: { color: isDark ? '#64748B' : '#64748B', font: { family: 'Inter, sans-serif', size: 11 } },
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9' },
          border: { display: false }
        }
      }
    };
  }
}
