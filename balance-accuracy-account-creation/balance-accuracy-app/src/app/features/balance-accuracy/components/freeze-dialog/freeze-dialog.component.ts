import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BankAccount } from '../../../../core/models/account.model';

export interface FreezeDialogData {
  account: BankAccount;
}

@Component({
  selector: 'app-freeze-dialog',
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
  templateUrl: './freeze-dialog.component.html',
  styleUrls: ['./freeze-dialog.component.scss']
})
export class FreezeDialogComponent implements OnInit {
  public freezeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FreezeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FreezeDialogData
  ) {}

  ngOnInit(): void {
    this.freezeForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onConfirm(): void {
    if (this.freezeForm.invalid) {
      this.freezeForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.freezeForm.value.reason);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
