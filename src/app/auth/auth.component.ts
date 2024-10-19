import { Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordStrengthValidator} from '../customValidators/password.validators'
import { passwordConfirmationValidator } from '../customValidators/passwordConfirm.validators';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, tap } from 'rxjs/operators';




@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NgbAlert],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnDestroy {
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

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert !: NgbAlert;
  errorMessage = '';
  private _message$ = new Subject<string>();

  createUserSubscription : Subscription | null = null;
  signInSubscription : Subscription | null = null;
  errorMessageSubscription: Subscription | null = null;

  // Services
  firebaseService = inject(FirebaseService);

  router = inject(Router);

  // Constructor
  constructor(private fb : FormBuilder){
    this.errorMessageSubscription = this._message$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.errorMessage = message)),
        debounceTime(5000),
      )
      .subscribe(() => this.selfClosingAlert?.close());
  }

  ngOnDestroy(): void {
    if(this.createUserSubscription){
      this.createUserSubscription.unsubscribe();
    }

    if(this.errorMessageSubscription){
      this.errorMessageSubscription.unsubscribe();
    }
  }

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

  // forms submit functions

  submitSignUpForm(){
    if(this.signUpForm.valid){
      let formData : {email : string, password:string} = {
        email : this.signUpForm.value.email as string,
        password : this.signUpForm.value.password as string,
      };

      this.createUserSubscription = this.firebaseService.createNewUser(formData.email,formData.password).subscribe(
        {
          next : (data : any) =>{ 
            this.router.navigate(['./']);
          },
          error : (error : any) => {
            if (error.code == "auth/invalid-email"){
              this.changeErrorMessage("Attention le mail semble incorrect !!!")
            } else if (error.code == "auth/email-already-in-use"){
              this.changeErrorMessage("Attention l'email est déjà utilisé !!!")
            }else{
              this.changeErrorMessage("Attention une erreur est survenue !!!")
            }
          }
        }
      );
    }
  }

  submitSignInForm(){
    if(this.signInForm.valid){
      let formData : {email : string, password:string} = {
        email : this.signInForm.get("email")?.value as string ,
        password : this.signInForm.get("password")?.value as string,
      }
      this.signInSubscription = this.firebaseService.signIn(formData.email,formData.password)
      .subscribe({
        next : (data : any) => {
          this.router.navigate(["./"]);
        },
        error : (error : any) => {
          if (error.code == "auth/invalid-credential"){
            this.changeErrorMessage("Attention les informations de connexion sont incorrectes !!!");
          }else{
            this.changeErrorMessage("Attention une erreur est survenue !!!");
          }
        }
      })
    }
  }

  changeErrorMessage(message : string) {
    this._message$.next(message);
  }
}
