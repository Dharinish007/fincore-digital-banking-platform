import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';
import { Account, Beneficiary, Payment } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-send-money-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './send-money-wizard.component.html',
  styleUrls: ['./send-money-wizard.component.scss']
})
export class SendMoneyWizardComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);

  accounts: Account[] = [];
  beneficiaries: Beneficiary[] = [];

  // Current Step: 1 to 7
  currentStep = 1;

  // Wizard Selections
  selectedSourceAccount: Account | null = null;
  selectedBeneficiary: Beneficiary | null = null;
  transferAmount: number = 15000;
  remarks: string = 'Consulting Invoice #SEP26';
  paymentMode: 'UPI' | 'IMPS' | 'NEFT' = 'IMPS';

  // Step 6: 2FA PIN
  mpin: string = '4820';
  isProcessing = false;

  // Step 7: Completed Payment Record
  completedPayment: Payment | null = null;

  // Quick Amount presets
  presets = [5000, 10000, 25000, 50000, 100000];

  ngOnInit() {
    this.banking.getAccounts().subscribe(accs => {
      this.accounts = accs.filter(a => a.status === 'Active' && a.availableBalance > 0);
      if (this.accounts.length > 0) {
        this.selectedSourceAccount = this.accounts[0];
      }
    });

    this.banking.getBeneficiaries().subscribe(bens => {
      this.beneficiaries = bens.filter(b => b.status === 'Active');
      if (this.beneficiaries.length > 0) {
        this.selectedBeneficiary = this.beneficiaries[0];
      }
    });
  }

  setPreset(amt: number) {
    this.transferAmount = amt;
  }

  goToStep(step: number) {
    if (step > this.currentStep) {
      // Validate before proceeding
      if (this.currentStep === 1 && !this.selectedSourceAccount) {
        this.toast.error('Required', 'Please select a source account');
        return;
      }
      if (this.currentStep === 2 && !this.selectedBeneficiary) {
        this.toast.error('Required', 'Please select a beneficiary');
        return;
      }
      if (this.currentStep === 3) {
        if (!this.transferAmount || this.transferAmount <= 0) {
          this.toast.error('Invalid Amount', 'Please enter a valid transfer amount');
          return;
        }
        if (this.selectedSourceAccount && this.transferAmount > this.selectedSourceAccount.availableBalance) {
          this.toast.error('Insufficient Funds', 'Transfer amount exceeds available ledger balance');
          return;
        }
      }
    }
    this.currentStep = step;
  }

  executeTransfer() {
    if (!this.selectedSourceAccount || !this.selectedBeneficiary) return;

    this.isProcessing = true;

    // Simulate 1.2s Saga transaction execution across microservices
    setTimeout(() => {
      this.banking.initiatePayment({
        sourceAccount: this.selectedSourceAccount!.accountNumber,
        beneficiaryId: this.selectedBeneficiary!.beneficiaryId,
        beneficiaryName: this.selectedBeneficiary!.beneficiaryName,
        beneficiaryAccount: `${this.selectedBeneficiary!.accountNumber} (${this.selectedBeneficiary!.bankName})`,
        paymentType: this.paymentMode,
        amount: this.transferAmount,
        remarks: this.remarks
      }).subscribe(res => {
        this.isProcessing = false;
        this.completedPayment = res;
        this.currentStep = 7;
        this.toast.success('Transfer Settled', `Transaction reference: ${res.transactionReference}`);
      });
    }, 1200);
  }

  resetWizard() {
    this.currentStep = 1;
    this.transferAmount = 15000;
    this.remarks = 'Invoice Settlement';
    this.completedPayment = null;
  }
}
