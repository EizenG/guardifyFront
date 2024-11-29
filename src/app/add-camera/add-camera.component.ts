import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { User, onAuthStateChanged } from '@angular/fire/auth';
import { emailjsConfigAddCamera } from '../../../emailConfig';
import { Subscription, debounceTime, from, tap } from 'rxjs';
import { MessageService } from '../services/message.service';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-camera',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, TranslateModule, CommonModule, NgxLoadingModule
    , NgbAlertModule],
  templateUrl: './add-camera.component.html',
  styleUrl: './add-camera.component.scss'
})
export class AddCameraComponent {

  user: User | null = null;
  isPopupInfVisible = false;


  addCameraForm = this.fb.group({
    ownerUID: [{ value: '', disabled: true }, Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    id_camera: [{ value: '', disabled: true }, Validators.required],
    localisation: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(59)]],
    status: [{ value: true, disabled: true }],
  });

  translate = inject(TranslateService);
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  msgService = inject(MessageService);
  loading = false;
  isAdmin = false;
  
  loadersConfig = {
    backdropBorderRadius: '3px',
    primaryColour: 'rgb(151, 153, 251)',
    animationType: ngxLoadingAnimationTypes.circle
  }

  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef,private route : ActivatedRoute) {
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }

    onAuthStateChanged(this.firebaseService.firebaseAuth, (user) => {
      if (user) {
        this.user = user;

        this.firebaseService.firebaseAuth.currentUser?.getIdTokenResult()
          .then((tokenResult) => {
            if (tokenResult.claims['role'] != "admin") {
              this.isAdmin = false;
              this.addCameraForm.get("ownerUID")?.enable();
              this.addCameraForm.get("name")?.enable();
              this.addCameraForm.get("id_camera")?.enable();
              this.addCameraForm.get("localisation")?.enable();
              this.addCameraForm.get("status")?.enable();

              this.addCameraForm.get("name")?.setValue(user.displayName);
              this.addCameraForm.get("email")?.setValue(user.email);
              this.addCameraForm.get("ownerUID")?.setValue(user.uid);
            } else {
              this.isAdmin = true;
              this.addCameraForm.get("ownerUID")?.disable();
              this.addCameraForm.get("name")?.disable();
              this.addCameraForm.get("id_camera")?.disable();
              this.addCameraForm.get("localisation")?.disable();
              this.addCameraForm.get("status")?.disable();

              this.addCameraForm.get("ownerUID")?.setValue(`ownerUID : ${route.snapshot.paramMap.get("ownerUID") }`);
              this.addCameraForm.get("name")?.setValue(`name : ${route.snapshot.paramMap.get("name") }`);
              this.addCameraForm.get("id_camera")?.setValue(`ID camera : ${route.snapshot.paramMap.get("idCamera") }`);
              this.addCameraForm.get("localisation")?.setValue(`location : ${route.snapshot.paramMap.get("location") }`);
              this.addCameraForm.get("status")?.setValue((route.snapshot.paramMap.get("status")?.toLowerCase() === "active") ? true : false);
              this.addCameraForm.get("email")?.setValue("fake@mail.com");
            }
          });
      } else {
        this.user = null;
        this.router.navigate(["./", "login-logout"]);
      }
    });
  }

  sendEmail(formData: any) {
    
    this.loading = true;
    from(emailjs.send(emailjsConfigAddCamera.serviceId, emailjsConfigAddCamera.addCameraEmailTemplate, formData, {
      publicKey: emailjsConfigAddCamera.publicKey,
    })).subscribe({
      next: () => {
        this.loading = false;
        if (localStorage.getItem("langue") == "fr") {
          this.msgService.changeSuccessMessage("La demande a été envoyée avec succès.");
        } else {
          this.msgService.changeSuccessMessage("The demand has been sent successfully.");
        }
      },
      error: (error) => {
        this.loading = false;
        if (localStorage.getItem("langue") == "fr") {
          this.msgService.changeErrorMessage("L'envoi de la demande a échouée.");
        } else {
          this.msgService.changeErrorMessage("The demand has failed to send.");
        }
      }
    });
  }

  formatAddCameraFormData(): any{
    let data = {
      ownerUID: this.addCameraForm.get("ownerUID")?.value,
      name: this.addCameraForm.get("name")?.value,
      email: this.addCameraForm.get("email")?.value,
      id_camera: this.addCameraForm.get("id_camera")?.value,
      localisation: this.addCameraForm.get("localisation")?.value,
      status: (this.addCameraForm.get("status")?.value) ? "Active" : "Inactive",
      //Adding url key, it's no part of the form but need by emailjs
      url : ''
    }
    
    data.url = `http://localhost:4200/add-camera/${encodeURIComponent(data.ownerUID as string)}/${encodeURIComponent(data.name as string)}/${encodeURIComponent(data.id_camera as string)}/${encodeURIComponent(data.localisation as string)}/${(data.status)?'active':'inactive'}`
    return data
  }

  addCamera(e: Event): void {
    if (this.addCameraForm.valid) {
      if (this.isAdmin) {
        this.loading = true;
        const id_camera = this.route.snapshot.paramMap.get("idCamera");
        const data = {
          location: this.route.snapshot.paramMap.get("location"),
          status: this.route.snapshot.paramMap.get("status"),
          ownerUID : this.route.snapshot.paramMap.get("ownerUID")
        }
        
        this.firebaseService.addDocument("cameras", data, id_camera as string).subscribe({
          next: () => {
            this.loading = false;
            if (localStorage.getItem("langue") == "fr") {
              this.msgService.changeSuccessMessage("La caméra a été ajoutée avec succès.");
            } else {
              this.msgService.changeSuccessMessage("The camera has been successfully added.");
            }
          },
          error: (error: any) => {
            this.loading = false;
            if (localStorage.getItem("langue") == "fr") {
              this.msgService.changeErrorMessage("L'ajout de la caméra a échoué, veuillez réessayer.");
            } else {
              this.msgService.changeErrorMessage("Failed to add the camera, please try again.");
            }
          }
        });
      } else {
        if (this.user?.displayName !== this.addCameraForm.get("name")?.value) {
          this.isPopupInfVisible = true;
        } else {
          
          this.sendEmail(this.formatAddCameraFormData());
        }
        
      }
    }
  }
  
  updateDisplayNamePopup(buttonTitle: string) {
    if (buttonTitle === 'cancel') {
      this.addCameraForm.get("name")?.setValue(this.user?.displayName ?? '');
      this.isPopupInfVisible = false;
    } else if (buttonTitle === 'confirm') {
      this.isPopupInfVisible = false;
      this.loading = true;
      this.firebaseService.updateUserDisplayName({ displayName: this.addCameraForm.get("name")?.value ?? '' }).subscribe({
        next: () => {
          this.loading = false;
          if (localStorage.getItem("langue") == "fr") {
            this.msgService.changeSuccessMessage("Votre nom d'utilisateur a été modifié avec succès.");
          } else {
            this.msgService.changeSuccessMessage("Your username has been successfully updated.");
          }
          this.sendEmail(this.formatAddCameraFormData());
        },
        error: () => {
          this.loading = false;
          if (localStorage.getItem("langue") == "fr") {
            this.msgService.changeErrorMessage("Échec de la modification de votre nom d'utilisateur. Veuillez réessayer.");
          } else {
            this.msgService.changeErrorMessage("Failed to update your username. Please try again.");
          }
        }
      });
    }
  }

  linkUsers(): void {
    this.router.navigate(['./', 'authories-user']);
  }

}
