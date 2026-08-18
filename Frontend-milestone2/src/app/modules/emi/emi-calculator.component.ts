import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmiService } from '../../services/emi.service';
import { EmiSummary, AmortizationScheduleItem } from '../../models/loan.model';

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './emi-calculator.component.html',
  styleUrl: './emi-calculator.component.css'
})
export class EmiCalculatorComponent implements OnInit {
  Math = Math;
  emiForm!: FormGroup;
  summary: EmiSummary | null = null;
  schedule: AmortizationScheduleItem[] = [];
  filteredSchedule: AmortizationScheduleItem[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 12;

  constructor(
    private fb: FormBuilder,
    private emiService: EmiService
  ) {}

  ngOnInit(): void {
    this.emiForm = this.fb.group({
      loanAmount: [500000, [Validators.required, Validators.min(1000)]],
      interestRate: [10.0, [Validators.required, Validators.min(0.1), Validators.max(50)]],
      tenure: [5, [Validators.required, Validators.min(1)]],
      tenureType: ['YEARS', Validators.required],
      repaymentFrequency: ['MONTHLY', Validators.required],
      startDate: ['2026-09-01']
    });

    this.calculate();
  }

  calculate(): void {
    if (this.emiForm.invalid) {
      this.emiForm.markAllAsTouched();
      return;
    }

    const formVal = this.emiForm.value;
    const result = this.emiService.calculateEmi({
      loanAmount: Number(formVal.loanAmount),
      interestRate: Number(formVal.interestRate),
      tenure: Number(formVal.tenure),
      tenureType: formVal.tenureType,
      repaymentFrequency: formVal.repaymentFrequency,
      startDate: formVal.startDate
    });

    this.summary = result.summary;
    this.schedule = result.schedule;
    this.applyFilter();
  }

  resetForm(): void {
    this.emiForm.reset({
      loanAmount: 500000,
      interestRate: 10.0,
      tenure: 5,
      tenureType: 'YEARS',
      repaymentFrequency: 'MONTHLY',
      startDate: '2026-09-01'
    });
    this.calculate();
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredSchedule = [...this.schedule];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSchedule = this.schedule.filter(
        item => item.month.toString().includes(term) || item.paymentDate.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSchedule.length / this.pageSize) || 1;
  }

  get paginatedSchedule(): AmortizationScheduleItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSchedule.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  formatCurrency(val: number): string {
    return '₹' + (val || 0).toLocaleString('en-IN');
  }

  exportScheduleCsv(): void {
    if (!this.schedule.length) return;
    const headers = ['Month', 'Payment Date', 'EMI (₹)', 'Principal (₹)', 'Interest (₹)', 'Remaining Balance (₹)'];
    const rows = this.schedule.map(s => [
      s.month,
      `"${s.paymentDate}"`,
      s.emi,
      s.principal,
      s.interest,
      s.remainingBalance
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `amortization_schedule_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
