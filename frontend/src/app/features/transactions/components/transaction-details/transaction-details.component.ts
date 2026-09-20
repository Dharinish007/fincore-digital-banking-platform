import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ExportService } from '../../../../core/services/export.service';
import { Transaction } from '../../../../core/models/transaction.model';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private txService = inject(TransactionService);
  private exportService = inject(ExportService);

  public sidebarCollapsed = false;
  public tx: Transaction | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    if (id) {
      this.tx = this.txService.getById(id) || null;
    }

    if (!this.tx) {
      this.router.navigate(['/transactions/history']);
    }
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public backToHistory(): void {
    this.router.navigate(['/transactions/history']);
  }

  public printReceipt(): void {
    window.print();
  }

  public downloadPdf(): void {
    if (this.tx) {
      this.exportService.exportToPDF([this.tx]);
    }
  }
}
