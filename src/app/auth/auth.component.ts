import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordStrengthValidator} from '../customValidators/password.validators'
import { passwordConfirmationValidator } from '../customValidators/passwordConfirm.validators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  signUpForm = this.fb.group({
    email: ["", [Validators.email,Validators.required]],
    password: ["", [Validators.required,Validators.minLength(8),passwordStrengthValidator()]],
    confirmPassword: ["", [Validators.required, Validators.minLength(8),]],
  }, {validators : passwordConfirmationValidator()});
  
  signInForm = this.fb.group({
    email: ["", [Validators.email, Validators.required]],
    password: ["", [Validators.required,Validators.minLength(8)]],
  });
  @ViewChild("switchContainer") switchContainer !: ElementRef;
  @ViewChild("signUpform") signUpFormEltRef !: ElementRef;
  @ViewChild("signInform") signInFormEltRef !: ElementRef;
  @ViewChildren("switchContainerDiv") switchContainerDivList !: QueryList<ElementRef>;

  // Constructor
  constructor(private fb : FormBuilder){}

  switchToLoginPage(){
    if(window.innerWidth <= 1023)
      this.switchContainer.nativeElement.style.transform = "translate(-50vw, -70vh)";
    else
      this.switchContainer.nativeElement.style.transform = "translate(40vw,-90vh)";

    this.switchContainerDivList.first.nativeElement.style.opacity = 0;
    this.switchContainerDivList.last.nativeElement.style.opacity = 1;
    this.signUpFormEltRef.nativeElement.style.display = "none";
    this.signInFormEltRef.nativeElement.style.display = "flex";
    this.signInFormEltRef.nativeElement.style.opacity = 0;
    setTimeout(() => {
      this.signInFormEltRef.nativeElement.style.opacity = 1;
    }, 800);
  }

  switchToSignUpPage(){
    if(window.innerWidth <= 1023){
      if (window.innerHeight <= 780)
        this.switchContainer.nativeElement.style.transform = "translate(-50vw,70vh)";
      else
        this.switchContainer.nativeElement.style.transform = "translate(-50vw, 60vh)";
    }else
      this.switchContainer.nativeElement.style.transform = "translate(-40vw,-90vh)";
    
    this.switchContainerDivList.first.nativeElement.style.opacity = 1;
    this.switchContainerDivList.last.nativeElement.style.opacity = 0;
    this.signUpFormEltRef.nativeElement.style.display = "flex";
    this.signInFormEltRef.nativeElement.style.display = "none";
    this.signUpFormEltRef.nativeElement.style.opacity = 0;
    setTimeout(() => {
      this.signUpFormEltRef.nativeElement.style.opacity = 1;
    }, 800);
  }

  showOrHidePassword(e : Event){
    let inputField = (((e.target as HTMLElement).nextElementSibling) as HTMLInputElement);
    (inputField.type == "password")? inputField.type = "text" : inputField.type = "password"; 
    
  }

  getFormControl(formControlName : string){
    // This function is use to get signUp form group control's
    return this.signUpForm.get(formControlName);
  }
}
