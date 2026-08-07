import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, of, tap } from 'rxjs';
import { MockCustomerService } from '../../services/mock-customer.service';
import { CustomerStatus, CustomerType } from '../../models/customer.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatButtonModule, MatIconModule, MatSnackBarModule,
    MatProgressSpinnerModule, PageHeaderComponent
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(MockCustomerService);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  isSaving = false;
  customerId: string | null = null;
  branches = this.customerService.branches;
  statuses = Object.values(CustomerStatus);
  customerTypes = Object.values(CustomerType);
  genders = ['MALE', 'FEMALE', 'OTHER'];

  form!: FormGroup;

  get isNew() { return !this.isEditMode; }
  get pageTitle() { return this.isEditMode ? 'Edit Customer' : 'Add New Customer'; }
  get pageSubtitle() { return this.isEditMode ? 'Update the customer record' : 'Create a new customer account'; }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.pipe(
      switchMap(params => {
        this.customerId = params.get('id');
        if (this.customerId) {
          this.isEditMode = true;
          return this.customerService.getCustomerById(this.customerId);
        }
        return of(undefined);
      })
    ).subscribe(customer => {
      if (customer) {
        this.form.patchValue({
          firstName: customer.firstName, lastName: customer.lastName,
          email: customer.email, phone: customer.phone,
          dateOfBirth: new Date(customer.dateOfBirth), gender: customer.gender,
          customerType: customer.customerType, status: customer.status,
          branch: customer.branch,
          street: customer.address.street, city: customer.address.city,
          state: customer.address.state, postalCode: customer.address.postalCode
        });
      }
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName:    ['', [Validators.required, Validators.minLength(2)]],
      lastName:     ['', [Validators.required, Validators.minLength(2)]],
      email:        ['', [Validators.required, Validators.email]],
      phone:        ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-().]{7,15}$/)]],
      dateOfBirth:  [null, Validators.required],
      gender:       ['', Validators.required],
      customerType: ['', Validators.required],
      status:       [CustomerStatus.PENDING, Validators.required],
      branch:       ['', Validators.required],
      street:       ['', Validators.required],
      city:         ['', Validators.required],
      state:        ['', Validators.required],
      postalCode:   ['', [Validators.required, Validators.pattern(/^\d{4,10}$/)]]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const v = this.form.value;
    const payload = {
      firstName: v.firstName, lastName: v.lastName,
      email: v.email, phone: v.phone,
      dateOfBirth: (v.dateOfBirth as Date).toISOString().split('T')[0],
      gender: v.gender, customerType: v.customerType,
      status: v.status, branch: v.branch,
      address: { street: v.street, city: v.city, state: v.state, postalCode: v.postalCode, country: 'USA' }
    };

    const operation$ = this.isEditMode
      ? this.customerService.updateCustomer(this.customerId!, payload)
      : this.customerService.createCustomer(payload);

    operation$.subscribe({
      next: customer => {
        this.isSaving = false;
        this.snackBar.open(
          this.isEditMode ? 'Customer updated successfully.' : 'Customer created successfully.',
          'Dismiss', { duration: 3500, panelClass: ['snackbar-success'] }
        );
        this.router.navigate(['/customer', customer.id]);
      },
      error: () => {
        this.isSaving = false;
        this.snackBar.open('An error occurred. Please try again.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(this.isEditMode ? ['/customer', this.customerId] : ['/customer']);
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }
}
