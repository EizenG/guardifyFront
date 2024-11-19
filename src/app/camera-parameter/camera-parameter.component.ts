import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';

@Component({
  selector: 'app-camera-parameter',
  standalone: true,
  imports: [NgbAccordionModule,TranslateModule,ReactiveFormsModule,CommonModule],
  templateUrl: './camera-parameter.component.html',
  styleUrl: './camera-parameter.component.scss'
})
export class CameraParameterComponent {

  isCollasped = true;
  fb = inject(FormBuilder);
  translate = inject(TranslateService);
  cameraParamForm = this.fb.group({
    id_camera: ['', Validators.required],
    localisation: ['', [Validators.required, Validators.maxLength(59)]],
    status: [true],
  });

  constructor() {
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
  }

  handleAccordionCollapse(): void {
    this.isCollasped = !this.isCollasped;
  }

}
