import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BankAccount } from '../../../../core/models/account.model';

export interface VerifyDialogData {
  account: BankAccount;
}

export interface VerifyDialogResult {
  action: 'Approve' | 'Reject';
  remarks: string;
}

@Component({
  selector: 'app-verify-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './verify-dialog.component.html',
  styleUrls: ['./verify-dialog.component.scss']
})
export class VerifyDialogComponent implements OnInit {
  public verifyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VerifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerifyDialogData
  ) {}

  ngOnInit(): void {
    this.verifyForm = this.fb.group({
      remarks: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onApprove(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }
    const result: VerifyDialogResult = {
      action: 'Approve',
      remarks: this.verifyForm.value.remarks
    };
    this.dialogRef.close(result);
  }

  onReject(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }
    const result: VerifyDialogResult = {
      action: 'Reject',
      remarks: this.verifyForm.value.remarks
    };
    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
