import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, of } from 'rxjs';
import { MockAccountService } from '../../services/mock-account.service';
import { AccountStatus, AccountType } from '../../models/account.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSnackBarModule,
    MatProgressSpinnerModule, PageHeaderComponent
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(MockAccountService);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  isSaving = false;
  accountId: string | null = null;

  branches = this.accountService.branches;
  customerStubs = this.accountService.customerStubs;
  currencies = this.accountService.currencies;
  statuses = Object.values(AccountStatus);
  accountTypes = Object.values(AccountType);

  form!: FormGroup;

  get pageTitle() { return this.isEditMode ? 'Edit Account' : 'Open New Account'; }
  get pageSubtitle() { return this.isEditMode ? 'Update the account details' : 'Create a new bank account for a customer'; }

  ngOnInit(): void {
    this.form = this.fb.group({
      customerId:   ['', Validators.required],
      accountType:  ['', Validators.required],
      currency:     ['USD', Validators.required],
      branch:       ['', Validators.required],
      balance:      [0, [Validators.required, Validators.min(0)]],
      status:       [AccountStatus.PENDING, Validators.required],
      description:  ['']
    });

    this.route.paramMap.pipe(
      switchMap(params => {
        this.accountId = params.get('id');
        if (this.accountId) {
          this.isEditMode = true;
          return this.accountService.getAccountById(this.accountId);
        }
        return of(undefined);
      })
    ).subscribe(account => {
      if (account) {
        // Lock customer and initial balance in edit mode
        this.form.patchValue({
          customerId: account.customerId, accountType: account.accountType,
          currency: account.currency, branch: account.branch,
          balance: account.balance, status: account.status,
          description: account.description ?? ''
        });
        this.form.get('customerId')?.disable();
      }
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;

    const v = this.form.getRawValue();
    const stub = this.customerStubs.find((c: any) => c.id === v.customerId);
    const payload = { ...v, customerName: stub?.name ?? '' };

    const op$ = this.isEditMode
      ? this.accountService.updateAccount(this.accountId!, payload)
      : this.accountService.createAccount(payload);

    op$.subscribe({
      next: (account: any) => {
        this.isSaving = false;
        this.snackBar.open(
          this.isEditMode ? 'Account updated successfully.' : 'Account opened successfully.',
          'Dismiss', { duration: 3500 }
        );
        this.router.navigate(['/account', account.id]);
      },
      error: () => {
        this.isSaving = false;
        this.snackBar.open('An error occurred. Please try again.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(this.isEditMode ? ['/account', this.accountId] : ['/account']);
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }
}
