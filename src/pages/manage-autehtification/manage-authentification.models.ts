import { ValidatorFn, AbstractControl } from '@angular/forms';

export class AuthFormControls {
  constructor() { }
  correctMail(mailRegExp: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const mailStatus = mailRegExp.test(control.value);
      return mailStatus ? null : { mailStat: { value: control.value } };
    }
  }
}