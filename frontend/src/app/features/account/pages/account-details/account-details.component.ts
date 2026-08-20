import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AccountService } from '../../services/account.service';
import { Observable, switchMap, tap, catchError, of } from 'rxjs';
import { Account } from '../../models/account.model';
import { AccountStatusChipComponent } from '../../components/account-status-chip/account-status-chip.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule, DatePipe, CurrencyPipe, RouterModule,
    MatButtonModule, MatIconModule, MatDividerModule,
    AccountStatusChipComponent, EmptyStateComponent
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  hasError = false;

  account$!: Observable<Account | undefined>;

  ngOnInit(): void {
    this.account$ = this.route.paramMap.pipe(
      tap(() => this.hasError = false),
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of(undefined);
        return this.accountService.getAccountById(id).pipe(
          catchError(err => {
            console.error('Error fetching account details:', err);
            this.hasError = true;
            return of(undefined);
          })
        );
      })
    );
  }

  backToAccounts(): void {
    this.router.navigate(['/account']);
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      SAVINGS: 'savings', CHECKING: 'account_balance_wallet',
      CURRENT: 'business_center', FIXED_DEPOSIT: 'lock_clock'
    };
    return icons[type] ?? 'account_balance';
  }
}
