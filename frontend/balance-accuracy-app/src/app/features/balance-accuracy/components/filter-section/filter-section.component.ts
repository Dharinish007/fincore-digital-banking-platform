import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BalanceFilterCriteria } from '../../../../core/models/filter.model';

@Component({
  selector: 'app-filter-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<BalanceFilterCriteria>();
  @Output() filterReset = new EventEmitter<void>();
  @Output() exportExcel = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();

  public filterForm!: FormGroup;

  public branches = [
    'All',
    'Main Branch - Downtown',
    'North Avenue Branch',
    'Westside Metro',
    'East Commerce',
    'Global Treasury'
  ];

  public accountTypes = [
    'All',
    'Savings',
    'Checking',
    'Corporate',
    'Fixed Deposit',
    'Money Market'
  ];

  public statuses = [
    'All',
    'Verified',
    'Mismatch',
    'Pending'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      branch: ['All'],
      accountType: ['All'],
      status: ['All'],
      customerSearch: [''],
      accountNumberSearch: ['']
    });
  }

  onSearch(): void {
    this.filterChanged.emit(this.filterForm.value);
  }

  onReset(): void {
    this.filterForm.reset({
      startDate: null,
      endDate: null,
      branch: 'All',
      accountType: 'All',
      status: 'All',
      customerSearch: '',
      accountNumberSearch: ''
    });
    this.filterReset.emit();
  }

  onExportExcel(): void {
    this.exportExcel.emit();
  }

  onExportPdf(): void {
    this.exportPdf.emit();
  }
}
