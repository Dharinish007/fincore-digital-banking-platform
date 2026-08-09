import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AccountService,
  CreateAccountRequest,
} from '../../../../core/services/account.service';

@Component({
  selector: 'app-open-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './open-account.component.html',
  styleUrls: ['./open-account.component.scss'],
})
export class OpenAccountComponent {
  fullname = '';
  email = '';
  mobile = '';
  branch = '';
  accountType: any = 'Savings';
  initialDeposit = 0;
  accountNo = '';
  ifscCode = '';

  statusMessage = '';

  constructor(private accountService: AccountService) {}

  submit() {
    // if user left accountNo blank, generate a client-side account number
    if (!this.accountNo || this.accountNo.trim() === '') {
      this.accountNo = this.generateAccountNo();
    }

    const backendAccountType =
      this.accountType === 'Savings' ? 'Savings' : 'Current';

    const payload: CreateAccountRequest = {
      fullname: this.fullname,
      email: this.email,
      mobile: this.mobile,
      dob: '',
      pan: '',
      aadhaar: '',
      address: '',
      occupation: '',
      income: 0,
      nomineeName: '',
      nomineeRelation: '',
      branch: this.branch,
      accountType: backendAccountType as any,
      initialDeposit: Number(this.initialDeposit),
      accountNo: this.accountNo || undefined,
      ifscCode: this.ifscCode || undefined,
      password: '',
      confirm: '',
      terms: true,
    };

    this.accountService.create(payload).subscribe(
      (acc) => {
        const created = acc.openedDate ? ` (${acc.openedDate})` : '';
        const message = acc.message || `Account created successfully`;
        this.statusMessage = `${message}: ${acc.accountNumber}${created}`;
      },
      (err) => {
        this.statusMessage =
          err?.error || err?.message || 'Failed to create account';
      },
    );
  }

  private generateAccountNo(): string {
    // Use SB prefix to match existing sample accounts. Generate 8 random digits.
    const prefix = 'SB';
    const num = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
    return `${prefix}${num}`;
  }
}
