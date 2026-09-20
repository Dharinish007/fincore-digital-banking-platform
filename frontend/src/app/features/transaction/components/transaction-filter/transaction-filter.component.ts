import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import {
  TransactionFilter, TransactionStatus, TransactionType
} from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-filter',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatIconModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <div class="filter-bar" [formGroup]="filterForm">

      <mat-form-field appearance="outline" class="filter-search" subscriptSizing="dynamic">
        <mat-label>Search transactions…</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput formControlName="search"
               placeholder="Transaction ID, reference, customer or account">
        @if (filterForm.get('search')?.value) {
          <button matSuffix mat-icon-button (click)="filterForm.get('search')?.setValue('')" aria-label="Clear search input">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-select" subscriptSizing="dynamic">
        <mat-label>Type</mat-label>
        <mat-select formControlName="transactionType">
          <mat-option [value]="null">All Types</mat-option>
          @for (t of types; track t) {
            <mat-option [value]="t">{{ t }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-select" subscriptSizing="dynamic">
        <mat-label>Status</mat-label>
        <mat-select formControlName="status">
          <mat-option [value]="null">All Statuses</mat-option>
          @for (s of statuses; track s) {
            <mat-option [value]="s">{{ s }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-date" subscriptSizing="dynamic">
        <mat-label>Date From</mat-label>
        <input matInput [matDatepicker]="fromPicker" formControlName="dateFrom">
        <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
        <mat-datepicker #fromPicker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-date" subscriptSizing="dynamic">
        <mat-label>Date To</mat-label>
        <input matInput [matDatepicker]="toPicker" formControlName="dateTo">
        <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
        <mat-datepicker #toPicker></mat-datepicker>
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
    .filter-date   { flex: 1; min-width: 140px; }
    .reset-btn { height: 42px; gap: 4px; flex-shrink: 0; display: flex; align-items: center; }
  `]
})
export class TransactionFilterComponent implements OnInit, OnDestroy {
  @Output() filterChanged = new EventEmitter<TransactionFilter>();

  filterForm!: FormGroup;
  types    = Object.values(TransactionType);
  statuses = Object.values(TransactionStatus);
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search:          [''],
      transactionType: [null],
      status:          [null],
      dateFrom:        [null],
      dateTo:          [null]
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntil(this.destroy$)
    ).subscribe(v => {
      const filter: TransactionFilter = {
        search:          v.search || undefined,
        transactionType: v.transactionType || undefined,
        status:          v.status || undefined,
        dateFrom:        v.dateFrom ? new Date(v.dateFrom).toISOString() : undefined,
        dateTo:          v.dateTo   ? new Date(v.dateTo).toISOString()   : undefined
      };
      this.filterChanged.emit(filter);
    });
  }

  reset(): void {
    this.filterForm.reset({
      search: '', transactionType: null, status: null, dateFrom: null, dateTo: null
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
