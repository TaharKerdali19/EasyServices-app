import { ValidatorFn, AbstractControl } from '@angular/forms';

export class AccountFormControls {
  constructor() { }

  correctCell(cellRegExp: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const cellStatus = cellRegExp.test(control.value);
      return cellStatus ? null : { cellStat: { value: control.value } };
    }
  }

  correctPostalCode(postalCodeRegExp: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const postalCodeStatus = postalCodeRegExp.test(control.value);
      return postalCodeStatus ? null : { postalCodeStatus: { value: control.value } };
    }
  }
}

export interface Account {
  lastName: string;
  firstName: string;
  address: string;
  status: string;
  postalCode?: string;
  phoneNumber?: string;
}