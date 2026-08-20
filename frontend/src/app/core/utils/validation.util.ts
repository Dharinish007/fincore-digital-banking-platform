import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATION_PATTERNS } from '../constants/validation.patterns';

export class ValidationUtil {
  /**
   * Validates if a password meets strong requirements.
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const isValid = VALIDATION_PATTERNS.PASSWORD_STRONG.test(value);
      return !isValid ? { strongPassword: true } : null;
    };
  }

  /**
   * Validates if two controls match (e.g. password and confirm password)
   */
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) return null;

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }
}
