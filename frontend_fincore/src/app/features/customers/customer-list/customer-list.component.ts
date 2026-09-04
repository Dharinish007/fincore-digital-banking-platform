import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankingService } from '../../../core/services/banking.service';
import { Customer, Account, Transaction, Loan, KYCStatus, RiskLevel } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  // Filter state
  searchQuery = '';
  selectedKyc: string = 'ALL';
  selectedRisk: string = 'ALL';

  // Modals state
  showAddModal = false;
  showDetailsModal = false;
  selectedCustomer?: Customer;

  // Linked details for selected customer
  customerAccounts: Account[] = [];
  customerTransactions: Transaction[] = [];
  customerLoans: Loan[] = [];

  // Reactive Add Customer Form
  customerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dateOfBirth: ['', Validators.required],
    gender: ['Male', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+ ]{10,15}$/)]],
    pan: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
    aadhaarRef: ['', [Validators.required]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['Maharashtra', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    country: ['India', Validators.required],
    employmentType: ['Salaried', Validators.required],
    annualIncome: [1200000, [Validators.required, Validators.min(100000)]],
    riskCategory: ['Low' as RiskLevel, Validators.required]
  });

  ngOnInit() {
    this.banking.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredCustomers = this.customers.filter(c => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        c.customerId.toLowerCase().includes(q) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.pan.toLowerCase().includes(q);

      const matchesKyc = this.selectedKyc === 'ALL' || c.kycStatus === this.selectedKyc;
      const matchesRisk = this.selectedRisk === 'ALL' || c.riskCategory === this.selectedRisk;

      return matchesSearch && matchesKyc && matchesRisk;
    });
  }

  openAddModal() {
    this.customerForm.reset({
      gender: 'Male',
      state: 'Maharashtra',
      country: 'India',
      employmentType: 'Salaried',
      annualIncome: 1200000,
      riskCategory: 'Low'
    });
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  submitCustomer() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.toast.error('Validation Failed', 'Please correct the highlighted fields');
      return;
    }

    const val = this.customerForm.value;
    const newCustomerData: Omit<Customer, 'customerId' | 'customerSince'> = {
      ...val,
      kycStatus: 'Pending' as KYCStatus,
      riskScore: val.riskCategory === 'Low' ? 15 : val.riskCategory === 'Medium' ? 45 : 75,
      status: 'Active'
    };

    this.banking.createCustomer(newCustomerData).subscribe(res => {
      this.toast.success('Customer Created', `Registered ${res.firstName} ${res.lastName} with ID ${res.customerId}`);
      this.closeAddModal();
    });
  }

  viewDetails(customer: Customer) {
    this.selectedCustomer = customer;

    this.banking.getAccounts().subscribe(accs => {
      this.customerAccounts = accs.filter(a => a.customerId === customer.customerId);
    });

    this.banking.getTransactions().subscribe(txns => {
      this.customerTransactions = txns.filter(t => t.customerId === customer.customerId);
    });

    this.banking.getLoans().subscribe(loans => {
      this.customerLoans = loans.filter(l => l.customerId === customer.customerId);
    });

    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedCustomer = undefined;
  }

  toggleBlock(customer: Customer) {
    customer.status = customer.status === 'Active' ? 'Blocked' : 'Active';
    this.toast.warning(
      customer.status === 'Blocked' ? 'Customer Blocked' : 'Customer Unblocked',
      `${customer.firstName} ${customer.lastName} status changed to ${customer.status}`
    );
  }
}
