import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AccountFilter, AccountStatus, AccountType } from '../../models/account.model';

@Component({
  selector: 'app-account-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule],
  template: `
    <div class="filter-bar" [formGroup]="filterForm">
      <mat-form-field appearance="outline" class="filter-search" subscriptSizing="dynamic">
        <mat-label>Search accounts…</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput formControlName="search" placeholder="Account number, customer ID">
        @if (filterForm.get('search')?.value) {
          <button matSuffix mat-icon-button (click)="filterForm.get('search')?.setValue('')" aria-label="Clear search input">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-select" subscriptSizing="dynamic">
        <mat-label>Status</mat-label>
        <mat-select formControlName="status">
          <mat-option [value]="null">All Statuses</mat-option>
          @for (s of statuses; track s) { <mat-option [value]="s">{{ s }}</mat-option> }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-select" subscriptSizing="dynamic">
        <mat-label>Account Type</mat-label>
        <mat-select formControlName="accountType">
          <mat-option [value]="null">All Types</mat-option>
          @for (t of accountTypes; track t) { <mat-option [value]="t">{{ t.replace('_', ' ') }}</mat-option> }
        </mat-select>
      </mat-form-field>

      <button mat-stroked-button color="warn" (click)="reset()" class="reset-btn" type="button">
        <mat-icon>refresh</mat-icon> Reset
      </button>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-6);
      box-shadow: var(--shadow-xs);
    }
    .filter-search { flex: 2; min-width: 240px; }
    .filter-select { flex: 1; min-width: 140px; }
    .reset-btn { height: 42px; gap: 4px; flex-shrink: 0; display: flex; align-items: center; }
  `]
})
export class AccountFilterComponent implements OnInit, OnDestroy {
  @Output() filterChanged = new EventEmitter<AccountFilter>();

  filterForm!: FormGroup;
  statuses = Object.values(AccountStatus);
  accountTypes = Object.values(AccountType);
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({ search: [''], status: [null], accountType: [null] });
    this.filterForm.valueChanges.pipe(
      debounceTime(300), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntil(this.destroy$)
    ).subscribe(v => this.filterChanged.emit(v));
  }

  reset(): void { this.filterForm.reset({ search: '', status: null, accountType: null }); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
