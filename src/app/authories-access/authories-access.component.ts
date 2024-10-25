import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../services/translation/translation.service';
import { langues } from '../langues/langues';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-authories-access',
  standalone: true,
  imports: [TranslateModule,ReactiveFormsModule,RouterLink],
  templateUrl: './authories-access.component.html',
  styleUrl: './authories-access.component.scss'
})
export class AuthoriesAccessComponent {

  cameraAMForm = this.fb.group({
    email : ['',[Validators.email,Validators.required]],
    permissions : ['',Validators.required]
  });
  translate = inject(TranslateService);

  constructor(private fb : FormBuilder){
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
  }
}
