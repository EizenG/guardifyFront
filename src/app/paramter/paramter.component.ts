import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { passwordStrengthValidator } from '../customValidators/password.validators';
import { passwordConfirmationValidator } from '../customValidators/passwordConfirm.validators';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { User, onAuthStateChanged } from '@angular/fire/auth';
import { MessageService } from '../services/message.service';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { DocumentSnapshot } from '@angular/fire/firestore';


@Component({
  selector: 'app-paramter',
  standalone: true,
  imports: [NgbAccordionModule,ReactiveFormsModule,CommonModule,TranslateModule,NgxLoadingModule],
  templateUrl: './paramter.component.html',
  styleUrl: './paramter.component.scss'
})
export class ParamterComponent {
  isCollasped = true; 
  user: User | null = null;
  userProfile: any;

  fb = inject(FormBuilder);
  accountParamForm = this.fb.group({
    fullName : [''],
    tel : ['']
  });
  loading = false;
  loadersConfig = {
    backdropBorderRadius: '3px',
    primaryColour: 'rgb(151, 153, 251)',
    animationType: ngxLoadingAnimationTypes.circle
  }

  firebaseService = inject(FirebaseService);
  msgService = inject(MessageService);

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

    onAuthStateChanged(this.firebaseService.firebaseAuth, (user) => {
      if (user) {
        this.user = user;
        this.firebaseService.getDocument("profiles", user.uid).subscribe({
          next: (doc : DocumentSnapshot) => {
            if (doc.exists()) {
              this.userProfile = doc.data();
              this.accountParamForm.get("tel")?.setValue(this.userProfile.phoneNumber);
            }
          }
        });
        if (user.providerData[0].providerId === "google.com") {
          this.changePasswordForm.get("oldPassword")?.disable();
          this.changePasswordForm.get("newPassword")?.disable();
          this.changePasswordForm.get("confirmPassword")?.disable();
        } else {
          this.changePasswordForm.get("oldPassword")?.enable();
          this.changePasswordForm.get("newPassword")?.enable();
          this.changePasswordForm.get("confirmPassword")?.enable();
        }
        
      } else {
        this.user = null;
      }
      this.accountParamForm.get("fullName")?.setValue(user?.displayName ? user.displayName : '');
    });
  }

  handleAccordionCollapse() : void{
    this.isCollasped = !this.isCollasped;
  }

  getFormControl(name : string) : AbstractControl | null{
    return this.changePasswordForm.get(name);
  }

  updateUserPhoneNumber(): void{
    let phoneNumberHasChanged = true;
    if (this.userProfile && this.accountParamForm.get("tel")?.value == this.userProfile.phoneNumber) {
      phoneNumberHasChanged = false;
    }
    if (this.accountParamForm.get("tel")?.value && phoneNumberHasChanged ) {
      const data = {
        phoneNumber: this.accountParamForm.get("tel")?.value
      };
      this.firebaseService.addDocument("profiles", data, this.user?.uid as string).subscribe({
        next: () => {
          this.loading = false;
          if (localStorage.getItem("langue") == "fr") {
            this.msgService.changeSuccessMessage("Votre numero de telephone a été modifié avec succès.");
          } else {
            this.msgService.changeSuccessMessage("Your phone number has been successfully updated.");
          }
        },
        error: () => {
          this.loading = false;
          if (localStorage.getItem("langue") == "fr") {
            this.msgService.changeErrorMessage("Échec de la modification de votre numero de telephone. Veuillez réessayer.");
          } else {
            this.msgService.changeErrorMessage("Failed to update your phone number. Please try again.");
          }
        }
      });
    }
  }

  updateAccountDetail(): void{
    if (this.accountParamForm.get("fullName")?.value && this.accountParamForm.get("fullName")?.value != this.user?.displayName) {
      this.loading = true;
      this.firebaseService.updateUserDisplayName({ displayName: this.accountParamForm.get("fullName")?.value ?? '' }).subscribe({
        next: () => {
          this.updateUserPhoneNumber();
          if (localStorage.getItem("langue") == "fr") {
            this.msgService.changeSuccessMessage("Votre nom d'utilisateur a été modifié avec succès.");
          } else {
            this.msgService.changeSuccessMessage("Your username has been successfully updated.");
          }
        },
        error: () => {
          this.updateUserPhoneNumber();
          if (localStorage.getItem("langue") == "fr") {
            this.msgService.changeErrorMessage("Échec de la modification de votre nom d'utilisateur. Veuillez réessayer.");
          } else {
            this.msgService.changeErrorMessage("Failed to update your username. Please try again.");
          }
        }
      });
    } else {
      this.loading = true;
      this.updateUserPhoneNumber();
    }
  }

  changePassword(): void{
    if (this.changePasswordForm.valid && this.user?.providerId != "google.com") {
      this.loading = true;
      this.firebaseService.reauthenticate(this.user as User, this.changePasswordForm.get("oldPassword")?.value as string).subscribe({
        next: () => {
          this.firebaseService.updatePassword(this.changePasswordForm.get("newPassword")?.value as string, this.user as User).subscribe({
            next: () => {
              this.loading = false;
              if (localStorage.getItem("langue") == langues[0])
                this.msgService.changeSuccessMessage("Le mot de passe a été mis à jour avec succès.");
              else
                this.msgService.changeSuccessMessage("The password has been successfully updated.");
            },
            error: () => {
              this.loading = false;
              if (localStorage.getItem("langue") == langues[0])
                this.msgService.changeErrorMessage("La mise à jour du mot de passe a échoué. Veuillez réessayer ultérieurement.");
              else
                this.msgService.changeErrorMessage("Password update failed. Please try again later.");
            }
          });
        },
        error: () => {
          this.loading = false;
          if (localStorage.getItem("langue") == langues[0])
            this.msgService.changeErrorMessage("La réauthentification a échoué, peut-être en raison d'un mot de passe incorrect. Veuillez vérifier vos informations et réessayer.")
          else
            this.msgService.changeErrorMessage("Reauthentication failed, possibly due to an incorrect password. Please check your credentials and try again.");
        }
      });
    }
  }
}
