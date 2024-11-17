import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordConfirmationValidator(formControlName1 : string,formControlName2 : string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    let password1 = formGroup.get(formControlName1)?.value;
    let confirmPassword = formGroup.get(formControlName2)?.value;
    return (password1 && confirmPassword && password1 == confirmPassword) ? null : { passwordNotConfirm: true };
  }
}