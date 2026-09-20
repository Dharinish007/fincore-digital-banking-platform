import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TransactionService } from '../../../../core/services/transaction.service';
import { Transaction } from '../../../../core/models/transaction.model';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';

@Component({
  selector: 'app-transaction-status',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './transaction-status.component.html',
  styleUrls: ['./transaction-status.component.scss']
})
export class TransactionStatusComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private txService = inject(TransactionService);

  public sidebarCollapsed = false;
  public tx: Transaction | null = null;
  public id = '';
  private sub?: Subscription;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    const pending = this.txService.getPending();
    if (pending && (pending.id === this.id || !this.id)) {
      this.tx = pending;
    } else if (this.id) {
      this.tx = this.txService.getById(this.id) || null;
    }

    this.sub = this.txService.list().subscribe(list => {
      if (this.id) {
        const found = list.find(x => x.id === this.id || x.reference === this.id);
        if (found) this.tx = found;
      } else {
        const currentPending = this.txService.getPending();
        if (currentPending) this.tx = currentPending;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public retry(): void {
    if (!this.tx) return;
    this.txService.retryTransaction(this.tx).subscribe(() => {
      const updated = this.txService.getPending();
      if (updated) this.tx = updated;
    });
  }

  public viewDetails(): void {
    if (!this.tx) return;
    this.router.navigate(['/transactions/details', this.tx.id || this.tx.reference]);
  }

  public initiateNew(): void {
    this.router.navigate(['/fund-transfer']);
  }

  public backToDashboard(): void {
    this.router.navigate(['/balance-accuracy']);
  }
}
