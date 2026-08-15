import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CreditCheckService } from '../../../../core/services/credit-check.service';
import { ApplicationStatus } from '../../../../core/models/loan-application.model';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-credit-check-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './credit-check-dashboard.component.html',
  styleUrls: ['./credit-check-dashboard.component.scss'],
})
export class CreditCheckDashboardComponent {
  public creditCheckService = inject(CreditCheckService);

  public sidebarCollapsed = false;

  // Local filter fields, applied on "Search" — same UX as the
  // Filter & search panel state for the Credit Check dashboard.
  public startDate = '';
  public endDate = '';
  public loanType = 'All';
  public creditStatus = 'All';
  public applicationStatus = 'All';
  public customerSearch = '';
  public loanIdSearch = '';

  public loanTypeOptions = ['All', 'Personal', 'Home', 'Vehicle', 'Education', 'Gold', 'Other'];
  public creditStatusOptions = ['All', 'Pass', 'Review', 'Fail'];
  public applicationStatusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

  public onToggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public applyFilters(): void {
    this.creditCheckService.setFilters({
      startDate: this.startDate || null,
      endDate: this.endDate || null,
      loanType: this.loanType as any,
      creditStatus: this.creditStatus as any,
      applicationStatus: this.applicationStatus as any,
      customerSearch: this.customerSearch,
      loanIdSearch: this.loanIdSearch,
    });
  }

  public resetFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.loanType = 'All';
    this.creditStatus = 'All';
    this.applicationStatus = 'All';
    this.customerSearch = '';
    this.loanIdSearch = '';
    this.creditCheckService.resetFilters();
  }

  public approve(loanId: number): void {
    this.creditCheckService.updateApplicationStatus(loanId, 'Approved' as ApplicationStatus);
  }

  public reject(loanId: number): void {
    this.creditCheckService.updateApplicationStatus(loanId, 'Rejected' as ApplicationStatus);
  }

  public onRefresh(): void {
    this.creditCheckService.fetchRecordsFromBackend().subscribe();
  }

  public exportExcel(): void {
    this.creditCheckService.exportToCSV();
  }

  public exportPdf(): void {
    this.creditCheckService.exportToPDF();
  }

  public formatCurrency(value: number): string {
    return '\u20B9' + value.toLocaleString('en-IN');
  }
}
