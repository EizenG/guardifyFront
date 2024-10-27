import { AfterViewInit, Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../services/translation/translation.service';
import { langues } from '../data/langues';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { permissionsValidators } from '../customValidators/permissions.validators';


@Component({
  selector: 'app-authories-access',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, 
    RouterLink, FormsModule,CommonModule
  ],
  templateUrl: './authories-access.component.html',
  styleUrl: './authories-access.component.scss'
})
export class AuthoriesAccessComponent {

  cameraAMForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    modif: [false],
    access : [false],
    visio : [false],
  },{validators:permissionsValidators()});


  translate = inject(TranslateService);

  constructor(private fb: FormBuilder) {
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
  }

  previousWindows() : void{
    window.history.back();
  }

}
