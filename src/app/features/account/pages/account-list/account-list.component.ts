import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, BehaviorSubject, switchMap, tap } from 'rxjs';
import { MockAccountService } from '../../services/mock-account.service';
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
  private accountService = inject(MockAccountService);

  branches = this.accountService.branches;
  isLoading = true;
  accounts$!: Observable<AccountSummary[]>;
  private filter$ = new BehaviorSubject<AccountFilter>({});

  ngOnInit(): void {
    this.accounts$ = this.filter$.pipe(
      tap(() => this.isLoading = true),
      switchMap(filter => this.accountService.getAccounts(filter)),
      tap(() => this.isLoading = false)
    );
  }

  onFilterChanged(filter: AccountFilter): void { this.filter$.next(filter); }
}
