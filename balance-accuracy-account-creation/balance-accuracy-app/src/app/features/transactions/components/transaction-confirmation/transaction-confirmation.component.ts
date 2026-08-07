import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TransactionService } from '../../../../core/services/transaction.service';
import { Transaction } from '../../../../core/models/transaction.model';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-transaction-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './transaction-confirmation.component.html',
  styleUrls: ['./transaction-confirmation.component.scss']
})
export class TransactionConfirmationComponent implements OnInit {
  private txService = inject(TransactionService);
  private router = inject(Router);

  public sidebarCollapsed = false;
  public tx: Transaction | null = null;

  ngOnInit(): void {
    this.tx = this.txService.getPending();
    if (!this.tx) {
      this.router.navigate(['/transactions/initiate']);
    }
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public confirm(): void {
    if (!this.tx) return;
    this.txService.confirm(this.tx).subscribe(() => {
      const pending = this.txService.getPending();
      this.router.navigate(['/transactions/status', pending?.id || '']);
    });
  }

  public edit(): void {
    this.router.navigate(['/transactions/initiate']);
  }

  public cancel(): void {
    this.txService.setPending(null);
    this.router.navigate(['/transactions']);
  }
}
