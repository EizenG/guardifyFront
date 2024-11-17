import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { passwordStrengthValidator } from '../customValidators/password.validators';
import { passwordConfirmationValidator } from '../customValidators/passwordConfirm.validators';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';

@Component({
  selector: 'app-paramter',
  standalone: true,
  imports: [NgbAccordionModule,ReactiveFormsModule,CommonModule,TranslateModule],
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
  }, { validators: passwordConfirmationValidator("newPassword","confirmPassword")});

  translate = inject(TranslateService);

  constructor(){
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
  }

  handleAccordionCollapse() : void{
    this.isCollasped = !this.isCollasped;
  }

  getFormControl(name : string) : AbstractControl | null{
    return this.changePasswordForm.get(name);
  }
}
