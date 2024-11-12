import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { passwordStrengthValidator } from '../customValidators/password.validators';
import { passwordConfirmationValidator } from '../customValidators/passwordConfirm.validators';

@Component({
  selector: 'app-paramter',
  standalone: true,
  imports: [NgbAccordionModule,ReactiveFormsModule],
  templateUrl: './paramter.component.html',
  styleUrl: './paramter.component.scss'
})
export class ParamterComponent {
  isCollasped = true;  

  fb = inject(FormBuilder);
  accountParamForm = this.fb.group({
    firstName : [''],
    lastName : [''],
    tel : ['']
  });

  changePasswordForm = this.fb.group({
    oldPassword : ['',[Validators.required]],
    newPassword : ['',[Validators.required,Validators.minLength(8),passwordStrengthValidator()]],
    confirmPassword : ['',[Validators.required]]
  },{validators : passwordConfirmationValidator()});


  handleAccordionCollapse() : void{
    this.isCollasped = !this.isCollasped;
  }
}
