import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CustomerFilter, CustomerStatus, KycStatus } from '../../models/customer.model';

@Component({
  selector: 'app-customer-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.scss'
})
export class CustomerFilterComponent implements OnInit, OnDestroy {
  @Output() filterChanged = new EventEmitter<CustomerFilter>();

  filterForm!: FormGroup;
  statuses = Object.values(CustomerStatus);
  kycStatuses = Object.values(KycStatus);
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      status: [null],
      kycStatus: [null]
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntil(this.destroy$)
    ).subscribe(value => this.filterChanged.emit(value));
  }

  get hasActiveFilters(): boolean {
    const v = this.filterForm.value;
    return !!(v.search || v.status || v.kycStatus);
  }

  clearSearch(): void {
    this.filterForm.patchValue({ search: '' });
  }

  reset(): void {
    this.filterForm.reset({ search: '', status: null, kycStatus: null });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
