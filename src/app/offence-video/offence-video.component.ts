import { Component, inject } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';

@Component({
  selector: 'app-offence-video',
  standalone: true,
  imports: [NgbAccordionModule,TranslateModule],
  templateUrl: './offence-video.component.html',
  styleUrl: './offence-video.component.scss'
})
export class OffenceVideoComponent {

  translate = inject(TranslateService);

  constructor(){
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
  }
}
