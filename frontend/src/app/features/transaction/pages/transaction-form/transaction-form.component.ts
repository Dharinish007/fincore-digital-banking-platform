import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AccountService } from '../../../account/services/account.service';
import { AccountSummary } from '../../../account/models/account.model';
import { TransactionService } from '../../services/transaction.service';
import { TransactionType, Currency } from '../../models/transaction.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule,
    PageHeaderComponent
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private txnService = inject(TransactionService);
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);

  isSaving = false;
  isLoadingAccounts = true;
  accountLoadError = false;
  accounts: AccountSummary[] = [];
  currencies = this.txnService.currencies;
  transactionTypes = Object.values(TransactionType);

  form!: FormGroup;

  ngOnInit(): void {
    this.loadAccounts();

    const today = new Date().toISOString().slice(0, 10);
    const ref = `REF-${Date.now()}`;

    this.form = this.fb.group({
      sourceAccountId: ['', Validators.required],
      destinationAccountId: [''],
      type: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      currency: ['USD', Validators.required],
      description: ['', Validators.required],
      referenceNumber: [ref, Validators.required],
      transactionDate: [today, Validators.required]
    });
  }

  loadAccounts(): void {
    this.isLoadingAccounts = true;
    this.accountLoadError = false;
    this.accountService.getAccounts().subscribe({
      next: (accs) => {
        this.accounts = accs || [];
        this.isLoadingAccounts = false;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.accountLoadError = true;
        this.isLoadingAccounts = false;
        this.notificationService.error('Unable to load accounts for transaction.');
      }
    });
  }

  save(): void {
    if (this.isSaving || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;

    const v = this.form.getRawValue();
    this.txnService.createTransaction({
      sourceAccountId: v.sourceAccountId,
      destinationAccountId: v.destinationAccountId || undefined,
      type: v.type as TransactionType,
      amount: +v.amount,
      currency: v.currency as Currency,
      description: v.description,
      referenceNumber: v.referenceNumber,
      transactionDate: new Date(v.transactionDate).toISOString()
    }).subscribe({
      next: txn => {
        this.isSaving = false;
        this.notificationService.success('Transaction executed successfully.');
        this.router.navigate(['/transaction', txn.id]);
      },
      error: (err) => {
        console.error('Error creating transaction:', err);
        this.isSaving = false;
        this.notificationService.error('Failed to execute transaction. Please check details and try again.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/transaction']);
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }

  get needsDestination(): boolean {
    return this.form.get('type')?.value === TransactionType.TRANSFER;
  }
}
