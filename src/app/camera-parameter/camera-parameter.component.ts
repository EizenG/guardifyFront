import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import { RouterModule } from '@angular/router';

interface IUser{
  id : string,
  firstName : string,
  lastName : string,
  email : string,
  permissions : number[]
}

@Component({
  selector: 'app-camera-parameter',
  standalone: true,
  imports: [NgbAccordionModule,TranslateModule,ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './camera-parameter.component.html',
  styleUrl: './camera-parameter.component.scss'
})
export class CameraParameterComponent {

  adminList : IUser[] =[
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    },
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      permissions: [1, 2, 3]
    }
  ]

  isCollasped = true;
  isPopupInfVisible = false;
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

  previousWindows() : void{
    window.history.back();
  }

}
