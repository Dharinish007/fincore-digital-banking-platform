import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-charts',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './analytics-charts.component.html',
  styleUrls: ['./analytics-charts.component.scss']
})
export class AnalyticsChartsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('trendCanvas') trendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('branchCanvas') branchCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('distributionCanvas') distributionCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dailyCanvas') dailyCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstances: any[] = [];

  ngAfterViewInit(): void {
    this.initTrendChart();
    this.initBranchChart();
    this.initDistributionChart();
    this.initDailyChart();
  }

  ngOnDestroy(): void {
    this.chartInstances.forEach(c => c.destroy());
  }

  private initTrendChart(): void {
    const ctx = this.trendCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Accuracy Rate (%)',
          data: [82.4, 84.1, 83.0, 85.5, 86.0, 85.8, 86.0],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#10B981'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { grid: { color: '#334155' }, ticks: { color: '#9CA3AF' } },
          y: { min: 75, max: 100, grid: { color: '#334155' }, ticks: { color: '#9CA3AF' } }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private initBranchChart(): void {
    const ctx = this.branchCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Main Downtown', 'North Ave', 'Westside', 'East Commerce', 'Treasury'],
        datasets: [
          {
            label: 'Verified',
            data: [22, 18, 16, 15, 15],
            backgroundColor: '#10B981'
          },
          {
            label: 'Mismatch',
            data: [3, 4, 2, 3, 2],
            backgroundColor: '#EF4444'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#9CA3AF' } }
        },
        scales: {
          x: { grid: { color: '#334155' }, ticks: { color: '#9CA3AF' } },
          y: { grid: { color: '#334155' }, ticks: { color: '#9CA3AF' } }
        }
      }
    });
    this.chartInstances.push(chart);
  }

  private initDistributionChart(): void {
    const ctx = this.distributionCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Posting Lag', 'Hold Reserve Gap', 'Interest Accrual', 'Clearing Delay'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#9CA3AF', boxWidth: 12 } }
        },
        cutout: '70%'
      }
    });
    this.chartInstances.push(chart);
  }

  private initDailyChart(): void {
    const ctx = this.dailyCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5'],
        datasets: [{
          label: 'Accounts Verified',
          data: [120, 145, 130, 160, 186],
          backgroundColor: '#0D47A1',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: '#334155' }, ticks: { color: '#9CA3AF' } },
          y: { grid: { color: '#334155' }, ticks: { color: '#9CA3AF' } }
        }
      }
    });
    this.chartInstances.push(chart);
  }
}
