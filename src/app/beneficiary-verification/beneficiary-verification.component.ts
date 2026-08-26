import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { BeneficiaryService } from '../services/beneficiary.service';
import { Beneficiary } from '../payment-initiation/models/beneficiary.model';

@Component({
  selector: 'app-beneficiary-verification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './beneficiary-verification.component.html',
  styleUrls: ['./beneficiary-verification.component.scss'],
})
export class BeneficiaryVerificationComponent implements OnInit {
  sidebarCollapsed = false;

  beneficiaries: Beneficiary[] = [];
  filteredBeneficiaries: Beneficiary[] = [];

  activeTab: 'ALL' | 'Pending' | 'Verified' | 'Blocked' = 'ALL';
  searchQuery = '';

  // Verification Modal State
  selectedBeneficiaryForVerify: Beneficiary | null = null;
  showVerifyModal = false;

  // Block Modal State
  selectedBeneficiaryForBlock: Beneficiary | null = null;
  showBlockModal = false;

  // Toast Notification
  toastMessage: string | null = null;
  toastType: 'success' | 'warning' | 'error' = 'success';

  constructor(private beneficiaryService: BeneficiaryService) {}

  ngOnInit(): void {
    this.beneficiaryService.getBeneficiaries().subscribe((data) => {
      this.beneficiaries = data;
      this.applyFilter();
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setTab(tab: 'ALL' | 'Pending' | 'Verified' | 'Blocked'): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.beneficiaries];

    // Status Tab Filter
    if (this.activeTab !== 'ALL') {
      result = result.filter((b) => b.status === this.activeTab);
    }

    // Search Query Filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.beneficiary_name.toLowerCase().includes(q) ||
          b.account_no.toLowerCase().includes(q) ||
          b.bank_name.toLowerCase().includes(q) ||
          b.ifsc_code.toLowerCase().includes(q)
      );
    }

    this.filteredBeneficiaries = result;
  }

  get totalCount(): number {
    return this.beneficiaries.length;
  }

  get pendingCount(): number {
    return this.beneficiaries.filter((b) => b.status === 'Pending').length;
  }

  get verifiedCount(): number {
    return this.beneficiaries.filter((b) => b.status === 'Verified').length;
  }

  get blockedCount(): number {
    return this.beneficiaries.filter((b) => b.status === 'Blocked').length;
  }

  // Verification Handlers
  openVerifyModal(beneficiary: Beneficiary): void {
    this.selectedBeneficiaryForVerify = beneficiary;
    this.showVerifyModal = true;
  }

  closeVerifyModal(): void {
    this.showVerifyModal = false;
    this.selectedBeneficiaryForVerify = null;
  }

  confirmVerification(): void {
    if (this.selectedBeneficiaryForVerify) {
      const name = this.selectedBeneficiaryForVerify.beneficiary_name;
      this.beneficiaryService.verifyBeneficiary(this.selectedBeneficiaryForVerify.beneficiary_id);
      this.closeVerifyModal();
      this.showToast(`Beneficiary "${name}" has been successfully verified!`, 'success');
    }
  }

  // Block Handlers
  openBlockModal(beneficiary: Beneficiary): void {
    this.selectedBeneficiaryForBlock = beneficiary;
    this.showBlockModal = true;
  }

  closeBlockModal(): void {
    this.showBlockModal = false;
    this.selectedBeneficiaryForBlock = null;
  }

  confirmBlock(): void {
    if (this.selectedBeneficiaryForBlock) {
      const name = this.selectedBeneficiaryForBlock.beneficiary_name;
      this.beneficiaryService.blockBeneficiary(this.selectedBeneficiaryForBlock.beneficiary_id);
      this.closeBlockModal();
      this.showToast(`Beneficiary "${name}" has been blocked.`, 'warning');
    }
  }

  private showToast(msg: string, type: 'success' | 'warning' | 'error' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
