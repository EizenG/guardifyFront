import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { langues } from '../data/langues';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-unauthorize',
  standalone: true,
  imports: [RouterModule,TranslateModule],
  templateUrl: './unauthorize.component.html',
  styleUrl: './unauthorize.component.scss'
})
export class UnauthorizeComponent {

  translate = inject(TranslateService)

  constructor() {
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
  }
}
