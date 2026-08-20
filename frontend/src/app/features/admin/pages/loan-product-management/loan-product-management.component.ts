import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CardContainerComponent } from '../../../../shared/components/card-container/card-container.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { LoanService } from '../../../loan/services/loan.service';
import { LoanProduct, LoanType, LoanProductStatus } from '../../../loan/models/loan.models';

@Component({
  selector: 'app-loan-product-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    PageHeaderComponent,
    CardContainerComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './loan-product-management.component.html',
  styleUrl: './loan-product-management.component.scss'
})
export class LoanProductManagementComponent implements OnInit {
  private loanService = inject(LoanService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  products = signal<LoanProduct[]>([]);

  showCreateModal = signal<boolean>(false);
  productForm!: FormGroup;

  loanTypes = Object.values(LoanType);

  displayedColumns: string[] = ['productCode', 'name', 'loanType', 'interestRate', 'amountRange', 'tenureRange', 'status', 'actions'];

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      productCode: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]{3,20}$/)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [''],
      loanType: [LoanType.PERSONAL, Validators.required],
      interestRate: [8.5, [Validators.required, Validators.min(0.1), Validators.max(50)]],
      minAmount: [1000, [Validators.required, Validators.min(100)]],
      maxAmount: [50000, [Validators.required, Validators.min(500)]],
      minTenureMonths: [6, [Validators.required, Validators.min(1)]],
      maxTenureMonths: [60, [Validators.required, Validators.min(1)]]
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.loanService.getLoanProducts().subscribe({
      next: (data) => {
        this.products.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load loan products:', err);
        this.notificationService.error('Failed to load loan products');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.productForm.reset({
      productCode: 'PROD_' + Math.floor(100 + Math.random() * 900),
      loanType: LoanType.PERSONAL,
      interestRate: 8.5,
      minAmount: 1000,
      maxAmount: 50000,
      minTenureMonths: 6,
      maxTenureMonths: 60
    });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  submitProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formVals = this.productForm.value;

    this.loanService.createLoanProduct(formVals).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.closeCreateModal();
        this.notificationService.success(`Loan product "${created.name}" created successfully!`);
        this.loadProducts();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err?.error?.message || 'Failed to create loan product';
        this.notificationService.error(msg);
      }
    });
  }

  toggleStatus(product: LoanProduct): void {
    const newStatus = product.status === LoanProductStatus.ACTIVE ? 'INACTIVE' : 'ACTIVE';
    this.loanService.updateProductStatus(product.id, newStatus).subscribe({
      next: (updated) => {
        this.notificationService.success(`Product "${product.name}" is now ${updated.status}`);
        this.loadProducts();
      },
      error: (err) => {
        this.notificationService.error(err?.error?.message || 'Failed to update product status');
      }
    });
  }
}
