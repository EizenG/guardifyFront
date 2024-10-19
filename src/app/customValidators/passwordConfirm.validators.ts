import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordConfirmationValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    let password1 = formGroup.get("password")?.value;
    let confirmPassword = formGroup.get("confirmPassword")?.value;
    return (password1 && confirmPassword && password1 == confirmPassword) ? null : { passwordNotConfirm: true };
  }
}