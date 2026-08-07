import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TransactionService } from '../../../../core/services/transaction.service';
import { ExportService } from '../../../../core/services/export.service';
import { Transaction } from '../../../../core/models/transaction.model';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  private txService = inject(TransactionService);
  private exportService = inject(ExportService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public sidebarCollapsed = false;
  public transactions = this.txService.filteredTransactions;
  public displayedColumns: string[] = ['id', 'sender', 'receiver', 'type', 'amount', 'date', 'status', 'actions'];

  public filterForm: FormGroup = this.fb.group({
    searchQuery: [''],
    status: ['ALL'],
    type: ['ALL']
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(val => {
      this.txService.updateFilters(val);
    });
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

  public viewDetails(tx: Transaction): void {
    this.router.navigate(['/transactions/details', tx.id]);
  }

  public viewStatus(tx: Transaction): void {
    this.router.navigate(['/transactions/status', tx.id]);
  }
}
