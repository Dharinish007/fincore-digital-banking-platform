import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFieldComponent),
      multi: true
    }
  ],
  template: `
    <mat-form-field appearance="outline" class="w-100">
      <mat-label>{{ label }}</mat-label>
      <input matInput [type]="hide ? 'password' : 'text'" [placeholder]="placeholder" [(ngModel)]="value" (ngModelChange)="onChange($event)" (blur)="onTouched()">
      <button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide" type="button">
        <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
      </button>
      @if (hint) {
        <mat-hint>{{ hint }}</mat-hint>
      }
    </mat-form-field>
  `,
  styles: [`
    .w-100 { width: 100%; }
  `]
})
export class PasswordFieldComponent implements ControlValueAccessor {
  @Input() label = 'Password';
  @Input() placeholder = 'Enter your password';
  @Input() hint?: string;

  hide = true;
  value = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }
}
