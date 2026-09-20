import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, switchMap, tap, catchError, of } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { AccountSummary, AccountFilter } from '../../models/account.model';
import { AccountTableComponent } from '../../components/account-table/account-table.component';
import { AccountFilterComponent } from '../../components/account-filter/account-filter.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule,
    AccountTableComponent, AccountFilterComponent, PageHeaderComponent
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  readonly hasError = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);
  readonly accounts = signal<AccountSummary[]>([]);
  
  private filter$ = new BehaviorSubject<AccountFilter>({});

  ngOnInit(): void {
    this.filter$.pipe(
      tap(() => {
        this.isLoading.set(true);
        this.hasError.set(false);
      }),
      switchMap(filter => this.accountService.getAccounts(filter).pipe(
        catchError(err => {
          console.error('Error loading accounts:', err);
          this.hasError.set(true);
          return of([]);
        })
      ))
    ).subscribe(accs => {
      this.accounts.set(accs || []);
      this.isLoading.set(false);
      this.cdr.markForCheck();
    });
  }

  onFilterChanged(filter: AccountFilter): void {
    this.filter$.next(filter);
  }

  onAddAccount(): void {
    this.router.navigate(['/account/new']);
  }
}
