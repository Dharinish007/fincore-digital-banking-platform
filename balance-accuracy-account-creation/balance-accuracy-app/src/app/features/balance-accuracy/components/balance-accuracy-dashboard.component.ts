import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BalanceAccuracyService } from '../../../core/services/balance-accuracy.service';
import { ExportService } from '../../../core/services/export.service';
import { BankAccount } from '../../../core/models/account.model';
import { BalanceFilterCriteria } from '../../../core/models/filter.model';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SummaryCardsComponent } from './summary-cards/summary-cards.component';
import { FilterSectionComponent } from './filter-section/filter-section.component';
import { AnalyticsChartsComponent } from './analytics-charts/analytics-charts.component';
import { AccuracyTableComponent } from './accuracy-table/accuracy-table.component';
import { DetailDrawerComponent } from './detail-drawer/detail-drawer.component';
import { VerifyDialogComponent } from './verify-dialog/verify-dialog.component';
import { AuditLogDialogComponent } from './audit-log-dialog/audit-log-dialog.component';
import { FreezeDialogComponent } from './freeze-dialog/freeze-dialog.component';

@Component({
  selector: 'app-balance-accuracy-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    HeaderComponent,
    SidebarComponent,
    SummaryCardsComponent,
    FilterSectionComponent,
    AnalyticsChartsComponent,
    AccuracyTableComponent,
    DetailDrawerComponent
  ],
  templateUrl: './balance-accuracy-dashboard.component.html',
  styleUrls: ['./balance-accuracy-dashboard.component.scss']
})
export class BalanceAccuracyDashboardComponent implements OnInit {
  private balanceService = inject(BalanceAccuracyService);
  private exportService = inject(ExportService);
  private dialog = inject(MatDialog);

  public sidebarCollapsed = false;
  public selectedAccountForDrawer: BankAccount | null = null;
  public isDrawerOpen = false;

  // Signals from BalanceAccuracyService
  public stats = this.balanceService.summaryStats;
  public accounts = this.balanceService.filteredAccounts;

  constructor() {}

  ngOnInit(): void {}

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public onFilterChanged(criteria: BalanceFilterCriteria): void {
    this.balanceService.updateFilters(criteria);
  }

  public onFilterReset(): void {
    this.balanceService.resetFilters();
  }

  public onExportExcel(): void {
    this.exportService.exportToCSV(this.accounts());
  }

  public onExportPdf(): void {
    this.exportService.exportToPDF(this.accounts());
  }

  public openDetailDrawer(account: BankAccount): void {
    this.selectedAccountForDrawer = account;
    this.isDrawerOpen = true;
  }

  public closeDetailDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedAccountForDrawer = null;
  }

  public openVerifyDialog(account: BankAccount): void {
    const dialogRef = this.dialog.open(VerifyDialogComponent, {
      width: '560px',
      data: { account }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.balanceService.verifyAccount(account.id, result.action, result.remarks);
        // Refresh selected account in drawer if open
        if (this.selectedAccountForDrawer?.id === account.id) {
          const updated = this.balanceService.getAccountById(account.id);
          if (updated) this.selectedAccountForDrawer = updated;
        }
      }
    });
  }

  public openAuditLogDialog(account: BankAccount): void {
    const logs = this.balanceService.getAuditLogsForAccount(account.accountNumber);
    this.dialog.open(AuditLogDialogComponent, {
      width: '640px',
      data: { account, logs }
    });
  }

  public openFreezeDialog(account: BankAccount): void {
    const dialogRef = this.dialog.open(FreezeDialogComponent, {
      width: '480px',
      data: { account }
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.balanceService.freezeAccount(account.id, reason);
        if (this.selectedAccountForDrawer?.id === account.id) {
          const updated = this.balanceService.getAccountById(account.id);
          if (updated) this.selectedAccountForDrawer = updated;
        }
      }
    });
  }
}
