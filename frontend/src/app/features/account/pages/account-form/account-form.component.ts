import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { switchMap, of, catchError } from 'rxjs';

import { AccountService } from '../../services/account.service';
import {
  Account,
  AccountStatus,
  AccountType,
  CreateAccountRequest,
  UpdateAccountRequest
} from '../../models/account.model';

import { CustomerService } from '../../../customer/services/customer.service';
import { Customer } from '../../../customer/models/customer.model';

import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private customerService = inject(CustomerService);
  private notificationService = inject(NotificationService);

  isEditMode = false;
  isSaving = false;

  accountId: string | null = null;
  customers: Customer[] = [];

  accountTypes = Object.values(AccountType);
  statuses = Object.values(AccountStatus);

  form!: FormGroup;

  get pageTitle(): string {
    return this.isEditMode
      ? 'Edit Account'
      : 'Open New Account';
  }

  get pageSubtitle(): string {
    return this.isEditMode
      ? 'Update the account details'
      : 'Create a new bank account for a customer';
  }

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.accountId;
    this.initForm();

    // Load customers from Customer Service
    this.loadCustomers();

    // If Edit mode, load existing account data
    if (this.isEditMode && this.accountId) {
      this.accountService
        .getAccountById(this.accountId)
        .pipe(
          catchError(err => {
            console.error('Error fetching account:', err);
            this.notificationService.error('Error loading account record from server.');
            return of(undefined);
          })
        )
        .subscribe(account => {
          if (account) {
            this.form.patchValue({
              customerId: account.customerId,
              accountType: account.accountType,
              initialBalance: account.balance
            });
          }
        });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      customerId: [
        { value: '', disabled: this.isEditMode },
        Validators.required
      ],
      accountType: [
        '',
        Validators.required
      ],
      initialBalance: [
        { value: 0, disabled: this.isEditMode },
        [
          Validators.required,
          Validators.min(0)
        ]
      ]
    });
  }

  private loadCustomers(): void {
    this.customerService
      .getCustomers()
      .subscribe({
        next: customers => {
          this.customers = customers;
        },
        error: err => {
          console.error('Error loading customers:', err);
          this.notificationService.error('Unable to load customer directory for account creation.');
        }
      });
  }

  save(): void {
    if (this.isSaving || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const value = this.form.getRawValue();

    if (!this.isEditMode) {
      const payload: CreateAccountRequest = {
        customerId: value.customerId,
        accountType: value.accountType,
        initialBalance: Number(value.initialBalance)
      };

      this.accountService
        .createAccount(payload)
        .subscribe({
          next: (account: Account) => {
            this.isSaving = false;
            this.notificationService.success('New bank account opened successfully.');
            this.router.navigate([
              '/account',
              account.accountId ?? account.id
            ]);
          },
          error: (err: unknown) => {
            console.error('Error creating account:', err);
            this.isSaving = false;
            this.notificationService.error('Failed to open account. Please try again.');
          }
        });

      return;
    }

    const payload: UpdateAccountRequest = {
      accountType: value.accountType
    };

    this.accountService
      .updateAccount(this.accountId!, payload)
      .subscribe({
        next: (account: Account) => {
          this.isSaving = false;
          this.notificationService.success('Account configuration updated successfully.');
          this.router.navigate([
            '/account',
            account.accountId ?? account.id
          ]);
        },
        error: (err: unknown) => {
          console.error('Error updating account:', err);
          this.isSaving = false;
          this.notificationService.error('Failed to update account. Please try again.');
        }
      });
  }

  cancel(): void {
    if (this.isEditMode && this.accountId) {
      this.router.navigate([
        '/account',
        this.accountId
      ]);
      return;
    }

    this.router.navigate([
      '/account'
    ]);
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(
      control?.hasError(error) &&
      control.touched
    );
  }
}