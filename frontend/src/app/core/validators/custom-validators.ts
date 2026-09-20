import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const NAME_RE = /^[A-Za-z ]{2,60}$/;
export const MOBILE_RE = /^[6-9]\d{9}$/;
export const PAN_RE = /^[A-Z]{5}\d{4}[A-Z]$/;
export const AADHAAR_RE = /^\d{12}$/;

export class CustomValidators {

  static name(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value || '').trim();
      if (!v) return null; // let `required` handle empty
      return NAME_RE.test(v) ? null : { invalidName: true };
    };
  }

  static mobile(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value || '').trim();
      if (!v) return null;
      if (!MOBILE_RE.test(v)) return { invalidMobile: true };
      if (/^(\d)\1{9}$/.test(v)) return { unrealisticMobile: true };
      return null;
    };
  }

  static pan(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value || '').trim().toUpperCase();
      if (!v) return null;
      return PAN_RE.test(v) ? null : { invalidPan: true };
    };
  }

  static aadhaar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value || '').replace(/\D/g, '');
      if (!v) return null;
      if (!AADHAAR_RE.test(v)) return { invalidAadhaar: true };
      if (/^(\d)\1{11}$/.test(v)) return { unrealisticAadhaar: true };
      return null;
    };
  }

  /** Requires the customer to be 18-120 years old. */
  static dateOfBirth(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      if (!v) return null;

      const dob = v instanceof Date ? v : new Date(v + 'T00:00:00');
      if (isNaN(dob.getTime())) return { invalidDate: true };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dob > today) return { futureDate: true };

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;

      if (age < 18) return { tooYoung: true };
      if (age > 120) return { invalidDate: true };
      return null;
    };
  }

  static income(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '').toString().trim();
      if (!v) return null;
      if (!/^\d+$/.test(v)) return { invalidIncome: true };
      const n = Number(v);
      if (n <= 0) return { tooLowIncome: true };
      if (n > 100000000) return { tooHighIncome: true };
      return null;
    };
  }

  static deposit(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '').toString().trim();
      if (!v) return null;
      if (!/^\d+(\.\d{1,2})?$/.test(v)) return { invalidDeposit: true };
      const n = Number(v);
      if (n < min) return { tooLowDeposit: { min } };
      return null;
    };
  }

  /** Cross-field: nominee name must not match the account holder's own name. */
  static nomineeNotSelf(fullnameControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const fullname = (parent.get(fullnameControlName)?.value || '').trim().toLowerCase();
      const nominee = (control.value || '').trim().toLowerCase();
      if (fullname && nominee && fullname === nominee) return { sameAsHolder: true };
      return null;
    };
  }

  /** Cross-field: password and confirm-password must match. Attach to the confirm control. */
  static passwordsMatch(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const password = parent.get(passwordControlName)?.value;
      const confirm = control.value;
      if (password && confirm && password !== confirm) return { passwordMismatch: true };
      return null;
    };
  }
}
