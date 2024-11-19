import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-camera',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './add-camera.component.html',
  styleUrl: './add-camera.component.scss'
})
export class AddCameraComponent {

  addCameraForm = this.fb.group({
    id_camera: ['', Validators.required],
    localisation: ['', [Validators.required,Validators.maxLength(59)]],
    status: [true],
  });

  translate = inject(TranslateService);
  router = inject(Router);

  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef) {
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }

    this.addCameraForm.get('status')?.valueChanges.subscribe(value => {
      console.log('Checkbox value:', value);
    });
  }



  test() {
    console.log(this.addCameraForm.get('status')?.value)
  }

  linkUsers() : void{
    this.router.navigate(['./','authories-user']);
  }

}
