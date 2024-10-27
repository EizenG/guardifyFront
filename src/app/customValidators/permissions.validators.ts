import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function permissionsValidators(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const modifPermission = formGroup.get("modif")?.value;
    const accessPermission = formGroup.get("access")?.value;
    const visioPermission = formGroup.get("visio")?.value;

   

    return (modifPermission || accessPermission || visioPermission) ? null: { permissionError: true };
  }
}