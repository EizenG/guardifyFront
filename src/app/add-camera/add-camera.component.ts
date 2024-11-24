import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-add-camera',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, TranslateModule, CommonModule,NgxLoadingModule],
  templateUrl: './add-camera.component.html',
  styleUrl: './add-camera.component.scss'
})
export class AddCameraComponent {

  addCameraForm = this.fb.group({
    ownerUID : [{value:'uid owner',disabled:true},Validators.required],
    id_camera: [{value:'ssssssss',disabled : true}, Validators.required],
    localisation: [{ value: 'ddddddd', disabled: true }, [Validators.required,Validators.maxLength(59)]],
    status: [{ value: true, disabled: true }],
  });

  translate = inject(TranslateService);
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  loading = false;

  loadersConfig = { 
    backdropBorderRadius: '3px', 
    primaryColour: 'rgb(151, 153, 251)', 
    animationType: ngxLoadingAnimationTypes.circle 
  }

  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef) {
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }

    onAuthStateChanged(this.firebaseService.firebaseAuth, (user) => {
      if (user) {
        this.firebaseService.firebaseAuth.currentUser?.getIdTokenResult()
          .then((tokenResult) => {
            if (tokenResult.claims['role'] != "admin"){
              this.router.navigate(['./','unauthorize']);
            }
          });
      }else{
        this.router.navigate(["./", "login-logout"]);
      } 
    });
  }



  addCamera() : void {
    if(this.addCameraForm.valid){
      this.loading = true;
      const { id_camera, ...data } = this.addCameraForm.value;
      this.firebaseService.addDocument("cameras",data,id_camera as(string | undefined)).subscribe({
        next: () => {
          console.log('success');
          this.loading = false;
        },
        error : (error : any) =>{
          console.log('error',error);
          this.loading = false;
        }
      });
    }
  }

  linkUsers() : void{
    this.router.navigate(['./','authories-user']);
  }

}
