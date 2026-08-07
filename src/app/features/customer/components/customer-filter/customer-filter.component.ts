import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CustomerFilter, CustomerStatus, CustomerType } from '../../models/customer.model';

@Component({
  selector: 'app-customer-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule],
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.scss'
})
export class CustomerFilterComponent implements OnInit, OnDestroy {
  @Input() branches: string[] = [];
  @Output() filterChanged = new EventEmitter<CustomerFilter>();

  filterForm!: FormGroup;
  statuses = Object.values(CustomerStatus);
  customerTypes = Object.values(CustomerType);
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      status: [null],
      customerType: [null],
      branch: [null]
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntil(this.destroy$)
    ).subscribe(value => this.filterChanged.emit(value));
  }

  reset(): void {
    this.filterForm.reset({ search: '', status: null, customerType: null, branch: null });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
