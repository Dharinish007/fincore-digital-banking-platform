import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';
import { Beneficiary } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './beneficiary-list.component.html',
  styleUrls: ['./beneficiary-list.component.scss']
})
export class BeneficiaryListComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  beneficiaries: Beneficiary[] = [];
  filteredBeneficiaries: Beneficiary[] = [];

  searchQuery = '';
  showAddModal = false;
  isVerifyingIfsc = false;
  resolvedBankBranch = '';

  benForm: FormGroup = this.fb.group({
    beneficiaryName: ['', [Validators.required, Validators.minLength(3)]],
    nickName: [''],
    accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
    confirmAccountNumber: ['', Validators.required],
    ifsc: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
    bankName: ['HDFC Bank Ltd', Validators.required],
    paymentType: ['All', Validators.required]
  });

  ngOnInit() {
    this.banking.getBeneficiaries().subscribe(b => {
      this.beneficiaries = b;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredBeneficiaries = this.beneficiaries.filter(b => {
      const q = this.searchQuery.toLowerCase();
      return !q ||
        b.beneficiaryName.toLowerCase().includes(q) ||
        b.bankName.toLowerCase().includes(q) ||
        b.ifsc.toLowerCase().includes(q) ||
        b.accountNumber.includes(q);
    });
  }

  lookupIfsc() {
    const code = this.benForm.get('ifsc')?.value?.toUpperCase();
    if (!code || code.length !== 11) return;

    this.isVerifyingIfsc = true;
    setTimeout(() => {
      this.isVerifyingIfsc = false;
      if (code.startsWith('HDFC')) {
        this.benForm.patchValue({ bankName: 'HDFC Bank Ltd' });
        this.resolvedBankBranch = 'HDFC Bank, Fort Branch, Mumbai';
      } else if (code.startsWith('SBIN')) {
        this.benForm.patchValue({ bankName: 'State Bank of India' });
        this.resolvedBankBranch = 'State Bank of India, Main Branch, Nariman Point';
      } else if (code.startsWith('ICIC')) {
        this.benForm.patchValue({ bankName: 'ICICI Bank Ltd' });
        this.resolvedBankBranch = 'ICICI Bank, Bandra Kurla Complex';
      } else {
        this.resolvedBankBranch = 'Valid National Bank IFSC (Branch Verified)';
      }
      this.toast.info('IFSC Verified', `Resolved branch: ${this.resolvedBankBranch}`);
    }, 600);
  }

  openAddModal() {
    this.benForm.reset({
      paymentType: 'All',
      bankName: 'HDFC Bank Ltd'
    });
    this.resolvedBankBranch = '';
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  submitBeneficiary() {
    if (this.benForm.invalid) {
      this.benForm.markAllAsTouched();
      return;
    }

    const val = this.benForm.value;
    if (val.accountNumber !== val.confirmAccountNumber) {
      this.toast.error('Mismatch', 'Account numbers do not match');
      return;
    }

    this.banking.addBeneficiary({
      customerId: 'CUS100234',
      beneficiaryName: val.beneficiaryName,
      accountNumber: val.accountNumber,
      bankName: val.bankName,
      ifsc: val.ifsc.toUpperCase(),
      paymentType: val.paymentType,
      status: 'Active',
      nickName: val.nickName || val.beneficiaryName.split(' ')[0]
    }).subscribe(res => {
      this.toast.success('Beneficiary Added', `Registered ${res.beneficiaryName} (${res.bankName})`);
      this.closeAddModal();
    });
  }

  deleteBen(b: Beneficiary) {
    if (confirm(`Remove beneficiary ${b.beneficiaryName}?`)) {
      this.banking.deleteBeneficiary(b.beneficiaryId).subscribe(() => {
        this.toast.warning('Beneficiary Removed', `${b.beneficiaryName} has been deleted.`);
      });
    }
  }
}
