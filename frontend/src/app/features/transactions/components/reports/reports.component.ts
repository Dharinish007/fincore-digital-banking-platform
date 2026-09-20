import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { ExportService } from '../../../../core/services/export.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  private exportService = inject(ExportService);
  private txService = inject(TransactionService);

  public sidebarCollapsed = false;

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public exportPdf(): void {
    this.exportService.exportToPDF(this.txService.getTransactions());
  }

  public exportCsv(): void {
    this.exportService.exportToCSV(this.txService.getTransactions());
  }
}
