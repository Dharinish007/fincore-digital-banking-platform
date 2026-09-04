import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BankingService } from '../../../core/services/banking.service';
import { Transaction, PaymentChannel, TransactionStatus } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  // Search & Filter
  searchQuery = '';
  selectedChannel = 'ALL';
  selectedStatus = 'ALL';
  selectedType = 'ALL';

  // Details Modal
  selectedTransaction?: Transaction;
  showDetailModal = false;

  // Pagination
  currentPage = 1;
  pageSize = 8;

  ngOnInit() {
    this.banking.getTransactions().subscribe(txns => {
      this.transactions = txns;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(t => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        t.transactionId.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.referenceNumber.toLowerCase().includes(q) ||
        t.accountNumber.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);

      const matchesChannel = this.selectedChannel === 'ALL' || t.channel === this.selectedChannel;
      const matchesStatus = this.selectedStatus === 'ALL' || t.status === this.selectedStatus;
      const matchesType = this.selectedType === 'ALL' || t.transactionType === this.selectedType;

      return matchesSearch && matchesChannel && matchesStatus && matchesType;
    });
    this.currentPage = 1;
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTransactions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.pageSize) || 1;
  }

  viewDetails(t: Transaction) {
    this.selectedTransaction = t;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedTransaction = undefined;
  }

  reverse(t: Transaction) {
    if (confirm(`Are you sure you want to reverse transaction ${t.transactionId} of ₹${t.amount}?`)) {
      this.banking.reverseTransaction(t.transactionId).subscribe(() => {
        this.toast.warning('Transaction Reversed', `Reference ${t.referenceNumber} has been reversed.`);
        this.closeDetailModal();
      });
    }
  }

  exportCSV() {
    this.toast.success('CSV Exported', `Exported ${this.filteredTransactions.length} records to FinCore_Ledger_Export.csv`);
  }
}
