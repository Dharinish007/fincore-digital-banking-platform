import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { TransactionService } from '../../../../core/services/transaction.service';
import { ExportService } from '../../../../core/services/export.service';
import { Transaction } from '../../../../core/models/transaction.model';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-transaction-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatTooltipModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './transaction-dashboard.component.html',
  styleUrls: ['./transaction-dashboard.component.scss']
})
export class TransactionDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private txService = inject(TransactionService);
  private exportService = inject(ExportService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public sidebarCollapsed = false;
  public selectedTxForDrawer: Transaction | null = null;
  public isDrawerOpen = false;

  public statusOptions = ['ALL', 'Success', 'Processing', 'Failed', 'Rolled Back'];
  public typeOptions = ['ALL', 'Transfer', 'Deposit', 'Withdraw'];

  // Signals
  public stats = this.txService.summaryStats;
  public transactions = this.txService.filteredTransactions;

  // Table Columns
  public displayedColumns: string[] = ['id', 'sender', 'receiver', 'type', 'amount', 'date', 'status', 'actions'];

  // Filter Form
  public filterForm: FormGroup = this.fb.group({
    searchQuery: [''],
    status: ['ALL'],
    type: ['ALL']
  });

  // Chart References
  @ViewChild('statusChart') statusChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('volumeChart') volumeChartCanvas!: ElementRef<HTMLCanvasElement>;
  private statusChartInstance?: any;
  private volumeChartInstance?: any;

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(val => {
      this.txService.updateFilters(val);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCharts(), 100);
  }

  ngOnDestroy(): void {
    this.statusChartInstance?.destroy();
    this.volumeChartInstance?.destroy();
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public resetFilters(): void {
    this.filterForm.patchValue({
      searchQuery: '',
      status: 'ALL',
      type: 'ALL'
    });
    this.txService.resetFilters();
  }

  public exportCsv(): void {
    this.exportService.exportToCSV(this.transactions());
  }

  public exportPdf(): void {
    this.exportService.exportToPDF(this.transactions());
  }

  public initiateNew(): void {
    this.router.navigate(['/transactions/initiate']);
  }

  public openDrawer(tx: Transaction): void {
    this.selectedTxForDrawer = tx;
    this.isDrawerOpen = true;
  }

  public closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedTxForDrawer = null;
  }

  public viewStatus(tx: Transaction): void {
    this.router.navigate(['/transactions/status', tx.id]);
  }

  public viewDetails(tx: Transaction): void {
    this.router.navigate(['/transactions/details', tx.id]);
  }

  public retry(tx: Transaction): void {
    this.txService.retryTransaction(tx).subscribe(() => {
      this.router.navigate(['/transactions/status', tx.id]);
    });
  }

  private initCharts(): void {
    if (this.statusChartCanvas?.nativeElement) {
      const ctx = this.statusChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.statusChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Success', 'Pending', 'Failed / Rolled Back'],
            datasets: [
              {
                data: [this.stats().success, this.stats().pending, this.stats().failed],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                borderWidth: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { color: '#9CA3AF', font: { family: 'Inter', size: 12 } }
              }
            }
          }
        });
      }
    }

    if (this.volumeChartCanvas?.nativeElement) {
      const ctx = this.volumeChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.volumeChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Transfer', 'Deposit', 'Withdraw'],
            datasets: [
              {
                label: 'Transaction Count',
                data: [
                  this.transactions().filter(t => t.type === 'Transfer').length,
                  this.transactions().filter(t => t.type === 'Deposit').length,
                  this.transactions().filter(t => t.type === 'Withdraw').length
                ],
                backgroundColor: '#2563EB',
                borderRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { ticks: { color: '#9CA3AF' }, grid: { display: false } },
              y: { ticks: { color: '#9CA3AF' }, grid: { color: '#334155' } }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }
  }
}
