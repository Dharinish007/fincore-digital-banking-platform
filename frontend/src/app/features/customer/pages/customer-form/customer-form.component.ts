import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, of, catchError } from 'rxjs';

import { CustomerService } from '../../services/customer.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private notificationService = inject(NotificationService);

  isEditMode = false;
  isSaving = false;
  customerId: string | null = null;
  form!: FormGroup;

  get isNew(): boolean {
    return !this.isEditMode;
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Customer Profile' : 'Add New Customer';
  }

  get pageSubtitle(): string {
    return this.isEditMode
      ? 'Update customer KYC details, contact info, and residential address.'
      : 'Create a new customer profile and establish core banking credentials.';
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.customerId;
    this.initForm();

    if (this.isEditMode && this.customerId) {
      this.customerService
        .getCustomerById(this.customerId)
        .pipe(
          catchError(err => {
            console.error('Error fetching customer:', err);
            this.notificationService.error('Unable to load customer record from core banking service.');
            return of(undefined);
          })
        )
        .subscribe(customer => {
          if (customer) {
            this.form.patchValue({
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
              phoneNumber: customer.phoneNumber,
              dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth) : null,
              address: customer.address,
              city: customer.city,
              state: customer.state,
              postalCode: customer.postalCode,
              country: customer.country
            });
          }
        });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-().]{7,15}$/)]],
      dateOfBirth: [null, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4,10}$/)]],
      country: ['', Validators.required]
    });
  }

  save(): void {
    if (this.isSaving || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.form.value;

    const dateOfBirthStr =
      formValue.dateOfBirth instanceof Date
        ? formValue.dateOfBirth.toISOString().split('T')[0]
        : typeof formValue.dateOfBirth === 'string'
          ? formValue.dateOfBirth.split('T')[0]
          : formValue.dateOfBirth;

    const payload = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim(),
      phoneNumber: formValue.phoneNumber.trim(),
      dateOfBirth: dateOfBirthStr,
      address: formValue.address.trim(),
      city: formValue.city.trim(),
      state: formValue.state.trim(),
      postalCode: formValue.postalCode.trim(),
      country: formValue.country.trim()
    };

    const operation$ = this.isEditMode
      ? this.customerService.updateCustomer(this.customerId!, payload)
      : this.customerService.createCustomer(payload);

    operation$.subscribe({
      next: customer => {
        this.isSaving = false;
        this.notificationService.success(
          this.isEditMode
            ? 'Customer profile successfully updated.'
            : 'New customer profile successfully created.'
        );
        this.router.navigate(['/customer', customer.id]);
      },
      error: err => {
        console.error('Error saving customer:', err);
        this.isSaving = false;
        this.notificationService.error('Failed to save customer record. Please review inputs and try again.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(
      this.isEditMode
        ? ['/customer', this.customerId]
        : ['/customer']
    );
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }
}