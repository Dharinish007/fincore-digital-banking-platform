import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { TransactionService } from '../../../../core/services/transaction.service';
import { HeaderComponent } from '../../../balance-accuracy/components/header/header.component';
import { SidebarComponent } from '../../../balance-accuracy/components/sidebar/sidebar.component';
import { Transaction } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-initiate-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './initiate-transaction.component.html',
  styleUrls: ['./initiate-transaction.component.scss']
})
export class InitiateTransactionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private txService = inject(TransactionService);
  private router = inject(Router);

  public sidebarCollapsed = false;
  public form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      sender: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      receiver: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      type: ['Transfer', [Validators.required]],
      amount: [1000, [Validators.required, Validators.min(1)]],
      reference: [this.generateReference(), [Validators.required]],
      date: [new Date(), [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const pending = this.txService.getPending();
    if (pending) {
      this.form.patchValue({
        sender: pending.sender,
        receiver: pending.receiver,
        type: pending.type,
        amount: pending.amount,
        reference: pending.reference,
        date: pending.date ? new Date(pending.date) : new Date(),
        description: pending.description || ''
      });
    }
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  public generateReference(): string {
    return 'REF' + Math.floor(100000 + Math.random() * 900000);
  }

  public fillSampleData(): void {
    this.form.setValue({
      sender: '100084920192',
      receiver: '400092817261',
      type: 'Transfer',
      amount: 15500,
      reference: this.generateReference(),
      date: new Date(),
      description: 'Vendor settlement for July batch processing'
    });
    this.form.markAllAsTouched();
  }

  public reset(): void {
    this.form.reset({
      sender: '',
      receiver: '',
      type: 'Transfer',
      amount: 0,
      reference: this.generateReference(),
      date: new Date(),
      description: ''
    });
  }

  public validateAll(): void {
    this.form.markAllAsTouched();
  }

  public proceed(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const val = this.form.value;
    if (val.sender === val.receiver) {
      this.form.get('receiver')?.setErrors({ sameAccount: true });
      return;
    }

    const tx: Transaction = {
      id: '',
      sender: val.sender,
      receiver: val.receiver,
      type: val.type,
      amount: Number(val.amount),
      reference: val.reference,
      date: val.date instanceof Date ? val.date.toISOString() : new Date(val.date).toISOString(),
      status: 'Pending',
      charges: Number(val.amount) > 10000 ? 15 : 5,
      description: val.description
    };

    this.txService.setPending(tx);
    this.router.navigate(['/transactions/confirm']);
  }

  public isSubmitting = false;
  public statusMessage = '';
  public isSuccess = false;

  public submitDirect(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const val = this.form.value;
    if (val.sender === val.receiver) {
      this.form.get('receiver')?.setErrors({ sameAccount: true });
      return;
    }

    this.isSubmitting = true;
    this.statusMessage = '';

    const tx: Transaction = {
      id: '',
      sender: val.sender,
      receiver: val.receiver,
      type: val.type,
      amount: Number(val.amount),
      reference: val.reference,
      date: val.date instanceof Date ? val.date.toISOString() : new Date(val.date).toISOString(),
      status: 'Pending',
      charges: Number(val.amount) > 10000 ? 15 : 5,
      description: val.description
    };

    this.txService.confirm(tx).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isSuccess = true;
        this.statusMessage = `Fund Transfer initiated successfully! Reference: ${val.reference}`;
      },
      error: () => {
        this.isSubmitting = false;
        this.isSuccess = false;
        this.statusMessage = 'Failed to submit transfer. Please check account details.';
      }
    });
  }

  public cancel(): void {
    this.router.navigate(['/balance-accuracy']);
  }
}
