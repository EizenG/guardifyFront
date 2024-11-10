import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';

@Component({
  selector: 'app-camera-stream',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './camera-stream.component.html',
  styleUrl: './camera-stream.component.scss'
})
export class CameraStreamComponent {

  translate = inject(TranslateService);

  constructor() {
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
  }
}
